import React from 'react';
import { OfferComparisonResult, PreferenceKey } from '../utils/CostCalculator';

interface SmartWidgetsProps {
  comparison: OfferComparisonResult | null;
  topPriorityKeys: PreferenceKey[];
  beforeCity: string;
  afterCity: string;
}

const labels: Record<PreferenceKey, string> = {
  salary: '薪资与存钱',
  health: '身心健康',
  entertainment: '娱乐体验',
  housing: '居住条件',
  time: '通勤与自由时间',
  family: '家庭负担',
  climate: '气候与城市环境',
  growth: '职业成长',
};

const formatSigned = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return `${value > 0 ? '+' : ''}${value}`;
};

const SmartWidgets: React.FC<SmartWidgetsProps> = ({
  comparison,
  topPriorityKeys,
  beforeCity,
  afterCity,
}) => {
  const riskWarnings = Array.isArray(comparison?.riskWarnings) ? comparison!.riskWarnings : [];
  const riskCount = riskWarnings.filter((item) => item.level === '高').length;

  const topFinding = comparison?.topPriorityFindings?.[0] ?? null;
  const thresholds = Array.isArray(comparison?.thresholdHints) ? comparison!.thresholdHints.slice(0, 2) : [];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Card className="lg:col-span-5">
        <Eyebrow>Decision snapshot</Eyebrow>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">最近一次决策快照</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          {beforeCity || '当前城市'} → {afterCity || '目标城市'} · {comparison?.decisionLabel ?? '等待结果'}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniCard label="匹配分" value={comparison ? `${comparison.weightedScore}/100` : '—'} />
          <MiniCard label="高风险数" value={`${riskCount}`} />
          <MiniCard label="月可支配变化" value={formatSigned(comparison?.delta?.monthlyDisposable)} />
          <MiniCard label="真实时薪变化" value={formatSigned(comparison?.delta?.realHourlyPay)} />
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <Eyebrow>Top priorities</Eyebrow>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">当前最看重</h3>
        <div className="mt-5 space-y-2">
          {topPriorityKeys.map((key, index) => (
            <div key={key} className="flex items-center justify-between rounded-2xl border border-black/5 bg-[#FAF8F4] px-4 py-3">
              <span className="text-sm font-medium text-slate-700">TOP {index + 1}</span>
              <span className="text-sm font-semibold text-slate-950">{labels[key]}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-4">
        <Eyebrow>System signal</Eyebrow>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">最关键的一条判断</h3>
        <div className="mt-5 rounded-[24px] border border-black/5 bg-[#F6F3EE] p-5">
          <div className="text-sm font-semibold text-slate-900">{topFinding?.label ?? '等待分析'}</div>
          <div className="mt-2 text-sm leading-7 text-slate-600">
            {topFinding?.explanation ?? '完成两份 offer 输入后，这里会出现最关键的一条系统判断。'}
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-7">
        <Eyebrow>Fast actions</Eyebrow>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">常用操作触手可及</h3>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <ActionLink href="#compare" title="编辑两份 offer" desc="快速回到输入区修改房租、工时、报销比例等。" />
          <ActionLink href="#diagnosis" title="继续看诊断" desc="查看收入、时间、健康与优先级变化证据。" />
          <ActionLink href="#decision" title="直接看决策" desc="查看阈值、风险和最终大结论。" />
        </div>
      </Card>

      <Card className="lg:col-span-5">
        <Eyebrow>Threshold hints</Eyebrow>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">最低成立条件</h3>
        <div className="mt-5 space-y-3">
          {thresholds.length > 0 ? thresholds.map((item) => (
            <div key={item.label} className="rounded-2xl border border-black/5 bg-[#FAF8F4] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
                <span className="text-base font-semibold text-slate-950">{item.value}</span>
              </div>
              <div className="mt-2 text-sm leading-7 text-slate-500">{item.explanation}</div>
            </div>
          )) : (
            <div className="rounded-2xl border border-black/5 bg-[#FAF8F4] px-4 py-4 text-sm leading-7 text-slate-500">
              输入完成后，这里会显示房租、通勤、工作天数等最低可接受条件。
            </div>
          )}
        </div>
      </Card>
    </section>
  );
};

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-[30px] border border-black/5 bg-white/88 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] md:p-6 ${className}`}>
      {children}
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-[#FAF8F4] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function ActionLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-[24px] border border-black/5 bg-[#FAF8F4] p-4 transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="text-base font-semibold text-slate-950">{title}</div>
      <div className="mt-2 text-sm leading-7 text-slate-500">{desc}</div>
      <div className="mt-4 text-sm font-medium text-slate-950">Open →</div>
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
      {children}
    </div>
  );
}

export default SmartWidgets;
