'use client';

import React from 'react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

function SortableCard({ item, index }: { item: PreferenceKey; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border p-4 flex items-center gap-4 bg-white dark:bg-gray-800 ${
        isDragging
          ? 'border-blue-400 shadow-xl ring-2 ring-blue-200 dark:ring-blue-900 z-10'
          : 'border-gray-100 dark:border-gray-700 shadow-sm'
      }`}
    >
      <button
        type="button"
        aria-label={`拖动排序：${labels[item].title}`}
        className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 touch-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        {...attributes}
        {...listeners}
      >
        <span className="text-lg leading-none">⋮⋮</span>
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold tracking-[0.14em] uppercase text-blue-600 dark:text-blue-400">
          TOP {index + 1}
        </div>
        <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {labels[item].title}
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {labels[item].desc}
        </div>
        <div className="mt-2 inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
          {weightHint[index]}
        </div>
      </div>
    </div>
  );
}

const PreferenceRanker: React.FC<PreferenceRankerProps> = ({ order, onChange }) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as PreferenceKey);
    const newIndex = order.indexOf(over.id as PreferenceKey);
    if (oldIndex === -1 || newIndex === -1) return;

    onChange(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-4">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 1</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">先排优先级，再看跳槽值不值</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          直接拖拽卡片排序。系统会优先围绕你的 TOP 3 维度出结论，主观体验评分也只展示这 3 个点。
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        长按或拖动左侧手柄即可调整顺序，越靠前权重越高。
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {order.map((key, index) => (
              <SortableCard key={key} item={key} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default PreferenceRanker;
