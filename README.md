<div align="center">

# OfferWise

面向跳槽场景的 Offer 决策系统

![Next.js](https://img.shields.io/badge/Next.js-13.5-black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38b2ac)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

**不只比较年包，而是把收入、时间、健康、家庭负担与生活体感放在一起，帮助用户判断一份 Offer 到底值不值得跳。**

### 在线访问

[🌐 点击打开网站](https://my-web-pied-nine.vercel.app)

</div>

---

## 项目简介

**OfferWise** 是一个面向跳槽与多地 Offer 对比场景的决策支持工具。

它不把“薪资更高”直接等同于“更值得跳”，而是把税后收入、住房成本、通勤时间、工作强度、家庭支出、主观偏好和职业成长等因素纳入同一套分析流程中，帮助用户完成从输入、诊断到决策的完整判断。

相比传统的城市生活成本计算器，这个项目更关注：

- 跳槽前后真实可支配收入是否提升
- 更高的年包是否被通勤、工时和生活成本抵消
- 用户最看重的 TOP 3 维度是否真的得到改善
- 一份 Offer 在什么条件下才真正成立

## 核心功能

### 1. 优先级排序
用户可以先对“薪资与存钱、身心健康、通勤与自由时间、居住条件、家庭负担、职业成长”等维度进行拖拽排序，系统会围绕 TOP 3 优先级输出后续诊断与结论。

### 2. 双 Offer 对比输入
支持分别输入跳槽前与跳槽后的城市、年薪、年终奖、公积金比例、租房/买房方式、通勤时间、工作时间、娱乐水平、家庭支出等信息，形成更贴近真实生活的对比基础。

### 3. 决策诊断层
系统会输出多层诊断结果，包括：

- 核心指标对比
- 月度收支拆解
- 时间与健康深挖
- 围绕优先级的差异解释
- 变化归因拆解

### 4. 决策推演层
除了静态比较，还支持进一步做“如果……会怎样”的判断，包括：

- 情景模拟
- 最低成立条件分析
- 风险预警
- 最终决策结论

### 5. 数据驱动 + 主观偏好结合
项目既关注税后收入、月结余、真实时薪等客观指标，也保留了对健康友好度、时间掌控感、职业成长性等主观体验的输入与解释，使结果更接近真实决策场景。

## 设计风格

项目整体采用更偏 **warm minimalism / monochrome premium dashboard** 的视觉语言，而不是传统高饱和 SaaS 仪表盘风格。

界面强调一种 **calm / analytical / editorial** 的决策支持氛围，通过：

- 大圆角与低对比阴影
- 浅暖底色与克制配色
- 分层卡片式信息组织
- 从 Hero、输入区、诊断区到决策区的递进式阅读路径

来强化“先理解，再判断”的使用体验。

## 可视化实现

当前版本的可视化主要由组件样式、信息卡片和轻量化自定义图形模块构成，而不是依赖重型图表库。

整体更强调信息层级、叙事节奏与决策阅读体验，而不是传统 dashboard 式的大量图表堆叠。

## 技术栈

- **前端框架**：Next.js
- **开发语言**：TypeScript
- **样式方案**：Tailwind CSS
- **核心计算**：自定义 `CostCalculator`
- **数据加载**：自定义 `CityDataLoader`
- **数据存储方式**：`public/city_data.csv`
- **部署方式**：Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发环境

```bash
npm run dev
```

启动后访问：

```bash
http://localhost:3000
```

## 项目结构

```bash
app/
  page.tsx                  # 主页面：优先级、对比、诊断、决策主流程

components/
  Header.tsx                # 顶部导航
  HomeHero.tsx              # Hero 区与首屏决策概览
  SmartWidgets.tsx          # 快速摘要、优先级快照、阈值提示
  PreferenceRanker.tsx      # 用户优先级拖拽排序
  MainInputs.tsx            # 双 Offer 基础输入
  LifestyleSettings.tsx     # 生活方式与主观体验输入
  OfferInsights.tsx         # 核心指标对比
  IncomeExpenseDetails.tsx  # 月度收支拆解
  DeltaWaterfall.tsx        # 变化归因拆解
  TimeHealthDrilldown.tsx   # 时间与健康分析
  PainPointComparisonTable.tsx # 围绕优先级的逐项解释
  ScenarioSimulator.tsx     # 情景模拟
  ThresholdAnalysis.tsx     # 最低成立条件
  RiskWarnings.tsx          # 风险预警
  FinalDecision.tsx         # 最终结论

utils/
  CityDataLoader.ts         # 城市数据加载
  CostCalculator.ts         # 核心决策计算模型

public/
  city_data.csv             # 城市成本与基础参数数据
```

## 数据维护

当前项目采用 `public/city_data.csv` 维护城市相关基础数据。

如果需要扩展更多城市，可以继续沿用这一方式，将新的城市生活成本、住房、交通、教育、医疗等数据补充到表格中，再由前端计算模型统一读取与处理。

## 适用场景

- 多地 Offer 对比
- 跳槽前后的收入与生活质量评估
- 将主观偏好纳入模型的职业决策场景
- AI 产品经理 / 交互设计 / 前端方向作品集展示

## 后续可扩展方向

- 接入真实岗位 JD / Offer 解析能力
- 增加城市软环境知识库
- 引入 AI 解释层，自动生成“为什么建议跳 / 不跳”的自然语言说明
- 支持分享式结果页与可视化报告导出
- 支持更多城市与更精细的数据维度

## 使用说明

这是一个更偏“决策系统”而不是“单点计算器”的项目。

它的目标不是只回答“哪个城市工资更高”，而是帮助用户回答：

> **这份 Offer 在我的真实生活条件下，到底值不值得跳？**

你可以根据自己的仓库地址、线上链接、License 和个人联系方式，继续补充 README 顶部信息与页脚说明。
