import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

interface OfferInsightsProps {
  beforeLabel: string;
  afterLabel: string;
  comparison: OfferComparisonResult;
}

const OfferInsights: React.FC<OfferInsightsProps> = ({ beforeLabel, afterLabel, comparison }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const deltaColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-900 dark:text-gray-100';
  };

  const deltaPrefix = (value: number) => (value > 0 ? '+' : '');

  const cards = [
    {
      label: '税后月收入变化',
      value: `${deltaPrefix(comparison.delta.monthlyNetIncome)}${formatCurrency(comparison.delta.monthlyNetIncome)}`,
      hint: `${beforeLabel} ${formatCurrency(comparison.before.monthlyIncome.税后工资)} → ${afterLabel} ${formatCurrency(comparison.after.monthlyIncome.税后工资)}`,
      numeric: comparison.delta.monthlyNetIncome,
    },
    {
      label: '月可支配收入变化',
      value: `${deltaPrefix(comparison.delta.monthlyDisposable)}${formatCurrency(comparison.delta.monthlyDisposable)}`,
      hint: `${beforeLabel} ${formatCurrency(comparison.before.monthlyDisposable)} → ${afterLabel} ${formatCurrency(comparison.after.monthlyDisposable)}`,
      numeric: comparison.delta.monthlyDisposable,
    },
    {
      label: '在岗时薪变化',
      value: `${deltaPrefix(comparison.delta.workOnlyHourlyPay)}${formatCurrency(comparison.delta.workOnlyHourlyPay)}/小时`,
      hint: `${beforeLabel} ${formatCurrency(comparison.before.workOnlyHourlyPay)}/h → ${afterLabel} ${formatCurrency(comparison.after.workOnlyHourlyPay)}/h`,
      numeric: comparison.delta.workOnlyHourlyPay,
    },
    {
      label: '含通勤真实时薪变化',
      value: `${deltaPrefix(comparison.delta.realHourlyPay)}${formatCurrency(comparison.delta.realHourlyPay)}/小时`,
      hint: `${beforeLabel} ${formatCurrency(comparison.before.realHourlyPay)}/h → ${afterLabel} ${formatCurrency(comparison.after.realHourlyPay)}/h`,
      numeric: comparison.delta.realHourlyPay,
    },
  ];

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{comparison.summaryTitle}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-3xl">{comparison.summaryText}</p>
        </div>
        <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {comparison.decisionLabel}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
            <div className={`mt-2 text-2xl font-bold ${deltaColor(card.numeric)}`}>{card.value}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{card.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4 md:p-5">
          <div className="text-sm font-semibold">对你最重要的 3 个点</div>
          <div className="mt-3 space-y-2">
            {comparison.topPriorityFindings.slice(0, 3).map((item, index) => (
              <div key={`${item.key}-${index}`} className="rounded-lg bg-white/10 px-3 py-2">
                <div className="font-semibold">{item.label}</div>
                <div className="mt-1 text-sm text-blue-100">{item.explanation}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-slate-50 dark:bg-slate-900 p-4 md:p-5">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">系统判断</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              月工作天数 {comparison.before.workingDaysPerMonth} → {comparison.after.workingDaysPerMonth}
            </span>
            <span className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              通勤 {comparison.before.commuteMinutesPerDay} 分钟 → {comparison.after.commuteMinutesPerDay} 分钟
            </span>
            <span className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              在岗时薪 {comparison.before.workOnlyHourlyPay} → {comparison.after.workOnlyHourlyPay}
            </span>
            <span className="rounded-full bg-white dark:bg-gray-800 px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
              含通勤真实时薪 {comparison.before.realHourlyPay} → {comparison.after.realHourlyPay}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferInsights;
