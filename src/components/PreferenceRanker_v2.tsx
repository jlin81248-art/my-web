import React from 'react';
import { PreferenceKey } from '../utils/CostCalculator';

interface PreferenceRankerProps {
  order: PreferenceKey[];
  onChange: (next: PreferenceKey[]) => void;
}

const labels: Record<PreferenceKey, { title: string; desc: string }> = {
  salary: {
    title: '薪资与存钱',
    desc: '更看重税后收入、结余和真实时薪。',
  },
  health: {
    title: '身心健康与工作强度',
    desc: '更看重工作强度是否可持续，会不会透支身体和情绪。',
  },
  entertainment: {
    title: '娱乐与生活丰富度',
    desc: '更看重娱乐预算、娱乐环境和下班后的生活空间。',
  },
  housing: {
    title: '居住条件',
    desc: '更看重租金/房贷压力以及居住舒适度。',
  },
  time: {
    title: '通勤与自由时间',
    desc: '更看重到岗-下班-通勤后一天还剩多少时间。',
  },
  family: {
    title: '家庭负担',
    desc: '更看重教育、赡养、医疗后的净结余。',
  },
  climate: {
    title: '气候与城市环境',
    desc: '更看重城市体感、宜居性和长期舒适度。',
  },
  growth: {
    title: '职业成长',
    desc: '更看重行业机会、平台发展和长期成长空间。',
  },
};

const weightHint = ['最高权重', '第二优先', '第三优先', '中等关注', '次要关注', '较低关注', '很低关注', '最低关注'];

const PreferenceRanker: React.FC<PreferenceRankerProps> = ({ order, onChange }) => {
  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-4">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 1</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">先告诉系统：你最看重什么</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          把越在意的维度排得越靠前。后面的结论会优先围绕你的前 3 个痛点来分析，身心健康和工作强度也会参与排序。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {order.map((key, index) => (
          <div
            key={key}
            className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between gap-4"
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

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40"
              >
                上移
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === order.length - 1}
                className="rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40"
              >
                下移
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreferenceRanker;
