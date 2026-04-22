'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import HomeHero from '../components/HomeHero';
import SmartWidgets from '../components/SmartWidgets';
import PreferenceRanker from '../components/PreferenceRanker';
import MainInputs from '../components/MainInputs';
import LifestyleSettings from '../components/LifestyleSettings';
import OfferInsights from '../components/OfferInsights';
import DeltaWaterfall from '../components/DeltaWaterfall';
import TimeHealthDrilldown from '../components/TimeHealthDrilldown';
import IncomeExpenseDetails from '../components/IncomeExpenseDetails';
import PainPointComparisonTable from '../components/PainPointComparisonTable';
import ScenarioSimulator from '../components/ScenarioSimulator';
import ThresholdAnalysis from '../components/ThresholdAnalysis';
import RiskWarnings from '../components/RiskWarnings';
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

  const [scenario, setScenario] = useState({
    customRentMonthly: 0,
    commuteMinutesPerDay: 0,
    workDaysPerMonth: 22,
    annualBonus: 0,
    medicalReimbursementRate: 0,
    entertainmentLevel: 'medium',
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
        console.error(err);
        setError('加载城市数据失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, []);

  useEffect(() => {
    setScenario((prev) => ({
      ...prev,
      customRentMonthly: afterOffer.customRentMonthly,
      commuteMinutesPerDay: afterOffer.commuteMinutesPerDay,
      workDaysPerMonth: afterOffer.workDaysPerMonth,
      annualBonus: afterOffer.annualBonus,
      medicalReimbursementRate: afterOffer.medicalReimbursementRate,
      entertainmentLevel: afterOffer.entertainmentLevel,
    }));
  }, [afterOffer]);

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

  const simulatedAfterOffer = useMemo<Settings>(() => ({
    ...afterOffer,
    customRentMonthly: scenario.customRentMonthly,
    commuteMinutesPerDay: scenario.commuteMinutesPerDay,
    workDaysPerMonth: scenario.workDaysPerMonth,
    annualBonus: scenario.annualBonus,
    medicalReimbursementRate: scenario.medicalReimbursementRate,
    entertainmentLevel: scenario.entertainmentLevel,
  }), [afterOffer, scenario]);

  const simulatedComparison = useMemo<OfferComparisonResult | null>(() => {
    if (!costCalculator || !cityDataLoader || !beforeMetrics || !simulatedAfterOffer.sourceCity) return null;
    const cityData = cityDataLoader.getCityData(simulatedAfterOffer.sourceCity);
    if (!cityData) return null;
    const annualPackage = costCalculator.calculateAnnualPackage(simulatedAfterOffer);
    const simulatedAfterMetrics = costCalculator.calculateOfferMetrics(
      annualPackage,
      cityData,
      simulatedAfterOffer,
      topPriorityKeys,
    );
    return costCalculator.calculateOfferComparison(beforeMetrics, simulatedAfterMetrics, preferenceOrder);
  }, [beforeMetrics, cityDataLoader, costCalculator, preferenceOrder, simulatedAfterOffer, topPriorityKeys]);

  const handleBeforeChange = (key: keyof Settings, value: unknown) => {
    setBeforeOffer((prev) => ({ ...prev, [key]: value }));
  };

  const handleAfterChange = (key: keyof Settings, value: unknown) => {
    setAfterOffer((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <Shell>
        <Header />
        <main className="relative mx-auto flex min-h-[72vh] w-full max-w-7xl items-center justify-center px-4 pb-14 pt-6 md:px-6">
          <div className="w-full max-w-md rounded-[32px] border border-black/5 bg-white/88 px-8 py-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            <p className="mt-5 text-sm text-slate-600">正在加载城市数据与决策模型…</p>
          </div>
        </main>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <Header />
        <main className="relative mx-auto flex min-h-[72vh] w-full max-w-7xl items-center justify-center px-4 pb-14 pt-6 md:px-6">
          <div className="w-full max-w-md rounded-[32px] border border-red-200 bg-white/92 px-8 py-8 text-center text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            {error}
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <Header />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-14 pt-4 md:px-6 md:pb-20">
        <HomeHero
          topPriorityKeys={topPriorityKeys}
          comparison={comparison}
          beforeCity={beforeOffer.sourceCity}
          afterCity={afterOffer.sourceCity}
        />

        <SmartWidgets
          comparison={comparison}
          topPriorityKeys={topPriorityKeys}
          beforeCity={beforeOffer.sourceCity}
          afterCity={afterOffer.sourceCity}
        />

        <SectionShell id="compare">
          <SectionIntro
            eyebrow="Step 1 · priorities"
            title="先排序，再开始两份 offer 对比"
            description="优先级会决定后续主观体验评分、诊断排序和最终结论落点。"
          />
          <div className="mt-5">
            <PreferenceRanker order={preferenceOrder} onChange={setPreferenceOrder} />
          </div>

          <div className="mt-7 rounded-[30px] border border-black/5 bg-[#FBFAF7]/95 p-4 md:p-5">
            <SectionIntro
              eyebrow="Step 2 · compare"
              title="输入跳槽前后两份 Offer"
              description="客观条件放左/右双栏输入，主观体验评分只围绕你当前最在意的 TOP 3 维度展开。"
            />
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
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
          </div>
        </SectionShell>

        {comparison && beforeMetrics && afterMetrics && (
          <>
            <SectionShell id="diagnosis">
              <SectionIntro
                eyebrow="Step 3 · diagnosis"
                title="沉浸式诊断：先看发生了什么"
                description="这一层只聚焦事实和证据：收入、时间、健康、归因拆解，以及你最在意的维度变化。"
              />

              <div className="mt-6 space-y-6">
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
                <DeltaWaterfall comparison={comparison} />
                <TimeHealthDrilldown
                  beforeLabel={`${beforeOffer.sourceCity || '跳槽前'} Offer`}
                  afterLabel={`${afterOffer.sourceCity || '跳槽后'} Offer`}
                  before={beforeMetrics}
                  after={afterMetrics}
                />
                <PainPointComparisonTable rows={comparison.painPointRows} />
              </div>
            </SectionShell>

            <SectionShell id="decision">
              <SectionIntro
                eyebrow="Step 4 · decision"
                title="从分析进入策略：什么条件下值得跳"
                description="这一层开始做推演：调参数、看阈值、看风险，最后再落到最终结论。"
              />

              <div className="mt-6 space-y-6">
                <ScenarioSimulator scenario={scenario} onChange={setScenario} comparison={simulatedComparison} />
                <ThresholdAnalysis comparison={comparison} />
                <RiskWarnings warnings={comparison.riskWarnings} />
                <FinalDecision comparison={comparison} />
              </div>
            </SectionShell>
          </>
        )}
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F4F1EB] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-0 h-[360px] w-[360px] rounded-full bg-[#E7E0D8] blur-3xl" />
        <div className="absolute right-[-100px] top-28 h-[320px] w-[320px] rounded-full bg-[#E4E0F6] blur-3xl" />
        <div className="absolute left-1/3 top-[38%] h-[300px] w-[300px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute bottom-[-100px] right-1/4 h-[360px] w-[360px] rounded-full bg-[#ECE7DE] blur-3xl" />
      </div>
      {children}
    </div>
  );
}

function SectionShell({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="rounded-[36px] border border-black/5 bg-white/72 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur md:p-7"
    >
      {children}
    </section>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}
