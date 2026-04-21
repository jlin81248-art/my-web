import React from 'react';
import { PainPointRow } from '../utils/CostCalculator';

interface PainPointComparisonTableProps {
  rows: PainPointRow[];
}

const impactMeta = {
  positive: {
    text: '改善',
    cls: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
  },
  negative: {
    text: '变差',
    cls: 'bg-rose-50 text-rose-700',
    border: 'border-rose-200',
  },
  neutral: {
    text: '变化有限',
    cls: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
  },
};

const PainPointComparisonTable: React.FC<PainPointComparisonTableProps> = ({ rows }) => {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="mb-5">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Step 3-D</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">围绕你的优先级，逐项解释这次跳槽</h2>
        <p className="mt-1 text-sm text-slate-500">
          不再用大表格堆信息，而是按优先级拆成独立卡片，先读最重要的结论，再看具体变化。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {rows.map((row) => {
          const meta = impactMeta[row.impact];
          return (
            <article
              key={row.key}
              className={`rounded-[24px] border bg-[#FCFBF8] p-4 md:p-5 ${meta.border}`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                    TOP {row.priorityRank}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{row.label}</h3>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}>
                  {meta.text}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoCard title="跳槽前" text={row.beforeValue} />
                <InfoCard title="跳槽后" text={row.afterValue} />
              </div>

              <div className="mt-3">
                <InfoCard title="变化" text={row.deltaText} emphasize />
              </div>

              <div className="mt-3">
                <InfoCard title="为什么这很重要" text={row.explanation} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

function InfoCard({
  title,
  text,
  emphasize = false,
}: {
  title: string;
  text: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-[20px] border border-black/5 bg-white p-3">
      <div className="text-xs text-slate-400">{title}</div>
      <div className={`mt-1 text-sm leading-6 ${emphasize ? 'font-medium text-slate-900' : 'text-slate-700'}`}>{text}</div>
    </div>
  );
}

export default PainPointComparisonTable;
