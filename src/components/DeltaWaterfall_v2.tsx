import React from 'react';
import { DeltaBreakdownItem } from '../utils/CostCalculator';

interface DeltaWaterfallProps {
  breakdown: DeltaBreakdownItem[];
}

const DeltaWaterfall: React.FC<DeltaWaterfallProps> = ({ breakdown }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const maxValue = Math.max(...breakdown.map((item) => Math.abs(item.amount)), 1);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3-A</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">变化归因：为什么最后结果会变成这样</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          不是只看“涨了还是跌了”，而是拆开看哪些因素真正推动了结果；无变化项会以中性样式展示，不再误导成上涨。
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {breakdown.map((item) => {
          const width = Math.max(10, Math.abs(item.amount) / maxValue * 100);
          const isPositive = item.amount > 0;
          const isNegative = item.amount < 0;
          const isNeutral = item.amount === 0;

          return (
            <div key={item.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
                <span className={isPositive
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : isNegative
                    ? 'text-green-600 dark:text-green-400 font-semibold'
                    : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                  {isNeutral ? '无变化' : `${isPositive ? '+' : ''}${formatCurrency(item.amount)}`}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="w-24 text-xs text-gray-400 dark:text-gray-500">
                  {isPositive ? '正向贡献' : isNegative ? '负向拖累' : '基本持平'}
                </div>
                <div className="flex-1 h-4 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isPositive
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                      : isNegative
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-500'}`}
                    style={{ width: `${isNeutral ? 18 : width}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DeltaWaterfall;
