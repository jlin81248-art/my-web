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
      <div className="mx-auto max-w-7xl rounded-[30px] border border-black/5 bg-white/82 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex items-center justify-between px-5 py-4 md:px-7">
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-[#111111] text-sm font-semibold text-white shadow-sm">
              OW
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Career Decision OS</div>
              <div className="truncate text-lg font-semibold tracking-tight text-slate-950">OfferWise</div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 rounded-full border border-black/5 bg-[#FAF8F4] p-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#compare"
              className="hidden rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-black/12 hover:bg-[#FAF8F4] md:inline-flex"
            >
              View compare
            </a>
            <a
              href="#decision"
              className="inline-flex rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-black"
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
