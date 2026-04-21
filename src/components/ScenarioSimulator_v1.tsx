import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

interface ScenarioState {
  customRentMonthly: number;
  commuteMinutesPerDay: number;
  workDaysPerMonth: number;
  annualBonus: number;
  medicalReimbursementRate: number;
  entertainmentLevel: string;
}

interface ScenarioSimulatorProps {
  scenario: ScenarioState;
  onChange: React.Dispatch<React.SetStateAction<ScenarioState>>;
  comparison: OfferComparisonResult;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ scenario, onChange, comparison }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 4</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">情景模拟：什么条件下这次跳槽才真正成立</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          直接拖动关键变量，观察这次跳槽会不会从“不划算”变成“可成立”。
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">房租 / 月</label>
          <input
            type="range"
            min="0"
            max="20000"
            step="100"
            value={scenario.customRentMonthly}
            onChange={(e) => onChange((prev) => ({ ...prev, customRentMonthly: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(scenario.customRentMonthly)}</div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">通勤时长 / 天</label>
          <input
            type="range"
            min="0"
            max="180"
            step="5"
            value={scenario.commuteMinutesPerDay}
            onChange={(e) => onChange((prev) => ({ ...prev, commuteMinutesPerDay: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{scenario.commuteMinutesPerDay} 分钟</div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">每月工作天数</label>
          <input
            type="range"
            min="18"
            max="30"
            step="0.5"
            value={scenario.workDaysPerMonth}
            onChange={(e) => onChange((prev) => ({ ...prev, workDaysPerMonth: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{scenario.workDaysPerMonth} 天</div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">年终奖</label>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={scenario.annualBonus}
            onChange={(e) => onChange((prev) => ({ ...prev, annualBonus: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(scenario.annualBonus)}</div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">医疗报销比例</label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={scenario.medicalReimbursementRate}
            onChange={(e) => onChange((prev) => ({ ...prev, medicalReimbursementRate: Number(e.target.value) }))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{scenario.medicalReimbursementRate}%</div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">娱乐强度</label>
          <select
            value={scenario.entertainmentLevel}
            onChange={(e) => onChange((prev) => ({ ...prev, entertainmentLevel: e.target.value }))}
            className="mt-3 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <option value="poor">极简生活</option>
            <option value="low">基本娱乐</option>
            <option value="medium">中等娱乐</option>
            <option value="high">丰富娱乐</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">模拟后月可支配收入</div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(comparison.after.monthlyDisposable)}</div>
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">模拟后真实时薪</div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(comparison.after.realHourlyPay)}/h</div>
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">模拟后匹配分</div>
          <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{comparison.weightedScore} / 100</div>
        </div>
      </div>
    </section>
  );
};

export default ScenarioSimulator;
