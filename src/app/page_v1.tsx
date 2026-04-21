'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import MainInputs from '../components/MainInputs';
import LifestyleSettings from '../components/LifestyleSettings';
import OfferInsights from '../components/OfferInsights';
import IncomeExpenseDetails from '../components/IncomeExpenseDetails';
import CityComparison, { CityOfferResult } from '../components/CityComparison';
import CityDataLoader from '../utils/CityDataLoader';
import CostCalculator, { MonthlyCosts, MonthlyIncome, OfferMetrics, Settings } from '../utils/CostCalculator';

export default function Home() {
  const [cityDataLoader, setCityDataLoader] = useState<CityDataLoader | null>(null);
  const [costCalculator, setCostCalculator] = useState<CostCalculator | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<Settings>({
    sourceCity: '',
    salary: 240000,
    annualBonus: 30000,
    weeklyWorkHours: 50,
    housingFundRate: '0.08',
    housingType: 'rent',
    housingLocation: 'center',
    housingSize: 'small',
    companyMeals: false,
    diningHomeRatio: 70,
    transportType: 'public',
    carLoanMonthlyPayment: 0,
    childrenCount: 0,
    educationTypes: [],
    entertainmentLevel: 'medium',
    loanInterestRate: 0.0588,
    loanTerm: 30,
  });

  const [sourceIncome, setSourceIncome] = useState<MonthlyIncome | null>(null);
  const [sourceCosts, setSourceCosts] = useState<MonthlyCosts | null>(null);
  const [currentOfferMetrics, setCurrentOfferMetrics] = useState<OfferMetrics | null>(null);

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
          setSettings((prev) => ({
            ...prev,
            sourceCity: cities[0],
          }));
        }
      } catch (err) {
        setError('加载城市数据失败，请刷新页面重试');
        console.error('Error loading city data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, []);

  useEffect(() => {
    if (!costCalculator || !cityDataLoader || !settings.sourceCity) {
      return;
    }

    const cityData = cityDataLoader.getCityData(settings.sourceCity);
    if (!cityData) {
      return;
    }

    const annualPackage = costCalculator.calculateAnnualPackage(settings);
    const income = costCalculator.calculateMonthlyIncome(annualPackage, cityData, settings);
    const costs = costCalculator.calculateMonthlyCosts(cityData, settings);
    const metrics = costCalculator.calculateOfferMetrics(annualPackage, cityData, settings);

    setSourceIncome(income);
    setSourceCosts(costs);
    setCurrentOfferMetrics(metrics);
  }, [costCalculator, cityDataLoader, settings]);

  const cityResults = useMemo<CityOfferResult[]>(() => {
    if (!costCalculator || !cityDataLoader || !settings.sourceCity) {
      return [];
    }

    const annualPackage = costCalculator.calculateAnnualPackage(settings);

    return availableCities
      .map((cityName) => {
        const cityData = cityDataLoader.getCityData(cityName);
        if (!cityData) {
          return null;
        }

        return {
          cityName,
          metrics: costCalculator.calculateOfferMetrics(annualPackage, cityData, {
            ...settings,
            sourceCity: cityName,
          }),
          isCurrentCity: cityName === settings.sourceCity,
        } as CityOfferResult;
      })
      .filter((item): item is CityOfferResult => Boolean(item));
  }, [availableCities, cityDataLoader, costCalculator, settings]);

  const annualPackage = useMemo(() => (
    costCalculator ? costCalculator.calculateAnnualPackage(settings) : settings.salary + settings.annualBonus
  ), [costCalculator, settings]);

  const handleSettingChange = (key: keyof Settings, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 space-y-6">
        <MainInputs
          settings={settings}
          availableCities={availableCities}
          onSettingChange={handleSettingChange}
        />

        <LifestyleSettings
          settings={settings}
          onSettingChange={handleSettingChange}
        />

        <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">
                Step 2
              </div>
              <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">当前 offer 基础信息</h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              当前测算总现金包：
              <span className="ml-1 font-semibold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(annualPackage)} / 年
              </span>
            </div>
          </div>
        </section>

        {currentOfferMetrics && (
          <OfferInsights cityName={settings.sourceCity} metrics={currentOfferMetrics} />
        )}

        {sourceIncome && sourceCosts && (
          <IncomeExpenseDetails
            cityName={`${settings.sourceCity} Offer`}
            income={sourceIncome}
            costs={sourceCosts}
          />
        )}

        {cityResults.length > 0 && (
          <CityComparison currentCity={settings.sourceCity} results={cityResults} />
        )}
      </main>

      <footer className="w-full py-6 mt-8 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            OfferWise 基于城市生活成本数据估算真实购买力，适合做 offer 选择、跳槽判断和择城决策。
          </p>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} OfferWise · 数据仅供参考，税务与实际福利政策请以公司 offer 和当地政策为准。
          </p>
        </div>
      </footer>
    </div>
  );
}
