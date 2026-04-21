
import React from 'react';
import { MonthlyCosts, MonthlyIncome } from '../utils/CostCalculator';

interface IncomeExpenseDetailsProps {
  beforeLabel: string;
  afterLabel: string;
  beforeIncome: MonthlyIncome;
  beforeCosts: MonthlyCosts;
  afterIncome: MonthlyIncome;
  afterCosts: MonthlyCosts;
}

const IncomeExpenseDetails: React.FC<IncomeExpenseDetailsProps> = ({
  beforeLabel,
  afterLabel,
  beforeIncome,
  beforeCosts,
  afterIncome,
  afterCosts,
}) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const buildRows = (income: MonthlyIncome, costs: MonthlyCosts) => {
    const monthlySavings = income.税后工资 - costs.总支出;
    return [
      ['平均税前月收入', income.税前工资],
      ['社保公积金', -income.社保公积金],
      ['个人所得税', -income.个人所得税],
      ['平均税后月收入', income.税后工资],
      ['住房', -costs.住房],
      ['餐饮', -costs.餐饮],
      ['交通', -costs.交通],
      ['娱乐', -costs.娱乐],
      ['水电通信', -costs.水电通信],
      ['子女教育', -costs.教育],
      ['老人赡养', -costs.赡养],
      ['医疗净支出', -costs.医疗],
      ['月总支出', -costs.总支出],
      ['月结余', monthlySavings],
    ] as const;
  };

  const beforeRows = buildRows(beforeIncome, beforeCosts);
  const afterRows = buildRows(afterIncome, afterCosts);
  const beforeMap = new Map(beforeRows.map(([label, value]) => [label, value]));
  const afterMap = new Map(afterRows.map(([label, value]) => [label, value]));
  const rowLabels = beforeRows.map(([label]) => label);

  const summaryCards = [
    {
      label: '平均税后月收入',
      before: beforeIncome.税后工资,
      after: afterIncome.税后工资,
    },
    {
      label: '月总支出',
      before: beforeCosts.总支出,
      after: afterCosts.总支出,
    },
    {
      label: '月结余',
      before: beforeIncome.税后工资 - beforeCosts.总支出,
      after: afterIncome.税后工资 - afterCosts.总支出,
    },
  ];

  const renderValue = (value: number) => (
    <span className={value < 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-900 dark:text-gray-100 font-semibold'}>
      {value < 0 ? '-' : ''}{formatCurrency(Math.abs(value))}
    </span>
  );

  const renderDelta = (value: number) => (
    <span className={value > 0 ? 'text-green-600 dark:text-green-400 font-semibold' : value < 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-900 dark:text-gray-100 font-semibold'}>
      {value > 0 ? '+' : ''}{formatCurrency(value)}
    </span>
  );

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-5">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">跳槽前后月度收支对比</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          这一步专门看客观账本：赚了多少、花了多少、最后还能剩多少。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {summaryCards.map((card) => {
          const delta = card.after - card.before;
          return (
            <div key={card.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">{card.label}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{beforeLabel}</div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(card.before)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{afterLabel}</div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(card.after)}</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">变化：</span>
                {renderDelta(delta)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">指标</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{beforeLabel}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">{afterLabel}</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">变化</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rowLabels.map((label) => {
              const beforeValue = Number(beforeMap.get(label) || 0);
              const afterValue = Number(afterMap.get(label) || 0);
              const delta = afterValue - beforeValue;
              return (
                <tr key={label}>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{label}</td>
                  <td className="px-4 py-3">{renderValue(beforeValue)}</td>
                  <td className="px-4 py-3">{renderValue(afterValue)}</td>
                  <td className="px-4 py-3">{renderDelta(delta)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default IncomeExpenseDetails;
