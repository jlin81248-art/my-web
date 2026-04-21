
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import PreferenceRanker from '../components/PreferenceRanker';
import MainInputs from '../components/MainInputs';
import LifestyleSettings from '../components/LifestyleSettings';
import OfferInsights from '../components/OfferInsights';
import IncomeExpenseDetails from '../components/IncomeExpenseDetails';
import PainPointComparisonTable from '../components/PainPointComparisonTable';
import FinalDecision from '../components/FinalDecision';
import CityDataLoader from '../utils/CityDataLoader';
import CostCalculator, {
  OfferComparisonResult,
  OfferMetrics,
  PreferenceKey,
  Settings,
} from '../utils/CostCalculator';

const defaultPreferences: PreferenceKey[] = [
  'salary',
  'health',
  'time',
  'entertainment',
  'housing',
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
  elderCareMonthly: 0,
  medicalMonthly: 0,
  medicalReimbursementRate: 0,
  commuteMinutesPerDay: 0,
  workStartTime: '09:30',
  workEndTime: '20:00',
  workDaysPerMonth: 22,
  salarySatisfactionScore: 3,
  healthFriendlyScore: 3,
  entertainmentSceneScore: 4,
  housingEnvironmentScore: 3,
  timeFreedomScore: 3,
  familySupportScore: 3,
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
    entertainmentSceneScore: 3,
    healthFriendlyScore: 2,
    growthScore: 5,
    timeFreedomScore: 2,
    salarySatisfactionScore: 4,
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

  const topPriorityKeys = useMemo(() => preferenceOrder.slice(0, 3), [preferenceOrder]);

  const beforeMetrics = useMemo<OfferMetrics | null>(() => {
    if (!costCalculator || !cityDataLoader || !beforeOffer.sourceCity) return null;
    const cityData = cityDataLoader.getCityData(beforeOffer.sourceCity);
    if (!cityData) return null;
    const annualPackage = costCalculator.calculateAnnualPackage(beforeOffer);
    return costCalculator.calculateOfferMetrics(annualPackage, cityData, beforeOffer, topPriorityKeys);
  }, [beforeOffer, cityDataLoader, costCalculator, topPriorityKeys]);

  const afterMetrics = useMemo<OfferMetrics | null>(() => {
    if (!costCalculator || !cityDataLoader || !afterOffer.sourceCity) return null;
    const cityData = cityDataLoader.getCityData(afterOffer.sourceCity);
    if (!cityData) return null;
    const annualPackage = costCalculator.calculateAnnualPackage(afterOffer);
    return costCalculator.calculateOfferMetrics(annualPackage, cityData, afterOffer, topPriorityKeys);
  }, [afterOffer, cityDataLoader, costCalculator, topPriorityKeys]);

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

        <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 2</div>
              <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">输入跳槽前后两份 Offer</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                先填客观条件，再补充你当前最在意的 3 个维度的主观体验评分。分析会优先围绕这 3 个点展开。
              </p>
            </div>
            <div className="inline-flex flex-wrap gap-2 text-xs">
              {topPriorityKeys.map((key) => (
                <span
                  key={key}
                  className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 font-semibold text-blue-700 dark:text-blue-300"
                >
                  TOP {topPriorityKeys.indexOf(key) + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MainInputs
                title="跳槽前 Offer"
                settings={beforeOffer}
                availableCities={availableCities}
                onSettingChange={handleBeforeChange}
              />
              <LifestyleSettings
                title="跳槽前的生活方式与主观体验"
                settings={beforeOffer}
                topPriorityKeys={topPriorityKeys}
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
                title="跳槽后的生活方式与主观体验"
                settings={afterOffer}
                topPriorityKeys={topPriorityKeys}
                onSettingChange={handleAfterChange}
              />
            </div>
          </div>
        </section>

        {comparison && beforeMetrics && afterMetrics && (
          <>
            <OfferInsights
              beforeLabel={`${beforeOffer.sourceCity || '跳槽前'} Offer`}
              afterLabel={`${afterOffer.sourceCity || '跳槽后'} Offer`}
              comparison={comparison}
              topPriorityKeys={topPriorityKeys}
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
            <FinalDecision comparison={comparison} />
          </>
        )}
      </main>
    </div>
  );
}
