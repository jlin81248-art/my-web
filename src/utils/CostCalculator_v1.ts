// 费用与购买力计算器
import CityDataLoader, { CityData } from './CityDataLoader';

export interface Settings {
  sourceCity: string;
  salary: number; // 税前固定年薪
  annualBonus: number; // 年终奖 / 额外现金收入
  weeklyWorkHours: number; // 每周平均工作时长
  housingFundRate: string;
  housingType: string;
  housingLocation: string;
  housingSize: string;
  companyMeals: boolean;
  diningHomeRatio: number;
  transportType: string;
  carLoanMonthlyPayment: number;
  childrenCount: number;
  educationTypes: string[];
  entertainmentLevel: string;
  loanInterestRate: number;
  loanTerm: number;
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
    const monthlyWorkHours = Math.max(1, settings.weeklyWorkHours * 4.33);
    const realHourlyPay = Number((monthlyDisposable / monthlyWorkHours).toFixed(1));
    const housingBurdenRate = monthlyIncome.税后工资 > 0 ? monthlyCosts.住房 / monthlyIncome.税后工资 : 0;
    const savingsRate = monthlyIncome.税后工资 > 0 ? (monthlyDisposable / monthlyIncome.税后工资) * 100 : 0;
    const purchasingPowerScore = this.calculatePurchasingPowerScore({
      monthlyDisposable,
      savingsRate,
      housingBurdenRate,
      realHourlyPay,
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
    };
  }

  calculateMonthlyCosts(cityData: CityData, settings: Settings): MonthlyCosts {
    const housing = this.calculateHousingCost(cityData, settings);
    const dining = this.calculateDiningCost(cityData, settings);
    const transport = this.calculateTransportCost(cityData, settings);
    const education = this.calculateEducationCost(cityData, settings);
    const utilities = this.calculateUtilitiesCost(cityData, settings);

    return {
      住房: Math.round(housing),
      餐饮: Math.round(dining),
      交通: Math.round(transport),
      教育: Math.round(education),
      日常开销: Math.round(utilities),
      总支出: Math.round(housing + dining + transport + education + utilities),
    };
  }

  calculateMonthlyIncome(annualSalary: number, cityData: CityData, settings: Settings): MonthlyIncome {
    const monthSalary = annualSalary / 12;
    const insuranceBase = Math.min(
      Math.max(monthSalary, cityData.social_security_base_min),
      cityData.social_security_base_max,
    );

    const insurance = {
      养老保险: insuranceBase * 0.08,
      医疗保险: insuranceBase * 0.02,
      失业保险: insuranceBase * 0.005,
      住房公积金: insuranceBase * parseFloat(settings.housingFundRate),
    };

    const monthlyInsurance = Object.values(insurance).reduce((a, b) => a + b, 0);
    const taxable = monthSalary - monthlyInsurance - 5000;
    const tax = this.calculateTax(Math.max(0, taxable));

    return {
      税前工资: Math.round(monthSalary),
      社保公积金: Math.round(monthlyInsurance),
      个人所得税: Math.round(tax),
      税后工资: Math.round(monthSalary - monthlyInsurance - tax),
    };
  }

  private calculateHousingCost(cityData: CityData, settings: Settings): number {
    if (settings.housingType === 'rent') {
      if (settings.housingLocation === 'center') {
        if (settings.housingSize === 'shared') {
          return cityData.rent_center_1b * 0.6;
        }
        if (settings.housingSize === 'small') {
          return cityData.rent_center_1b;
        }
        return cityData.rent_center_3b;
      }

      if (settings.housingSize === 'shared') {
        return cityData.rent_suburb_1b * 0.6;
      }
      if (settings.housingSize === 'small') {
        return cityData.rent_suburb_1b;
      }
      return cityData.rent_suburb_3b;
    }

    const housePrice = settings.housingLocation === 'center'
      ? cityData.house_price_center
      : cityData.house_price_suburb;

    const area = settings.housingSize === 'small' ? 60 : 120;
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

    const propertyFee = settings.housingSize === 'small' ? 180 : 360;

    return monthlyPayment + propertyFee;
  }

  private calculateDiningCost(cityData: CityData, settings: Settings): number {
    if (settings.companyMeals) {
      const nonWorkdayRatio = 0.27;
      const diningHomeRatio = settings.diningHomeRatio / 100;
      const diningOutRatio = 1 - diningHomeRatio;
      const nonWorkdayCost = cityData.dining_home * diningHomeRatio + cityData.dining_out * diningOutRatio;
      return nonWorkdayCost * nonWorkdayRatio;
    }

    const diningHomeRatio = settings.diningHomeRatio / 100;
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

  private calculateEducationCost(cityData: CityData, settings: Settings): number {
    let educationCost = 0;

    if (settings.childrenCount > 0) {
      settings.educationTypes.forEach((educationType) => {
        switch (educationType) {
          case 'kindergarten':
            educationCost += cityData.kindergarten;
            break;
          case 'primary':
            educationCost += cityData.primary;
            break;
          case 'middle':
            educationCost += cityData.middle;
            break;
          case 'high':
            educationCost += cityData.high;
            break;
          case 'international':
            educationCost += cityData.international;
            break;
          default:
            break;
        }
      });
    }

    return educationCost;
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
        break;
    }
    return cityData.utilities + cityData.mobile_plan + cityData.internet + entertainmentCost;
  }

  private calculatePurchasingPowerScore(params: {
    monthlyDisposable: number;
    savingsRate: number;
    housingBurdenRate: number;
    realHourlyPay: number;
  }): number {
    const savingsScore = this.clamp(((params.savingsRate + 20) / 70) * 55, 0, 55);
    const housingScore = this.clamp(((0.45 - params.housingBurdenRate) / 0.45) * 25, 0, 25);
    const hourlyScore = this.clamp((params.realHourlyPay / 120) * 20, 0, 20);

    return Math.round(savingsScore + housingScore + hourlyScore);
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
        summary: '税后可支配空间充足，租住/通勤压力较低，适合作为优先考虑的 offer。',
      };
    }

    if (params.purchasingPowerScore >= 65) {
      return {
        label: '值得考虑',
        summary: '整体生活成本可控，真实时薪和结余率处于较健康区间，适合进一步比较发展机会。',
      };
    }

    if (params.purchasingPowerScore >= 50) {
      return {
        label: '谨慎比较',
        summary: '名义薪资尚可，但结余空间有限，建议结合成长性、团队和通勤成本一起判断。',
      };
    }

    return {
      label: '压力较大',
      summary: '住房或总支出占比较高，真实时薪偏低，不建议仅因为涨薪数字而做决定。',
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

  // 兼容原项目：仍然保留“反推目标城市所需工资”的能力
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

      if (Math.abs(diff) < 100) {
        break;
      }

      if (diff < 0) {
        targetAnnualSalary += step;
      } else {
        targetAnnualSalary -= step;
      }

      if ((diff > 0 && lastDiff < 0) || (diff < 0 && lastDiff > 0)) {
        step = Math.max(1000, step / 2);
      }

      lastDiff = diff;
    }

    return targetAnnualSalary;
  }
}

export default CostCalculator;
