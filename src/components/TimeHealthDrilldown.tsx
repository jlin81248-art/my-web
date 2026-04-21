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
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Step 3-C</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">时间与健康深挖</h2>
        <p className="mt-1 text-sm text-slate-500">
          这一层专门看“工作强度会不会把生活体感吃掉”，避免只盯着收入数字。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const beforeWidth = Math.min(100, Math.max(8, item.beforeValue / item.max * 100));
          const afterWidth = Math.min(100, Math.max(8, item.afterValue / item.max * 100));
          return (
            <div key={item.label} className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4">
              <div className="text-sm font-semibold text-slate-950">{item.label}</div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{beforeLabel}</span>
                    <span>{valueLabel(item.beforeValue, item.suffix)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#EFE9FF]">
                    <div className="h-full rounded-full bg-[#6D5EF7]" style={{ width: `${beforeWidth}%` }} />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{afterLabel}</span>
                    <span>{valueLabel(item.afterValue, item.suffix)}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#E7ECEF]">
                    <div className="h-full rounded-full bg-[#111111]" style={{ width: `${afterWidth}%` }} />
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
