import React from 'react';
import { MonthlyIncome, MonthlyCosts } from '../utils/CostCalculator';

interface IncomeExpenseDetailsProps {
  cityName: string;
  income: MonthlyIncome;
  costs: MonthlyCosts;
  hideTitle?: boolean;
}

const IncomeExpenseDetails: React.FC<IncomeExpenseDetailsProps> = ({ cityName, income, costs, hideTitle = false }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  const monthlySavings = income.税后工资 - costs.总支出;
  const savingsRate = income.税后工资 > 0 ? (monthlySavings / income.税后工资) * 100 : 0;

  const incomeRows = [
    ['平均税前月收入', income.税前工资],
    ['社保公积金', -income.社保公积金],
    ['个人所得税', -income.个人所得税],
    ['平均税后月收入', income.税后工资],
  ];

  const expenseRows = [
    ['住房', -costs.住房],
    ['餐饮', -costs.餐饮],
    ['交通', -costs.交通],
    ['子女教育', -costs.教育],
    ['老人赡养', -costs.赡养],
    ['家庭医疗净支出', -costs.医疗],
    ['日常开销', -costs.日常开销],
    ['月总支出', -costs.总支出],
  ];

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-5">
      {!hideTitle && (
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4</div>
          <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{cityName} 月度收支拆解</h2>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">收入结构</h3>
          <div className="mt-4 space-y-3">
            {incomeRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
                <span className={`font-semibold ${Number(value) < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {Number(value) < 0 ? '-' : ''}{formatCurrency(Math.abs(Number(value)))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">支出结构</h3>
          <div className="mt-4 space-y-3">
            {expenseRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(Math.abs(Number(value)))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">平均税后月收入</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(income.税后工资)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">月总支出</div>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(costs.总支出)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">月结余</div>
          <div className={`mt-1 text-2xl font-bold ${monthlySavings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(monthlySavings)}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">结余率 {savingsRate.toFixed(1)}%</div>
        </div>
      </div>
    </section>
  );
};

export default IncomeExpenseDetails;
