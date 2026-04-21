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

const fieldClass =
  'mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400';
const labelClass = 'text-sm font-medium text-slate-700';

const LifestyleSettings: React.FC<LifestyleSettingsProps> = ({
  title,
  settings,
  topPriorityKeys,
  onSettingChange,
}) => {
  return (
    <section className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_10px_34px_rgba(15,23,42,0.05)] md:p-6">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">生活方式与主观体验</div>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">
          家庭支出直接输入总金额；主观体验评分只显示你当前最在意的 3 个维度。
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="住房设置">
          <div>
            <label className={labelClass}>住房方式</label>
            <select
              className={fieldClass}
              value={settings.housingType}
              onChange={(e) => onSettingChange('housingType', e.target.value)}
            >
              <option value="rent">租房</option>
              <option value="buy">购房</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>住房位置</label>
            <select
              className={fieldClass}
              value={settings.housingLocation}
              onChange={(e) => onSettingChange('housingLocation', e.target.value)}
            >
              <option value="center">市中心</option>
              <option value="suburb">郊区</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>住房大小</label>
            <select
              className={fieldClass}
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
              <label className={labelClass}>租金 / 月（元）</label>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.customRentMonthly}
                onChange={(e) => onSettingChange('customRentMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>贷款年利率（%）</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={(settings.loanInterestRate * 100).toFixed(2)}
                  onChange={(e) => onSettingChange('loanInterestRate', Number(e.target.value) / 100)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>贷款期限（年）</label>
                <select
                  className={fieldClass}
                  value={settings.loanTerm}
                  onChange={(e) => onSettingChange('loanTerm', Number(e.target.value))}
                >
                  {[10, 15, 20, 25, 30].map((year) => <option key={year} value={year}>{year}年</option>)}
                </select>
              </div>
            </>
          )}
        </Panel>

        <Panel title="日常生活">
          <div>
            <label className={labelClass}>公司提供餐食</label>
            <select
              className={fieldClass}
              value={String(settings.companyMeals)}
              onChange={(e) => onSettingChange('companyMeals', e.target.value === 'true')}
            >
              <option value="false">否</option>
              <option value="true">是</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>在家吃饭比例（%）</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.diningHomeRatio}
              onChange={(e) => onSettingChange('diningHomeRatio', Number(e.target.value))}
              className="mt-3 w-full"
            />
            <div className="mt-1 text-xs text-slate-500">当前：{settings.diningHomeRatio}%</div>
          </div>

          <div>
            <label className={labelClass}>交通方式</label>
            <select
              className={fieldClass}
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
              <label className={labelClass}>每月车贷（元）</label>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.carLoanMonthlyPayment}
                onChange={(e) => onSettingChange('carLoanMonthlyPayment', e.target.value === '' ? 0 : Number(e.target.value))}
                className={fieldClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>娱乐水平</label>
            <select
              className={fieldClass}
              value={settings.entertainmentLevel}
              onChange={(e) => onSettingChange('entertainmentLevel', e.target.value)}
            >
              <option value="poor">极简生活</option>
              <option value="low">基本娱乐</option>
              <option value="medium">中等娱乐</option>
              <option value="high">丰富娱乐</option>
            </select>
          </div>
        </Panel>

        <Panel title="家庭支出">
          <div>
            <label className={labelClass}>子女教育投入 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.childrenEducationMonthly}
              onChange={(e) => onSettingChange('childrenEducationMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>老人赡养费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.elderCareMonthly}
              onChange={(e) => onSettingChange('elderCareMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>医疗费用 / 月（元）</label>
            <input
              type="number"
              min="0"
              step="100"
              value={settings.medicalMonthly}
              onChange={(e) => onSettingChange('medicalMonthly', e.target.value === '' ? 0 : Number(e.target.value))}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>医疗报销比例（%）</label>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              value={settings.medicalReimbursementRate}
              onChange={(e) => onSettingChange('medicalReimbursementRate', e.target.value === '' ? 0 : Number(e.target.value))}
              className={fieldClass}
            />
          </div>
        </Panel>
      </div>

      <div className="mt-6 rounded-[26px] border border-black/5 bg-[#FAF8F4] p-4 md:p-5">
        <div>
          <div className="text-sm font-semibold text-slate-900">主观体验补充评分</div>
          <div className="mt-1 text-xs text-slate-500">
            只展示你当前 TOP 3 优先级，这样分析不会固定围绕同一套维度打转。
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {topPriorityKeys.map((key, index) => {
            const field = subjectiveFieldMeta[key];
            return (
              <div key={`${title}-${key}`} className="rounded-[22px] border border-black/5 bg-white p-4">
                <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  TOP {index + 1}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-950">{field.label}</div>
                <div className="mt-1 text-xs text-slate-500">{field.help}</div>

                <select
                  className={fieldClass}
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-black/5 bg-[#FCFBF8] p-4">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export default LifestyleSettings;
