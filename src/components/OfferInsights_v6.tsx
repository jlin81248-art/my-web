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

interface RingComparisonCardProps {
  title: string;
  beforeLabel: string;
  afterLabel: string;
  beforeValue: number;
  afterValue: number;
  maxValue: number;
  suffix: string;
  note?: string;
}

const RingComparisonCard: React.FC<RingComparisonCardProps> = ({
  title,
  beforeLabel,
  afterLabel,
  beforeValue,
  afterValue,
  maxValue,
  suffix,
  note,
}) => {
  const beforePercent = Math.max(6, Math.min(100, (beforeValue / maxValue) * 100));
  const afterPercent = Math.max(6, Math.min(100, (afterValue / maxValue) * 100));

  const buildRingStyle = (percent: number, colorA: string, colorB: string) => ({
    background: `conic-gradient(${colorA} 0%, ${colorB} ${percent}%, rgba(255,255,255,0.12) ${percent}%, rgba(255,255,255,0.12) 100%)`,
  });

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-4 text-white">
      <div className="text-sm font-semibold text-white">{title}</div>
      {note && <div className="mt-1 text-xs text-slate-300">{note}</div>}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div
            className="relative h-24 w-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.18)]"
            style={buildRingStyle(beforePercent, '#f97316', '#ec4899')}
          >
            <div className="h-16 w-16 rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
              <div className="text-[11px] text-slate-400">{beforeLabel}</div>
              <div className="text-base font-black">{beforeValue}{suffix}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="relative h-24 w-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.22)]"
            style={buildRingStyle(afterPercent, '#06b6d4', '#3b82f6')}
          >
            <div className="h-16 w-16 rounded-full bg-slate-950 flex flex-col items-center justify-center text-center">
              <div className="text-[11px] text-slate-400">{afterLabel}</div>
              <div className="text-base font-black">{afterValue}{suffix}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

  const getDeltaClass = (value: number) => {
    if (value === 0) return 'text-white';
    return value > 0 ? 'text-cyan-300' : 'text-rose-300';
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
            下面这部分只负责把关键变化摊开看：钱、时间、健康，以及你最看重的 TOP 3 主观体验分。
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
        <div className="rounded-xl border border-fuchsia-200 dark:border-fuchsia-900/50 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-4 text-white">
          <div className="text-sm text-white/85">税后月收入变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.monthlyNetIncome)}`}>
            {comparison.delta.monthlyNetIncome > 0 ? '+' : ''}{formatCurrency(comparison.delta.monthlyNetIncome)}
          </div>
          <div className="mt-2 text-xs text-white/80">
            {beforeLabel} → {afterLabel}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-200 dark:border-cyan-900/50 bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 p-4 text-white">
          <div className="text-sm text-white/85">月可支配收入变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.monthlyDisposable)}`}>
            {comparison.delta.monthlyDisposable > 0 ? '+' : ''}{formatCurrency(comparison.delta.monthlyDisposable)}
          </div>
          <div className="mt-2 text-xs text-white/80">
            年化变化 {comparison.delta.annualDisposable > 0 ? '+' : ''}{formatCurrency(comparison.delta.annualDisposable)}
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-4 text-white">
          <div className="text-sm text-white/85">在岗时薪变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.workOnlyHourlyPay)}`}>
            {comparison.delta.workOnlyHourlyPay > 0 ? '+' : ''}{formatCurrency(comparison.delta.workOnlyHourlyPay)}/h
          </div>
          <div className="mt-2 text-xs text-white/80">
            只把真实工作时长分摊进去
          </div>
        </div>

        <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4 text-white">
          <div className="text-sm text-white/85">含通勤真实时薪变化</div>
          <div className={`mt-2 text-2xl font-bold ${getDeltaClass(comparison.delta.realHourlyPay)}`}>
            {comparison.delta.realHourlyPay > 0 ? '+' : ''}{formatCurrency(comparison.delta.realHourlyPay)}/h
          </div>
          <div className="mt-2 text-xs text-white/80">
            把通勤一起分摊进去，更接近日常体感
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">图形化对比：核心指标</div>
          <div className="mt-4 space-y-4">
            {metricBars.map((item, index) => {
              const beforeWidth = Math.max(8, Math.abs(item.beforeValue) / maxBarValue * 100);
              const afterWidth = Math.max(8, Math.abs(item.afterValue) / maxBarValue * 100);
              const beforeBarClass = [
                'bg-gradient-to-r from-fuchsia-500 to-rose-500',
                'bg-gradient-to-r from-orange-500 to-pink-500',
                'bg-gradient-to-r from-amber-400 to-orange-500',
                'bg-gradient-to-r from-violet-500 to-fuchsia-500',
              ][index];
              const afterBarClass = [
                'bg-gradient-to-r from-cyan-500 to-blue-500',
                'bg-gradient-to-r from-sky-500 to-blue-600',
                'bg-gradient-to-r from-emerald-400 to-cyan-500',
                'bg-gradient-to-r from-indigo-500 to-cyan-500',
              ][index];

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
                      <div className="h-3 rounded-full bg-pink-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${beforeBarClass}`} style={{ width: `${beforeWidth}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{afterLabel}</span>
                        <span>{item.formatter(item.afterValue)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-cyan-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${afterBarClass}`} style={{ width: `${afterWidth}%` }} />
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
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RingComparisonCard
              title="月工作天数"
              beforeLabel="前"
              afterLabel="后"
              beforeValue={comparison.before.workingDaysPerMonth}
              afterValue={comparison.after.workingDaysPerMonth}
              maxValue={31}
              suffix="天"
              note="越多通常意味着月度恢复时间越少"
            />
            <RingComparisonCard
              title="通勤时长"
              beforeLabel="前"
              afterLabel="后"
              beforeValue={comparison.before.commuteMinutesPerDay}
              afterValue={comparison.after.commuteMinutesPerDay}
              maxValue={180}
              suffix="分"
              note="按往返总时长展示"
            />
            <RingComparisonCard
              title="自由时间"
              beforeLabel="前"
              afterLabel="后"
              beforeValue={comparison.before.freeHoursPerDay}
              afterValue={comparison.after.freeHoursPerDay}
              maxValue={8}
              suffix="h"
              note="越高越说明下班后还有生活空间"
            />
            <RingComparisonCard
              title="健康压力"
              beforeLabel="前"
              afterLabel="后"
              beforeValue={comparison.before.healthPressureScore}
              afterValue={comparison.after.healthPressureScore}
              maxValue={100}
              suffix=""
              note="越低越好，用环形图看压力量级更直观"
            />
          </div>

          <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 text-white p-4">
            <div className="text-sm font-semibold">分析提示</div>
            <div className="mt-2 text-sm text-white/90">
              核心指标保留横向条形对比，时间与体感改成环形对比，更容易一眼区分“钱”的变化和“日常体感”的变化。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferInsights;
