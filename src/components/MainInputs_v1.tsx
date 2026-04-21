import React, { useEffect, useState } from 'react';
import { Settings } from '../utils/CostCalculator';

interface MainInputsProps {
  settings: Settings;
  availableCities: string[];
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const MainInputs: React.FC<MainInputsProps> = ({ settings, availableCities, onSettingChange }) => {
  const [salaryInput, setSalaryInput] = useState(settings.salary.toString());
  const [bonusInput, setBonusInput] = useState(settings.annualBonus.toString());
  const [weeklyHoursInput, setWeeklyHoursInput] = useState(settings.weeklyWorkHours.toString());
  const [housingFundInput, setHousingFundInput] = useState((parseFloat(settings.housingFundRate) * 100).toString());

  useEffect(() => {
    if (settings.salary >= 0) {
      setSalaryInput(settings.salary.toString());
    }
  }, [settings.salary]);

  useEffect(() => {
    setBonusInput(settings.annualBonus.toString());
  }, [settings.annualBonus]);

  useEffect(() => {
    setWeeklyHoursInput(settings.weeklyWorkHours.toString());
  }, [settings.weeklyWorkHours]);

  useEffect(() => {
    setHousingFundInput((parseFloat(settings.housingFundRate) * 100).toString());
  }, [settings.housingFundRate]);

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6">
      <div className="mb-4">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">
          Step 1
        </div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">输入你的 offer 信息</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          这一部分决定 OfferWise 如何估算税后收入、真实时薪和跨城购买力。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <label htmlFor="sourceCity" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Offer 所在城市
          </label>
          <select
            id="sourceCity"
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={settings.sourceCity}
            onChange={(e) => onSettingChange('sourceCity', e.target.value)}
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="salary" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            税前固定年薪（元）
          </label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如 240000"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="annualBonus" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            年终奖 / 额外现金（元）
          </label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如 30000"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="weeklyWorkHours" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            每周平均工作时长（小时）
          </label>
          <input
            id="weeklyWorkHours"
            type="number"
            min="1"
            max="112"
            step="1"
            value={weeklyHoursInput}
            onChange={(e) => {
              const value = e.target.value;
              setWeeklyHoursInput(value);
              onSettingChange('weeklyWorkHours', value === '' ? 0 : Number(value));
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例如 50"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="housingFundRate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            公积金比例（%）
          </label>
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
            className="border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">允许范围 5% - 12%</div>
        </div>
      </div>
    </section>
  );
};

export default MainInputs;
