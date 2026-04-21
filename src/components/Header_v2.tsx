import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#020617_100%)]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-blue-700 dark:text-blue-300">
          OfferWise Dual-Offer MVP
        </div>

        <div className="mt-4 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-black leading-tight text-slate-900 dark:text-slate-100">
            OfferWise：跳槽前后 Offer 的
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600">
              个性化生活决策对比平台
            </span>
          </h1>

          <p className="mt-4 text-sm md:text-lg leading-7 text-slate-600 dark:text-slate-300 max-w-4xl">
            不是只看涨了多少年包，而是把税后收入、住房、娱乐、通勤、家庭负担、气候舒适度和职业成长性放在一起，
            判断这次跳槽到底是“数字更好看”，还是“生活真的更好过”。
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {['双 Offer 对比', '用户偏好排序', '痛点分析表', '生活化结论'].map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/80 dark:bg-slate-800/80 px-3 py-1 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
