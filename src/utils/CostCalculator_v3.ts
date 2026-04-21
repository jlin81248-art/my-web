import CityDataLoader, { CityData } from './CityDataLoader';

export type PreferenceKey =
  | 'salary'
  | 'entertainment'
  | 'housing'
  | 'time'
  | 'family'
  | 'climate'
  | 'growth';

export interface Settings {
  sourceCity: string;
  salary: number;
  annualBonus: number;
  housingFundRate: string;
  housingType: string;
  housingLocation: string;
  housingSize: string;
  customRentMonthly: number;
  companyMeals: boolean;
  diningHomeRatio: number;
  transportType: string;
  carLoanMonthlyPayment: number;
  entertainmentLevel: string;
  loanInterestRate: number;
  loanTerm: number;
  childrenEducationMonthly: number;
  elderCount: number;
  elderCareMonthlyPerPerson: number;
  familyMedicalMonthly: number;
  medicalReimbursementMonthly: number;
  commuteMinutesPerDay: number;
  workStartTime: string;
  workEndTime: string;
  workDaysPerWeek: number;
  entertainmentSceneScore: number;
  climateComfortScore: number;
  growthScore: number;
}

export interface MonthlyIncome {
  税前工资: number;
  社保公积金: number;
  个人所得税: number;
  税后工资: number;
}

export interface MonthlyCosts {
  住房: number;
  餐饮: number;
  交通: number;
  娱乐: number;
  水电通信: number;
  教育: number;
  赡养: number;
  医疗: number;
  总支出: number;
}

export interface OfferMetrics {
  annualPackage: number;
  monthlyIncome: MonthlyIncome;
  monthlyCosts: MonthlyCosts;
  monthlyDisposable: number;
  annualDisposable: number;
  realHourlyPay: number;
  housingBurdenRate: number;
  savingsRate: number;
  workHoursPerDay: number;
  occupiedHoursPerDay: number;
  freeHoursPerDay: number;
  workingDaysPerMonth: number;
  entertainmentBudgetRatio: number;
  familyBurdenRate: number;
  entertainmentSceneScore: number;
  climateComfortScore: number;
  growthScore: number;
}

export interface PreferenceWeight {
  key: PreferenceKey;
  weight: number;
}

export interface PainPointRow {
  key: PreferenceKey;
  label: string;
  beforeValue: string;
  afterValue: string;
  deltaText: string;
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
  priorityRank: number;
}

export interface OfferComparisonResult {
  before: OfferMetrics;
  after: OfferMetrics;
  weightedScore: number;
  decisionLabel: string;
  summaryTitle: string;
  summaryText: string;
  delta: {
    monthlyNetIncome: number;
    monthlyDisposable: number;
    annualDisposable: number;
    realHourlyPay: number;
  };
  painPointRows: PainPointRow[];
  topPriorityFindings: PainPointRow[];
}

class CostCalculator {
  private cityDataLoader: CityDataLoader;

  constructor(cityDataLoader: CityDataLoader) {
    this.cityDataLoader = cityDataLoader;
  }

  calculateAnnualPackage(settings: Pick<Settings, 'salary' | 'annualBonus'>): number {
    return Math.max(0, settings.salary) + Math.max(0, settings.annualBonus);
  }

  calculateOfferMetrics(annualPackage: number, cityData: CityData, settings: Settings): OfferMetrics {
    const monthlyIncome = this.calculateMonthlyIncome(annualPackage, cityData, settings);
    const monthlyCosts = this.calculateMonthlyCosts(cityData, settings);
    const monthlyDisposable = Math.round(monthlyIncome.税后工资 - monthlyCosts.总支出);
    const annualDisposable = monthlyDisposable * 12;

    const workHoursPerDay = this.getDailyWorkHours(settings.workStartTime, settings.workEndTime);
    const occupiedHoursPerDay = workHoursPerDay + (Math.max(0, settings.commuteMinutesPerDay) / 60);
    const freeHoursPerDay = Math.max(0, 24 - occupiedHoursPerDay - 8);
    const workingDaysPerMonth = Math.max(1, Number((Math.max(0.5, settings.workDaysPerWeek) * 4.33).toFixed(1)));
    const monthlyOccupiedHours = Math.max(1, occupiedHoursPerDay * workingDaysPerMonth);
    const realHourlyPay = Number((monthlyDisposable / monthlyOccupiedHours).toFixed(1));

    const housingBurdenRate = monthlyIncome.税后工资 > 0 ? (monthlyCosts.住房 / monthlyIncome.税后工资) * 100 : 0;
    const savingsRate = monthlyIncome.税后工资 > 0 ? (monthlyDisposable / monthlyIncome.税后工资) * 100 : 0;
    const entertainmentBudgetRatio = monthlyIncome.税后工资 > 0 ? (monthlyCosts.娱乐 / monthlyIncome.税后工资) * 100 : 0;
    const familyCosts = monthlyCosts.教育 + monthlyCosts.赡养 + monthlyCosts.医疗;
    const familyBurdenRate = monthlyIncome.税后工资 > 0 ? (familyCosts / monthlyIncome.税后工资) * 100 : 0;

    return {
      annualPackage,
      monthlyIncome,
      monthlyCosts,
      monthlyDisposable,
      annualDisposable,
      realHourlyPay,
      housingBurdenRate: Number(housingBurdenRate.toFixed(1)),
      savingsRate: Number(savingsRate.toFixed(1)),
      workHoursPerDay: Number(workHoursPerDay.toFixed(1)),
      occupiedHoursPerDay: Number(occupiedHoursPerDay.toFixed(1)),
      freeHoursPerDay: Number(freeHoursPerDay.toFixed(1)),
      workingDaysPerMonth,
      entertainmentBudgetRatio: Number(entertainmentBudgetRatio.toFixed(1)),
      familyBurdenRate: Number(familyBurdenRate.toFixed(1)),
      entertainmentSceneScore: settings.entertainmentSceneScore,
      climateComfortScore: settings.climateComfortScore,
      growthScore: settings.growthScore,
    };
  }

  calculateOfferComparison(
    before: OfferMetrics,
    after: OfferMetrics,
    preferenceOrder: PreferenceKey[],
  ): OfferComparisonResult {
    const weights = this.getPreferenceWeights(preferenceOrder);

    const dimensionScores: Record<PreferenceKey, number> = {
      salary: this.getSalaryDimensionScore(before, after),
      entertainment: this.getEntertainmentDimensionScore(before, after),
      housing: this.getHousingDimensionScore(before, after),
      time: this.getTimeDimensionScore(before, after),
      family: this.getFamilyDimensionScore(before, after),
      climate: this.getClimateDimensionScore(before, after),
      growth: this.getGrowthDimensionScore(before, after),
    };

    const weightedDelta = weights.reduce((sum, item) => sum + (dimensionScores[item.key] * item.weight), 0);
    const weightedScore = Math.round(this.clamp(50 + weightedDelta / 2, 0, 100));

    const painPointRows = this.buildPainPointRows(before, after, preferenceOrder);
    const topPriorityFindings = [...painPointRows].sort((a, b) => a.priorityRank - b.priorityRank);

    const { decisionLabel, summaryTitle, summaryText } = this.generateNarrative(
      weightedScore,
      topPriorityFindings.slice(0, 3),
      before,
      after,
    );

    return {
      before,
      after,
      weightedScore,
      decisionLabel,
      summaryTitle,
      summaryText,
      delta: {
        monthlyNetIncome: after.monthlyIncome.税后工资 - before.monthlyIncome.税后工资,
        monthlyDisposable: after.monthlyDisposable - before.monthlyDisposable,
        annualDisposable: after.annualDisposable - before.annualDisposable,
        realHourlyPay: Number((after.realHourlyPay - before.realHourlyPay).toFixed(1)),
      },
      painPointRows,
      topPriorityFindings,
    };
  }

  getPreferenceWeights(order: PreferenceKey[]): PreferenceWeight[] {
    const distribution = [0.30, 0.22, 0.18, 0.12, 0.10, 0.05, 0.03];
    return order.map((key, index) => ({
      key,
      weight: distribution[index] ?? 0,
    }));
  }

  calculateMonthlyIncome(annualPackage: number, cityData: CityData, settings: Settings): MonthlyIncome {
    const monthlyGross = annualPackage / 12;
    const insuranceBase = Math.min(
      Math.max(monthlyGross, cityData.social_security_base_min),
      cityData.social_security_base_max,
    );

    const monthlyInsurance =
      insuranceBase * 0.08 +
      insuranceBase * 0.02 +
      insuranceBase * 0.005 +
      insuranceBase * parseFloat(settings.housingFundRate);

    const taxable = monthlyGross - monthlyInsurance - 5000;
    const tax = this.calculateTax(Math.max(0, taxable));

    return {
      税前工资: Math.round(monthlyGross),
      社保公积金: Math.round(monthlyInsurance),
      个人所得税: Math.round(tax),
      税后工资: Math.round(monthlyGross - monthlyInsurance - tax),
    };
  }

  calculateMonthlyCosts(cityData: CityData, settings: Settings): MonthlyCosts {
    const housing = this.calculateHousingCost(cityData, settings);
    const dining = this.calculateDiningCost(cityData, settings);
    const transport = this.calculateTransportCost(cityData, settings);
    const { utilities, entertainment } = this.calculateUtilitiesAndEntertainmentCost(cityData, settings);
    const education = Math.max(0, settings.childrenEducationMonthly || 0);
    const eldercare = Math.max(0, settings.elderCount || 0) * Math.max(0, settings.elderCareMonthlyPerPerson || 0);
    const medical = Math.max(0, (settings.familyMedicalMonthly || 0) - (settings.medicalReimbursementMonthly || 0));

    return {
      住房: Math.round(housing),
      餐饮: Math.round(dining),
      交通: Math.round(transport),
      娱乐: Math.round(entertainment),
      水电通信: Math.round(utilities),
      教育: Math.round(education),
      赡养: Math.round(eldercare),
      医疗: Math.round(medical),
      总支出: Math.round(housing + dining + transport + utilities + entertainment + education + eldercare + medical),
    };
  }

  private buildPainPointRows(before: OfferMetrics, after: OfferMetrics, preferenceOrder: PreferenceKey[]): PainPointRow[] {
    const rankMap = new Map(preferenceOrder.map((key, index) => [key, index + 1]));
    const rows: PainPointRow[] = [
      {
        key: 'salary',
        label: '薪资与存钱',
        beforeValue: `${this.formatCurrency(before.monthlyDisposable)}/月可支配，${this.formatCurrency(before.realHourlyPay)}/小时`,
        afterValue: `${this.formatCurrency(after.monthlyDisposable)}/月可支配，${this.formatCurrency(after.realHourlyPay)}/小时`,
        deltaText: `${this.getSignedCurrency(after.monthlyDisposable - before.monthlyDisposable)} / 月可支配；${this.getSignedCurrency(after.realHourlyPay - before.realHourlyPay)} / 小时`,
        impact: this.getImpact(after.monthlyDisposable - before.monthlyDisposable + (after.realHourlyPay - before.realHourlyPay) * 100),
        explanation: after.monthlyDisposable >= before.monthlyDisposable
          ? '跳槽后税后结余更高，名义涨薪真正转化成了可支配现金。'
          : '虽然可能涨了总包，但涨薪没有有效转化成更高的月结余。',
        priorityRank: rankMap.get('salary') || 99,
      },
      {
        key: 'entertainment',
        label: '娱乐与生活丰富度',
        beforeValue: `娱乐预算占比 ${before.entertainmentBudgetRatio}%｜环境满意度 ${before.entertainmentSceneScore}/5`,
        afterValue: `娱乐预算占比 ${after.entertainmentBudgetRatio}%｜环境满意度 ${after.entertainmentSceneScore}/5`,
        deltaText: `预算占比 ${this.getSignedPercent(after.entertainmentBudgetRatio - before.entertainmentBudgetRatio)}；环境评分 ${this.getSignedNumber(after.entertainmentSceneScore - before.entertainmentSceneScore)}`,
        impact: this.getEntertainmentImpact(before, after),
        explanation: this.getEntertainmentExplanation(before, after),
        priorityRank: rankMap.get('entertainment') || 99,
      },
      {
        key: 'housing',
        label: '居住条件',
        beforeValue: `住房负担率 ${before.housingBurdenRate}%`,
        afterValue: `住房负担率 ${after.housingBurdenRate}%`,
        deltaText: this.getSignedPercent(after.housingBurdenRate - before.housingBurdenRate),
        impact: this.getImpact(before.housingBurdenRate - after.housingBurdenRate),
        explanation: after.housingBurdenRate <= before.housingBurdenRate
          ? '跳槽后住房成本对税后收入的挤压更小，居住压力更可控。'
          : '跳槽后住房占比上升，租房或房贷会更明显地吃掉收入。',
        priorityRank: rankMap.get('housing') || 99,
      },
      {
        key: 'time',
        label: '通勤与自由时间',
        beforeValue: `总占用 ${before.occupiedHoursPerDay}h/天｜自由时间 ${before.freeHoursPerDay}h/天`,
        afterValue: `总占用 ${after.occupiedHoursPerDay}h/天｜自由时间 ${after.freeHoursPerDay}h/天`,
        deltaText: `总占用 ${this.getSignedNumber(after.occupiedHoursPerDay - before.occupiedHoursPerDay)}h；自由时间 ${this.getSignedNumber(after.freeHoursPerDay - before.freeHoursPerDay)}h`,
        impact: this.getImpact((after.freeHoursPerDay - before.freeHoursPerDay) * 10 - (after.occupiedHoursPerDay - before.occupiedHoursPerDay) * 10),
        explanation: after.freeHoursPerDay >= before.freeHoursPerDay
          ? '跳槽后下班后的可支配时间更多，更有空间恢复和娱乐。'
          : '跳槽后在岗与通勤时间更长，真实时薪和生活体感都会被拉低。',
        priorityRank: rankMap.get('time') || 99,
      },
      {
        key: 'family',
        label: '家庭负担',
        beforeValue: `家庭负担率 ${before.familyBurdenRate}%`,
        afterValue: `家庭负担率 ${after.familyBurdenRate}%`,
        deltaText: this.getSignedPercent(after.familyBurdenRate - before.familyBurdenRate),
        impact: this.getImpact(before.familyBurdenRate - after.familyBurdenRate),
        explanation: after.familyBurdenRate <= before.familyBurdenRate
          ? '跳槽后教育、赡养、医疗对现金流的压力更可控。'
          : '跳槽后家庭支出占税后收入比例更高，长期抗风险能力会下降。',
        priorityRank: rankMap.get('family') || 99,
      },
      {
        key: 'climate',
        label: '气候与城市环境',
        beforeValue: `${before.climateComfortScore}/5`,
        afterValue: `${after.climateComfortScore}/5`,
        deltaText: this.getSignedNumber(after.climateComfortScore - before.climateComfortScore),
        impact: this.getImpact(after.climateComfortScore - before.climateComfortScore),
        explanation: after.climateComfortScore >= before.climateComfortScore
          ? '从主观评价看，跳槽后所在城市更适合长期生活。'
          : '从主观评价看，跳槽后所在城市的体感舒适度可能下降。',
        priorityRank: rankMap.get('climate') || 99,
      },
      {
        key: 'growth',
        label: '职业成长',
        beforeValue: `${before.growthScore}/5`,
        afterValue: `${after.growthScore}/5`,
        deltaText: this.getSignedNumber(after.growthScore - before.growthScore),
        impact: this.getImpact(after.growthScore - before.growthScore),
        explanation: after.growthScore >= before.growthScore
          ? '跳槽后平台和成长性更强，适合接受短期波动换长期收益。'
          : '跳槽后生活可能更稳，但长期成长空间未必更强。',
        priorityRank: rankMap.get('growth') || 99,
      },
    ];

    return rows.sort((a, b) => a.priorityRank - b.priorityRank);
  }

  private getSalaryDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const disposableDelta = after.monthlyDisposable - before.monthlyDisposable;
    const hourlyDelta = after.realHourlyPay - before.realHourlyPay;
    return this.clamp((disposableDelta / 1000) * 12 + hourlyDelta * 3, -100, 100);
  }

  private getEntertainmentDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const sceneDelta = (after.entertainmentSceneScore - before.entertainmentSceneScore) * 15;
    const freeTimeDelta = (after.freeHoursPerDay - before.freeHoursPerDay) * 10;
    const budgetPressureDelta = (before.entertainmentBudgetRatio - after.entertainmentBudgetRatio) * 2;
    return this.clamp(sceneDelta + freeTimeDelta + budgetPressureDelta, -100, 100);
  }

  private getHousingDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((before.housingBurdenRate - after.housingBurdenRate) * 4, -100, 100);
  }

  private getTimeDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const freeTimeDelta = (after.freeHoursPerDay - before.freeHoursPerDay) * 18;
    const occupiedPenalty = (before.occupiedHoursPerDay - after.occupiedHoursPerDay) * 18;
    return this.clamp(freeTimeDelta + occupiedPenalty, -100, 100);
  }

  private getFamilyDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((before.familyBurdenRate - after.familyBurdenRate) * 4, -100, 100);
  }

  private getClimateDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((after.climateComfortScore - before.climateComfortScore) * 25, -100, 100);
  }

  private getGrowthDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((after.growthScore - before.growthScore) * 25, -100, 100);
  }

  private getEntertainmentImpact(before: OfferMetrics, after: OfferMetrics): 'positive' | 'negative' | 'neutral' {
    const score = this.getEntertainmentDimensionScore(before, after);
    if (score > 8) return 'positive';
    if (score < -8) return 'negative';
    return 'neutral';
  }

  private getEntertainmentExplanation(before: OfferMetrics, after: OfferMetrics): string {
    const sceneDown = after.entertainmentSceneScore < before.entertainmentSceneScore;
    const budgetUp = after.entertainmentBudgetRatio > before.entertainmentBudgetRatio;
    const freeTimeDown = after.freeHoursPerDay < before.freeHoursPerDay;

    if (sceneDown && (budgetUp || freeTimeDown)) {
      return '跳槽后娱乐环境评分下降，同时娱乐预算压力或自由时间变差，娱乐质量可能会下降。';
    }
    if (after.entertainmentSceneScore > before.entertainmentSceneScore && after.freeHoursPerDay >= before.freeHoursPerDay) {
      return '跳槽后娱乐环境和下班后的可支配时间都更友好，更适合高娱乐偏好用户。';
    }
    if (budgetUp) {
      return '跳槽后娱乐消费更容易挤压现金流，想维持原有娱乐习惯会更吃力。';
    }
    return '娱乐相关变化不算极端，但仍建议结合你对城市生活丰富度的主观预期一起判断。';
  }

  private generateNarrative(
    weightedScore: number,
    topRows: PainPointRow[],
    before: OfferMetrics,
    after: OfferMetrics,
  ): { decisionLabel: string; summaryTitle: string; summaryText: string } {
    const lead = topRows[0];
    const second = topRows[1];
    const third = topRows[2];

    if (weightedScore >= 72) {
      return {
        decisionLabel: '更适合跳',
        summaryTitle: '这次跳槽更符合你的优先级',
        summaryText: `最核心的原因在于「${lead?.label ?? '综合维度'}」明显改善，且「${second?.label ?? '关键维度'}」没有拖后腿。相比跳槽前，税后月收入 ${this.getSignedCurrency(after.monthlyIncome.税后工资 - before.monthlyIncome.税后工资)}，月可支配收入 ${this.getSignedCurrency(after.monthlyDisposable - before.monthlyDisposable)}，更像是生活层面的真实升级。`,
      };
    }

    if (weightedScore >= 58) {
      return {
        decisionLabel: '可以认真考虑',
        summaryTitle: '这次跳槽总体可行，但不是无脑更优',
        summaryText: `这份新 offer 在「${lead?.label ?? '核心维度'}」上更适合你，但「${third?.label ?? '另一个维度'}」仍有明显权衡。它更像是“有条件成立”的选择：如果你愿意接受部分生活习惯调整，这次跳槽是有理由继续推进的。`,
      };
    }

    if (weightedScore >= 45) {
      return {
        decisionLabel: '需要谨慎权衡',
        summaryTitle: '名义变化不等于生活升级',
        summaryText: `虽然部分指标可能上升，但你最看重的「${lead?.label ?? '核心维度'}」与「${second?.label ?? '关键维度'}」并没有同步改善。尤其当你更在意生活体感而不是总包数字时，这次跳槽未必会让日常过得更舒服。`,
      };
    }

    return {
      decisionLabel: '不太建议仅凭涨薪跳',
      summaryTitle: '这次跳槽很可能只是数字更好看',
      summaryText: `对你来说，最关键的「${lead?.label ?? '核心维度'}」表现变差，而且「${second?.label ?? '关键维度'}」也没有补回来。特别是当跳槽后住房、娱乐或时间成本上升时，即使总包上涨，也可能换来更差的生活质量。`,
    };
  }

  private calculateHousingCost(cityData: CityData, settings: Settings): number {
    if (settings.housingType === 'rent') {
      if ((settings.customRentMonthly || 0) > 0) {
        return settings.customRentMonthly;
      }

      if (settings.housingLocation === 'center') {
        if (settings.housingSize === 'shared') return cityData.rent_center_1b * 0.6;
        if (settings.housingSize === 'small') return cityData.rent_center_1b;
        return cityData.rent_center_3b;
      }

      if (settings.housingSize === 'shared') return cityData.rent_suburb_1b * 0.6;
      if (settings.housingSize === 'small') return cityData.rent_suburb_1b;
      return cityData.rent_suburb_3b;
    }

    const housePrice = settings.housingLocation === 'center'
      ? cityData.house_price_center
      : cityData.house_price_suburb;

    const area = settings.housingSize === 'large' ? 120 : 60;
    const totalPrice = housePrice * area;
    const downPayment = totalPrice * 0.3;
    const loan = totalPrice - downPayment;
    const years = settings.loanTerm || 30;
    const months = years * 12;
    const useHousingFund = parseFloat(settings.housingFundRate) > 0.05;
    const baseRate = settings.loanInterestRate || 0.0588;
    const effectiveRate = useHousingFund ? baseRate * 0.7 + 0.0325 * 0.3 : baseRate;
    const monthlyRate = effectiveRate / 12;
    const monthlyPayment = loan * monthlyRate * Math.pow(1 + monthlyRate, months)
      / (Math.pow(1 + monthlyRate, months) - 1);
    const propertyFee = settings.housingSize === 'large' ? 360 : 180;

    return monthlyPayment + propertyFee;
  }

  private calculateDiningCost(cityData: CityData, settings: Settings): number {
    if (settings.companyMeals) {
      const nonWorkdayRatio = 0.27;
      const diningHomeRatio = (settings.diningHomeRatio || 0) / 100;
      const diningOutRatio = 1 - diningHomeRatio;
      const nonWorkdayCost = cityData.dining_home * diningHomeRatio + cityData.dining_out * diningOutRatio;
      return nonWorkdayCost * nonWorkdayRatio;
    }

    const diningHomeRatio = (settings.diningHomeRatio || 0) / 100;
    const diningOutRatio = 1 - diningHomeRatio;
    return cityData.dining_home * diningHomeRatio + cityData.dining_out * diningOutRatio;
  }

  private calculateTransportCost(cityData: CityData, settings: Settings): number {
    switch (settings.transportType) {
      case 'public':
        return cityData.transport_public;
      case 'car':
        return cityData.transport_car + (settings.carLoanMonthlyPayment || 0);
      case 'ebike':
        return 100;
      case 'bike':
      case 'walk':
        return 0;
      default:
        return cityData.transport_public;
    }
  }

  private calculateUtilitiesAndEntertainmentCost(cityData: CityData, settings: Settings): { utilities: number; entertainment: number } {
    let entertainmentCost = 0;
    switch (settings.entertainmentLevel) {
      case 'poor':
        entertainmentCost = 0;
        break;
      case 'low':
        entertainmentCost = (cityData.fitness + cityData.cinema) * 2;
        break;
      case 'medium':
        entertainmentCost = (cityData.fitness + cityData.cinema) * 4;
        break;
      case 'high':
        entertainmentCost = (cityData.fitness + cityData.cinema) * 8;
        break;
      default:
        entertainmentCost = (cityData.fitness + cityData.cinema) * 4;
    }

    return {
      utilities: cityData.utilities + cityData.mobile_plan + cityData.internet,
      entertainment: entertainmentCost,
    };
  }

  private getDailyWorkHours(startTime: string, endTime: string): number {
    const start = this.parseTimeToMinutes(startTime || '09:00');
    const end = this.parseTimeToMinutes(endTime || '18:00');
    if (Number.isNaN(start) || Number.isNaN(end)) return 8;
    const rawMinutes = end >= start ? end - start : (24 * 60 - start + end);
    return Math.max(0.5, rawMinutes / 60);
  }

  private parseTimeToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return NaN;
    return hour * 60 + minute;
  }

  private calculateTax(monthlyTaxable: number): number {
    const brackets = [
      { limit: 0, rate: 0.03, deduction: 0 },
      { limit: 3000, rate: 0.1, deduction: 210 },
      { limit: 12000, rate: 0.2, deduction: 1410 },
      { limit: 25000, rate: 0.25, deduction: 2660 },
      { limit: 35000, rate: 0.3, deduction: 4410 },
      { limit: 55000, rate: 0.35, deduction: 7160 },
      { limit: 80000, rate: 0.45, deduction: 15160 },
    ];

    for (let i = brackets.length - 1; i >= 0; i -= 1) {
      if (monthlyTaxable > brackets[i].limit) {
        return monthlyTaxable * brackets[i].rate - brackets[i].deduction;
      }
    }

    return 0;
  }

  private getImpact(value: number): 'positive' | 'negative' | 'neutral' {
    if (value > 2) return 'positive';
    if (value < -2) return 'negative';
    return 'neutral';
  }

  private getSignedCurrency(value: number): string {
    return `${value > 0 ? '+' : ''}${this.formatCurrency(value)}`;
  }

  private getSignedPercent(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  private getSignedNumber(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  calculateRequiredSalary(sourceCityName: string, targetCityName: string, sourceSalary: number, settings: Settings): number {
    const sourceCityData = this.cityDataLoader.getCityData(sourceCityName);
    const targetCityData = this.cityDataLoader.getCityData(targetCityName);

    if (!sourceCityData || !targetCityData) {
      throw new Error('城市数据未找到');
    }

    const sourceIncome = this.calculateMonthlyIncome(sourceSalary, sourceCityData, settings);
    const sourceCosts = this.calculateMonthlyCosts(sourceCityData, settings);
    const targetSavingsGoal = sourceIncome.税后工资 - sourceCosts.总支出;

    const targetCosts = this.calculateMonthlyCosts(targetCityData, settings);
    const targetAfterTaxMonthly = targetCosts.总支出 + targetSavingsGoal;

    let targetAnnualSalary = sourceSalary;
    let lastDiff = Infinity;
    let step = 10000;

    for (let i = 0; i < 100; i += 1) {
      const monthlyIncome = this.calculateMonthlyIncome(targetAnnualSalary, targetCityData, settings);
      const diff = monthlyIncome.税后工资 - targetAfterTaxMonthly;

      if (Math.abs(diff) < 100) break;
      targetAnnualSalary += diff < 0 ? step : -step;
      if ((diff > 0 && lastDiff < 0) || (diff < 0 && lastDiff > 0)) {
        step = Math.max(1000, step / 2);
      }
      lastDiff = diff;
    }

    return targetAnnualSalary;
  }
}

export default CostCalculator;
