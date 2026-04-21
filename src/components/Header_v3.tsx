import React from 'react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Compare', href: '#compare' },
  { label: 'Diagnosis', href: '#diagnosis' },
  { label: 'Decision', href: '#decision' },
];

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/55 bg-white/70 backdrop-blur-xl shadow-[0_14px_60px_rgba(81,109,158,0.16)]">
        <div className="flex items-center justify-between px-5 py-4 md:px-7">
          <a href="#home" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#DCE8FF] via-white to-[#E7DDFB] ring-1 ring-white/60 shadow-inner" />
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Career Decision OS</div>
              <div className="text-lg font-semibold tracking-tight text-slate-900">OfferWise</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 rounded-full bg-white/60 p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#compare"
              className="hidden rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white md:inline-flex"
            >
              View compare
            </a>
            <a
              href="#decision"
              className="inline-flex rounded-full bg-[#FF8A3D] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,138,61,0.35)] transition hover:translate-y-[-1px]"
            >
              Final decision
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
