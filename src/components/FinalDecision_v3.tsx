import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

interface FinalDecisionProps {
  comparison: OfferComparisonResult;
}

const FinalDecision: React.FC<FinalDecisionProps> = ({ comparison }) => {
  const badgeClass =
    comparison.weightedScore >= 72
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : comparison.weightedScore >= 58
        ? 'bg-slate-100 text-slate-800 border-slate-200'
        : comparison.weightedScore >= 45
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <section className="overflow-hidden rounded-[32px] border border-black/5 bg-[linear-gradient(135deg,#111111,#2B2B2B)] text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">Final Decision</div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            {comparison.summaryTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-white/75 md:text-lg">
            {comparison.summaryText}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            {comparison.topPriorityFindings.slice(0, 3).map((item, index) => (
              <div key={`${item.key}-${index}`} className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">TOP {index + 1}</div>
                <div className="mt-1 text-lg font-semibold">{item.label}</div>
                <div className="mt-2 text-sm leading-7 text-white/75">{item.explanation}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.04] p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${badgeClass}`}>
            {comparison.decisionLabel}
          </div>

          <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45">综合匹配分</div>
            <div className="mt-2 text-5xl font-semibold">{comparison.weightedScore}</div>
            <div className="text-sm text-white/50">/ 100</div>
          </div>

          <div className="mt-5 space-y-3">
            <SideMetric label="主结论" value={comparison.decisionLabel} />
            <SideMetric label="摘要标题" value={comparison.summaryTitle} />
          </div>
        </div>
      </div>
    </section>
  );
};

function SideMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}

export default FinalDecision;
