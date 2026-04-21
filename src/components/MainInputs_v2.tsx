import React, { useEffect, useState } from 'react';
import { Settings } from '../utils/CostCalculator';

interface MainInputsProps {
  settings: Settings;
  availableCities: string[];
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const MainInputs: React.FC<MainInputsProps> = ({ settings, availableCities, onSettingChange }) => {
  const [salaryInput, setSalaryInput] = useState(String(settings.salary));
  const [bonusInput, setBonusInput] = useState(String(settings.annualBonus));
  const [housingFundInput, setHousingFundInput] = useState((parseFloat(settings.housingFundRate) * 100).toString());

  useEffect(() => setSalaryInput(String(settings.salary)), [settings.salary]);
  useEffect(() => setBonusInput(String(settings.annualBonus)), [settings.annualBonus]);
  useEffect(() => setHousingFundInput((parseFloat(settings.housingFundRate) * 100).toString()), [settings.housingFundRate]);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="mb-4">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">Step 1</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">输入 offer 与工作时间</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          年终奖会自动平均到每个月；真实时薪按“平均月可支配收入 ÷ 月占用时长（在岗 + 通勤）”计算。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor="sourceCity" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer 所在城市</label>
          <select
            id="sourceCity"
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            value={settings.sourceCity}
            onChange={(e) => onSettingChange('sourceCity', e.target.value)}
          >
            {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="salary" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">税前固定年薪（元）</label>
          <input
            id="salary"
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
          <label htmlFor="annualBonus" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年终奖 / 额外现金（元）</label>
          <input
            id="annualBonus"
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
          <label htmlFor="housingFundRate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">公积金比例（%）</label>
          <input
            id="housingFundRate"
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
          <label htmlFor="workStartTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每天到达公司时间</label>
          <input
            id="workStartTime"
            type="time"
            value={settings.workStartTime}
            onChange={(e) => onSettingChange('workStartTime', e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="workEndTime" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每天下班时间</label>
          <input
            id="workEndTime"
            type="time"
            value={settings.workEndTime}
            onChange={(e) => onSettingChange('workEndTime', e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="workDaysPerWeek" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">每周工作天数</label>
          <input
            id="workDaysPerWeek"
            type="number"
            min="1"
            max="7"
            step="0.5"
            value={settings.workDaysPerWeek}
            onChange={(e) => onSettingChange('workDaysPerWeek', e.target.value === '' ? 5 : Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">建议填 5 / 5.5 / 6，更接近真实出勤。</div>
        </div>
      </div>
    </section>
  );
};

export default MainInputs;
