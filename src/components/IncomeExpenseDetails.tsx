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

  const renderValue = (value: number) => (
    <span className={value < 0 ? 'font-semibold text-red-600' : 'font-semibold text-slate-950'}>
      {value < 0 ? '-' : ''}{formatCurrency(Math.abs(value))}
    </span>
  );

  const renderDelta = (value: number) => {
    const cls = value > 0
      ? 'text-red-600'
      : value < 0
        ? 'text-emerald-600'
        : 'text-amber-600';

    return (
      <span className={`font-semibold ${cls}`}>
        {value > 0 ? '+' : ''}{formatCurrency(value)}
      </span>
    );
  };

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Step 3-B</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">跳槽前后月度收支对比</h2>
        <p className="mt-1 text-sm text-slate-500">
          这一步只看账本，把收入、支出和结余先摆清楚；变化列按股票常见逻辑显示：正值红色，负值绿色。
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[24px] border border-black/5 bg-[#FCFBF8]">
        <table className="w-full min-w-[820px] divide-y divide-black/5 text-sm">
          <thead className="bg-[#F4F1EB]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">指标</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">{beforeLabel}</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">{afterLabel}</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">变化</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white">
            {rowLabels.map((label) => {
              const beforeValue = Number(beforeMap.get(label) || 0);
              const afterValue = Number(afterMap.get(label) || 0);
              const delta = afterValue - beforeValue;
              return (
                <tr key={label} className="hover:bg-[#FAF8F4]">
                  <td className="px-4 py-3 text-slate-700">{label}</td>
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
