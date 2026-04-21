
import React from 'react';
import { OfferComparisonResult, PreferenceKey } from '../utils/CostCalculator';

interface OfferInsightsProps {
  beforeLabel: string;
  afterLabel: string;
  comparison: OfferComparisonResult;
  topPriorityKeys: PreferenceKey[];
}

const priorityLabels: Record<PreferenceKey, string> = {
  salary: '薪资与存钱',
  health: '身心健康与工作强度',
  entertainment: '娱乐与生活丰富度',
  housing: '居住条件',
  time: '通勤与自由时间',
  family: '家庭负担',
  climate: '气候与城市环境',
  growth: '职业成长',
};

const OfferInsights: React.FC<OfferInsightsProps> = ({
  beforeLabel,
  afterLabel,
  comparison,
  topPriorityKeys,
}) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const getDeltaClass = (value: number, reverse = false) => {
    if (value === 0) return 'text-gray-900 dark:text-gray-100';
    const positive = reverse ? value < 0 : value > 0;
    return positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const metricBars = [
    {
      label: '月可支配收入',
      beforeValue: comparison.before.monthlyDisposable,
      afterValue: comparison.after.monthlyDisposable,
      formatter: (value: number) => formatCurrency(value),
    },
    {
      label: '在岗时薪',
      beforeValue: comparison.before.workOnlyHourlyPay,
      afterValue: comparison.after.workOnlyHourlyPay,
      formatter: (value: number) => `${formatCurrency(value)}/h`,
    },
    {
      label: '含通勤真实时薪',
      beforeValue: comparison.before.realHourlyPay,
      afterValue: comparison.after.realHourlyPay,
      formatter: (value: number) => `${formatCurrency(value)}/h`,
    },
    {
      label: 'TOP3 主观体验分',
      beforeValue: comparison.topPrioritySubjectiveBefore,
      afterValue: comparison.topPrioritySubjectiveAfter,
      formatter: (value: number) => `${value.toFixed(1)} / 5`,
    },
  ];

  const maxBarValue = Math.max(
    ...metricBars.flatMap((item) => [Math.abs(item.beforeValue), Math.abs(item.afterValue)]),
    1,
  );

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">先看分析，不急着下结论</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-3xl">
            下面这部分只负责把关键变化摊开看：钱、时间、健康、以及你最看重的 TOP 3 主观体验分。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {topPriorityKeys.map((key, index) => (
            <span
              key={key}
              className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 font-semibold text-blue-700 dark:text-blue-300"
            >
              TOP {index + 1}：{priorityLabels[key]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">税后月收入变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.monthlyNetIncome)}`}>
            {comparison.delta.monthlyNetIncome > 0 ? '+' : ''}{formatCurrency(comparison.delta.monthlyNetIncome)}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {beforeLabel} → {afterLabel}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">月可支配收入变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.monthlyDisposable)}`}>
            {comparison.delta.monthlyDisposable > 0 ? '+' : ''}{formatCurrency(comparison.delta.monthlyDisposable)}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            年化变化 {comparison.delta.annualDisposable > 0 ? '+' : ''}{formatCurrency(comparison.delta.annualDisposable)}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">在岗时薪变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.workOnlyHourlyPay)}`}>
            {comparison.delta.workOnlyHourlyPay > 0 ? '+' : ''}{formatCurrency(comparison.delta.workOnlyHourlyPay)}/h
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            只把真实工作时长分摊进去
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">含通勤真实时薪变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.realHourlyPay)}`}>
            {comparison.delta.realHourlyPay > 0 ? '+' : ''}{formatCurrency(comparison.delta.realHourlyPay)}/h
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            把通勤一起分摊进去，更接近日常体感
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">图形化对比：核心指标</div>
          <div className="mt-4 space-y-4">
            {metricBars.map((item) => {
              const beforeWidth = Math.max(8, Math.abs(item.beforeValue) / maxBarValue * 100);
              const afterWidth = Math.max(8, Math.abs(item.afterValue) / maxBarValue * 100);

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.formatter(item.beforeValue)} → {item.formatter(item.afterValue)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{beforeLabel}</span>
                        <span>{item.formatter(item.beforeValue)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full bg-slate-400" style={{ width: `${beforeWidth}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{afterLabel}</span>
                        <span>{item.formatter(item.afterValue)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-blue-100 dark:bg-blue-950/40 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${afterWidth}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">图形化对比：时间与健康体感</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: '月工作天数',
                before: `${comparison.before.workingDaysPerMonth} 天`,
                after: `${comparison.after.workingDaysPerMonth} 天`,
                beforePct: (comparison.before.workingDaysPerMonth / 31) * 100,
                afterPct: (comparison.after.workingDaysPerMonth / 31) * 100,
              },
              {
                label: '通勤时长',
                before: `${comparison.before.commuteMinutesPerDay} 分钟`,
                after: `${comparison.after.commuteMinutesPerDay} 分钟`,
                beforePct: Math.min(100, comparison.before.commuteMinutesPerDay / 180 * 100),
                afterPct: Math.min(100, comparison.after.commuteMinutesPerDay / 180 * 100),
              },
              {
                label: '自由时间',
                before: `${comparison.before.freeHoursPerDay} 小时`,
                after: `${comparison.after.freeHoursPerDay} 小时`,
                beforePct: Math.min(100, comparison.before.freeHoursPerDay / 8 * 100),
                afterPct: Math.min(100, comparison.after.freeHoursPerDay / 8 * 100),
              },
              {
                label: '健康压力',
                before: `${comparison.before.healthPressureScore} / 100`,
                after: `${comparison.after.healthPressureScore} / 100`,
                beforePct: comparison.before.healthPressureScore,
                afterPct: comparison.after.healthPressureScore,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{beforeLabel}</span>
                      <span>{item.before}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full bg-slate-400" style={{ width: `${item.beforePct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{afterLabel}</span>
                      <span>{item.after}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-blue-100 dark:bg-blue-950/40 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.afterPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4">
            <div className="text-sm font-semibold">分析提示</div>
            <div className="mt-2 text-sm text-blue-100">
              这一步只做拆解，不给最终判决。真正的结论会在页面最后单独放大展示，避免把“分析过程”和“最终建议”混在一起。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferInsights;
