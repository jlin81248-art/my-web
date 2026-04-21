import React from 'react';
import { PainPointRow } from '../utils/CostCalculator';

interface PainPointComparisonTableProps {
  rows: PainPointRow[];
}

const impactMeta = {
  positive: {
    text: '改善',
    cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-900/60',
  },
  negative: {
    text: '变差',
    cls: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-900/60',
  },
  neutral: {
    text: '变化有限',
    cls: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-900/60',
  },
};

const PainPointComparisonTable: React.FC<PainPointComparisonTableProps> = ({ rows }) => {
  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="mb-5">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 3-D</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">围绕你的优先级，逐项解释这次跳槽</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          不再用大表格堆信息，而是按优先级拆成独立卡片，先读最重要的结论，再看具体变化。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {rows.map((row) => {
          const meta = impactMeta[row.impact];
          return (
            <article
              key={row.key}
              className={`rounded-2xl border p-4 md:p-5 bg-slate-50 dark:bg-slate-900 ${meta.border}`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    TOP {row.priorityRank}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">{row.label}</h3>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}>
                  {meta.text}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-800 p-3">
                  <div className="text-xs text-gray-400 dark:text-gray-500">跳槽前</div>
                  <div className="mt-1 text-sm leading-6 text-gray-800 dark:text-gray-200">{row.beforeValue}</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-800 p-3">
                  <div className="text-xs text-gray-400 dark:text-gray-500">跳槽后</div>
                  <div className="mt-1 text-sm leading-6 text-gray-800 dark:text-gray-200">{row.afterValue}</div>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-800 p-3">
                <div className="text-xs text-gray-400 dark:text-gray-500">变化</div>
                <div className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{row.deltaText}</div>
              </div>

              <div className="mt-3 rounded-xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-800 p-3">
                <div className="text-xs text-gray-400 dark:text-gray-500">为什么这很重要</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">{row.explanation}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PainPointComparisonTable;
