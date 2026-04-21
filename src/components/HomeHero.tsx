import React from 'react';
import { OfferComparisonResult, PreferenceKey } from '../utils/CostCalculator';

interface HomeHeroProps {
  topPriorityKeys: PreferenceKey[];
  comparison: OfferComparisonResult | null;
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

const HomeHero: React.FC<HomeHeroProps> = ({
  topPriorityKeys,
  comparison,
  beforeCity,
  afterCity,
}) => {
  const score = typeof comparison?.weightedScore === 'number' ? comparison.weightedScore : 0;
  const decision = comparison?.decisionLabel ?? '等待分析';
  const title = comparison?.summaryTitle ?? 'Make career decisions with real life in mind.';
  const subtitle =
    comparison?.summaryText ??
    '不是只比较年包，而是把收入、时间、健康、家庭与生活体感一起算清楚。';

  const subjectiveText =
    typeof comparison?.topPrioritySubjectiveAfter === 'number'
      ? `${comparison.topPrioritySubjectiveAfter.toFixed(1)}/5`
      : '—';

  return (
    <section
      id="home"
      className="relative overflow-hidden rounded-[40px] border border-black/5 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(250,248,244,0.95))] px-6 py-8 shadow-[0_22px_80px_rgba(15,23,42,0.07)] md:px-8 md:py-10 lg:px-10 lg:py-12"
    >
      <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#E9E3DB] blur-3xl" />
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#E4E0F6] blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-white/70 blur-2xl" />

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex rounded-full border border-black/5 bg-[#FAF8F4] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
              Decision-first workspace
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {topPriorityKeys.map((key, index) => (
                <span
                  key={key}
                  className="rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  TOP {index + 1} · {labels[key]}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#compare"
              className="inline-flex rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-black"
            >
              Start comparing
            </a>
            <a
              href="#diagnosis"
              className="inline-flex rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#FAF8F4]"
            >
              View diagnosis
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white/92 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Latest analysis</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {beforeCity || '当前城市'} → {afterCity || '目标城市'}
                </div>
                <div className="mt-2 text-sm text-slate-500">{decision}</div>
              </div>
              <div className="rounded-[24px] border border-black/5 bg-[#FAF8F4] px-4 py-3 text-right">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">score</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{score}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <MetricChip
                label="月可支配"
                value={
                  typeof comparison?.delta?.monthlyDisposable === 'number'
                    ? `${comparison.delta.monthlyDisposable > 0 ? '+' : ''}${comparison.delta.monthlyDisposable}`
                    : '—'
                }
              />
              <MetricChip
                label="真实时薪"
                value={
                  typeof comparison?.delta?.realHourlyPay === 'number'
                    ? `${comparison.delta.realHourlyPay > 0 ? '+' : ''}${comparison.delta.realHourlyPay}`
                    : '—'
                }
              />
              <MetricChip label="主观体验" value={subjectiveText} />
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white/88 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Why this matters</div>
            <div className="mt-3 text-xl font-semibold leading-tight text-slate-950">
              年包不是结论，生活体感才是结论。
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600">
              把收入、健康、家庭、时间和主观体验放在一起，才是真正接近现实的跳槽判断。
            </div>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-[#F6F3EE] p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Focus</div>
            <div className="mt-3 text-xl font-semibold leading-tight text-slate-950">
              从“值不值”升级到“在什么条件下成立”。
            </div>
            <div className="mt-4 grid h-28 grid-cols-5 items-end gap-2">
              {[52, 74, 63, 88, 70].map((height, idx) => (
                <div key={idx} className="overflow-hidden rounded-t-full bg-white/80">
                  <div
                    className="w-full rounded-t-full bg-[linear-gradient(180deg,#6D5EF7,#111111)]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-[#FAF8F4] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export default HomeHero;
