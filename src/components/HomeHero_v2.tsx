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
    <section id="home" className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[linear-gradient(135deg,rgba(240,245,255,0.96),rgba(229,236,248,0.94)),radial-gradient(circle_at_100%_0%,rgba(184,183,245,0.22),transparent_32%),radial-gradient(circle_at_0%_100%,rgba(91,140,255,0.18),transparent_34%)] px-6 py-8 shadow-[0_24px_80px_rgba(73,98,148,0.14)] md:px-8 md:py-10 lg:px-10 lg:py-12">
      <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#D9D5FA]/55 blur-3xl" />
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#C8DBFF]/60 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-white/60 blur-2xl" />

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/70 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 backdrop-blur">
              Premium Decision Workspace
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {topPriorityKeys.map((key, index) => (
                <span
                  key={key}
                  className="rounded-full border border-white/75 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur"
                >
                  TOP {index + 1} · {labels[key]}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#compare"
              className="inline-flex rounded-full bg-[#FF8A3D] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(255,138,61,0.32)] transition hover:translate-y-[-1px]"
            >
              Start comparing
            </a>
            <a
              href="#diagnosis"
              className="inline-flex rounded-full border border-white/65 bg-white/70 px-5 py-3 text-sm font-medium text-slate-700 backdrop-blur transition hover:bg-white"
            >
              View diagnosis
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/60 bg-white/72 p-5 backdrop-blur-xl shadow-[0_18px_50px_rgba(83,106,150,0.12)] lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Latest analysis</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {beforeCity || '当前城市'} → {afterCity || '目标城市'}
                </div>
                <div className="mt-2 text-sm text-slate-500">{decision}</div>
              </div>
              <div className="rounded-2xl bg-[linear-gradient(135deg,#D9E8FF,#E6DDFB)] px-4 py-3 text-right">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">score</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{score}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <MetricChip label="月可支配" value={typeof comparison?.delta?.monthlyDisposable === 'number' ? `${comparison.delta.monthlyDisposable > 0 ? '+' : ''}${comparison.delta.monthlyDisposable}` : '—'} />
              <MetricChip label="真实时薪" value={typeof comparison?.delta?.realHourlyPay === 'number' ? `${comparison.delta.realHourlyPay > 0 ? '+' : ''}${comparison.delta.realHourlyPay}` : '—'} />
              <MetricChip label="主观体验" value={subjectiveText} />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 backdrop-blur-xl shadow-[0_18px_50px_rgba(83,106,150,0.12)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Why this matters</div>
            <div className="mt-3 text-xl font-semibold leading-tight text-slate-950">
              年包不是结论，生活体感才是结论。
            </div>
            <div className="mt-3 text-sm leading-7 text-slate-600">
              把收入、健康、家庭、时间和主观体验放在一起，才是真正接近现实的跳槽判断。
            </div>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(196,220,255,0.8),rgba(224,215,250,0.76))] p-5 shadow-[0_18px_50px_rgba(83,106,150,0.12)]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Focus</div>
            <div className="mt-3 text-xl font-semibold leading-tight text-slate-950">
              从“值不值”升级到“在什么条件下成立”。
            </div>
            <div className="mt-3 flex h-28 items-end gap-2">
              {[52, 74, 63, 88, 70].map((height, idx) => (
                <div key={idx} className="flex-1 rounded-t-full bg-white/70">
                  <div
                    className="w-full rounded-t-full bg-gradient-to-t from-[#5B8CFF] to-[#B8B7F5]"
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
    <div className="rounded-2xl bg-slate-50/90 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export default HomeHero;
