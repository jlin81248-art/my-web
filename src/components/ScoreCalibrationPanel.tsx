import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

interface ScoreCalibrationPanelProps {
  comparison: OfferComparisonResult | null;
}

const ScoreCalibrationPanel: React.FC<ScoreCalibrationPanelProps> = ({ comparison }) => {
  const debug = comparison?.scoreDebug;

  if (!comparison || !debug) {
    return (
      <section className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 4-D · score debug</div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">评分拆解</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          完成两份 offer 输入后，这里会展示综合匹配分的构成：维度贡献、优先级加成与风险扣分。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 4-D · score debug</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">为什么这次不是又卡在 60 附近</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            这一层把综合匹配分拆成 4 部分：核心得分、TOP3 优先级校正、主观体验校正、风险扣分，避免分数“黑盒化”。
          </p>
        </div>
        <div className="rounded-[24px] border border-black/5 bg-[#FAF8F4] px-4 py-3 text-right">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">final score</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{debug.finalScore}</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MiniMetric label="原始加权差值" value={debug.rawWeightedDelta.toFixed(1)} />
        <MiniMetric label="核心归一化分" value={debug.normalizedCoreScore.toFixed(1)} />
        <MiniMetric label="TOP3 / 主观加成" value={`+${(debug.topPriorityAdjustment + debug.subjectiveAdjustment).toFixed(1)}`} />
        <MiniMetric label="风险扣分" value={`-${debug.riskPenalty.toFixed(1)}`} />
      </div>

      <div className="mt-6 rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4">
        <div className="text-base font-semibold text-slate-950">维度贡献明细</div>
        <div className="mt-4 space-y-3">
          {debug.dimensionBreakdown.map((item, index) => {
            const positive = item.contribution >= 0;
            const width = Math.max(8, Math.min(100, Math.abs(item.score)));
            return (
              <div key={item.key} className="rounded-[20px] border border-black/5 bg-white p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-slate-400">TOP {index + 1}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">{item.label}</div>
                  </div>
                  <div className="text-sm text-slate-600">
                    权重 {(item.weight * 100).toFixed(0)}% · 维度分 {item.score.toFixed(1)} · 贡献{' '}
                    <span className={positive ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                      {positive ? '+' : ''}{item.contribution.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${positive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-black/5 bg-[#FAF8F4] p-4">
      <div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
    </div>
  );
}

export default ScoreCalibrationPanel;
