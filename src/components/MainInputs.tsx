import React, { useEffect, useState } from 'react';
import { Settings } from '../utils/CostCalculator';

interface MainInputsProps {
  title: string;
  settings: Settings;
  availableCities: string[];
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const fieldClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400';
const labelClass = 'mb-1.5 text-sm font-medium text-slate-700';

const MainInputs: React.FC<MainInputsProps> = ({ title, settings, availableCities, onSettingChange }) => {
  const [salaryInput, setSalaryInput] = useState(String(settings.salary));
  const [bonusInput, setBonusInput] = useState(String(settings.annualBonus));
  const [housingFundInput, setHousingFundInput] = useState((parseFloat(settings.housingFundRate) * 100).toString());

  useEffect(() => setSalaryInput(String(settings.salary)), [settings.salary]);
  useEffect(() => setBonusInput(String(settings.annualBonus)), [settings.annualBonus]);
  useEffect(() => setHousingFundInput((parseFloat(settings.housingFundRate) * 100).toString()), [settings.housingFundRate]);

  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div className="mb-5">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Offer 基础信息</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">
          年终奖会自动平均到每个月；系统会同时展示在岗时薪和含通勤真实时薪。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col">
          <label htmlFor={`${title}-city`} className={labelClass}>所在城市</label>
          <select
            id={`${title}-city`}
            className={fieldClass}
            value={settings.sourceCity}
            onChange={(e) => onSettingChange('sourceCity', e.target.value)}
          >
            {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-salary`} className={labelClass}>税前固定年薪（元）</label>
          <input
            id={`${title}-salary`}
            type="number"
            min="0"
            step="1000"
            value={salaryInput}
            onChange={(e) => {
              const value = e.target.value;
              setSalaryInput(value);
              onSettingChange('salary', value === '' ? 0 : Number(value));
            }}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-annualBonus`} className={labelClass}>年终奖 / 额外现金（元）</label>
          <input
            id={`${title}-annualBonus`}
            type="number"
            min="0"
            step="1000"
            value={bonusInput}
            onChange={(e) => {
              const value = e.target.value;
              setBonusInput(value);
              onSettingChange('annualBonus', value === '' ? 0 : Number(value));
            }}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-housingFundRate`} className={labelClass}>公积金比例（%）</label>
          <input
            id={`${title}-housingFundRate`}
            type="number"
            min="5"
            max="12"
            step="0.1"
            value={housingFundInput}
            onChange={(e) => {
              const value = e.target.value;
              setHousingFundInput(value);
              if (value !== '') {
                const percent = Number(value);
                if (percent >= 5 && percent <= 12) {
                  onSettingChange('housingFundRate', (percent / 100).toString());
                }
              }
            }}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workStartTime`} className={labelClass}>每天到岗时间</label>
          <input
            id={`${title}-workStartTime`}
            type="time"
            value={settings.workStartTime}
            onChange={(e) => onSettingChange('workStartTime', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workEndTime`} className={labelClass}>每天下班时间</label>
          <input
            id={`${title}-workEndTime`}
            type="time"
            value={settings.workEndTime}
            onChange={(e) => onSettingChange('workEndTime', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workDaysPerMonth`} className={labelClass}>每月工作天数</label>
          <input
            id={`${title}-workDaysPerMonth`}
            type="number"
            min="1"
            max="31"
            step="0.5"
            value={settings.workDaysPerMonth}
            onChange={(e) => onSettingChange('workDaysPerMonth', e.target.value === '' ? 22 : Number(e.target.value))}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-commuteMinutesPerDay`} className={labelClass}>通勤时长 / 天（分钟）</label>
          <input
            id={`${title}-commuteMinutesPerDay`}
            type="number"
            min="0"
            step="5"
            value={settings.commuteMinutesPerDay}
            onChange={(e) => onSettingChange('commuteMinutesPerDay', e.target.value === '' ? 0 : Number(e.target.value))}
            className={fieldClass}
          />
        </div>
      </div>
    </section>
  );
};

export default MainInputs;
