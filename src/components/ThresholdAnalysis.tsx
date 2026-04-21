import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

type ThresholdHint = {
  label: string;
  value: string;
  explanation?: string;
};

interface ThresholdAnalysisProps {
  comparison: OfferComparisonResult | null;
}

const ThresholdAnalysis: React.FC<ThresholdAnalysisProps> = ({ comparison }) => {
  const extra = (comparison ?? {}) as OfferComparisonResult & {
    thresholdHints?: ThresholdHint[];
    thresholds?: ThresholdHint[];
  };

  const hints: ThresholdHint[] = Array.isArray(extra.thresholdHints)
    ? extra.thresholdHints
    : Array.isArray(extra.thresholds)
      ? extra.thresholds
      : [];

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 4-B · threshold</div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        最低成立条件
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        不是只看现在“值不值”，而是判断这份 offer 至少要满足什么条件，才真正成立。
      </p>

      {hints.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-black/5 bg-[#FAF8F4] px-5 py-5 text-sm leading-7 text-slate-500">
          当前版本还没有接入阈值分析数据，所以这里先显示安全占位态，不会再报错。后续把
          <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">thresholdHints</code>
          或
          <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">thresholds</code>
          挂到 comparison 上，这里就会自动渲染。
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {hints.map((hint) => (
            <div
              key={hint.label}
              className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4"
            >
              <div className="text-sm text-slate-500">{hint.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{hint.value}</div>
              <div className="mt-2 text-sm leading-7 text-slate-500">
                {hint.explanation ?? '该条件是让当前这次跳槽成立的关键约束之一。'}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ThresholdAnalysis;
