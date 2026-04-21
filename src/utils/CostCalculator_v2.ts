import CityDataLoader, { CityData } from './CityDataLoader';

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
  教育: number;
  赡养: number;
  医疗: number;
  日常开销: number;
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
  purchasingPowerScore: number;
  decisionLabel: string;
  decisionSummary: string;
  workHoursPerDay: number;
  occupiedHoursPerDay: number;
  workingDaysPerMonth: number;
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
    const workingDaysPerMonth = Math.max(1, Number((Math.max(0.5, settings.workDaysPerWeek) * 4.33).toFixed(1)));
    const monthlyOccupiedHours = Math.max(1, occupiedHoursPerDay * workingDaysPerMonth);
    const realHourlyPay = Number((monthlyDisposable / monthlyOccupiedHours).toFixed(1));

    const housingBurdenRate = monthlyIncome.税后工资 > 0 ? monthlyCosts.住房 / monthlyIncome.税后工资 : 0;
    const savingsRate = monthlyIncome.税后工资 > 0 ? (monthlyDisposable / monthlyIncome.税后工资) * 100 : 0;

    const purchasingPowerScore = this.calculatePurchasingPowerScore({
      monthlyDisposable,
      savingsRate,
      housingBurdenRate,
      realHourlyPay,
      occupiedHoursPerDay,
    });

    const { label, summary } = this.getDecisionRecommendation({
      purchasingPowerScore,
      savingsRate,
      housingBurdenRate,
      realHourlyPay,
    });

    return {
      annualPackage,
      monthlyIncome,
      monthlyCosts,
      monthlyDisposable,
      annualDisposable,
      realHourlyPay,
      housingBurdenRate: Number((housingBurdenRate * 100).toFixed(1)),
      savingsRate: Number(savingsRate.toFixed(1)),
      purchasingPowerScore,
      decisionLabel: label,
      decisionSummary: summary,
      workHoursPerDay: Number(workHoursPerDay.toFixed(1)),
      occupiedHoursPerDay: Number(occupiedHoursPerDay.toFixed(1)),
      workingDaysPerMonth,
    };
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
    const education = Math.max(0, settings.childrenEducationMonthly || 0);
    const eldercare = Math.max(0, settings.elderCount || 0) * Math.max(0, settings.elderCareMonthlyPerPerson || 0);
    const medical = Math.max(0, (settings.familyMedicalMonthly || 0) - (settings.medicalReimbursementMonthly || 0));
    const utilities = this.calculateUtilitiesCost(cityData, settings);

    return {
      住房: Math.round(housing),
      餐饮: Math.round(dining),
      交通: Math.round(transport),
      教育: Math.round(education),
      赡养: Math.round(eldercare),
      医疗: Math.round(medical),
      日常开销: Math.round(utilities),
      总支出: Math.round(housing + dining + transport + education + eldercare + medical + utilities),
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

  private calculateUtilitiesCost(cityData: CityData, settings: Settings): number {
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

    return cityData.utilities + cityData.mobile_plan + cityData.internet + entertainmentCost;
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

  private calculatePurchasingPowerScore(params: {
    monthlyDisposable: number;
    savingsRate: number;
    housingBurdenRate: number;
    realHourlyPay: number;
    occupiedHoursPerDay: number;
  }): number {
    const savingsScore = this.clamp(((params.savingsRate + 20) / 70) * 50, 0, 50);
    const housingScore = this.clamp(((0.45 - params.housingBurdenRate) / 0.45) * 20, 0, 20);
    const hourlyScore = this.clamp((params.realHourlyPay / 120) * 20, 0, 20);
    const timePenalty = this.clamp(((params.occupiedHoursPerDay - 10) / 4) * 10, 0, 10);
    return Math.round(savingsScore + housingScore + hourlyScore - timePenalty);
  }

  private getDecisionRecommendation(params: {
    purchasingPowerScore: number;
    savingsRate: number;
    housingBurdenRate: number;
    realHourlyPay: number;
  }): { label: string; summary: string } {
    if (params.purchasingPowerScore >= 80) {
      return {
        label: '高购买力',
        summary: '税后可支配空间较大，时间占用与住房负担都较健康，是优先考虑的 offer。',
      };
    }

    if (params.purchasingPowerScore >= 65) {
      return {
        label: '值得考虑',
        summary: '整体支出可控，真实时薪与结余率处于中上区间，适合继续比较发展机会。',
      };
    }

    if (params.purchasingPowerScore >= 50) {
      return {
        label: '谨慎比较',
        summary: '名义薪资尚可，但家庭支出或时间占用偏高，建议再结合团队和成长性判断。',
      };
    }

    return {
      label: '压力较大',
      summary: '住房、家庭支出或时间占用明显偏高，不建议只看涨薪数字做决定。',
    };
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
