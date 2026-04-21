import React from 'react';
import { PreferenceKey, Settings } from '../utils/CostCalculator';

interface LifestyleSettingsProps {
  title: string;
  settings: Settings;
  topPriorityKeys: PreferenceKey[];
  onSettingChange: (key: keyof Settings, value: unknown) => void;
}

const subjectiveFieldMeta: Record<PreferenceKey, { label: string; key: keyof Settings; help: string }> = {
  salary: {
    label: '薪酬满意度（1-5）',
    key: 'salarySatisfactionScore',
    help: '你主观觉得这份薪酬是否值得这份投入。',
  },
  health: {
    label: '工作强度对身心健康友好度（1-5）',
    key: 'healthFriendlyScore',
    help: '越高代表越可持续，越不容易透支。',
  },
  entertainment: {
    label: '娱乐环境满意度（1-5）',
    key: 'entertainmentSceneScore',
    help: '夜生活、线下活动和文娱供给是否符合你的偏好。',
  },
  housing: {
    label: '居住环境满意度（1-5）',
    key: 'housingEnvironmentScore',
    help: '综合看居住舒适度、社区和通勤体感。',
  },
  time: {
    label: '时间掌控感（1-5）',
    key: 'timeFreedomScore',
    help: '你是否觉得自己的节奏和可支配时间还算可控。',
  },
  family: {
    label: '家庭支持友好度（1-5）',
    key: 'familySupportScore',
    help: '综合看照顾安排和家庭生活的便利程度。',
  },
  climate: {
    label: '气候舒适度（1-5）',
    key: 'climateComfortScore',
    help: '综合你对温度、湿度和长期宜居性的感受。',
  },
  growth: {
    label: '职业成长性（1-5）',
    key: 'growthScore',
    help: '综合行业机会、平台势能和长期成长空间。',
  },
};

const LifestyleSettings: React.FC<LifestyleSettingsProps> = ({
  title,
  settings,
  topPriorityKeys,
  onSettingChange,
}) => {
  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-4 md:p-6 space-y-6">
      <div>
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600 dark:text-blue-400">生活方式与主观体验</div>
        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          家庭支出直接输入总金额；主观体验评分只显示你当前最在意的 3 个维度。
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
              />
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">娱乐水平</label>
            <select
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              value={settings.entertainmentLevel}
              onChange={(e) => onSettingChange('entertainmentLevel', e.target.value)}
            >
              <option value="poor">极简生活</option>
              <option value="low">基本娱乐</option>
              <option value="medium">中等娱乐</option>
              <option value="high">丰富娱乐</option>
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">老人赡养费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.elderCareMonthly}
              onChange={(e) => onSettingChange('elderCareMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">医疗费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.medicalMonthly}
              onChange={(e) => onSettingChange('medicalMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">医疗报销比例（%）</label>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              value={settings.medicalReimbursementRate}
              onChange={(e) => onSettingChange('medicalReimbursementRate', e.target.value === '' ? 0 : Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-4 space-y-4">
        <div>
          <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">主观体验补充评分</div>
          <div className="mt-1 text-xs text-blue-700/80 dark:text-blue-300/80">
            只展示你当前 TOP 3 优先级，这样分析不会固定围绕同一套维度打转。
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPriorityKeys.map((key, index) => {
            const field = subjectiveFieldMeta[key];
            return (
              <div key={`${title}-${key}`} className="rounded-xl bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/60 p-4">
                <div className="text-xs font-semibold tracking-[0.12em] uppercase text-blue-600 dark:text-blue-400">
                  TOP {index + 1}
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{field.label}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.help}</div>

                <select
                  className="mt-3 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2.5 px-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  value={Number(settings[field.key])}
                  onChange={(e) => onSettingChange(field.key, Number(e.target.value))}
                >
                  <option value={1}>1 - 很差</option>
                  <option value={2}>2 - 较差</option>
                  <option value={3}>3 - 一般</option>
                  <option value={4}>4 - 较好</option>
                  <option value={5}>5 - 很好</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSettings;
