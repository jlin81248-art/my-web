import CityDataLoader, { CityData } from './CityDataLoader';

export type PreferenceKey =
  | 'salary'
  | 'health'
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
  elderCareMonthly: number;
  medicalMonthly: number;
  medicalReimbursementRate: number;
  commuteMinutesPerDay: number;
  workStartTime: string;
  workEndTime: string;
  workDaysPerMonth: number;
  salarySatisfactionScore: number;
  healthFriendlyScore: number;
  entertainmentSceneScore: number;
  housingEnvironmentScore: number;
  timeFreedomScore: number;
  familySupportScore: number;
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
  workOnlyHourlyPay: number;
  realHourlyPay: number;
  housingBurdenRate: number;
  savingsRate: number;
  workHoursPerDay: number;
  commuteMinutesPerDay: number;
  commuteHoursPerDay: number;
  occupiedHoursPerDay: number;
  freeHoursPerDay: number;
  workingDaysPerMonth: number;
  entertainmentBudgetRatio: number;
  familyBurdenRate: number;
  healthPressureScore: number;
  subjectiveScores: Record<PreferenceKey, number>;
  topPrioritySubjectiveScore: number;
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

export interface DeltaBreakdownItem {
  key: string;
  label: string;
  amount: number;
}

export interface RiskWarning {
  level: '低' | '中' | '高';
  title: string;
  reason: string;
}

export interface ThresholdHint {
  label: string;
  value: string;
  explanation: string;
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
    workOnlyHourlyPay: number;
    realHourlyPay: number;
  };
  painPointRows: PainPointRow[];
  topPriorityFindings: PainPointRow[];
  topPrioritySubjectiveBefore: number;
  topPrioritySubjectiveAfter: number;
  deltaBreakdown: DeltaBreakdownItem[];
  riskWarnings: RiskWarning[];
  thresholdHints: ThresholdHint[];
}

class CostCalculator {
  private cityDataLoader: CityDataLoader;

  constructor(cityDataLoader: CityDataLoader) {
    this.cityDataLoader = cityDataLoader;
  }

  calculateAnnualPackage(settings: Pick<Settings, 'salary' | 'annualBonus'>): number {
    return Math.max(0, settings.salary) + Math.max(0, settings.annualBonus);
  }

  calculateOfferMetrics(
    annualPackage: number,
    cityData: CityData,
    settings: Settings,
    topPriorityKeys: PreferenceKey[] = [],
  ): OfferMetrics {
    const monthlyIncome = this.calculateMonthlyIncome(annualPackage, cityData, settings);
    const monthlyCosts = this.calculateMonthlyCosts(cityData, settings);
    const monthlyDisposable = Math.round(monthlyIncome.税后工资 - monthlyCosts.总支出);
    const annualDisposable = monthlyDisposable * 12;

    const workHoursPerDay = this.getDailyWorkHours(settings.workStartTime, settings.workEndTime);
    const commuteMinutesPerDay = Math.max(0, settings.commuteMinutesPerDay || 0);
    const commuteHoursPerDay = commuteMinutesPerDay / 60;
    const occupiedHoursPerDay = workHoursPerDay + commuteHoursPerDay;
    const freeHoursPerDay = Math.max(0, 24 - occupiedHoursPerDay - 8);
    const workingDaysPerMonth = this.clamp(Number((settings.workDaysPerMonth || 22).toFixed(1)), 1, 31);
    const monthlyWorkHours = Math.max(1, workHoursPerDay * workingDaysPerMonth);
    const monthlyOccupiedHours = Math.max(1, occupiedHoursPerDay * workingDaysPerMonth);
    const workOnlyHourlyPay = Number((monthlyDisposable / monthlyWorkHours).toFixed(1));
    const realHourlyPay = Number((monthlyDisposable / monthlyOccupiedHours).toFixed(1));

    const housingBurdenRate = monthlyIncome.税后工资 > 0 ? (monthlyCosts.住房 / monthlyIncome.税后工资) * 100 : 0;
    const savingsRate = monthlyIncome.税后工资 > 0 ? (monthlyDisposable / monthlyIncome.税后工资) * 100 : 0;
    const entertainmentBudgetRatio = monthlyIncome.税后工资 > 0 ? (monthlyCosts.娱乐 / monthlyIncome.税后工资) * 100 : 0;
    const familyCosts = monthlyCosts.教育 + monthlyCosts.赡养 + monthlyCosts.医疗;
    const familyBurdenRate = monthlyIncome.税后工资 > 0 ? (familyCosts / monthlyIncome.税后工资) * 100 : 0;
    const healthPressureScore = this.calculateHealthPressureScore(
      workHoursPerDay,
      workingDaysPerMonth,
      commuteMinutesPerDay,
      settings.healthFriendlyScore,
    );

    const subjectiveScores: Record<PreferenceKey, number> = {
      salary: settings.salarySatisfactionScore,
      health: settings.healthFriendlyScore,
      entertainment: settings.entertainmentSceneScore,
      housing: settings.housingEnvironmentScore,
      time: settings.timeFreedomScore,
      family: settings.familySupportScore,
      climate: settings.climateComfortScore,
      growth: settings.growthScore,
    };

    return {
      annualPackage,
      monthlyIncome,
      monthlyCosts,
      monthlyDisposable,
      annualDisposable,
      workOnlyHourlyPay,
      realHourlyPay,
      housingBurdenRate: Number(housingBurdenRate.toFixed(1)),
      savingsRate: Number(savingsRate.toFixed(1)),
      workHoursPerDay: Number(workHoursPerDay.toFixed(1)),
      commuteMinutesPerDay: Number(commuteMinutesPerDay.toFixed(1)),
      commuteHoursPerDay: Number(commuteHoursPerDay.toFixed(1)),
      occupiedHoursPerDay: Number(occupiedHoursPerDay.toFixed(1)),
      freeHoursPerDay: Number(freeHoursPerDay.toFixed(1)),
      workingDaysPerMonth,
      entertainmentBudgetRatio: Number(entertainmentBudgetRatio.toFixed(1)),
      familyBurdenRate: Number(familyBurdenRate.toFixed(1)),
      healthPressureScore,
      subjectiveScores,
      topPrioritySubjectiveScore: this.calculateTopPrioritySubjectiveScore(subjectiveScores, topPriorityKeys),
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
      health: this.getHealthDimensionScore(before, after),
      entertainment: this.getEntertainmentDimensionScore(before, after),
      housing: this.getHousingDimensionScore(before, after),
      time: this.getTimeDimensionScore(before, after),
      family: this.getFamilyDimensionScore(before, after),
      climate: this.getClimateDimensionScore(before, after),
      growth: this.getGrowthDimensionScore(before, after),
    };

    const weightedDelta = weights.reduce((sum, item) => sum + (dimensionScores[item.key] * item.weight), 0);
    const weightedScore = Math.round(this.clamp(50 + weightedDelta / 2.2, 0, 100));

    const painPointRows = this.buildPainPointRows(before, after, preferenceOrder);
    const topPriorityFindings = painPointRows.slice(0, 3);

    const { decisionLabel, summaryTitle, summaryText } = this.generateNarrative(
      weightedScore,
      topPriorityFindings,
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
        workOnlyHourlyPay: Number((after.workOnlyHourlyPay - before.workOnlyHourlyPay).toFixed(1)),
        realHourlyPay: Number((after.realHourlyPay - before.realHourlyPay).toFixed(1)),
      },
      painPointRows,
      topPriorityFindings,
      topPrioritySubjectiveBefore: before.topPrioritySubjectiveScore,
      topPrioritySubjectiveAfter: after.topPrioritySubjectiveScore,
      deltaBreakdown: this.calculateDeltaBreakdown(before, after),
      riskWarnings: this.generateRiskWarnings(after),
      thresholdHints: this.solveThresholdConditions(before, after),
    };
  }

  getPreferenceWeights(order: PreferenceKey[]): PreferenceWeight[] {
    const distribution = [0.26, 0.20, 0.16, 0.12, 0.10, 0.07, 0.05, 0.04];
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
    const eldercare = Math.max(0, settings.elderCareMonthly || 0);
    const reimbursementRate = this.clamp(settings.medicalReimbursementRate || 0, 0, 100) / 100;
    const medical = Math.max(0, (settings.medicalMonthly || 0) * (1 - reimbursementRate));

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
        beforeValue: `${this.formatCurrency(before.monthlyDisposable)}/月可支配｜在岗 ${this.formatCurrency(before.workOnlyHourlyPay)}/h`,
        afterValue: `${this.formatCurrency(after.monthlyDisposable)}/月可支配｜在岗 ${this.formatCurrency(after.workOnlyHourlyPay)}/h`,
        deltaText: `${this.getSignedCurrency(after.monthlyDisposable - before.monthlyDisposable)} / 月；主观满意 ${this.getSignedNumber(after.subjectiveScores.salary - before.subjectiveScores.salary)}`,
        impact: this.getImpact(this.getSalaryDimensionScore(before, after)),
        explanation: after.monthlyDisposable >= before.monthlyDisposable
          ? '涨薪不只是数字更高，也更有效地转化成了月结余和时薪。'
          : '看起来像涨薪，但没有真正换来更高的月可支配收入或更好的时薪体感。',
        priorityRank: rankMap.get('salary') || 99,
      },
      {
        key: 'health',
        label: '身心健康与工作强度',
        beforeValue: `健康压力 ${before.healthPressureScore}/100｜主观友好度 ${before.subjectiveScores.health}/5`,
        afterValue: `健康压力 ${after.healthPressureScore}/100｜主观友好度 ${after.subjectiveScores.health}/5`,
        deltaText: `健康压力 ${this.getSignedNumber(before.healthPressureScore - after.healthPressureScore)}；主观友好度 ${this.getSignedNumber(after.subjectiveScores.health - before.subjectiveScores.health)}`,
        impact: this.getImpact(this.getHealthDimensionScore(before, after)),
        explanation: after.healthPressureScore <= before.healthPressureScore
          ? '跳槽后工时、月工作天数、通勤或主观强度感受更可持续，对身心更友好。'
          : '跳槽后工作强度更容易透支身体或情绪，这个成本不能只靠总包掩盖。',
        priorityRank: rankMap.get('health') || 99,
      },
      {
        key: 'entertainment',
        label: '娱乐与生活丰富度',
        beforeValue: `娱乐预算占比 ${before.entertainmentBudgetRatio}%｜主观评分 ${before.subjectiveScores.entertainment}/5｜自由时间 ${before.freeHoursPerDay}h`,
        afterValue: `娱乐预算占比 ${after.entertainmentBudgetRatio}%｜主观评分 ${after.subjectiveScores.entertainment}/5｜自由时间 ${after.freeHoursPerDay}h`,
        deltaText: `预算占比 ${this.getSignedPercent(after.entertainmentBudgetRatio - before.entertainmentBudgetRatio)}；主观评分 ${this.getSignedNumber(after.subjectiveScores.entertainment - before.subjectiveScores.entertainment)}；自由时间 ${this.getSignedNumber(after.freeHoursPerDay - before.freeHoursPerDay)}h`,
        impact: this.getImpact(this.getEntertainmentDimensionScore(before, after)),
        explanation: this.getEntertainmentExplanation(before, after),
        priorityRank: rankMap.get('entertainment') || 99,
      },
      {
        key: 'housing',
        label: '居住条件',
        beforeValue: `住房负担率 ${before.housingBurdenRate}%｜主观评分 ${before.subjectiveScores.housing}/5`,
        afterValue: `住房负担率 ${after.housingBurdenRate}%｜主观评分 ${after.subjectiveScores.housing}/5`,
        deltaText: `住房负担 ${this.getSignedPercent(after.housingBurdenRate - before.housingBurdenRate)}；主观评分 ${this.getSignedNumber(after.subjectiveScores.housing - before.subjectiveScores.housing)}`,
        impact: this.getImpact(this.getHousingDimensionScore(before, after)),
        explanation: after.housingBurdenRate <= before.housingBurdenRate
          ? '住房占税后收入的比例更低，住得起且住得更舒服的概率更高。'
          : '住房压力上升后，其他生活质量很容易一起被挤压。',
        priorityRank: rankMap.get('housing') || 99,
      },
      {
        key: 'time',
        label: '通勤与自由时间',
        beforeValue: `月工作 ${before.workingDaysPerMonth} 天｜通勤 ${before.commuteMinutesPerDay} 分钟｜主观评分 ${before.subjectiveScores.time}/5`,
        afterValue: `月工作 ${after.workingDaysPerMonth} 天｜通勤 ${after.commuteMinutesPerDay} 分钟｜主观评分 ${after.subjectiveScores.time}/5`,
        deltaText: `月工作 ${this.getSignedNumber(after.workingDaysPerMonth - before.workingDaysPerMonth)} 天；通勤 ${this.getSignedNumber(after.commuteMinutesPerDay - before.commuteMinutesPerDay)} 分钟；主观评分 ${this.getSignedNumber(after.subjectiveScores.time - before.subjectiveScores.time)}`,
        impact: this.getImpact(this.getTimeDimensionScore(before, after)),
        explanation: after.freeHoursPerDay >= before.freeHoursPerDay && after.commuteMinutesPerDay <= before.commuteMinutesPerDay
          ? '跳槽后被工作和通勤吃掉的时间更少，真正能归自己支配的时间更多。'
          : '如果月工作天数更高、通勤更长，自由时间会缩水得很明显。',
        priorityRank: rankMap.get('time') || 99,
      },
      {
        key: 'family',
        label: '家庭负担',
        beforeValue: `家庭负担率 ${before.familyBurdenRate}%｜主观评分 ${before.subjectiveScores.family}/5`,
        afterValue: `家庭负担率 ${after.familyBurdenRate}%｜主观评分 ${after.subjectiveScores.family}/5`,
        deltaText: `负担率 ${this.getSignedPercent(after.familyBurdenRate - before.familyBurdenRate)}；主观评分 ${this.getSignedNumber(after.subjectiveScores.family - before.subjectiveScores.family)}`,
        impact: this.getImpact(this.getFamilyDimensionScore(before, after)),
        explanation: after.familyBurdenRate <= before.familyBurdenRate
          ? '教育、赡养、医疗对收入的挤压更小，家庭现金流更稳。'
          : '家庭支出占比上升后，跳槽的抗风险能力会下降。',
        priorityRank: rankMap.get('family') || 99,
      },
      {
        key: 'climate',
        label: '气候与城市环境',
        beforeValue: `主观评分 ${before.subjectiveScores.climate}/5`,
        afterValue: `主观评分 ${after.subjectiveScores.climate}/5`,
        deltaText: `主观评分 ${this.getSignedNumber(after.subjectiveScores.climate - before.subjectiveScores.climate)}`,
        impact: this.getImpact(this.getClimateDimensionScore(before, after)),
        explanation: after.subjectiveScores.climate >= before.subjectiveScores.climate
          ? '从你的主观感受看，跳槽后所在城市更适合长期生活。'
          : '即使收入好看，城市体感下降也会拉低长期幸福感。',
        priorityRank: rankMap.get('climate') || 99,
      },
      {
        key: 'growth',
        label: '职业成长',
        beforeValue: `主观评分 ${before.subjectiveScores.growth}/5`,
        afterValue: `主观评分 ${after.subjectiveScores.growth}/5`,
        deltaText: `主观评分 ${this.getSignedNumber(after.subjectiveScores.growth - before.subjectiveScores.growth)}`,
        impact: this.getImpact(this.getGrowthDimensionScore(before, after)),
        explanation: after.subjectiveScores.growth >= before.subjectiveScores.growth
          ? '如果你接受短期波动换长期成长，这份新 offer 的潜力更高。'
          : '这次跳槽更像短期变化，未必带来更好的长期成长回报。',
        priorityRank: rankMap.get('growth') || 99,
      },
    ];

    return rows.sort((a, b) => a.priorityRank - b.priorityRank);
  }

  private calculateDeltaBreakdown(before: OfferMetrics, after: OfferMetrics): DeltaBreakdownItem[] {
    return [
      {
        key: 'income',
        label: '税后收入变化',
        amount: after.monthlyIncome.税后工资 - before.monthlyIncome.税后工资,
      },
      {
        key: 'housing',
        label: '住房变化',
        amount: before.monthlyCosts.住房 - after.monthlyCosts.住房,
      },
      {
        key: 'time',
        label: '通勤与时间成本',
        amount: Math.round((before.realHourlyPay - after.realHourlyPay) * 15),
      },
      {
        key: 'entertainment',
        label: '娱乐支出变化',
        amount: before.monthlyCosts.娱乐 - after.monthlyCosts.娱乐,
      },
      {
        key: 'family',
        label: '家庭支出变化',
        amount:
          (before.monthlyCosts.教育 + before.monthlyCosts.赡养 + before.monthlyCosts.医疗)
          - (after.monthlyCosts.教育 + after.monthlyCosts.赡养 + after.monthlyCosts.医疗),
      },
    ];
  }

  private generateRiskWarnings(after: OfferMetrics): RiskWarning[] {
    const warnings: RiskWarning[] = [];

    warnings.push(
      after.healthPressureScore >= 70
        ? { level: '高', title: '健康透支风险', reason: '工时、月工作天数或通勤偏高，长期可能影响恢复和情绪。' }
        : after.healthPressureScore >= 50
          ? { level: '中', title: '健康透支风险', reason: '当前强度还能承受，但一旦业务节奏上升，透支风险会明显增加。' }
          : { level: '低', title: '健康透支风险', reason: '当前时间与强度组合相对可持续。' },
    );

    warnings.push(
      after.housingBurdenRate >= 38
        ? { level: '高', title: '住房压力风险', reason: '住房成本占税后收入过高，其他生活质量会被持续挤压。' }
        : after.housingBurdenRate >= 28
          ? { level: '中', title: '住房压力风险', reason: '住房压力可接受，但不太适合再叠加高娱乐或高家庭支出。' }
          : { level: '低', title: '住房压力风险', reason: '住房负担相对健康。' },
    );

    warnings.push(
      after.familyBurdenRate >= 25
        ? { level: '高', title: '家庭现金流风险', reason: '教育、赡养、医疗占比偏高，遇到额外支出时缓冲空间不足。' }
        : after.familyBurdenRate >= 15
          ? { level: '中', title: '家庭现金流风险', reason: '家庭支出占比不低，需要更关注结余和备用金。' }
          : { level: '低', title: '家庭现金流风险', reason: '家庭支出对现金流的挤压较小。' },
    );

    return warnings;
  }

  private solveThresholdConditions(before: OfferMetrics, after: OfferMetrics): ThresholdHint[] {
    const currentDisposableGap = before.monthlyDisposable - after.monthlyDisposable;
    const rentReductionNeeded = currentDisposableGap > 0 ? Math.ceil(currentDisposableGap / 100) * 100 : 0;
    const commuteReductionNeeded = after.realHourlyPay < before.realHourlyPay
      ? Math.max(0, Math.round((before.realHourlyPay - after.realHourlyPay) * 12))
      : 0;

    return [
      {
        label: '租金上限',
        value: rentReductionNeeded > 0 ? `建议至少再压低 ${rentReductionNeeded} 元/月` : '当前租金已基本可接受',
        explanation: '如果你最在意现金流与住房压力，租金通常是最先值得谈的条件。',
      },
      {
        label: '通勤上限',
        value: commuteReductionNeeded > 0 ? `建议每天至少减少 ${commuteReductionNeeded} 分钟` : '当前通勤对真实时薪影响不大',
        explanation: '真实时薪很容易被通勤拉低，尤其对时间和健康敏感型用户影响更大。',
      },
      {
        label: '最低年终奖要求',
        value: after.monthlyDisposable < before.monthlyDisposable
          ? `建议年终奖至少再增加 ${Math.max(12000, Math.round((before.monthlyDisposable - after.monthlyDisposable) * 12))} 元`
          : '当前年终奖水平已足够支撑',
        explanation: '如果 base 难谈，年终奖往往是补回跳槽溢价的第二抓手。',
      },
    ];
  }

  private getSalaryDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const disposableDelta = after.monthlyDisposable - before.monthlyDisposable;
    const workOnlyDelta = after.workOnlyHourlyPay - before.workOnlyHourlyPay;
    const realDelta = after.realHourlyPay - before.realHourlyPay;
    const subjectiveDelta = (after.subjectiveScores.salary - before.subjectiveScores.salary) * 10;
    return this.clamp((disposableDelta / 1000) * 10 + workOnlyDelta * 2 + realDelta * 1.5 + subjectiveDelta, -100, 100);
  }

  private getHealthDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const healthPressureDelta = (before.healthPressureScore - after.healthPressureScore) * 1.2;
    const subjectiveDelta = (after.subjectiveScores.health - before.subjectiveScores.health) * 14;
    const freeTimeDelta = (after.freeHoursPerDay - before.freeHoursPerDay) * 8;
    return this.clamp(healthPressureDelta + subjectiveDelta + freeTimeDelta, -100, 100);
  }

  private getEntertainmentDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const sceneDelta = (after.subjectiveScores.entertainment - before.subjectiveScores.entertainment) * 18;
    const freeTimeDelta = (after.freeHoursPerDay - before.freeHoursPerDay) * 8;
    const budgetPressureDelta = (before.entertainmentBudgetRatio - after.entertainmentBudgetRatio) * 1.6;
    return this.clamp(sceneDelta + freeTimeDelta + budgetPressureDelta, -100, 100);
  }

  private getHousingDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const burdenDelta = (before.housingBurdenRate - after.housingBurdenRate) * 3.6;
    const subjectiveDelta = (after.subjectiveScores.housing - before.subjectiveScores.housing) * 12;
    return this.clamp(burdenDelta + subjectiveDelta, -100, 100);
  }

  private getTimeDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const freeTimeDelta = (after.freeHoursPerDay - before.freeHoursPerDay) * 14;
    const commuteDelta = (before.commuteMinutesPerDay - after.commuteMinutesPerDay) / 3;
    const monthlyDaysDelta = (before.workingDaysPerMonth - after.workingDaysPerMonth) * 3;
    const subjectiveDelta = (after.subjectiveScores.time - before.subjectiveScores.time) * 12;
    return this.clamp(freeTimeDelta + commuteDelta + monthlyDaysDelta + subjectiveDelta, -100, 100);
  }

  private getFamilyDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    const burdenDelta = (before.familyBurdenRate - after.familyBurdenRate) * 4;
    const subjectiveDelta = (after.subjectiveScores.family - before.subjectiveScores.family) * 10;
    return this.clamp(burdenDelta + subjectiveDelta, -100, 100);
  }

  private getClimateDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((after.subjectiveScores.climate - before.subjectiveScores.climate) * 25, -100, 100);
  }

  private getGrowthDimensionScore(before: OfferMetrics, after: OfferMetrics): number {
    return this.clamp((after.subjectiveScores.growth - before.subjectiveScores.growth) * 25, -100, 100);
  }

  private calculateHealthPressureScore(
    workHoursPerDay: number,
    workingDaysPerMonth: number,
    commuteMinutesPerDay: number,
    healthFriendlyScore: number,
  ): number {
    const workScore = this.clamp((workHoursPerDay - 8) * 8, 0, 40);
    const dayScore = this.clamp((workingDaysPerMonth - 22) * 3.5, 0, 25);
    const commuteScore = this.clamp((commuteMinutesPerDay - 40) / 3, 0, 15);
    const subjectivePenalty = this.clamp((5 - healthFriendlyScore) * 6, 0, 20);
    return Math.round(this.clamp(workScore + dayScore + commuteScore + subjectivePenalty, 0, 100));
  }

  private calculateTopPrioritySubjectiveScore(
    scores: Record<PreferenceKey, number>,
    topPriorityKeys: PreferenceKey[],
  ): number {
    if (topPriorityKeys.length === 0) return 0;
    const total = topPriorityKeys.reduce((sum, key) => sum + (scores[key] || 0), 0);
    return Number((total / topPriorityKeys.length).toFixed(1));
  }

  private getEntertainmentExplanation(before: OfferMetrics, after: OfferMetrics): string {
    const sceneDown = after.subjectiveScores.entertainment < before.subjectiveScores.entertainment;
    const budgetUp = after.entertainmentBudgetRatio > before.entertainmentBudgetRatio;
    const freeTimeDown = after.freeHoursPerDay < before.freeHoursPerDay;

    if (sceneDown && (budgetUp || freeTimeDown)) {
      return '跳槽后娱乐环境主观评分下降，同时娱乐预算压力或自由时间变差，娱乐体验大概率会下降。';
    }
    if (after.subjectiveScores.entertainment > before.subjectiveScores.entertainment && after.freeHoursPerDay >= before.freeHoursPerDay) {
      return '跳槽后娱乐环境和下班后的可支配时间都更友好，更适合高娱乐偏好用户。';
    }
    if (budgetUp) {
      return '跳槽后想维持原有娱乐习惯会更吃力，娱乐消费更容易挤压现金流。';
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

    if (weightedScore >= 72) {
      return {
        decisionLabel: '更适合跳',
        summaryTitle: '这次跳槽更符合你的优先级',
        summaryText: `你最在意的「${lead?.label ?? '核心维度'}」明显改善，而且「${second?.label ?? '第二优先维度'}」没有拖后腿。相比跳槽前，税后月收入 ${this.getSignedCurrency(after.monthlyIncome.税后工资 - before.monthlyIncome.税后工资)}，月可支配收入 ${this.getSignedCurrency(after.monthlyDisposable - before.monthlyDisposable)}。`,
      };
    }

    if (weightedScore >= 58) {
      return {
        decisionLabel: '可以认真考虑',
        summaryTitle: '这次跳槽总体可行，但不是无脑更优',
        summaryText: `新 offer 在「${lead?.label ?? '核心维度'}」上更适合你，但仍存在明显权衡。更像是“有条件成立”的选择：如果关键条件谈到位，这次跳槽值得推进。`,
      };
    }

    if (weightedScore >= 45) {
      return {
        decisionLabel: '需要谨慎权衡',
        summaryTitle: '名义变化不等于生活升级',
        summaryText: `虽然部分指标可能上升，但你最看重的「${lead?.label ?? '核心维度'}」与「${second?.label ?? '关键维度'}」没有同步改善。尤其当你更在意生活体感而不是总包数字时，这次跳槽未必会让日常过得更舒服。`,
      };
    }

    return {
      decisionLabel: '不太建议仅凭涨薪跳',
      summaryTitle: '这次跳槽很可能只是数字更好看',
      summaryText: `对你来说，最关键的「${lead?.label ?? '核心维度'}」表现变差，而且「${second?.label ?? '关键维度'}」也没有补回来。特别是当跳槽后住房、健康或时间成本上升时，即使总包上涨，也可能换来更差的生活质量。`,
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
