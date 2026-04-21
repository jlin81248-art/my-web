import React from 'react';
import { RiskWarning } from '../utils/CostCalculator';

interface RiskWarningsProps {
  warnings: RiskWarning[];
}

const levelClassMap: Record<RiskWarning['level'], string> = {
  低: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  中: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  高: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

const RiskWarnings: React.FC<RiskWarningsProps> = ({ warnings }) => {
  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4-B</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">风险预警</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          最终值不值，不只看收益，也要看你为这个 offer 承担了哪些未来风险。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {warnings.map((warning) => (
          <div key={warning.title} className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700">
            <div className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${levelClassMap[warning.level]}`}>
              {warning.level}风险
            </div>
            <div className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">{warning.title}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{warning.reason}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RiskWarnings;
