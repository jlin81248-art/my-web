import React from 'react';
import { Settings } from '../utils/CostCalculator';

interface LifestyleSettingsProps {
  title: string;
  settings: Settings;
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const LifestyleSettings: React.FC<LifestyleSettingsProps> = ({ title, settings, onSettingChange }) => {
  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">生活方式与环境</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          既看现金支出，也看娱乐环境、气候舒适度和职业成长等更生活化的判断依据。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">住房设置</h3>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">住房方式</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.housingType}
              onChange={(e) => onSettingChange('housingType', e.target.value)}
            >
              <option value="rent">租房</option>
              <option value="buy">购房</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">住房位置</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.housingLocation}
              onChange={(e) => onSettingChange('housingLocation', e.target.value)}
            >
              <option value="center">市中心</option>
              <option value="suburb">郊区</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">住房大小</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.housingSize}
              onChange={(e) => onSettingChange('housingSize', e.target.value)}
            >
              {settings.housingType === 'rent' && <option value="shared">合租</option>}
              <option value="small">小户型</option>
              <option value="large">大户型</option>
            </select>
          </div>

          {settings.housingType === 'rent' ? (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">租金 / 月（元）</label>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.customRentMonthly}
                onChange={(e) => onSettingChange('customRentMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="建议直接填真实租金"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">填 0 时会回退到城市均值。</div>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">贷款年利率（%）</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={(settings.loanInterestRate * 100).toFixed(2)}
                  onChange={(e) => onSettingChange('loanInterestRate', Number(e.target.value) / 100)}
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">贷款期限（年）</label>
                <select
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  value={settings.loanTerm}
                  onChange={(e) => onSettingChange('loanTerm', Number(e.target.value))}
                >
                  {[10, 15, 20, 25, 30].map((year) => <option key={year} value={year}>{year}年</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">日常生活</h3>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">公司提供餐食</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={String(settings.companyMeals)}
              onChange={(e) => onSettingChange('companyMeals', e.target.value === 'true')}
            >
              <option value="false">否</option>
              <option value="true">是</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">在家吃饭比例（%）</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.diningHomeRatio}
              onChange={(e) => onSettingChange('diningHomeRatio', Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前：{settings.diningHomeRatio}%</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">交通方式</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.transportType}
              onChange={(e) => onSettingChange('transportType', e.target.value)}
            >
              <option value="public">公共交通</option>
              <option value="car">私家车</option>
              <option value="ebike">电动车</option>
              <option value="bike">自行车</option>
              <option value="walk">步行</option>
            </select>
          </div>

          {settings.transportType === 'car' && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">每月车贷（元）</label>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.carLoanMonthlyPayment}
                onChange={(e) => onSettingChange('carLoanMonthlyPayment', e.target.value === '' ? 0 : Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">通勤时长 / 天（分钟）</label>
            <input
              type="number"
              min="0"
              step="5"
              value={settings.commuteMinutesPerDay}
              onChange={(e) => onSettingChange('commuteMinutesPerDay', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">娱乐消费强度</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.entertainmentLevel}
              onChange={(e) => onSettingChange('entertainmentLevel', e.target.value)}
            >
              <option value="poor">极简生活</option>
              <option value="low">基本娱乐</option>
              <option value="medium">中等娱乐</option>
              <option value="high">高频娱乐</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">家庭支出</h3>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">子女教育投入 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.childrenEducationMonthly}
              onChange={(e) => onSettingChange('childrenEducationMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">赡养老人数</label>
            <input
              type="number"
              min="0"
              max="8"
              step="1"
              value={settings.elderCount}
              onChange={(e) => onSettingChange('elderCount', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">每位老人赡养费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.elderCareMonthlyPerPerson}
              onChange={(e) => onSettingChange('elderCareMonthlyPerPerson', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">一家人医疗费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.familyMedicalMonthly}
              onChange={(e) => onSettingChange('familyMedicalMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">医疗报销 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.medicalReimbursementMonthly}
              onChange={(e) => onSettingChange('medicalReimbursementMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">主观环境评分</h3>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">娱乐环境满意度（1-5）</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={settings.entertainmentSceneScore}
              onChange={(e) => onSettingChange('entertainmentSceneScore', Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前：{settings.entertainmentSceneScore} / 5</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">气候舒适度（1-5）</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={settings.climateComfortScore}
              onChange={(e) => onSettingChange('climateComfortScore', Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前：{settings.climateComfortScore} / 5</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">职业成长性（1-5）</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={settings.growthScore}
              onChange={(e) => onSettingChange('growthScore', Number(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前：{settings.growthScore} / 5</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSettings;
