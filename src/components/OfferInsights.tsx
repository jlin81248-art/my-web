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
      label: '家庭负担率',
      beforeValue: comparison.before.familyBurdenRate,
      afterValue: comparison.after.familyBurdenRate,
      formatter: (value: number) => `${value.toFixed(1)}%`,
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
    },
    {
      label: '通勤时长',
      beforeValue: comparison.before.commuteMinutesPerDay,
      afterValue: comparison.after.commuteMinutesPerDay,
      max: 180,
      formatter: (value: number) => `${value} 分钟`,
    },
    {
      label: '自由时间',
      beforeValue: comparison.before.freeHoursPerDay,
      afterValue: comparison.after.freeHoursPerDay,
      max: 8,
      formatter: (value: number) => `${value} 小时`,
    },
    {
      label: '健康压力',
      beforeValue: comparison.before.healthPressureScore,
      afterValue: comparison.after.healthPressureScore,
      max: 100,
      formatter: (value: number) => `${value} / 100`,
    },
  ];

  const deltaText = (beforeValue: number, afterValue: number, formatter: (value: number) => string) => {
    if (beforeValue === afterValue) return '无变化';
    return `${formatter(beforeValue)} → ${formatter(afterValue)}`;
  };

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Step 3</div>
          <h2 className="mt-1 text-xl font-semibold text-slate-950 md:text-2xl">先看诊断：到底发生了什么变化</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            这里先不做最终判断，只把钱、时间、健康，以及你最看重的 TOP 3 维度客观拆开。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {topPriorityKeys.map((key, index) => (
            <span
              key={key}
              className="rounded-full border border-black/5 bg-[#FAF8F4] px-3 py-1 font-medium text-slate-700"
            >
              TOP {index + 1}：{priorityLabels[key]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4">
          <div className="text-base font-semibold text-slate-950">图形化对比：核心指标</div>
          <div className="mt-4 space-y-4">
            {metricBars.map((item) => {
              const beforeWidth = Math.max(10, Math.abs(item.beforeValue) / maxBarValue * 100);
              const afterWidth = Math.max(10, Math.abs(item.afterValue) / maxBarValue * 100);
              const isEqual = item.beforeValue === item.afterValue;

              return (
                <div key={item.label} className="rounded-[20px] border border-black/5 bg-white p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-800">{item.label}</span>
                    <span className={`font-medium ${isEqual ? 'text-amber-600' : 'text-slate-500'}`}>
                      {deltaText(item.beforeValue, item.afterValue, item.formatter)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    <MetricBar
                      label={beforeLabel}
                      value={item.formatter(item.beforeValue)}
                      width={beforeWidth}
                      trackClassName="bg-[#EFE9FF]"
                      barClassName="bg-[#6D5EF7]"
                    />
                    <MetricBar
                      label={afterLabel}
                      value={item.formatter(item.afterValue)}
                      width={afterWidth}
                      trackClassName={isEqual ? 'bg-[#F6E7C8]' : 'bg-[#E7ECEF]'}
                      barClassName={isEqual ? 'bg-[#B7791F]' : 'bg-[#111111]'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4">
          <div className="text-base font-semibold text-slate-950">图形化对比：时间与体感</div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ringItems.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-black/5 bg-white p-4">
                <div className="text-sm font-medium text-slate-800">{item.label}</div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <RadialMeter
                    label={beforeLabel}
                    value={item.beforeValue}
                    max={item.max}
                    display={item.formatter(item.beforeValue)}
                    color="#6D5EF7"
                  />
                  <RadialMeter
                    label={afterLabel}
                    value={item.afterValue}
                    max={item.max}
                    display={item.formatter(item.afterValue)}
                    color="#111111"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function MetricBar({
  label,
  value,
  width,
  trackClassName,
  barClassName,
}: {
  label: string;
  value: string;
  width: number;
  trackClassName: string;
  barClassName: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className={`h-3 overflow-hidden rounded-full ${trackClassName}`}>
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function RadialMeter({
  label,
  value,
  max,
  display,
  color,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  color: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex flex-col items-center rounded-2xl border border-black/5 bg-[#FAF8F4] px-3 py-4">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg, #E7E2DA 0deg)`,
        }}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-900">
          {Math.round(pct)}%
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-950">{display}</div>
    </div>
  );
}

export default OfferInsights;
