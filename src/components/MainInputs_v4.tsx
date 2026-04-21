import React, { useEffect, useState } from 'react';
import { Settings } from '../utils/CostCalculator';

interface MainInputsProps {
  title: string;
  settings: Settings;
  availableCities: string[];
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const MainInputs: React.FC<MainInputsProps> = ({ title, settings, availableCities, onSettingChange }) => {
  const [salaryInput, setSalaryInput] = useState(String(settings.salary));
  const [bonusInput, setBonusInput] = useState(String(settings.annualBonus));
  const [housingFundInput, setHousingFundInput] = useState((parseFloat(settings.housingFundRate) * 100).toString());

  useEffect(() => setSalaryInput(String(settings.salary)), [settings.salary]);
  useEffect(() => setBonusInput(String(settings.annualBonus)), [settings.annualBonus]);
  useEffect(() => setHousingFundInput((parseFloat(settings.housingFundRate) * 100).toString()), [settings.housingFundRate]);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="mb-4">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Offer 基础信息</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          年终奖会自动平均到每个月；系统同时展示“在岗时薪”和“含通勤真实时薪”。通勤默认是 0，不会自动额外加 1 小时。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor={`${title}-city`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所在城市</label>
          <select
            id={`${title}-city`}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            value={settings.sourceCity}
            onChange={(e) => onSettingChange('sourceCity', e.target.value)}
          >
            {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-salary`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">税前固定年薪（元）</label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-annualBonus`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年终奖 / 额外现金（元）</label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-housingFundRate`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">公积金比例（%）</label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workStartTime`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每天到达公司时间</label>
          <input
            id={`${title}-workStartTime`}
            type="time"
            value={settings.workStartTime}
            onChange={(e) => onSettingChange('workStartTime', e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workEndTime`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每天下班时间</label>
          <input
            id={`${title}-workEndTime`}
            type="time"
            value={settings.workEndTime}
            onChange={(e) => onSettingChange('workEndTime', e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-workDaysPerMonth`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每月工作天数</label>
          <input
            id={`${title}-workDaysPerMonth`}
            type="number"
            min="1"
            max="31"
            step="0.5"
            value={settings.workDaysPerMonth}
            onChange={(e) => onSettingChange('workDaysPerMonth', e.target.value === '' ? 22 : Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">直接填真实月工作天数即可，大小周可填 24 / 25 / 26 等。</div>
        </div>

        <div className="flex flex-col">
          <label htmlFor={`${title}-commuteMinutesPerDay`} className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">通勤时长 / 天（分钟）</label>
          <input
            id={`${title}-commuteMinutesPerDay`}
            type="number"
            min="0"
            step="5"
            value={settings.commuteMinutesPerDay}
            onChange={(e) => onSettingChange('commuteMinutesPerDay', e.target.value === '' ? 0 : Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">填 0 就是不计入通勤时间；这里只统计往返总时长。</div>
        </div>
      </div>
    </section>
  );
};

export default MainInputs;
