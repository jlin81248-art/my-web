import React from 'react';

type RiskWarning = {
  title: string;
  level: '低' | '中' | '高' | string;
  reason?: string;
  suggestion?: string;
};

interface RiskWarningsProps {
  warnings?: RiskWarning[] | null;
}

const levelStyles: Record<string, string> = {
  高: 'bg-red-50 text-red-700 border-red-200',
  中: 'bg-amber-50 text-amber-700 border-amber-200',
  低: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const RiskWarnings: React.FC<RiskWarningsProps> = ({ warnings }) => {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Step 4-C · risks</div>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        风险预警
      </h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        这一层不是告诉你“看起来怎么样”，而是提醒你这次跳槽最可能在哪些地方出问题。
      </p>

      {safeWarnings.length === 0 ? (
        <div className="mt-5 rounded-[24px] border border-black/5 bg-[#FAF8F4] px-5 py-5 text-sm leading-7 text-slate-500">
          当前版本还没有接入风险预警数据，所以这里先显示安全占位态，不会报错。
          后续只要把 <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">riskWarnings</code>
          挂到 comparison 上，这里就会自动渲染。
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {safeWarnings.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-slate-950">
                  {item.title}
                </div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    levelStyles[item.level] ?? 'border-slate-200 bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.level}
                </span>
              </div>

              <div className="mt-3 text-sm leading-7 text-slate-500">
                {item.reason ?? '该风险的具体成因将在后续数据接入后显示。'}
              </div>

              <div className="mt-3 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-7 text-slate-600">
                {item.suggestion ?? '建议结合 Step 4-A 情景模拟，进一步判断这类风险能否被谈薪或条件调整抵消。'}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RiskWarnings;
