import React from 'react';
import { OfferMetrics } from '../utils/CostCalculator';

interface OfferInsightsProps {
  cityName: string;
  metrics: OfferMetrics;
}

const OfferInsights: React.FC<OfferInsightsProps> = ({ cityName, metrics }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const kpiCards = [
    {
      label: '平均税后月收入',
      value: formatCurrency(metrics.monthlyIncome.税后工资),
      hint: '固定年薪 + 年终奖平均到每个月后计算',
    },
    {
      label: '月可支配收入',
      value: formatCurrency(metrics.monthlyDisposable),
      hint: '税后收入 - 住房/餐饮/交通/教育/赡养/医疗等总支出',
    },
    {
      label: '真实时薪',
      value: `${formatCurrency(metrics.realHourlyPay)}/小时`,
      hint: `按月占用时长计算：${metrics.workingDaysPerMonth} 天/月 × ${metrics.occupiedHoursPerDay} 小时/天`,
    },
    {
      label: '购买力分数',
      value: `${metrics.purchasingPowerScore} / 100`,
      hint: metrics.decisionLabel,
    },
  ];

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{cityName} Offer 的真实购买力</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">{metrics.decisionSummary}</p>
        </div>
        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {metrics.decisionLabel}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {kpiCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{card.hint}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 md:p-5">
        <div className="text-sm font-semibold">系统判断</div>
        <div className="mt-2 text-lg font-bold">这份 offer 在 {cityName} 属于「{metrics.decisionLabel}」区间</div>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-blue-100">
          <span className="rounded-full bg-white/10 px-3 py-1">住房负担率 {metrics.housingBurdenRate}%</span>
          <span className="rounded-full bg-white/10 px-3 py-1">结余率 {metrics.savingsRate}%</span>
          <span className="rounded-full bg-white/10 px-3 py-1">在岗 {metrics.workHoursPerDay} 小时/天</span>
          <span className="rounded-full bg-white/10 px-3 py-1">通勤后总占用 {metrics.occupiedHoursPerDay} 小时/天</span>
        </div>
      </div>
    </section>
  );
};

export default OfferInsights;
