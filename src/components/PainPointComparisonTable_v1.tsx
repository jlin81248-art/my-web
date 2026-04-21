import React from 'react';
import { PainPointRow } from '../utils/CostCalculator';

interface PainPointComparisonTableProps {
  rows: PainPointRow[];
}

const PainPointComparisonTable: React.FC<PainPointComparisonTableProps> = ({ rows }) => {
  const getImpactClass = (impact: PainPointRow['impact']) => {
    if (impact === 'positive') return 'text-green-600 dark:text-green-400';
    if (impact === 'negative') return 'text-red-600 dark:text-red-400';
    return 'text-gray-700 dark:text-gray-300';
  };

  const getImpactText = (impact: PainPointRow['impact']) => {
    if (impact === 'positive') return '改善';
    if (impact === 'negative') return '变差';
    return '变化有限';
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="mb-4">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 6</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">围绕你的优先级，逐项解释这次跳槽</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          先看你最在意的维度，再看跳槽前后到底发生了什么变化。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">维度</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">跳槽前</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">跳槽后</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">变化</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">影响</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">解释</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{row.label}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.beforeValue}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.afterValue}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.deltaText}</td>
                <td className={`px-4 py-3 font-semibold ${getImpactClass(row.impact)}`}>{getImpactText(row.impact)}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PainPointComparisonTable;
