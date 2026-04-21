import React from 'react';
import { ThresholdHint } from '../utils/CostCalculator';

interface ThresholdAnalysisProps {
  hints: ThresholdHint[];
}

const ThresholdAnalysis: React.FC<ThresholdAnalysisProps> = ({ hints }) => {
  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4-A</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">最低可接受条件</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          不只是看结果，还要知道哪些条件必须谈到位，这次跳槽才真正值得接。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {hints.map((hint) => (
          <div key={hint.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{hint.label}</div>
            <div className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">{hint.value}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{hint.explanation}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThresholdAnalysis;
