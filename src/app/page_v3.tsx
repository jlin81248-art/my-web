'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import PreferenceRanker from '../components/PreferenceRanker';
import MainInputs from '../components/MainInputs';
import LifestyleSettings from '../components/LifestyleSettings';
import OfferInsights from '../components/OfferInsights';
import IncomeExpenseDetails from '../components/IncomeExpenseDetails';
import PainPointComparisonTable from '../components/PainPointComparisonTable';
import CityDataLoader from '../utils/CityDataLoader';
import CostCalculator, {
  OfferComparisonResult,
  OfferMetrics,
  PreferenceKey,
  Settings,
} from '../utils/CostCalculator';

const defaultPreferences: PreferenceKey[] = [
  'salary',
  'entertainment',
  'housing',
  'time',
  'family',
  'climate',
  'growth',
];

const createOfferDefaults = (): Settings => ({
  sourceCity: '',
  salary: 240000,
  annualBonus: 30000,
  housingFundRate: '0.08',
  housingType: 'rent',
  housingLocation: 'center',
  housingSize: 'small',
  customRentMonthly: 4500,
  companyMeals: false,
  diningHomeRatio: 70,
  transportType: 'public',
  carLoanMonthlyPayment: 0,
  entertainmentLevel: 'medium',
  loanInterestRate: 0.0588,
  loanTerm: 30,
  childrenEducationMonthly: 0,
  elderCount: 0,
  elderCareMonthlyPerPerson: 0,
  familyMedicalMonthly: 0,
  medicalReimbursementMonthly: 0,
  commuteMinutesPerDay: 60,
  workStartTime: '09:30',
  workEndTime: '20:00',
  workDaysPerWeek: 5,
  entertainmentSceneScore: 4,
  climateComfortScore: 3,
  growthScore: 4,
});

export default function Home() {
  const [cityDataLoader, setCityDataLoader] = useState<CityDataLoader | null>(null);
  const [costCalculator, setCostCalculator] = useState<CostCalculator | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [preferenceOrder, setPreferenceOrder] = useState<PreferenceKey[]>(defaultPreferences);
  const [beforeOffer, setBeforeOffer] = useState<Settings>(createOfferDefaults());
  const [afterOffer, setAfterOffer] = useState<Settings>({
    ...createOfferDefaults(),
    salary: 320000,
    annualBonus: 50000,
    customRentMonthly: 6000,
    entertainmentLevel: 'high',
    commuteMinutesPerDay: 80,
    workEndTime: '21:00',
    entertainmentSceneScore: 3,
    climateComfortScore: 3,
    growthScore: 5,
  });

  useEffect(() => {
    const loadCityData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/city_data.csv');
        const csvText = await response.text();
        const loader = new CityDataLoader();
        await loader.loadData(csvText);
        const calculator = new CostCalculator(loader);
        const cities = loader.getAvailableCities();
        setCityDataLoader(loader);
        setCostCalculator(calculator);
        setAvailableCities(cities);

        if (cities.length > 0) {
          setBeforeOffer((prev) => ({ ...prev, sourceCity: cities[0] }));
          setAfterOffer((prev) => ({ ...prev, sourceCity: cities[1] || cities[0] }));
        }
      } catch (err) {
        setError('加载城市数据失败，请刷新页面重试');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, []);

  const beforeMetrics = useMemo<OfferMetrics | null>(() => {
    if (!costCalculator || !cityDataLoader || !beforeOffer.sourceCity) return null;
    const cityData = cityDataLoader.getCityData(beforeOffer.sourceCity);
    if (!cityData) return null;
    const annualPackage = costCalculator.calculateAnnualPackage(beforeOffer);
    return costCalculator.calculateOfferMetrics(annualPackage, cityData, beforeOffer);
  }, [beforeOffer, cityDataLoader, costCalculator]);

  const afterMetrics = useMemo<OfferMetrics | null>(() => {
    if (!costCalculator || !cityDataLoader || !afterOffer.sourceCity) return null;
    const cityData = cityDataLoader.getCityData(afterOffer.sourceCity);
    if (!cityData) return null;
    const annualPackage = costCalculator.calculateAnnualPackage(afterOffer);
    return costCalculator.calculateOfferMetrics(annualPackage, cityData, afterOffer);
  }, [afterOffer, cityDataLoader, costCalculator]);

  const comparison = useMemo<OfferComparisonResult | null>(() => {
    if (!costCalculator || !beforeMetrics || !afterMetrics) return null;
    return costCalculator.calculateOfferComparison(beforeMetrics, afterMetrics, preferenceOrder);
  }, [afterMetrics, beforeMetrics, costCalculator, preferenceOrder]);

  const handleBeforeChange = (key: keyof Settings, value: unknown) => {
    setBeforeOffer((prev) => ({ ...prev, [key]: value }));
  };

  const handleAfterChange = (key: keyof Settings, value: unknown) => {
    setAfterOffer((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载城市数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 space-y-6">
        <PreferenceRanker order={preferenceOrder} onChange={setPreferenceOrder} />

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <MainInputs
              title="跳槽前 Offer"
              settings={beforeOffer}
              availableCities={availableCities}
              onSettingChange={handleBeforeChange}
            />
            <LifestyleSettings
              title="跳槽前的生活方式与环境"
              settings={beforeOffer}
              onSettingChange={handleBeforeChange}
            />
          </div>

          <div className="space-y-6">
            <MainInputs
              title="跳槽后 Offer"
              settings={afterOffer}
              availableCities={availableCities}
              onSettingChange={handleAfterChange}
            />
            <LifestyleSettings
              title="跳槽后的生活方式与环境"
              settings={afterOffer}
              onSettingChange={handleAfterChange}
            />
          </div>
        </section>

        {comparison && beforeMetrics && afterMetrics && (
          <>
            <OfferInsights
              beforeLabel={`${beforeOffer.sourceCity || '跳槽前'} Offer`}
              afterLabel={`${afterOffer.sourceCity || '跳槽后'} Offer`}
              comparison={comparison}
            />
            <IncomeExpenseDetails
              beforeLabel={`${beforeOffer.sourceCity || '跳槽前'} Offer`}
              afterLabel={`${afterOffer.sourceCity || '跳槽后'} Offer`}
              beforeIncome={beforeMetrics.monthlyIncome}
              beforeCosts={beforeMetrics.monthlyCosts}
              afterIncome={afterMetrics.monthlyIncome}
              afterCosts={afterMetrics.monthlyCosts}
            />
            <PainPointComparisonTable rows={comparison.painPointRows} />
          </>
        )}
      </main>
    </div>
  );
}
