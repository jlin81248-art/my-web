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

const beforeBarClass = 'from-fuchsia-500 to-pink-500';
const afterBarClass = 'from-cyan-500 to-blue-500';

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

  const ringItems = [
    {
      label: '月工作天数',
      beforeValue: comparison.before.workingDaysPerMonth,
      afterValue: comparison.after.workingDaysPerMonth,
      max: 31,
      formatter: (value: number) => `${value} 天`,
      reverse: true,
    },
    {
      label: '通勤时长',
      beforeValue: comparison.before.commuteMinutesPerDay,
      afterValue: comparison.after.commuteMinutesPerDay,
      max: 180,
      formatter: (value: number) => `${value} 分钟`,
      reverse: true,
    },
    {
      label: '自由时间',
      beforeValue: comparison.before.freeHoursPerDay,
      afterValue: comparison.after.freeHoursPerDay,
      max: 8,
      formatter: (value: number) => `${value} 小时`,
      reverse: false,
    },
    {
      label: '健康压力',
      beforeValue: comparison.before.healthPressureScore,
      afterValue: comparison.after.healthPressureScore,
      max: 100,
      formatter: (value: number) => `${value} / 100`,
      reverse: true,
    },
  ];

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3</div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">先看诊断：到底发生了什么变化</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-3xl">
            这里不直接下结论，只把钱、时间、健康，以及你最看重的 TOP 3 维度先拆给你看。
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">图形化对比：核心指标</div>
          <div className="mt-4 space-y-4">
            {metricBars.map((item) => {
              const beforeWidth = Math.max(10, Math.abs(item.beforeValue) / maxBarValue * 100);
              const afterWidth = Math.max(10, Math.abs(item.afterValue) / maxBarValue * 100);

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
                      <div className="h-3 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/30 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${beforeBarClass}`} style={{ width: `${beforeWidth}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{afterLabel}</span>
                        <span>{item.formatter(item.afterValue)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-cyan-100 dark:bg-cyan-950/30 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${afterBarClass}`} style={{ width: `${afterWidth}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">图形化对比：时间与体感</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ringItems.map((item) => {
              const beforePct = Math.min(100, Math.max(0, item.beforeValue / item.max * 100));
              const afterPct = Math.min(100, Math.max(0, item.afterValue / item.max * 100));
              const beforeDash = `${beforePct} ${100 - beforePct}`;
              const afterDash = `${afterPct} ${100 - afterPct}`;

              return (
                <div key={item.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center">
                      <svg width="92" height="92" viewBox="0 0 36 36" className="-rotate-90">
                        <path d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31" fill="none" stroke="currentColor" strokeWidth="3.2" className="text-fuchsia-100 dark:text-fuchsia-950/30" />
                        <path
                          d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                          fill="none"
                          stroke="url(#beforeGrad)"
                          strokeWidth="3.2"
                          strokeDasharray={beforeDash}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="beforeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{beforeLabel}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.formatter(item.beforeValue)}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <svg width="92" height="92" viewBox="0 0 36 36" className="-rotate-90">
                        <path d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31" fill="none" stroke="currentColor" strokeWidth="3.2" className="text-cyan-100 dark:text-cyan-950/30" />
                        <path
                          d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                          fill="none"
                          stroke="url(#afterGrad)"
                          strokeWidth="3.2"
                          strokeDasharray={afterDash}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="afterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{afterLabel}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.formatter(item.afterValue)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white p-4">
            <div className="text-sm font-semibold">这一层只做诊断</div>
            <div className="mt-2 text-sm text-blue-100">
              你会先看到“哪些指标变了、变化来自哪里”；真正的建议、风险和成立条件会放在 Step 4 单独判断。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferInsights;
