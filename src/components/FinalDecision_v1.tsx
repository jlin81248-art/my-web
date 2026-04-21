
import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

interface FinalDecisionProps {
  comparison: OfferComparisonResult;
}

const FinalDecision: React.FC<FinalDecisionProps> = ({ comparison }) => {
  const badgeClass =
    comparison.weightedScore >= 72
      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
      : comparison.weightedScore >= 58
        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
        : comparison.weightedScore >= 45
          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';

  return (
    <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white shadow-xl p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl">
          <div className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-200">Final Decision</div>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
            {comparison.summaryTitle}
          </h2>
          <p className="mt-4 text-base md:text-lg leading-8 text-blue-100">
            {comparison.summaryText}
          </p>
        </div>

        <div className="shrink-0">
          <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold ${badgeClass}`}>
            {comparison.decisionLabel}
          </div>
          <div className="mt-3 text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-blue-200">综合匹配分</div>
            <div className="mt-1 text-4xl font-black">{comparison.weightedScore}</div>
            <div className="text-sm text-blue-200">/ 100</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {comparison.topPriorityFindings.slice(0, 3).map((item, index) => (
          <div key={`${item.key}-${index}`} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-4">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-200">TOP {index + 1}</div>
            <div className="mt-1 text-lg font-bold">{item.label}</div>
            <div className="mt-2 text-sm leading-7 text-blue-100">{item.explanation}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FinalDecision;
