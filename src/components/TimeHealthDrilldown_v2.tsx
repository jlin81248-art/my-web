import React from 'react';
import { OfferMetrics } from '../utils/CostCalculator';

interface TimeHealthDrilldownProps {
  beforeLabel: string;
  afterLabel: string;
  before: OfferMetrics;
  after: OfferMetrics;
}

const TimeHealthDrilldown: React.FC<TimeHealthDrilldownProps> = ({ beforeLabel, afterLabel, before, after }) => {
  const items = [
    {
      label: '每日工时',
      beforeValue: before.workHoursPerDay,
      afterValue: after.workHoursPerDay,
      suffix: ' 小时',
      max: 14,
    },
    {
      label: '总占用时长',
      beforeValue: before.occupiedHoursPerDay,
      afterValue: after.occupiedHoursPerDay,
      suffix: ' 小时',
      max: 16,
    },
    {
      label: '自由时间',
      beforeValue: before.freeHoursPerDay,
      afterValue: after.freeHoursPerDay,
      suffix: ' 小时',
      max: 8,
    },
    {
      label: '健康压力',
      beforeValue: before.healthPressureScore,
      afterValue: after.healthPressureScore,
      suffix: ' / 100',
      max: 100,
    },
  ];

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3-C</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">时间与健康深挖</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          这一层专门看“工作强度会不会把生活体感吃掉”，避免只盯着收入数字。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const beforeWidth = Math.min(100, Math.max(8, item.beforeValue / item.max * 100));
          const afterWidth = Math.min(100, Math.max(8, item.afterValue / item.max * 100));
          return (
            <div key={item.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{beforeLabel}</span>
                    <span>{valueLabel(item.beforeValue, item.suffix)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/30 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500" style={{ width: `${beforeWidth}%` }} />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{afterLabel}</span>
                    <span>{valueLabel(item.afterValue, item.suffix)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-cyan-100 dark:bg-cyan-950/30 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${afterWidth}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

function valueLabel(value: number, suffix: string): string {
  return `${Number(value.toFixed(1))}${suffix}`;
}

export default TimeHealthDrilldown;
