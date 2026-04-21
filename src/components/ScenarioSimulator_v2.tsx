import React from 'react';
import { OfferComparisonResult } from '../utils/CostCalculator';

type ScenarioState = {
  customRentMonthly: number;
  commuteMinutesPerDay: number;
  workDaysPerMonth: number;
  annualBonus: number;
  medicalReimbursementRate: number;
  entertainmentLevel: string;
};

interface ScenarioSimulatorProps {
  scenario: ScenarioState;
  onChange: (next: ScenarioState) => void;
  comparison: OfferComparisonResult | null;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ scenario, onChange, comparison }) => {
  const update = <K extends keyof ScenarioState>(key: K, value: ScenarioState[K]) => {
    onChange({
      ...scenario,
      [key]: value,
    });
  };

  const scoreText =
    typeof comparison?.weightedScore === 'number' ? `${comparison.weightedScore}/100` : '—';
  const disposableText =
    typeof comparison?.delta?.monthlyDisposable === 'number'
      ? `${comparison.delta.monthlyDisposable > 0 ? '+' : ''}${comparison.delta.monthlyDisposable}`
      : '—';
  const hourlyText =
    typeof comparison?.delta?.realHourlyPay === 'number'
      ? `${comparison.delta.realHourlyPay > 0 ? '+' : ''}${comparison.delta.realHourlyPay}`
      : '—';

  return (
    <section className="rounded-[28px] border border-white/60 bg-white/72 p-5 shadow-[0_18px_50px_rgba(83,106,150,0.12)] backdrop-blur-xl md:p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 4-A · simulation</div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
        情景模拟
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
        通过调节关键变量，看看这次跳槽是在什么条件下才真正成立。
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="租金 / 月（元）"
            value={scenario.customRentMonthly}
            min={0}
            max={30000}
            step={100}
            onChange={(value) => update('customRentMonthly', value)}
          />
          <Field
            label="通勤 / 天（分钟）"
            value={scenario.commuteMinutesPerDay}
            min={0}
            max={240}
            step={5}
            onChange={(value) => update('commuteMinutesPerDay', value)}
          />
          <Field
            label="每月工作天数"
            value={scenario.workDaysPerMonth}
            min={1}
            max={31}
            step={0.5}
            onChange={(value) => update('workDaysPerMonth', value)}
          />
          <Field
            label="年终奖（元）"
            value={scenario.annualBonus}
            min={0}
            max={500000}
            step={1000}
            onChange={(value) => update('annualBonus', value)}
          />
          <Field
            label="医疗报销比例（%）"
            value={scenario.medicalReimbursementRate}
            min={0}
            max={100}
            step={5}
            onChange={(value) => update('medicalReimbursementRate', value)}
          />

          <div className="rounded-[24px] border border-slate-100 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">娱乐水平</div>
            <select
              value={scenario.entertainmentLevel}
              onChange={(e) => update('entertainmentLevel', e.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="poor">极简生活</option>
              <option value="low">基本娱乐</option>
              <option value="medium">中等娱乐</option>
              <option value="high">丰富娱乐</option>
            </select>
          </div>
        </div>

        <div className="rounded-[24px] bg-[linear-gradient(135deg,#DCE8FF,#ECE7FB)] p-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Simulated result</div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Metric label="模拟后匹配分" value={scoreText} />
            <Metric label="月可支配变化" value={disposableText} />
            <Metric label="真实时薪变化" value={hourlyText} />
          </div>

          <div className="mt-4 rounded-2xl bg-white/80 px-4 py-4 text-sm leading-7 text-slate-600">
            {comparison
              ? '你现在调的这些条件，已经实时映射到右侧结果里。继续试不同的租金、通勤和工作天数，看哪组条件最接近你真正愿意接受的状态。'
              : '当前还没有模拟结果，但你已经可以先调参数。等 comparison 数据可用后，这里会自动显示对应结果。'}
          </div>
        </div>
      </div>
    </section>
  );
};

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</div>
        <div className="text-sm font-semibold text-slate-950 dark:text-slate-100">{value}</div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 w-full"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

export default ScenarioSimulator;
