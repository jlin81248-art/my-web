import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

type BreakdownItem = {
  label: string;
  amount: number;
  explanation?: string;
};

interface DeltaWaterfallProps {
  comparison: OfferComparisonResult | null;
}

const DeltaWaterfall: React.FC<DeltaWaterfallProps> = ({ comparison }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(value);

  const extra = (comparison ?? {}) as OfferComparisonResult & {
    breakdown?: BreakdownItem[];
    deltaBreakdown?: BreakdownItem[];
  };

  const breakdown: BreakdownItem[] = Array.isArray(extra.deltaBreakdown)
    ? extra.deltaBreakdown
    : Array.isArray(extra.breakdown)
      ? extra.breakdown
      : [];

  const maxValue = Math.max(...breakdown.map((item) => Math.abs(item.amount)), 1);

  const getBarClass = (amount: number) => {
    if (amount > 0) return 'bg-[#A63A3A]';
    if (amount < 0) return 'bg-[#276749]';
    return 'bg-slate-300';
  };

  const getTextClass = (amount: number) => {
    if (amount > 0) return 'text-red-700';
    if (amount < 0) return 'text-emerald-700';
    return 'text-slate-500';
  };

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 3-C · attribution</div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        变化归因拆解
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        把结果拆开看，帮助你判断到底是薪资、房租、通勤还是家庭支出在主导这次跳槽结果。
      </p>

      {breakdown.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-black/5 bg-[#FAF8F4] px-5 py-5 text-sm leading-7 text-slate-500">
          当前版本还没有接入归因拆解数据，所以这里先显示占位态，不会再报错。后续把
          <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">breakdown</code>
          或
          <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">deltaBreakdown</code>
          结果挂到 comparison 上，这里就会自动渲染。
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {breakdown.map((item) => {
            const width = Math.max((Math.abs(item.amount) / maxValue) * 100, item.amount === 0 ? 12 : 18);

            return (
              <div
                key={item.label}
                className="rounded-[22px] border border-black/5 bg-[#FCFBF8] p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-950">{item.label}</div>
                    <div className="mt-1 text-sm leading-7 text-slate-500">
                      {item.explanation ?? '该因子对最终结果的影响。'}
                    </div>
                  </div>

                  <div className={`shrink-0 text-right text-base font-semibold ${getTextClass(item.amount)}`}>
                    {item.amount === 0 ? '无变化' : `${item.amount > 0 ? '+' : ''}${formatCurrency(item.amount)}`}
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E8E2D9]">
                  <div className={`h-full rounded-full ${getBarClass(item.amount)}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DeltaWaterfall;
