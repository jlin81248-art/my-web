import React, { useState } from 'react';
import { PreferenceKey } from '../utils/CostCalculator';

interface PreferenceRankerProps {
  order: PreferenceKey[];
  onChange: (next: PreferenceKey[]) => void;
}

const labels: Record<PreferenceKey, { title: string; desc: string }> = {
  salary: {
    title: '薪资与存钱',
    desc: '更看重税后收入、结余和在岗/真实时薪。',
  },
  health: {
    title: '身心健康与工作强度',
    desc: '更看重工作强度是否可持续，会不会透支身体和情绪。',
  },
  entertainment: {
    title: '娱乐与生活丰富度',
    desc: '更看重娱乐预算、下班生活和城市的文娱供给。',
  },
  housing: {
    title: '居住条件',
    desc: '更看重租金/房贷压力以及住得是否舒服。',
  },
  time: {
    title: '通勤与自由时间',
    desc: '更看重每天被工作和通勤占走多少时间。',
  },
  family: {
    title: '家庭负担',
    desc: '更看重教育、赡养、医疗后的净结余和家庭友好度。',
  },
  climate: {
    title: '气候与城市环境',
    desc: '更看重宜居性、体感舒适度和长期生活体验。',
  },
  growth: {
    title: '职业成长',
    desc: '更看重行业机会、平台势能和长期成长空间。',
  },
};

const weightHint = ['最高权重', '第二优先', '第三优先', '中等关注', '次要关注', '较低关注', '很低关注', '最低关注'];

const PreferenceRanker: React.FC<PreferenceRankerProps> = ({ order, onChange }) => {
  const [dragKey, setDragKey] = useState<PreferenceKey | null>(null);
  const [hoverKey, setHoverKey] = useState<PreferenceKey | null>(null);

  const reorder = (fromKey: PreferenceKey, toKey: PreferenceKey) => {
    if (fromKey === toKey) return;
    const next = [...order];
    const fromIndex = next.indexOf(fromKey);
    const toIndex = next.indexOf(toKey);
    if (fromIndex === -1 || toIndex === -1) return;
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, fromKey);
    onChange(next);
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-4">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 1</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">先排优先级，再看跳槽值不值</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          直接拖拽排序，系统会优先围绕你的 TOP 3 维度出诊断、推演和最后结论。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {order.map((key, index) => {
          const isDragging = dragKey === key;
          const isHover = hoverKey === key && dragKey !== key;

          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragKey(key)}
              onDragEnd={() => {
                setDragKey(null);
                setHoverKey(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setHoverKey(key);
              }}
              onDragLeave={() => {
                if (hoverKey === key) setHoverKey(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragKey) reorder(dragKey, key);
                setDragKey(null);
                setHoverKey(null);
              }}
              className={`rounded-xl border p-4 flex items-center justify-between gap-4 cursor-move transition-all ${
                isDragging
                  ? 'opacity-60 scale-[0.98] border-fuchsia-300 dark:border-fuchsia-700 bg-fuchsia-50/70 dark:bg-fuchsia-950/20'
                  : isHover
                    ? 'border-cyan-300 dark:border-cyan-700 bg-cyan-50/60 dark:bg-cyan-950/20'
                    : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex-1">
                <div className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-600 dark:text-blue-400">
                  TOP {index + 1}
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{labels[key].title}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{labels[key].desc}</div>
                <div className="mt-2 inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {weightHint[index]}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-xs text-gray-400 dark:text-gray-500 text-right leading-5">
                  <div>拖拽排序</div>
                  <div>Drag</div>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-500 dark:text-gray-400 select-none">
                  ⋮⋮
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PreferenceRanker;
