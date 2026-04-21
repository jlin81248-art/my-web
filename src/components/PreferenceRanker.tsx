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
    <section className="rounded-[28px] border border-black/5 bg-white/88 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Step 1</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">先排优先级，再看跳槽值不值</h2>
        <p className="mt-1 text-sm text-slate-500">
          直接拖拽排序，系统会优先围绕你的 TOP 3 维度出诊断、推演和最后结论。
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
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
              className={`rounded-[24px] border p-4 transition-all ${
                isDragging
                  ? 'scale-[0.985] border-slate-900/20 bg-slate-100/80 opacity-70'
                  : isHover
                    ? 'border-[#6D5EF7]/30 bg-[#F4F0FF]'
                    : 'border-black/5 bg-[#FAF8F4]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                    TOP {index + 1}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">{labels[key].title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{labels[key].desc}</div>
                  <div className="mt-3 inline-flex rounded-full border border-black/5 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                    {weightHint[index]}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <div className="text-right text-xs leading-5 text-slate-400">
                    <div>拖拽排序</div>
                    <div>Drag</div>
                  </div>
                  <div className="select-none rounded-2xl border border-black/5 bg-white px-3 py-2 text-slate-500">
                    ⋮⋮
                  </div>
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
