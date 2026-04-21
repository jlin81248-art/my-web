import React, { useMemo, useState } from 'react';
import { OfferMetrics } from '../utils/CostCalculator';
import IncomeExpenseDetails from './IncomeExpenseDetails';

export interface CityOfferResult {
  cityName: string;
  metrics: OfferMetrics;
  isCurrentCity?: boolean;
}

interface CityComparisonProps {
  currentCity: string;
  results: CityOfferResult[];
}

type SortField = 'score' | 'disposable' | 'hourly';

const CityComparison: React.FC<CityComparisonProps> = ({ currentCity, results }) => {
  const [sortBy, setSortBy] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const sortedResults = useMemo(() => {
    const copied = [...results];
    copied.sort((a, b) => {
      const valueA = sortBy === 'score'
        ? a.metrics.purchasingPowerScore
        : sortBy === 'disposable'
          ? a.metrics.monthlyDisposable
          : a.metrics.realHourlyPay;
      const valueB = sortBy === 'score'
        ? b.metrics.purchasingPowerScore
        : sortBy === 'disposable'
          ? b.metrics.monthlyDisposable
          : b.metrics.realHourlyPay;

      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    return copied;
  }, [results, sortBy, sortDirection]);

  const bestCity = useMemo(() => sortedResults[0], [sortedResults]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(field);
    setSortDirection('desc');
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">
            Step 3
          </div>
          <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">同样的 offer，在哪个城市更值钱？</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            保持同样的年包和生活偏好不变，对比不同城市下的真实购买力。
          </p>
        </div>

        {bestCity && (
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/30 px-4 py-3 text-sm text-blue-800 dark:text-blue-200">
            当前排序下，<span className="font-semibold">{bestCity.cityName}</span> 表现最好。
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm md:text-base">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">城市</th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('score')}
              >
                购买力分数 {sortBy === 'score' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('disposable')}
              >
                月可支配收入 {sortBy === 'disposable' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('hourly')}
              >
                真实时薪 {sortBy === 'hourly' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">判断</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedResults.map((result) => {
              const isExpanded = expandedCity === result.cityName;
              const isCurrent = result.cityName === currentCity || result.isCurrentCity;
              return (
                <React.Fragment key={result.cityName}>
                  <tr
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${isExpanded ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => setExpandedCity(isExpanded ? null : result.cityName)}
                  >
                    <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        <span>{result.cityName}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-2 py-0.5 text-[10px] font-semibold">
                            当前 offer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{result.metrics.purchasingPowerScore}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {formatCurrency(result.metrics.monthlyDisposable)}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {formatCurrency(result.metrics.realHourlyPay)}/小时
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {result.metrics.decisionLabel}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="p-3 bg-gray-50 dark:bg-gray-900">
                        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                            <div className="text-gray-500 dark:text-gray-400">住房负担率</div>
                            <div className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{result.metrics.housingBurdenRate}%</div>
                          </div>
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                            <div className="text-gray-500 dark:text-gray-400">结余率</div>
                            <div className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{result.metrics.savingsRate}%</div>
                          </div>
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                            <div className="text-gray-500 dark:text-gray-400">年可支配收入</div>
                            <div className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(result.metrics.annualDisposable)}</div>
                          </div>
                        </div>
                        <IncomeExpenseDetails
                          cityName={result.cityName}
                          income={result.metrics.monthlyIncome}
                          costs={result.metrics.monthlyCosts}
                          hideTitle={false}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>· 购买力分数综合考虑结余率、住房负担率和真实时薪，分数越高说明这份 offer 越能支撑更轻松的生活。</p>
        <p>· 点击任一城市可以展开查看税后收入和支出结构。</p>
      </div>
    </section>
  );
};

export default CityComparison;
