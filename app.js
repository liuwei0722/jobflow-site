const STORAGE_KEY = "jobflow_mvp_v1";
const THEME_STORAGE_KEY = "jobflow_theme_v1";
const LOCAL_MIGRATION_OWNER_KEY = "jobflow_local_migration_owner_v1";
const ASSET_DB_NAME = "jobflow_assets_v1";
const ASSET_STORE_NAME = "jd_images";
const CLOUD_STATE_TABLE = "user_states";
const CLOUD_ASSET_BUCKET = "jd-images";
const CLOUD_INTERVIEW_MEDIA_BUCKET = "interview-media-temp";
const CLOUD_AI_FUNCTION = "parse-progress";
const CLOUD_INTERVIEW_AI_FUNCTION = "analyze-interview";
const CLOUD_INTERVIEW_ASR_FUNCTION = "transcribe-interview";
const CLOUD_SYNC_DELAY = 500;
const CLOUD_OTP_RESEND_DELAY = 60;
const CLOUD_AI_TIMEOUT = 28000;
const CLOUD_INTERVIEW_AI_TIMEOUT = 48000;
const INTERVIEW_MEDIA_MAX_BYTES = 200 * 1024 * 1024;
const INTERVIEW_ASR_POLL_INTERVAL = 4000;
const INTERVIEW_ASR_TIMEOUT = 30 * 60 * 1000;

const STATUS = [
  { value: "wish", label: "想投", color: "#74788D", icon: "bookmark" },
  { value: "applied", label: "已投递", color: "#3478F6", icon: "send" },
  { value: "assessment", label: "测评", color: "#7357F6", icon: "file-check-2" },
  { value: "first", label: "一面", color: "#F2A900", icon: "messages-square" },
  { value: "second", label: "二面", color: "#F2A900", icon: "message-square-more" },
  { value: "final", label: "终面", color: "#F2A900", icon: "users-round" },
  { value: "offer", label: "Offer", color: "#16A36F", icon: "badge-check" },
  { value: "rejected", label: "已结束", color: "#EE5353", icon: "circle-x" },
  { value: "other", label: "其他", color: "#74788D", icon: "circle-ellipsis" },
];

const STATUS_MAP = Object.fromEntries(STATUS.map((item) => [item.value, item]));
const FUNNEL_STAGES = ["applied", "assessment", "first", "second", "final", "offer"];
const INTERVIEW_STAGES = new Set(["first", "second", "final"]);
const REVIEW_CATEGORIES = [
  { value: "personal", label: "个人信息", color: "#3478F6" },
  { value: "internship", label: "实习深挖", color: "#7357F6" },
  { value: "business", label: "业务提问", color: "#F2A900" },
  { value: "reverse", label: "反问环节", color: "#16A36F" },
  { value: "pending", label: "待确认", color: "#EE5353" },
];
const REVIEW_CATEGORY_MAP = Object.fromEntries(
  REVIEW_CATEGORIES.map((item) => [item.value, item]),
);
const OLD_STATUS_MAP = {
  written: "assessment",
  interview: "first",
  reject: "rejected",
  archive: "rejected",
};

const INDUSTRIES = [
  "互联网平台",
  "AI / 大模型",
  "电商 / 零售",
  "内容社区",
  "本地生活",
  "智能硬件",
  "金融 / 咨询",
  "其他",
];

const CHANNELS = ["官网", "Boss", "内推", "线下", "其他"];

const COMPANIES = [
  {
    name: "字节跳动",
    aliases: ["字节", "抖音", "豆包"],
    category: "互联网平台",
    stage: "open",
    url: "https://jobs.bytedance.com/campus",
    direction: "策略运营、产品运营、商业分析、数据分析",
    meta: ["北京 / 上海", "产品与运营", "全球化业务"],
    color: "#315efb",
  },
  {
    name: "腾讯",
    aliases: ["鹅厂"],
    category: "互联网平台",
    stage: "preheat",
    url: "https://join.qq.com/",
    direction: "产品策划、内容运营、用户研究、商业分析",
    meta: ["深圳 / 北京", "产品与市场", "内容生态"],
    color: "#0878d1",
  },
  {
    name: "阿里巴巴",
    aliases: ["阿里", "淘天", "淘宝", "天猫"],
    category: "电商 / 零售",
    stage: "preheat",
    url: "https://talent.alibaba.com/campus/home",
    direction: "平台运营、行业运营、用户增长、数据策略",
    meta: ["杭州 / 北京", "电商平台", "经营分析"],
    color: "#ff6a00",
  },
  {
    name: "美团",
    aliases: ["美团点评"],
    category: "本地生活",
    stage: "open",
    url: "https://zhaopin.meituan.com/web/campus",
    direction: "策略运营、商业分析、用户运营、供给运营",
    meta: ["北京 / 上海", "本地生活", "数据驱动"],
    color: "#d59a00",
  },
  {
    name: "百度",
    aliases: [],
    category: "AI / 大模型",
    stage: "open",
    url: "https://talent.baidu.com/jobs/list",
    direction: "AI 产品运营、策略分析、商业产品、用户增长",
    meta: ["北京", "AI 应用", "产品运营"],
    color: "#2932e1",
  },
  {
    name: "小红书",
    aliases: ["红书"],
    category: "内容社区",
    stage: "preheat",
    url: "https://campus.xiaohongshu.com/",
    direction: "社区运营、商业化运营、产品运营、内容策略",
    meta: ["上海 / 北京", "内容社区", "商业化"],
    color: "#e7334f",
  },
  {
    name: "京东",
    aliases: ["JD"],
    category: "电商 / 零售",
    stage: "open",
    url: "https://campus.jd.com/",
    direction: "采销运营、平台运营、经营分析、供应链策略",
    meta: ["北京", "零售电商", "供应链"],
    color: "#c9282d",
  },
  {
    name: "快手",
    aliases: [],
    category: "内容社区",
    stage: "preheat",
    url: "https://campus.kuaishou.cn/",
    direction: "内容运营、电商策略、用户增长、商业化分析",
    meta: ["北京 / 杭州", "短视频", "直播电商"],
    color: "#e65b34",
  },
  {
    name: "拼多多",
    aliases: ["PDD"],
    category: "电商 / 零售",
    stage: "open",
    url: "https://careers.pddglobalhr.com/campus/grad",
    direction: "运营管培、消费者运营、商业分析、平台招商",
    meta: ["上海", "电商平台", "运营管培"],
    color: "#b92d29",
  },
  {
    name: "哔哩哔哩",
    aliases: ["B站", "b站"],
    category: "内容社区",
    stage: "watch",
    url: "https://jobs.bilibili.com/campus/positions",
    direction: "内容运营、用户运营、商业化策略、产品运营",
    meta: ["上海", "内容生态", "年轻用户"],
    color: "#1688a8",
  },
  {
    name: "智谱 AI",
    aliases: ["智谱", "GLM"],
    category: "AI / 大模型",
    stage: "preheat",
    url: "https://www.zhipuai.cn/",
    direction: "AI 产品、增长运营、开发者生态、商业化",
    meta: ["北京", "大模型", "开发者生态"],
    color: "#3859dd",
  },
  {
    name: "MiniMax",
    aliases: ["minimax", "海螺"],
    category: "AI / 大模型",
    stage: "open",
    url: "https://vrfi1sk8a0.jobs.feishu.cn/379481/",
    direction: "AI 产品运营、内容增长、用户研究、国际化",
    meta: ["上海 / 北京", "多模态", "全球化"],
    color: "#c94f5e",
  },
  {
    name: "月之暗面",
    aliases: ["Kimi", "kimi"],
    category: "AI / 大模型",
    stage: "preheat",
    url: "https://careers.kimi.com/zh-cn",
    direction: "AI 产品、用户增长、开发者运营、商业分析",
    meta: ["北京 / 上海", "Kimi", "AI 应用"],
    color: "#24282b",
  },
  {
    name: "蚂蚁集团",
    aliases: ["蚂蚁", "支付宝"],
    category: "金融 / 咨询",
    stage: "open",
    url: "https://talent.antgroup.com/campus/home",
    direction: "策略运营、数字金融、商业分析、产品运营",
    meta: ["杭州 / 上海", "数字金融", "平台产品"],
    color: "#1677c8",
  },
  {
    name: "滴滴",
    aliases: [],
    category: "本地生活",
    stage: "open",
    url: "https://campus.didiglobal.com/",
    direction: "城市运营、策略运营、商业分析、用户增长",
    meta: ["北京 / 杭州", "出行平台", "经营策略"],
    color: "#d76910",
  },
  {
    name: "SHEIN",
    aliases: ["希音"],
    category: "电商 / 零售",
    stage: "preheat",
    url: "https://careers.shein.cn/campus",
    direction: "跨境运营、商品策略、用户增长、数据分析",
    meta: ["广州 / 南京", "跨境电商", "全球市场"],
    color: "#35393c",
  },
  {
    name: "小米",
    aliases: [],
    category: "智能硬件",
    stage: "open",
    url: "https://hr.xiaomi.com/campus",
    direction: "产品运营、新零售运营、用户研究、商业分析",
    meta: ["北京 / 武汉", "人车家", "消费电子"],
    color: "#d85c00",
  },
  {
    name: "理想汽车",
    aliases: ["理想"],
    category: "智能硬件",
    stage: "open",
    url: "https://lixiang.jobs.feishu.cn/",
    direction: "用户运营、产品运营、商业分析、销售策略",
    meta: ["北京 / 上海", "智能汽车", "用户运营"],
    color: "#177f77",
  },
];

const ROLE_KEYWORDS = [
  "AI 策略运营",
  "AI策略运营",
  "AI 产品运营",
  "AI产品运营",
  "商业化运营",
  "消费者运营",
  "开发者运营",
  "供应链策略",
  "商业分析",
  "经营分析",
  "策略运营",
  "产品运营",
  "平台运营",
  "用户运营",
  "内容运营",
  "增长运营",
  "行业运营",
  "城市运营",
  "社区运营",
  "数据分析",
  "产品经理",
  "产品策划",
  "运营管培",
  "管培生",
  "市场运营",
  "品牌运营",
  "采销运营",
];

const VIEW_META = {
  dashboard: { eyebrow: "求职行动中心", title: "总览" },
  funnel: { eyebrow: "阶段转化分析", title: "漏斗" },
  applications: { eyebrow: "全流程管理", title: "投递管理" },
  reviews: { eyebrow: "面试经验沉淀", title: "面试复盘" },
  fairs: { eyebrow: "招聘活动日程", title: "双选会" },
  companies: { eyebrow: "目标公司库", title: "公司导航" },
};

let currentView = "dashboard";
let reminderFilter = "assessment";
let interviewReviewFilter = "all";
let companyCategory = "全部";
let specialFilter = "";
let confirmCallback = null;
let toastTimer = null;
let captureDraft = null;
let editingApplicationId = "";
let expandedApplicationId = "";
let pendingJdImages = [];
let capturePendingJdImages = [];
let quickCaptureImage = null;
let quickOcrBusy = false;
let quickAiBusy = false;
let interviewReviewDraft = null;
let selectedInterviewMedia = null;
let activeInterviewTranscription = null;
const expandedReviewQuestionIds = new Set();
let assetDbPromise = null;
let calendarWeekOffset = 0;
let notificationTimer = null;
let notificationWorkerPromise = null;
let notificationCheckInFlight = false;
let supabaseClient = null;
let cloudUser = null;
let isGuest = true;
let cloudSyncReady = false;
let cloudSyncTimer = null;
let cloudMutationVersion = 0;
let cloudSyncInFlight = false;
let cloudSessionLoadingId = "";
let cloudSessionVersion = 0;
let cloudAuthReady = false;
let cloudReturnRoute = "";
let cloudStatus = "local";
let cloudStatusMessage = "";
let cloudOtpPending = false;
let cloudOtpEmail = "";
let cloudOtpResendAt = 0;
let cloudOtpResendTimer = null;

function dateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function timestampOffset(days, hours = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function today() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeStatus(value) {
  const mapped = OLD_STATUS_MAP[value] || value;
  return STATUS_MAP[mapped] ? mapped : "other";
}

function normalizeChannel(value) {
  const channel = String(value || "").trim();
  if (/^boss(?:直聘)?$/i.test(channel)) return "Boss";
  return CHANNELS.includes(channel) ? channel : "其他";
}

function normalizeInterviewReview(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const questions = Array.isArray(value.questions)
    ? value.questions
        .map((item) => ({
          id: item?.id || makeId(),
          category: REVIEW_CATEGORY_MAP[item?.category] ? item.category : "pending",
          question: String(item?.question || "").trim(),
          originalText: String(item?.originalText || item?.question || "").trim(),
          followUps: Array.isArray(item?.followUps)
            ? item.followUps.map((entry) => String(entry || "").trim()).filter(Boolean)
            : [],
          confidence: Math.max(0, Math.min(1, Number(item?.confidence) || 0)),
        }))
        .filter((item) => item.question)
    : [];
  return {
    status: value.status === "completed" ? "completed" : "reviewing",
    transcript: String(value.transcript || "").trim(),
    questions,
    summary: String(value.summary || "").trim(),
    analysisSource: value.analysisSource === "ai" ? "ai" : "local",
    model: String(value.model || "").trim(),
    sourceFileName: String(value.sourceFileName || "").trim(),
    sourceMimeType: String(value.sourceMimeType || "").trim(),
    createdAt: value.createdAt || new Date().toISOString(),
    updatedAt: value.updatedAt || value.createdAt || new Date().toISOString(),
  };
}

function createProgress(
  stage,
  eventDate,
  note = "",
  recordedAt = new Date().toISOString(),
  source = "manual",
  details = {},
) {
  return {
    id: makeId(),
    stage: normalizeStatus(stage),
    eventDate: eventDate || today(),
    recordedAt,
    note: String(note || "").trim(),
    source,
    scheduledAt: details.scheduledAt || "",
    endedAt: details.endedAt || "",
    review: String(details.review || "").trim(),
    interviewReview: normalizeInterviewReview(details.interviewReview),
  };
}

function progressSort(a, b) {
  const dateCompare = String(a.eventDate || "").localeCompare(String(b.eventDate || ""));
  if (dateCompare !== 0) return dateCompare;
  return String(a.recordedAt || "").localeCompare(String(b.recordedAt || ""));
}

function getProgress(application) {
  return Array.isArray(application.progress)
    ? [...application.progress].sort(progressSort)
    : [];
}

function getLatestProgress(application) {
  const items = getProgress(application);
  return items[items.length - 1] || null;
}

function syncApplicationFromProgress(application) {
  application.progress = getProgress(application);
  const latest = getLatestProgress(application);
  application.status = latest ? normalizeStatus(latest.stage) : "wish";
  if (!application.appliedDate) {
    const applied = application.progress.find((item) => item.stage === "applied");
    if (applied) application.appliedDate = applied.eventDate;
  }
  return application;
}

function normalizeApplication(application) {
  const normalizedStatus = normalizeStatus(application.status || "wish");
  const updatedAt = application.updatedAt || application.createdAt || new Date().toISOString();
  const progress = Array.isArray(application.progress)
    ? application.progress.map((item) => ({
        id: item.id || makeId(),
        stage: normalizeStatus(item.stage || item.status),
        eventDate: item.eventDate || item.date || String(updatedAt).slice(0, 10) || today(),
        recordedAt: item.recordedAt || item.createdAt || updatedAt,
        note: String(item.note || item.notes || "").trim(),
        source: item.source || "manual",
        scheduledAt: item.scheduledAt || item.startAt || item.deadlineAt || "",
        endedAt: item.endedAt || item.endAt || "",
        review: String(item.review || item.evaluation || "").trim(),
        interviewReview: normalizeInterviewReview(item.interviewReview),
      }))
    : [
        createProgress(
          normalizedStatus,
          application.appliedDate || String(updatedAt).slice(0, 10) || today(),
          "由旧版当前状态迁移",
          updatedAt,
          "migration",
        ),
      ];

  return syncApplicationFromProgress({
    id: application.id || makeId(),
    company: String(application.company || "").trim(),
    department: String(application.department || "").trim(),
    role: String(application.role || application.position || "待确认岗位").trim(),
    industry: INDUSTRIES.includes(application.industry) ? application.industry : "其他",
    channel: normalizeChannel(application.channel),
    city: String(application.city || "").trim(),
    status: normalizedStatus,
    appliedDate: application.appliedDate || "",
    nextActionDate: application.nextActionDate || "",
    link: application.link || "",
    notes: String(application.notes || "").trim(),
    jdCount: Number(application.jdCount) || 0,
    progress,
    createdAt: application.createdAt || updatedAt,
    updatedAt,
  });
}

function migrateState(raw) {
  const applications = Array.isArray(raw.applications)
    ? raw.applications.map(normalizeApplication)
    : [];
  return {
    version: 6,
    account: raw.account && typeof raw.account === "object" ? raw.account : { email: "" },
    settings: {
      interviewNotifications: Boolean(raw.settings?.interviewNotifications),
      notificationHistory: Array.isArray(raw.settings?.notificationHistory)
        ? raw.settings.notificationHistory.slice(-100)
        : [],
    },
    applications,
    fairPlans:
      raw.fairPlans && typeof raw.fairPlans === "object" && !Array.isArray(raw.fairPlans)
        ? raw.fairPlans
        : {},
    legacyEvents: Array.isArray(raw.legacyEvents)
      ? raw.legacyEvents
      : Array.isArray(raw.events)
        ? raw.events
        : [],
  };
}

function makeDemoApplication(config) {
  const progress = config.progress.map(([stage, days, note, recordHours = 0, details = {}]) =>
    createProgress(
      stage,
      dateOffset(days),
      note,
      timestampOffset(days, recordHours),
      "demo",
      details,
    ),
  );
  const applied = progress.find((item) => item.stage === "applied");
  return syncApplicationFromProgress({
    id: makeId(),
    company: config.company,
    department: config.department || "",
    role: config.role,
    industry: config.industry,
    channel: config.channel,
    city: config.city,
    status: progress[progress.length - 1].stage,
    appliedDate: applied ? applied.eventDate : "",
    nextActionDate: config.nextActionDate || "",
    link: config.link,
    notes: config.notes || "",
    jdCount: 0,
    progress,
    createdAt: progress[0].recordedAt,
    updatedAt: progress[progress.length - 1].recordedAt,
  });
}

function buildDemoState() {
  return {
    version: 6,
    account: { email: "" },
    settings: {
      interviewNotifications: false,
      notificationHistory: [],
    },
    legacyEvents: [],
    fairPlans: {},
    applications: [
      makeDemoApplication({
        company: "字节跳动",
        department: "商业化部门",
        role: "AI 策略运营",
        industry: "互联网平台",
        channel: "内推",
        city: "北京",
        nextActionDate: dateOffset(1),
        link: "https://jobs.bytedance.com/campus",
        notes: "准备业务分析案例与产品拆解",
        progress: [
          ["applied", -16, "通过内推完成投递"],
          ["assessment", -11, "收到在线测评"],
          ["first", -4, "一面通过，重点追问策略归因"],
          ["second", -1, "进入二面，下周准备案例分析"],
        ],
      }),
      makeDemoApplication({
        company: "美团",
        department: "到店事业群",
        role: "商业分析",
        industry: "本地生活",
        channel: "官网",
        city: "北京",
        nextActionDate: dateOffset(-1),
        link: "https://zhaopin.meituan.com/web/campus",
        notes: "整理本地生活行业框架",
        progress: [
          ["applied", -12, "官网投递"],
          ["assessment", -3, "收到测评，要求三天内完成"],
        ],
      }),
      makeDemoApplication({
        company: "腾讯",
        department: "PCG",
        role: "产品运营",
        industry: "互联网平台",
        channel: "内推",
        city: "深圳",
        nextActionDate: dateOffset(-2),
        link: "https://join.qq.com/",
        notes: "关注内容生态与 AI 产品方向",
        progress: [["applied", -9, "内推投递"]],
      }),
      makeDemoApplication({
        company: "蚂蚁集团",
        department: "",
        role: "策略运营",
        industry: "金融 / 咨询",
        channel: "官网",
        city: "杭州",
        nextActionDate: dateOffset(5),
        link: "https://talent.antgroup.com/campus/home",
        notes: "完善支付业务案例后投递",
        progress: [["wish", -5, "加入目标公司"]],
      }),
      makeDemoApplication({
        company: "小红书",
        department: "商业化事业部",
        role: "商业化运营",
        industry: "内容社区",
        channel: "官网",
        city: "上海",
        nextActionDate: dateOffset(0),
        link: "https://campus.xiaohongshu.com/",
        notes: "准备社区商业化和内容供给分析",
        progress: [
          ["applied", -18, "官网投递"],
          [
            "first",
            -2,
            "完成一面，待记录复盘",
            0,
            {
              scheduledAt: `${dateOffset(-2)}T14:00`,
              endedAt: `${dateOffset(-2)}T15:00`,
            },
          ],
        ],
      }),
      makeDemoApplication({
        company: "月之暗面",
        department: "用户增长团队",
        role: "用户增长运营",
        industry: "AI / 大模型",
        channel: "官网",
        city: "北京",
        nextActionDate: dateOffset(3),
        link: "https://careers.kimi.com/zh-cn",
        notes: "补充 AI 产品使用与增长策略分析",
        progress: [["applied", -4, "官网投递"]],
      }),
      makeDemoApplication({
        company: "京东",
        department: "零售业务",
        role: "平台运营",
        industry: "电商 / 零售",
        channel: "其他",
        city: "北京",
        link: "https://campus.jd.com/",
        notes: "复盘岗位匹配与案例表达",
        progress: [
          ["applied", -24, "转正流程"],
          ["rejected", -8, "流程结束"],
        ],
      }),
      makeDemoApplication({
        company: "百度",
        department: "文心产品部",
        role: "AI 产品运营",
        industry: "AI / 大模型",
        channel: "内推",
        city: "北京",
        link: "https://talent.baidu.com/jobs/list",
        notes: "等待意向沟通",
        progress: [
          ["applied", -31, "内推投递"],
          ["assessment", -26, "完成测评"],
          ["first", -20, "一面通过"],
          ["second", -14, "二面通过"],
          ["final", -7, "完成终面"],
          ["offer", -1, "收到录用意向", -3],
        ],
      }),
    ],
  };
}

function buildEmptyState(email = "") {
  return {
    version: 6,
    account: { email },
    settings: {
      interviewNotifications: false,
      notificationHistory: [],
    },
    legacyEvents: [],
    applications: [],
    fairPlans: {},
  };
}

function loadState(storageKey = STORAGE_KEY, fallback = null) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (parsed && Array.isArray(parsed.applications)) {
      const migrated = migrateState(parsed);
      localStorage.setItem(storageKey, JSON.stringify(migrated));
      return migrated;
    }
  } catch (error) {
    console.warn("Local data could not be read.", error);
  }
  const initial = fallback ? migrateState(fallback) : buildEmptyState();
  localStorage.setItem(storageKey, JSON.stringify(initial));
  return initial;
}

// Guest examples stay in memory and never become a local migration source.
const mockData = buildDemoState();
mockData.applications[0].progress.push(createProgress(
  "second", today(), "示例：准备业务分析案例", new Date().toISOString(), "demo",
  { scheduledAt: `${dateOffset(1)}T14:00`, endedAt: `${dateOffset(1)}T15:00` },
));
syncApplicationFromProgress(mockData.applications[0]);
let state = buildGuestState();

function buildGuestState() {
  return migrateState(JSON.parse(JSON.stringify(mockData)));
}

function cloudStateStorageKey(userId = cloudUser?.id) {
  return userId ? `${STORAGE_KEY}:cloud:${userId}` : STORAGE_KEY;
}

function cloudPendingStorageKey(userId = cloudUser?.id) {
  return `${cloudStateStorageKey(userId)}:pending`;
}

function saveState() {
  if (isGuest) return;
  state.version = 6;
  if (cloudUser?.email) state.account = { email: cloudUser.email };
  localStorage.setItem(cloudStateStorageKey(), JSON.stringify(state));
  if (cloudUser && cloudSyncReady) {
    localStorage.setItem(cloudPendingStorageKey(), new Date().toISOString());
    cloudMutationVersion += 1;
    queueCloudStateSync();
  }
}

function getCloudConfig() {
  const config = window.JOBFLOW_CLOUD_CONFIG || {};
  const url = String(config.url || "").trim();
  const key = String(config.publishableKey || "").trim();
  const configured =
    /^https:\/\/.+\.supabase\.co$/i.test(url) &&
    key.startsWith("sb_publishable_") && key.length > 20 &&
    !url.includes("YOUR_") &&
    !key.includes("YOUR_");
  return { url, key, configured };
}

function setCloudStatus(status, message = "") {
  cloudStatus = status;
  cloudStatusMessage = message;
  if (document.readyState !== "loading") {
    renderAccount();
    renderAuthGate();
  }
}

function serializableCloudState() {
  const snapshot = JSON.parse(JSON.stringify(state));
  snapshot.version = 6;
  snapshot.account = { email: cloudUser?.email || "" };
  return snapshot;
}

function queueCloudStateSync() {
  if (!supabaseClient || !cloudUser || !cloudSyncReady) return;
  window.clearTimeout(cloudSyncTimer);
  setCloudStatus("pending");
  cloudSyncTimer = window.setTimeout(() => {
    uploadCloudState();
  }, CLOUD_SYNC_DELAY);
}

async function uploadCloudState() {
  if (!supabaseClient || !cloudUser || !cloudSyncReady) return false;
  if (cloudSyncInFlight) {
    queueCloudStateSync();
    return false;
  }
  window.clearTimeout(cloudSyncTimer);
  const revision = cloudMutationVersion;
  const userId = cloudUser.id;
  const sessionVersion = cloudSessionVersion;
  const pendingKey = cloudPendingStorageKey(userId);
  const snapshot = serializableCloudState();
  cloudSyncInFlight = true;
  setCloudStatus("syncing");
  try {
    const { error } = await supabaseClient.from(CLOUD_STATE_TABLE).upsert(
      {
        user_id: userId,
        state: snapshot,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    if (sessionVersion !== cloudSessionVersion) return false;
    if (revision === cloudMutationVersion) {
      localStorage.removeItem(pendingKey);
    }
    setCloudStatus("synced");
    return true;
  } catch (error) {
    if (sessionVersion !== cloudSessionVersion) return false;
    console.error("Cloud state sync failed.", error);
    setCloudStatus("error", error.message || "云端同步失败");
    return false;
  } finally {
    cloudSyncInFlight = false;
    if (revision !== cloudMutationVersion) queueCloudStateSync();
  }
}

async function loadCloudStateForUser(user, previousState, sessionVersion) {
  cloudSyncReady = false;
  setCloudStatus("loading");
  const storageKey = cloudStateStorageKey(user.id);
  const hadCachedState = Boolean(localStorage.getItem(storageKey));
  let migrationOwner = localStorage.getItem(LOCAL_MIGRATION_OWNER_KEY);
  if (!migrationOwner) {
    migrationOwner = user.id;
    localStorage.setItem(LOCAL_MIGRATION_OWNER_KEY, user.id);
  }
  const canMigrateLocalState = migrationOwner === user.id;
  const initialState = canMigrateLocalState
    ? previousState
    : buildEmptyState(user.email || "");
  state = loadState(storageKey, initialState);
  const cachedState = state;
  const pendingAt = localStorage.getItem(cloudPendingStorageKey(user.id)) || "";
  state.account = { email: user.email || "" };
  renderAll();

  try {
    const { data, error } = await supabaseClient
      .from(CLOUD_STATE_TABLE)
      .select("state, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (sessionVersion !== cloudSessionVersion) return false;

    if (data?.state && Array.isArray(data.state.applications)) {
      if (pendingAt && pendingAt > String(data.updated_at || "")) {
        state = migrateState(cachedState);
        state.account = { email: user.email || "" };
        cloudSyncReady = true;
        await uploadCloudState();
      } else {
        state = migrateState(data.state);
        state.account = { email: user.email || "" };
        localStorage.setItem(storageKey, JSON.stringify(state));
        localStorage.removeItem(cloudPendingStorageKey(user.id));
        cloudSyncReady = true;
        setCloudStatus("synced");
      }
    } else {
      state = migrateState(
        hadCachedState && pendingAt
          ? cachedState
          : canMigrateLocalState
            ? previousState
            : buildEmptyState(user.email || ""),
      );
      state.account = { email: user.email || "" };
      localStorage.setItem(storageKey, JSON.stringify(state));
      cloudSyncReady = true;
      await uploadCloudState();
      if (sessionVersion !== cloudSessionVersion) return false;
      if (!hadCachedState && canMigrateLocalState) {
        await migrateLocalAssetsToCloud(state.applications);
      }
    }
    if (sessionVersion !== cloudSessionVersion) return false;
    renderAll();
    return true;
  } catch (error) {
    console.error("Cloud state loading failed.", error);
    if (sessionVersion !== cloudSessionVersion) return false;
    cloudSyncReady = true;
    setCloudStatus("error", error.message || "暂时无法读取云端数据");
    renderAll();
    return false;
  }
}

async function handleCloudSession(session, eventName = "") {
  let user = session?.user || null;
  if (!user) {
    cloudSessionVersion += 1;
    cloudAuthReady = true;
    const hadUser = Boolean(cloudUser);
    cloudSessionLoadingId = "";
    cloudUser = null;
    isGuest = true;
    cloudSyncReady = false;
    window.clearTimeout(cloudSyncTimer);
    if (hadUser) {
      closeWorkspaceDialogs();
      document.getElementById("accountEmailInput").value = "";
    }
    setCloudStatus(supabaseClient ? "signed-out" : "local");
    state = buildGuestState();
    window.resetFairSession?.();
    renderAll();
    if (hadUser) {
      closeDialog("accountDialog");
      window.history.replaceState(null, "", `#${cloudReturnRoute || currentView}`);
    }
    resolveCloudRoute();
    return;
  }
  if (
    cloudUser?.id === user.id &&
    (cloudSyncReady || cloudSessionLoadingId === user.id)
  ) {
    cloudUser = user;
    cloudAuthReady = true;
    resolveCloudRoute();
    return;
  }
  const sessionVersion = ++cloudSessionVersion;
  cloudAuthReady = false;
  cloudSyncReady = false;
  window.clearTimeout(cloudSyncTimer);
  if (cloudUser) {
    closeWorkspaceDialogs();
    cloudUser = null;
    isGuest = true;
    state = buildGuestState();
    window.resetFairSession?.();
    renderAll();
  }
  setCloudStatus("loading", "正在验证登录状态");
  // Resolve cached sessions with Auth before rendering a private workspace.
  let result;
  try {
    result = await supabaseClient.auth.getUser(session.access_token);
  } catch (error) {
    result = { error };
  }
  const { data, error } = result;
  if (sessionVersion !== cloudSessionVersion) return;
  cloudAuthReady = true;
  if (error || !data?.user || data.user.id !== user.id) {
    await handleCloudSession(null, "SIGNED_OUT");
    setCloudStatus("error", "登录状态已失效或暂时无法验证，请重新登录");
    return;
  }
  user = data.user;
  clearCloudOtpState();
  const previousState = loadState();
  closeWorkspaceDialogs();
  cloudUser = user;
  isGuest = false;
  window.resetFairSession?.();
  cloudSessionLoadingId = user.id;
  await loadCloudStateForUser(user, previousState, sessionVersion);
  if (sessionVersion !== cloudSessionVersion) return;
  if (cloudSessionLoadingId === user.id) cloudSessionLoadingId = "";
  resolveCloudRoute();
  if (eventName === "SIGNED_IN") showToast("登录成功，已切换到你的云端数据");
}

function closeWorkspaceDialogs() {
  cleanupInterviewTranscription();
  document.querySelectorAll("dialog[open]").forEach((dialog) => {
    if (dialog.id !== "accountDialog") dialog.close();
  });
  document.getElementById("imageLightbox").hidden = true;
  pendingJdImages = [];
  capturePendingJdImages = [];
  captureDraft = null;
  quickCaptureImage = null;
  quickOcrBusy = false;
  quickAiBusy = false;
  document.getElementById("quickCaptureInput").value = "";
  document.getElementById("quickImagePreview").hidden = true;
  interviewReviewDraft = null;
  selectedInterviewMedia = null;
  closeConfirm();
}

function hasWorkspaceAccess() {
  return !isGuest && cloudAuthReady && Boolean(cloudUser) && cloudSyncReady;
}

function canBrowseWorkspace() {
  return isGuest || hasWorkspaceAccess();
}

// Call immediately before committing a draft, changing business data or uploading.
function checkGuestPermission() {
  if (isGuest) {
    const message = "当前为演示模式，登录后即可修改数据";
    showToast(message);
    // Native modal dialogs cover the global toast. Reuse their existing copy and button.
    const dialog = [...document.querySelectorAll("dialog[open]")].pop();
    const hint = dialog?.querySelector?.(".modal-header .eyebrow");
    const login = dialog?.querySelector?.(".modal-footer [data-close-dialog]");
    for (const [element, text] of [[hint, message], [login, "去登录"]]) {
      if (!element) continue;
      if (!Object.hasOwn(element.dataset, "guestOriginalText")) {
        element.dataset.guestOriginalText = element.textContent;
      }
      element.textContent = text;
    }
    if (login) login.dataset.guestLogin = "true";
    return false;
  }
  if (!hasWorkspaceAccess()) {
    showToast("工作区正在加载，请稍后重试");
    return false;
  }
  return true;
}

function resetGuestPermissionPrompt(dialog) {
  dialog?.querySelectorAll?.("[data-guest-original-text]").forEach((element) => {
    element.textContent = element.dataset.guestOriginalText;
    delete element.dataset.guestOriginalText;
    delete element.dataset.guestLogin;
  });
}

function renderAuthGate() {
  const authorized = canBrowseWorkspace();
  document.querySelector(".app-shell").hidden = !authorized;
  document.querySelector(".mobile-nav").hidden = !authorized;
  document.getElementById("authGate").hidden = authorized;
  document.getElementById("guestBanner").hidden = !isGuest;
  if (!authorized) document.getElementById("fairCompareBar").hidden = true;
  document.getElementById("authGateMessage").textContent =
    !cloudAuthReady || cloudStatus === "loading"
      ? "正在验证登录状态并读取工作区。"
      : cloudStatus === "unconfigured"
        ? "暂时无法连接登录服务，请稍后刷新重试。"
        : "登录后访问你的投递、日历和面试复盘。";
}

function resolveCloudRoute() {
  const route = window.location.hash.slice(1);
  renderAuthGate();
  if (isGuest) {
    if (route === "login" || route === "cloud") {
      if (!cloudReturnRoute) cloudReturnRoute = currentView;
      renderAccount();
      openDialog("accountDialog");
    } else {
      switchView(VIEW_META[route] ? route : "dashboard");
    }
    return;
  }
  if (!cloudAuthReady) {
    if (VIEW_META[route] || route === "cloud") cloudReturnRoute = route;
    return;
  }
  if (!cloudUser) {
    if (VIEW_META[route] || route === "cloud") cloudReturnRoute = route;
    window.history.replaceState(null, "", "#login");
    renderAccount();
    openDialog("accountDialog");
    return;
  }
  if (!cloudSyncReady) return;
  if (route === "login") {
    const destination = cloudReturnRoute || "dashboard";
    cloudReturnRoute = "";
    navigateRoute(destination);
    return;
  }
  if (route !== "cloud") {
    switchView(VIEW_META[route] ? route : "dashboard");
    return;
  }
  renderAccount();
  openDialog("accountDialog");
}

function navigateRoute(route) {
  const destination = route === "cloud" || route === "login" || VIEW_META[route]
    ? route : "dashboard";
  window.history.replaceState(null, "", `#${destination}`);
  resolveCloudRoute();
}

function cloudRedirectUrl() {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  return url.href;
}

function cloudAuthErrorMessage(error, fallback) {
  const message = String(error?.message || "");
  const code = String(error?.code || "");
  const cooldownMatch = message.match(/after\s+(\d+)\s+seconds?/i);
  if (cooldownMatch) return `请求过于频繁，请 ${cooldownMatch[1]} 秒后再试`;
  if (
    code === "over_email_send_rate_limit" ||
    /email rate limit exceeded/i.test(message)
  ) {
    return "邮件发送额度已用完，请稍后再试";
  }
  if (/rate limit exceeded|too many requests/i.test(message)) {
    return "请求过于频繁，请稍后再试";
  }
  if (/token.*expired|expired.*token|invalid.*token|token.*invalid/i.test(message)) {
    return "验证码无效或已过期，请重新发送";
  }
  return message || fallback;
}

function updateCloudOtpResendButton() {
  const button = document.getElementById("accountResendButton");
  if (!button) return;
  const seconds = Math.max(0, Math.ceil((cloudOtpResendAt - Date.now()) / 1000));
  button.textContent = seconds > 0 ? `${seconds} 秒后重发` : "重新发送验证码";
  button.disabled =
    seconds > 0 || ["sending", "verifying"].includes(cloudStatus);
  if (seconds === 0 && cloudOtpResendTimer) {
    window.clearInterval(cloudOtpResendTimer);
    cloudOtpResendTimer = null;
  }
}

function startCloudOtpCooldown() {
  window.clearInterval(cloudOtpResendTimer);
  cloudOtpResendAt = Date.now() + CLOUD_OTP_RESEND_DELAY * 1000;
  updateCloudOtpResendButton();
  cloudOtpResendTimer = window.setInterval(updateCloudOtpResendButton, 1000);
}

function clearCloudOtpState() {
  cloudOtpPending = false;
  cloudOtpEmail = "";
  cloudOtpResendAt = 0;
  window.clearInterval(cloudOtpResendTimer);
  cloudOtpResendTimer = null;
  const otpInput = document.getElementById("accountOtpInput");
  if (otpInput) otpInput.value = "";
  updateCloudOtpResendButton();
}

async function sendCloudLoginCode(email) {
  if (!supabaseClient) {
    showToast("请先完成 Supabase 云端配置");
    return false;
  }
  setCloudStatus("sending");
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: cloudRedirectUrl(),
      shouldCreateUser: true,
    },
  });
  if (error) {
    const message = cloudAuthErrorMessage(error, "验证码发送失败");
    setCloudStatus("error", message);
    showToast(message);
    return false;
  }
  cloudOtpEmail = email;
  cloudOtpPending = true;
  setCloudStatus("code-sent", `验证码已发送至 ${email}`);
  startCloudOtpCooldown();
  window.setTimeout(() => document.getElementById("accountOtpInput")?.focus(), 0);
  return true;
}

async function verifyCloudLoginCode(email, token) {
  if (!supabaseClient) return false;
  setCloudStatus("verifying");
  const { data, error } = await supabaseClient.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error || !data.session) {
    const message = cloudAuthErrorMessage(error, "验证码验证失败");
    setCloudStatus("error", message);
    showToast(message);
    return false;
  }
  clearCloudOtpState();
  await handleCloudSession(data.session, "SIGNED_IN");
  if (!cloudUser) return false;
  resolveCloudRoute();
  return true;
}

async function signOutCloudAccount() {
  if (!supabaseClient || !cloudUser) return;
  setCloudStatus("syncing", "正在退出");
  if (cloudSyncReady && localStorage.getItem(cloudPendingStorageKey())) {
    await uploadCloudState();
  }
  const { error } = await supabaseClient.auth.signOut({ scope: "local" });
  if (error) {
    setCloudStatus("error", error.message);
    showToast(error.message || "退出失败");
    return;
  }
  clearCloudOtpState();
  await handleCloudSession(null, "SIGNED_OUT");
  showToast("已退出登录，正在展示示例数据");
}

async function clearCurrentCloudWorkspace() {
  if (!checkGuestPermission()) return;
  if (!cloudUser || !cloudSyncReady) return;
  const sessionVersion = cloudSessionVersion;
  const applicationIds = state.applications.map((application) => application.id);
  setCloudStatus("syncing", "正在清空当前账户");
  try {
    if (typeof window.clearFairPlans === "function") {
      await window.clearFairPlans();
    }
    if (sessionVersion !== cloudSessionVersion) return;
    await clearAssetDb(applicationIds);
    if (sessionVersion !== cloudSessionVersion) return;
    state = buildEmptyState(cloudUser.email || "");
    saveState();
    await uploadCloudState();
    if (sessionVersion !== cloudSessionVersion) return;
    closeConfirm();
    closeDialog("dataDialog");
    clearApplicationFilters();
    switchView("dashboard");
    renderAll();
    showToast("当前邮箱的云端工作区已清空");
  } catch (error) {
    console.error("Cloud workspace clearing failed.", error);
    setCloudStatus("error", error.message || "清空云端工作区失败");
    closeConfirm();
    showToast(error.message || "清空云端工作区失败");
  }
}

async function initializeCloudSync() {
  const config = getCloudConfig();
  if (!config.configured || !window.supabase?.createClient) {
    cloudAuthReady = true;
    setCloudStatus("unconfigured");
    resolveCloudRoute();
    return;
  }
  supabaseClient = window.supabase.createClient(config.url, config.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  supabaseClient.auth.onAuthStateChange((eventName, session) => {
    window.setTimeout(() => handleCloudSession(session, eventName), 0);
  });
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    cloudAuthReady = true;
    setCloudStatus("error", error.message);
    resolveCloudRoute();
    return;
  }
  await handleCloudSession(data.session, "INITIAL_SESSION");
}

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function renderThemeToggle() {
  const button = document.getElementById("themeToggle");
  const icon = document.getElementById("themeToggleIcon");
  if (!button || !icon) return;
  const isDark = getPreferredTheme() === "dark";
  const label = isDark ? "切换为浅色模式" : "切换为深色模式";
  button.setAttribute("aria-checked", String(isDark));
  button.setAttribute("aria-label", label);
  button.title = label;
  icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
  refreshIcons();
}

function applyTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    document.documentElement.dataset.theme = stored;
  } else {
    delete document.documentElement.dataset.theme;
  }
  renderThemeToggle();
}

function toggleTheme() {
  const nextTheme = getPreferredTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme();
}

function openAssetDb() {
  if (assetDbPromise) return assetDbPromise;
  assetDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(ASSET_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return assetDbPromise;
}

async function getLocalJdImages(applicationId) {
  if (!applicationId) return [];
  const db = await openAssetDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(ASSET_STORE_NAME, "readonly");
    const request = transaction.objectStore(ASSET_STORE_NAME).get(applicationId);
    request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
    request.onerror = () => reject(request.error);
  });
}

async function putLocalJdImages(applicationId, images) {
  if (!applicationId) return;
  const db = await openAssetDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(ASSET_STORE_NAME, "readwrite");
    const store = transaction.objectStore(ASSET_STORE_NAME);
    if (images.length) store.put(images, applicationId);
    else store.delete(applicationId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearLocalAssetDb() {
  const db = await openAssetDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(ASSET_STORE_NAME, "readwrite");
    transaction.objectStore(ASSET_STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function cloudAssetFolder(applicationId) {
  return `${cloudUser.id}/${applicationId}`;
}

async function listCloudJdFiles(applicationId) {
  if (!supabaseClient || !cloudUser || !applicationId) return [];
  const folder = cloudAssetFolder(applicationId);
  const { data, error } = await supabaseClient.storage
    .from(CLOUD_ASSET_BUCKET)
    .list(folder, { limit: 100, sortBy: { column: "created_at", order: "asc" } });
  if (error) throw error;
  return (data || [])
    .filter((file) => file.name && file.name !== ".emptyFolderPlaceholder")
    .map((file) => ({ ...file, path: `${folder}/${file.name}` }));
}

async function getCloudJdImages(applicationId) {
  const files = await listCloudJdFiles(applicationId);
  return Promise.all(
    files.map(async (file) => {
      const { data, error } = await supabaseClient.storage
        .from(CLOUD_ASSET_BUCKET)
        .createSignedUrl(file.path, 3600);
      if (error) throw error;
      const metadata = file.metadata || {};
      return {
        id: file.name.replace(/\.[^.]+$/, ""),
        name: metadata.originalName || metadata.original_name || "JD 截图",
        type: metadata.mimetype || "image/jpeg",
        dataUrl: data.signedUrl,
        remotePath: file.path,
        createdAt: file.created_at || new Date().toISOString(),
      };
    }),
  );
}

function imageExtension(type) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error("图片数据读取失败");
  return response.blob();
}

async function putCloudJdImages(applicationId, images) {
  const sessionVersion = cloudSessionVersion;
  const folder = cloudAssetFolder(applicationId);
  const currentFiles = await listCloudJdFiles(applicationId);
  if (sessionVersion !== cloudSessionVersion) return;
  const desiredIds = new Set(images.map((image) => image.id));
  const removePaths = currentFiles
    .filter((file) => !desiredIds.has(file.name.replace(/\.[^.]+$/, "")))
    .map((file) => file.path);
  if (removePaths.length) {
    const { error } = await supabaseClient.storage
      .from(CLOUD_ASSET_BUCKET)
      .remove(removePaths);
    if (error) throw error;
  }

  const currentIds = new Set(
    currentFiles.map((file) => file.name.replace(/\.[^.]+$/, "")),
  );
  for (const image of images) {
    if (sessionVersion !== cloudSessionVersion) return;
    if (image.remotePath || currentIds.has(image.id)) continue;
    if (!String(image.dataUrl || "").startsWith("data:")) continue;
    const extension = imageExtension(image.type);
    const path = `${folder}/${image.id}.${extension}`;
    const blob = await dataUrlToBlob(image.dataUrl);
    if (sessionVersion !== cloudSessionVersion) return;
    const { error } = await supabaseClient.storage
      .from(CLOUD_ASSET_BUCKET)
      .upload(path, blob, {
        cacheControl: "3600",
        contentType: image.type || blob.type || "image/jpeg",
        upsert: true,
        metadata: { originalName: image.name || "JD 截图" },
      });
    if (error) throw error;
  }
}

async function deleteCloudJdImages(applicationId) {
  const files = await listCloudJdFiles(applicationId);
  if (!files.length) return;
  const { error } = await supabaseClient.storage
    .from(CLOUD_ASSET_BUCKET)
    .remove(files.map((file) => file.path));
  if (error) throw error;
}

async function migrateLocalAssetsToCloud(applications) {
  if (!supabaseClient || !cloudUser) return;
  const sessionVersion = cloudSessionVersion;
  const candidates = applications.filter((application) => application.jdCount > 0);
  for (const application of candidates) {
    const localImages = await getLocalJdImages(application.id).catch(() => []);
    if (sessionVersion !== cloudSessionVersion) return;
    if (!localImages.length) continue;
    try {
      await putCloudJdImages(application.id, localImages);
    } catch (error) {
      if (sessionVersion !== cloudSessionVersion) return;
      console.error(`JD image migration failed for ${application.id}.`, error);
      setCloudStatus("error", "部分 JD 图片迁移失败");
    }
  }
}

async function getJdImages(applicationId) {
  if (isGuest) return [];
  if (cloudUser && cloudSyncReady) return getCloudJdImages(applicationId);
  return getLocalJdImages(applicationId);
}

async function putJdImages(applicationId, images) {
  if (!checkGuestPermission()) return;
  if (cloudUser && cloudSyncReady) {
    await putCloudJdImages(applicationId, images);
    return;
  }
  await putLocalJdImages(applicationId, images);
}

async function deleteJdImages(applicationId) {
  if (!checkGuestPermission()) return;
  if (cloudUser && cloudSyncReady) {
    await deleteCloudJdImages(applicationId);
    return;
  }
  await putLocalJdImages(applicationId, []);
}

async function clearAssetDb(applicationIds = []) {
  if (!checkGuestPermission()) return;
  if (cloudUser && cloudSyncReady) {
    const sessionVersion = cloudSessionVersion;
    for (const applicationId of applicationIds) {
      if (sessionVersion !== cloudSessionVersion) return;
      await deleteCloudJdImages(applicationId);
    }
    return;
  }
  await clearLocalAssetDb();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function formatDate(value, includeYear = false) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: includeYear ? "numeric" : undefined,
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toDateTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formatTimestamp(value) {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  if (diff < 60 * 60 * 1000) {
    return `${Math.max(1, Math.floor(diff / 60000))} 分钟前`;
  }
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / 3600000)} 小时前`;
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / 86400000)} 天前`;
  }
  return formatDate(String(value).slice(0, 10));
}

function dateDifference(value) {
  if (!value) return 0;
  const end = new Date(`${today()}T12:00:00`);
  const start = new Date(`${value}T12:00:00`);
  return Math.floor((end - start) / 86400000);
}

function formatReminderDate(value) {
  if (!value) return "时间待补充";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function reminderDistance(value) {
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return "";
  const hours = Math.ceil((target.getTime() - Date.now()) / 3600000);
  if (hours < -24) return `逾期 ${Math.ceil(Math.abs(hours) / 24)} 天`;
  if (hours < 0) return "已到时间";
  if (hours <= 24) return hours <= 1 ? "1 小时内" : `${hours} 小时后`;
  return `${Math.ceil(hours / 24)} 天后`;
}

function reminderTarget(application, progress) {
  if (progress.scheduledAt) return progress.scheduledAt;
  if (!application.nextActionDate) return "";
  const time = progress.stage === "assessment" ? "23:59" : "14:00";
  return `${application.nextActionDate}T${time}`;
}

function getActionReminders() {
  const reminders = [];
  state.applications.forEach((application) => {
    const progressItems = getProgress(application);
    const latest = progressItems[progressItems.length - 1];
    progressItems
      .filter((progress) => progress.stage === "assessment" || INTERVIEW_STAGES.has(progress.stage))
      .forEach((progress) => {
        const target =
          progress.scheduledAt ||
          (progress.id === latest?.id ? reminderTarget(application, progress) : "");
        const targetTime = new Date(target).getTime();
        const interviewEnded = INTERVIEW_STAGES.has(progress.stage)
          ? new Date(progress.endedAt || targetTime + 2 * 3600000).getTime() <= Date.now()
          : false;
        if (
          target &&
          Number.isFinite(targetTime) &&
          targetTime > Date.now() &&
          !interviewEnded
        ) {
          reminders.push({
            id: `schedule-${progress.id}`,
            type: progress.stage === "assessment" ? "assessment" : "interview",
            title: progress.stage === "assessment" ? "测评安排" : `${getStatus(progress.stage).label}安排`,
            application,
            progress,
            dueAt: target,
            createdAt: progress.recordedAt,
          });
        }
      });

    progressItems
      .filter((progress) => INTERVIEW_STAGES.has(progress.stage) && !progress.review)
      .forEach((progress) => {
        let inferredEnd = progress.endedAt;
        if (!inferredEnd) {
          const scheduledAt =
            progress.scheduledAt ||
            (progress.id === latest?.id ? reminderTarget(application, progress) : "");
          if (scheduledAt) {
            const inferredDate = new Date(scheduledAt);
            inferredDate.setHours(inferredDate.getHours() + 2);
            inferredEnd = inferredDate.toISOString();
          } else if (progress.eventDate < today()) {
            inferredEnd = `${progress.eventDate}T18:00`;
          }
        }
        const endedAt = new Date(inferredEnd).getTime();
        if (!inferredEnd || !Number.isFinite(endedAt) || endedAt > Date.now()) return;
        reminders.push({
          id: `review-${progress.id}`,
          type: "review",
          title: `${getStatus(progress.stage).label}复盘`,
          application,
          progress,
          dueAt: inferredEnd,
          createdAt: progress.endedAt || progress.recordedAt,
        });
      });
  });
  return reminders;
}

function reminderTheme(type) {
  return {
    assessment: { label: "测评", icon: "file-check-2", color: "#7357F6", soft: "#F4F0FF" },
    interview: { label: "面试", icon: "messages-square", color: "#F2A900", soft: "#FFF8E6" },
    review: { label: "复盘待办", icon: "clipboard-pen-line", color: "#3478F6", soft: "#EEF5FF" },
  }[type];
}

function getStatus(value) {
  return STATUS_MAP[normalizeStatus(value)] || STATUS_MAP.other;
}

function statusOptions(selected = "") {
  return STATUS.map(
    (item) =>
      `<option value="${item.value}" ${selected === item.value ? "selected" : ""}>${item.label}</option>`,
  ).join("");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("请选择图片格式的邮件截图"));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error("截图不能超过 15MB"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("截图读取失败"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function renderQuickCaptureImage() {
  const preview = document.getElementById("quickImagePreview");
  const busy = quickOcrBusy || quickAiBusy;
  document.getElementById("quickCaptureButton").disabled = busy;
  document.getElementById("quickImageButton").disabled = busy;
  document.getElementById("quickImageRemoveButton").disabled = busy;
  if (!quickCaptureImage) {
    preview.hidden = true;
    preview.classList.remove("is-processing", "has-error");
    return;
  }
  preview.hidden = false;
  preview.classList.toggle("is-processing", quickOcrBusy);
  preview.classList.toggle("has-error", quickCaptureImage.status === "error");
  document.getElementById("quickImageThumbnail").src = quickCaptureImage.dataUrl;
  document.getElementById("quickImageName").textContent = quickCaptureImage.name;
  document.getElementById("quickImageStatus").textContent = quickCaptureImage.message;
  document.getElementById("quickImageProgressBar").style.width =
    `${Math.round((quickCaptureImage.progress || 0) * 100)}%`;
}

function clearQuickCaptureImage() {
  if (quickOcrBusy || quickAiBusy) return;
  quickCaptureImage = null;
  document.getElementById("quickImageInput").value = "";
  renderQuickCaptureImage();
}

function normalizeOcrText(value) {
  return String(value || "")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function updateOcrProgress(message) {
  if (!quickCaptureImage) return;
  const statusLabels = {
    "loading tesseract core": "正在加载识别引擎",
    "initializing tesseract": "正在初始化识别引擎",
    "loading language traineddata": "正在加载中英文模型",
    "initializing api": "正在准备识别",
    "recognizing text": "正在识别邮件内容",
  };
  quickCaptureImage.progress = Number(message.progress) || 0;
  const label = statusLabels[message.status] || "正在处理截图";
  quickCaptureImage.message =
    message.status === "recognizing text"
      ? `${label} ${Math.round(quickCaptureImage.progress * 100)}%`
      : label;
  renderQuickCaptureImage();
}

async function recognizeQuickCaptureImage(file) {
  const sessionVersion = cloudSessionVersion;
  if (quickOcrBusy || quickAiBusy) {
    showToast("当前内容仍在识别中");
    return;
  }
  try {
    const dataUrl = await readImageAsDataUrl(file);
    if (sessionVersion !== cloudSessionVersion) return;
    quickCaptureImage = {
      name: file.name || `面试邮件_${Date.now()}.png`,
      dataUrl,
      progress: 0,
      status: "processing",
      message: "正在准备识别",
      text: "",
    };
    quickOcrBusy = true;
    renderQuickCaptureImage();
    if (!window.Tesseract) {
      throw new Error("图片识别组件加载失败，请检查网络后重试");
    }
    const result = await window.Tesseract.recognize(dataUrl, "chi_sim", {
      langPath:
        "https://cdn.jsdelivr.net/npm/@tesseract.js-data/chi_sim@1.0.0/4.0.0_best_int",
      logger: (message) => {
        if (sessionVersion === cloudSessionVersion) updateOcrProgress(message);
      },
    });
    if (sessionVersion !== cloudSessionVersion) return;
    const text = normalizeOcrText(result?.data?.text);
    if (text.replace(/\s/g, "").length < 4) {
      throw new Error("没有识别到足够文字，请换用更清晰的截图");
    }
    quickCaptureImage.text = text;
    quickCaptureImage.progress = 1;
    quickCaptureImage.status = "complete";
    quickCaptureImage.message = `已提取 ${text.replace(/\s/g, "").length} 个字符`;
    document.getElementById("quickCaptureInput").value = text
      .replace(/\s*\n+\s*/g, "；")
      .slice(0, 300);
    renderQuickCaptureImage();
    await openCapturePreview(text, {
      source: "image",
      sourceName: quickCaptureImage.name,
    });
  } catch (error) {
    if (sessionVersion !== cloudSessionVersion) return;
    if (!quickCaptureImage) return;
    quickCaptureImage.status = "error";
    quickCaptureImage.message = error.message || "截图识别失败";
    quickCaptureImage.progress = 0;
    showToast(quickCaptureImage.message);
  } finally {
    if (sessionVersion === cloudSessionVersion) {
      quickOcrBusy = false;
      renderQuickCaptureImage();
    }
  }
}

function openDialog(id) {
  if (id !== "accountDialog" && !canBrowseWorkspace()) {
    return;
  }
  const dialog = document.getElementById(id);
  if (dialog && !dialog.open) {
    resetGuestPermissionPrompt(dialog);
    dialog.showModal();
  }
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog && dialog.open) dialog.close();
}

function confirmAction(title, message, onAccept) {
  if (!checkGuestPermission()) return;
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  document.getElementById("confirmPopover").hidden = false;
  const sessionVersion = cloudSessionVersion;
  confirmCallback = () => {
    if (sessionVersion === cloudSessionVersion && checkGuestPermission()) return onAccept();
  };
  setTimeout(() => document.getElementById("confirmCancelButton").focus(), 0);
}

function closeConfirm() {
  document.getElementById("confirmPopover").hidden = true;
  confirmCallback = null;
}

function renderAccount() {
  const configured = getCloudConfig().configured && Boolean(window.supabase?.createClient);
  const email = cloudUser?.email || "";
  const name = email ? email.split("@")[0] : "演示访客";
  const avatar = email ? name.slice(0, 1).toUpperCase() : "访";
  const statusLabels = {
    loading: "正在读取云端",
    pending: "等待同步",
    syncing: "正在同步",
    synced: "已同步",
    error: "同步异常",
    sending: "正在发送",
    "code-sent": "验证码已发送",
    verifying: "正在验证",
    "signed-out": "未登录",
    unconfigured: "未配置",
    local: "本地模式",
  };
  const summaryIcon = document.getElementById("accountSummaryIcon");
  const summaryTitle = document.getElementById("accountSummaryTitle");
  const summaryDescription = document.getElementById("accountSummaryDescription");
  const syncStatus = document.getElementById("accountSyncStatus");
  const emailField = document.getElementById("accountEmailField");
  const emailInput = document.getElementById("accountEmailInput");
  const otpField = document.getElementById("accountOtpField");
  const otpInput = document.getElementById("accountOtpInput");
  const codeActions = document.getElementById("accountCodeActions");
  const submitButton = document.getElementById("accountSubmitButton");
  const submitIcon = document.getElementById("accountSubmitIcon");
  const submitLabel = document.getElementById("accountSubmitLabel");
  const signOutButton = document.getElementById("clearAccountButton");
  const otpPending = cloudOtpPending && !email;
  const busy = ["sending", "loading", "syncing", "verifying"].includes(cloudStatus);

  document.getElementById("accountName").textContent = name;
  document.getElementById("accountState").textContent = email
    ? cloudStatus === "error"
      ? "云同步异常"
      : statusLabels[cloudStatus] || "云端账户"
    : "示例数据 · 去登录";
  document.getElementById("accountAvatar").textContent = avatar;

  emailField.hidden = Boolean(email);
  emailInput.disabled = otpPending || busy;
  otpField.hidden = !otpPending;
  otpInput.disabled = !otpPending || !configured || busy;
  codeActions.hidden = !otpPending;
  submitButton.hidden = Boolean(email);
  submitButton.disabled = !configured || busy;
  submitIcon.setAttribute("data-lucide", otpPending ? "shield-check" : "mail");
  submitLabel.textContent = otpPending ? "验证并登录" : "发送验证码";
  signOutButton.hidden = !email;
  if (email) {
    emailInput.value = email;
  } else if (otpPending) {
    emailInput.value = cloudOtpEmail;
  } else if (!emailInput.value && state.account?.email) {
    emailInput.value = state.account.email;
  }

  if (email) {
    summaryIcon.setAttribute(
      "data-lucide",
      cloudStatus === "error" ? "cloud-alert" : "cloud",
    );
    summaryTitle.textContent = email;
    summaryDescription.textContent =
      cloudStatusMessage ||
      (cloudStatus === "synced"
        ? "此账户的数据已保存在云端，可在其他设备登录查看。"
        : "本地修改会自动同步至当前账户。");
  } else if (configured) {
    summaryIcon.setAttribute("data-lucide", "cloud");
    summaryTitle.textContent = otpPending ? "输入邮箱验证码" : "使用邮箱登录";
    summaryDescription.textContent =
      cloudStatusMessage ||
      (otpPending
        ? `验证码已发送至 ${cloudOtpEmail}`
        : "我们会发送 6 位验证码，在当前页面验证后即可登录。");
  } else {
    summaryIcon.setAttribute("data-lucide", "cloud-off");
    summaryTitle.textContent = "云同步尚未配置";
    summaryDescription.textContent =
      "完成 supabase-config.js 和数据库初始化后，即可使用邮箱登录。";
  }

  syncStatus.textContent =
    !email && cloudStatus === "error"
      ? "登录异常"
      : statusLabels[cloudStatus] || "本地模式";
  syncStatus.className = `sync-status is-${cloudStatus}`;
  updateCloudOtpResendButton();
  refreshIcons();
}

function switchView(view, options = {}) {
  if (!VIEW_META[view]) return;
  if (!canBrowseWorkspace()) {
    navigateRoute(view);
    return;
  }
  cloudReturnRoute = "";
  closeDialog("accountDialog");
  currentView = view;
  if (window.location.hash !== `#${view}`) {
    window.history.replaceState(null, "", `#${view}`);
  }
  document.querySelectorAll(".view").forEach((element) => {
    element.classList.toggle("is-active", element.id === `view-${view}`);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  document
    .querySelector(".app-shell")
    ?.classList.toggle("is-dashboard-shell", view === "dashboard");
  document.getElementById("mainArea").classList.toggle("is-dashboard", view === "dashboard");
  document.getElementById("pageEyebrow").textContent = VIEW_META[view].eyebrow;
  document.getElementById("pageTitle").textContent = VIEW_META[view].title;

  if (view === "applications") {
    if (options.filter) {
      specialFilter = options.filter;
      document.getElementById("statusFilter").value =
        STATUS_MAP[options.filter] ? options.filter : "";
    }
    renderApplications();
  } else if (view === "companies") {
    renderCompanies();
  } else if (view === "funnel") {
    renderFunnel();
  } else if (view === "reviews") {
    renderInterviewReviews();
  } else if (view === "fairs") {
    window.renderFairs?.();
  } else {
    renderDashboard();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderNavigation() {
  document.getElementById("applicationNavCount").textContent = state.applications.length;
  const pendingCount = getInterviewReviewItems().filter(
    (item) => item.reviewStatus === "pending",
  ).length;
  ["reviewNavCount", "mobileReviewNavCount"].forEach((id) => {
    const badge = document.getElementById(id);
    if (!badge) return;
    badge.textContent = pendingCount;
    badge.hidden = pendingCount === 0;
  });
}

function interviewEndTime(progress) {
  if (progress.endedAt) {
    const endedAt = new Date(progress.endedAt);
    if (!Number.isNaN(endedAt.getTime())) return endedAt;
  }
  if (progress.scheduledAt) {
    const scheduledAt = new Date(progress.scheduledAt);
    if (!Number.isNaN(scheduledAt.getTime())) {
      return new Date(scheduledAt.getTime() + 2 * 3600000);
    }
  }
  if (progress.eventDate) {
    const inferred = new Date(`${progress.eventDate}T18:00`);
    if (!Number.isNaN(inferred.getTime())) return inferred;
  }
  return null;
}

function getInterviewReviewStatus(progress) {
  if (
    progress.interviewReview?.status === "completed" ||
    progress.interviewReview?.questions?.length ||
    progress.review
  ) {
    return "completed";
  }
  const endTime = interviewEndTime(progress);
  return endTime && endTime.getTime() <= Date.now() ? "pending" : "upcoming";
}

function getInterviewReviewItems() {
  const priority = { pending: 0, completed: 1, upcoming: 2 };
  return state.applications
    .flatMap((application) =>
      getProgress(application)
        .filter((progress) => INTERVIEW_STAGES.has(progress.stage))
        .map((progress) => ({
          application,
          progress,
          reviewStatus: getInterviewReviewStatus(progress),
        })),
    )
    .sort((a, b) => {
      const statusDifference =
        priority[a.reviewStatus] - priority[b.reviewStatus];
      if (statusDifference !== 0) return statusDifference;
      const aTime = a.progress.scheduledAt || `${a.progress.eventDate}T00:00`;
      const bTime = b.progress.scheduledAt || `${b.progress.eventDate}T00:00`;
      return String(bTime).localeCompare(String(aTime));
    });
}

function interviewReviewStatusMeta(status) {
  return {
    pending: { label: "待复盘", icon: "clock-3", color: "#EE5353" },
    completed: { label: "已复盘", icon: "circle-check-big", color: "#16A36F" },
    upcoming: { label: "待面试", icon: "calendar-clock", color: "#F2A900" },
  }[status];
}

function renderInterviewReviews() {
  const allItems = getInterviewReviewItems();
  const visibleItems = allItems.filter(
    (item) =>
      interviewReviewFilter === "all" ||
      item.reviewStatus === interviewReviewFilter,
  );
  const pendingCount = allItems.filter((item) => item.reviewStatus === "pending").length;
  const completedCount = allItems.filter(
    (item) => item.reviewStatus === "completed",
  ).length;
  const upcomingCount = allItems.filter(
    (item) => item.reviewStatus === "upcoming",
  ).length;

  document.getElementById("reviewSummaryBand").innerHTML = `
    <div><span>面试场次</span><strong>${allItems.length}</strong></div>
    <div><span>待复盘</span><strong>${pendingCount}</strong></div>
    <div><span>已复盘</span><strong>${completedCount}</strong></div>
    <div><span>待面试</span><strong>${upcomingCount}</strong></div>
  `;
  document.getElementById("reviewResultCount").textContent =
    `${visibleItems.length} 场面试`;

  document.getElementById("interviewReviewList").innerHTML = visibleItems
    .map((item) => {
      const status = interviewReviewStatusMeta(item.reviewStatus);
      const review = item.progress.interviewReview;
      const questionCount = review?.questions?.length || 0;
      const date = item.progress.scheduledAt
        ? formatReminderDate(item.progress.scheduledAt)
        : formatDate(item.progress.eventDate, true);
      const action =
        item.reviewStatus === "completed"
          ? "查看复盘"
          : item.reviewStatus === "pending"
            ? "生成复盘"
            : "查看场次";
      return `
        <button
          class="interview-review-row"
          type="button"
          data-open-review-app="${item.application.id}"
          data-open-review-progress="${item.progress.id}"
          data-review-status="${item.reviewStatus}"
          style="--review-status-color:${status.color}"
        >
          <span class="review-row-icon"><i data-lucide="${status.icon}"></i></span>
          <span class="review-row-main">
            <span class="review-row-title">
              <strong>${escapeHtml(item.application.company)} · ${escapeHtml(item.application.role)}</strong>
              <em>${getStatus(item.progress.stage).label}</em>
            </span>
            <span>${escapeHtml(item.application.department || "部门待补充")} · ${escapeHtml(date)}</span>
            <small>${
              item.reviewStatus === "completed"
                ? questionCount
                  ? `已整理 ${questionCount} 个问题`
                  : "已记录手动复盘"
                : item.reviewStatus === "pending"
                  ? "面试已结束，等待整理"
                  : "面试尚未开始"
            }</small>
          </span>
          <span class="review-row-status">${status.label}</span>
          <span class="review-row-action">${action}<i data-lucide="chevron-right"></i></span>
        </button>
      `;
    })
    .join("");
  document.getElementById("interviewReviewEmpty").hidden = visibleItems.length > 0;
  refreshIcons();
}

function getOverdueApplications() {
  const terminal = new Set(["offer", "rejected"]);
  return state.applications
    .filter(
      (item) =>
        item.nextActionDate &&
        item.nextActionDate <= today() &&
        !terminal.has(item.status),
    )
    .sort((a, b) => a.nextActionDate.localeCompare(b.nextActionDate));
}

function allProgressEvents() {
  return state.applications
    .flatMap((application) =>
      getProgress(application).map((progress) => ({ application, progress })),
    )
    .sort((a, b) =>
      String(b.progress.recordedAt).localeCompare(String(a.progress.recordedAt)),
    );
}

function startOfCalendarWeek(offset = 0) {
  const date = new Date();
  const weekday = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - weekday + 1 + offset * 7);
  return date;
}

function addCalendarDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatClock(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getCalendarScheduleEvents() {
  const applicationEvents = state.applications.flatMap((application) =>
    getProgress(application)
      .filter(
        (progress) =>
          (progress.stage === "assessment" || INTERVIEW_STAGES.has(progress.stage)) &&
          progress.scheduledAt,
      )
      .map((progress) => {
        const start = new Date(progress.scheduledAt);
        const explicitEnd = new Date(progress.endedAt);
        const isAssessment = progress.stage === "assessment";
        const end =
          !Number.isNaN(explicitEnd.getTime()) && explicitEnd > start
            ? explicitEnd
            : new Date(start.getTime() + (isAssessment ? 0 : 3600000));
        return {
          application,
          progress,
          start,
          end,
          isAssessment,
          conflict: false,
        };
      })
      .filter((item) => !Number.isNaN(item.start.getTime())),
  );
  const fairEvents =
    typeof window.getFairCalendarEvents === "function"
      ? window.getFairCalendarEvents()
      : [];
  return [...applicationEvents, ...fairEvents];
}

function getInterviewScheduleEvents() {
  return getCalendarScheduleEvents().filter((event) =>
    event.progress && INTERVIEW_STAGES.has(event.progress.stage),
  );
}

function markCalendarAttention(events) {
  const sorted = [...events].sort((a, b) => a.start - b.start || a.end - b.end);
  sorted.forEach((event) => {
    event.conflict = false;
  });
  for (let index = 0; index < sorted.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < sorted.length; otherIndex += 1) {
      const current = sorted[index];
      const other = sorted[otherIndex];
      const gap = other.start.getTime() - current.end.getTime();
      const attentionMinutes = Math.max(
        30,
        Number(current.transferMinutes || 0),
        Number(other.transferMinutes || 0),
      );
      if (gap > attentionMinutes * 60000) break;
      if (gap <= attentionMinutes * 60000) {
        current.conflict = true;
        other.conflict = true;
      }
    }
  }
  return sorted;
}

function formatCalendarEventTime(event) {
  if (event.isAssessment) return `截止 ${formatClock(event.start)}`;
  return `${formatClock(event.start)}-${formatClock(event.end)}`;
}

function renderInterviewCalendar() {
  const calendarStartMinutes = 9 * 60;
  const calendarEndMinutes = 18 * 60;
  const calendarDurationMinutes = calendarEndMinutes - calendarStartMinutes;
  const calendarGridHeight = 172;
  const weekStart = startOfCalendarWeek(calendarWeekOffset);
  const weekEnd = addCalendarDays(weekStart, 7);
  const days = Array.from({ length: 7 }, (_, index) => addCalendarDays(weekStart, index));
  const events = getCalendarScheduleEvents().filter(
    (item) => item.start >= weekStart && item.start < weekEnd,
  );
  const eventsByDate = new Map(days.map((date) => [toLocalDateValue(date), []]));
  events.forEach((event) => {
    const dateKey = toLocalDateValue(event.start);
    if (eventsByDate.has(dateKey)) eventsByDate.get(dateKey).push(event);
  });
  eventsByDate.forEach((items, key) => {
    eventsByDate.set(key, markCalendarAttention(items));
  });

  const conflictCount = events.filter((event) => event.conflict).length;
  const conflictBadge = document.getElementById("calendarConflictCount");
  conflictBadge.textContent = conflictCount
    ? `${conflictCount} 个安排需留意`
    : "本周无时间冲突";
  conflictBadge.classList.toggle("has-conflict", conflictCount > 0);
  document.getElementById("calendarWeekLabel").textContent =
    `${formatDate(toLocalDateValue(weekStart), true)} - ${formatDate(toLocalDateValue(addCalendarDays(weekEnd, -1)), true)}`;

  const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short" });
  const dayFormatter = new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" });
  const timeMarkers = [9, 12, 15, 18];
  const eventStyle = (event) => {
    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
    const clippedStart = Math.max(
      calendarStartMinutes,
      Math.min(calendarEndMinutes, startMinutes),
    );
    const clippedEnd = Math.max(
      clippedStart + 30,
      Math.min(calendarEndMinutes, endMinutes),
    );
    const rawTop =
      ((clippedStart - calendarStartMinutes) / calendarDurationMinutes) * 100;
    const top = Math.max(0, Math.min(72, rawTop));
    const naturalHeight =
      ((clippedEnd - clippedStart) / calendarDurationMinutes) * calendarGridHeight;
    const availableHeight = Math.max(
      38,
      calendarGridHeight - (top / 100) * calendarGridHeight - 4,
    );
    const height = Math.min(Math.max(48, naturalHeight), availableHeight);
    return `--event-top:${top.toFixed(2)}%;--event-height:${Math.round(height)}px`;
  };
  const renderCalendarEvent = (event) => {
    if (event.kind === "fair") {
      const time = `${formatClock(event.start)}-${formatClock(event.end)}`;
      return `
        <button
          class="calendar-event fair-calendar-event ${event.conflict ? "has-conflict" : ""}"
          type="button"
          data-calendar-fair="${event.fair.id}"
          style="--event-color:#168C78;${eventStyle(event)}"
          title="${escapeHtml(time)} · ${escapeHtml(event.fair.title)} · 双选会"
        >
          <span class="calendar-event-primary">
            <time>${escapeHtml(time)}</time>
            <strong>${escapeHtml(event.fair.school || event.fair.publisher || "双选会")}</strong>
          </span>
          <span class="calendar-event-secondary">
            <span>${escapeHtml(event.fair.title)}</span>
            <em>双选会</em>
          </span>
        </button>
      `;
    }
    const status = getStatus(event.progress.stage);
    const time = formatCalendarEventTime(event);
    return `
      <button
        class="calendar-event ${event.conflict ? "has-conflict" : ""}"
        type="button"
        data-calendar-application="${event.application.id}"
        data-calendar-progress="${event.progress.id}"
        style="--event-color:${status.color};${eventStyle(event)}"
        title="${escapeHtml(time)} · ${escapeHtml(event.application.company)} · ${escapeHtml(event.application.role)} · ${status.label}"
      >
        <span class="calendar-event-primary">
          <time>${escapeHtml(time)}</time>
          <strong>${escapeHtml(event.application.company)}</strong>
        </span>
        <span class="calendar-event-secondary">
          <span>${escapeHtml(event.application.role)}</span>
          <em>${status.label}</em>
        </span>
      </button>
    `;
  };

  document.getElementById("interviewCalendar").innerHTML = `
    <div class="calendar-days-header">
      <span class="calendar-corner"></span>
      ${days
        .map((date) => {
          const dateKey = toLocalDateValue(date);
          return `
            <span class="calendar-day-heading ${dateKey === today() ? "is-today" : ""}">
              <small>${weekdayFormatter.format(date)}</small>
              <strong>${dayFormatter.format(date)}</strong>
            </span>
          `;
        })
        .join("")}
    </div>
    <div class="calendar-time-grid">
      <div class="calendar-time-axis">
        ${timeMarkers
          .map((hour, index) => {
            const top = ((hour - 9) / 9) * 100;
            const edgeClass =
              index === 0 ? "is-first" : index === timeMarkers.length - 1 ? "is-last" : "";
            return `<span class="calendar-time-label ${edgeClass}" style="top:${top}%">${String(hour).padStart(2, "0")}:00</span>`;
          })
          .join("")}
      </div>
      ${days
        .map((date) => {
          const dateKey = toLocalDateValue(date);
          const dayEvents = eventsByDate.get(dateKey) || [];
          return `
            <div class="calendar-time-day ${dateKey === today() ? "is-today" : ""}">
              ${dayEvents.map(renderCalendarEvent).join("")}
            </div>
          `;
        })
        .join("")}
      ${events.length ? "" : '<div class="calendar-empty">本周暂无面试或测评安排</div>'}
    </div>
  `;
  renderNotificationToggle();
  refreshIcons();
}

function getNotificationEnvironment() {
  if (!window.isSecureContext) {
    return {
      available: false,
      message: "系统通知需要通过 HTTPS 或本地开发地址打开",
    };
  }
  if (
    !("Notification" in window) ||
    typeof window.Notification.requestPermission !== "function"
  ) {
    return {
      available: false,
      message: "当前打开方式不支持系统通知，请使用支持通知的系统浏览器",
    };
  }
  if (window.Notification.permission === "denied") {
    return {
      available: false,
      message: "通知权限已被阻止，请在浏览器的网站设置中改为允许后刷新",
    };
  }
  return { available: true, message: "" };
}

async function getNotificationWorkerRegistration() {
  if (!window.isSecureContext || !("serviceWorker" in navigator)) return null;
  if (!notificationWorkerPromise) {
    notificationWorkerPromise = navigator.serviceWorker
      .register("./service-worker.js?v=1", {
        scope: "./",
        updateViaCache: "none",
      })
      .then(() => navigator.serviceWorker.ready)
      .catch((error) => {
        console.warn("Notification service worker could not be registered.", error);
        return null;
      });
  }
  return notificationWorkerPromise;
}

function renderNotificationToggle() {
  const button = document.getElementById("notificationToggle");
  if (!button) return;
  const environment = getNotificationEnvironment();
  const enabled =
    environment.available &&
    state.settings.interviewNotifications &&
    window.Notification.permission === "granted";
  button.disabled = false;
  button.classList.toggle("is-active", enabled);
  button.classList.toggle("is-unavailable", !environment.available);
  button.setAttribute("aria-checked", String(enabled));
  button.setAttribute("aria-disabled", String(!environment.available));
  button.title = environment.available
    ? enabled
      ? "关闭面试前 1 小时提醒"
      : "开启面试前 1 小时提醒"
    : environment.message;
}

async function toggleInterviewNotifications() {
  if (!checkGuestPermission()) return;
  const environment = getNotificationEnvironment();
  if (!environment.available) {
    showToast(environment.message);
    return;
  }
  if (
    state.settings.interviewNotifications &&
    window.Notification.permission === "granted"
  ) {
    state.settings.interviewNotifications = false;
    saveState();
    renderNotificationToggle();
    showToast("面试通知已关闭");
    return;
  }
  let permission = window.Notification.permission;
  if (permission === "default") {
    permission = await window.Notification.requestPermission();
  }
  if (permission !== "granted") {
    renderNotificationToggle();
    showToast("未获得通知权限，提醒尚未开启");
    return;
  }
  state.settings.interviewNotifications = true;
  saveState();
  renderNotificationToggle();
  await checkInterviewNotifications();
  showToast("已开启；页面保持打开时会在面试前 1 小时提醒");
}

async function showInterviewNotification(event, key) {
  const title = `${event.application.company} · ${getStatus(event.progress.stage).label}`;
  const options = {
    body: `面试将于 ${formatClock(event.start)} 开始 · ${event.application.role}`,
    tag: key,
    data: {
      type: "open-progress",
      applicationId: event.application.id,
      progressId: event.progress.id,
    },
  };
  const registration = await getNotificationWorkerRegistration();
  if (registration && typeof registration.showNotification === "function") {
    await registration.showNotification(title, options);
    return;
  }
  const notification = new window.Notification(title, options);
  notification.onclick = () => {
    window.focus();
    editingApplicationId = event.application.id;
    openProgressDialog(event.progress.id);
    notification.close();
  };
}

async function checkInterviewNotifications() {
  if (!hasWorkspaceAccess()) return;
  if (
    !getNotificationEnvironment().available ||
    window.Notification.permission !== "granted" ||
    !state.settings.interviewNotifications ||
    notificationCheckInFlight
  ) {
    return false;
  }
  notificationCheckInFlight = true;
  const history = new Set(state.settings.notificationHistory || []);
  let didNotify = false;
  try {
    for (const event of getInterviewScheduleEvents()) {
      const millisecondsUntilStart = event.start.getTime() - Date.now();
      if (millisecondsUntilStart <= 0 || millisecondsUntilStart > 3600000) continue;
      const key = `${event.application.id}:${event.progress.id}:${event.progress.scheduledAt}`;
      if (history.has(key)) continue;
      try {
        await showInterviewNotification(event, key);
        history.add(key);
        didNotify = true;
      } catch (error) {
        console.warn("Interview notification could not be shown.", error);
      }
    }
    if (didNotify) {
      state.settings.notificationHistory = [...history].slice(-100);
      saveState();
    }
    return didNotify;
  } finally {
    notificationCheckInFlight = false;
  }
}

function bindNotificationWorkerMessages() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || message.type !== "open-progress") return;
    const application = state.applications.find(
      (item) => item.id === message.applicationId,
    );
    const progress = application?.progress.find((item) => item.id === message.progressId);
    if (!application || !progress) return;
    switchView("dashboard");
    editingApplicationId = application.id;
    openProgressDialog(progress.id);
  });
}

function renderDashboard() {
  const count = (stages) =>
    state.applications.filter((item) => stages.includes(item.status)).length;
  const reminders = getActionReminders();
  const scheduleCount = reminders.filter((item) =>
    ["assessment", "interview"].includes(item.type),
  ).length;
  const reviewCount = reminders.filter((item) => item.type === "review").length;

  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  const statItems = [
    {
      label: "岗位总数",
      value: state.applications.length,
      note: "全部求职岗位",
      color: "#3478F6",
      icon: "briefcase-business",
      filter: "",
    },
    {
      label: "面试中",
      value: count(["first", "second", "final"]),
      note: "一面至终面",
      color: "#7357F6",
      icon: "users",
      filter: "interview",
    },
    {
      label: "未开始安排",
      value: scheduleCount,
      note: "测评与面试提醒",
      color: "#FF6A2A",
      icon: "calendar-days",
      filter: "",
    },
    {
      label: "待复盘",
      value: reviewCount,
      note: "面试评价未记录",
      color: "#F2A900",
      icon: "clock-3",
      filter: "",
    },
  ];

  document.getElementById("statsGrid").innerHTML = statItems
    .map(
      (item) => `
        <button class="stat-card" type="button" data-stat-filter="${item.filter}" style="--stat-color:${item.color}">
          <span class="stat-top"><span>${item.label}</span><i data-lucide="${item.icon}"></i></span>
          <strong class="stat-value">${item.value}</strong>
          <span class="stat-note">${item.note}</span>
        </button>
      `,
    )
    .join("");

  const sort = document.getElementById("reminderSort").value;
  const visibleReminders = reminders
    .filter((item) => item.type === reminderFilter)
    .sort((a, b) =>
      sort === "due-asc"
        ? String(a.dueAt).localeCompare(String(b.dueAt))
        : String(b.createdAt).localeCompare(String(a.createdAt)),
    );
  document.getElementById("actionReminderCount").textContent = `${reminders.length} 项提醒`;
  document.getElementById("actionReminderList").innerHTML = visibleReminders.length
    ? visibleReminders
        .map((item) => {
          const theme = reminderTheme(item.type);
          return `
            <button
              class="action-reminder-item"
              type="button"
              data-reminder-application="${item.application.id}"
              data-reminder-progress="${item.progress.id}"
              data-reminder-type="${item.type}"
              style="--reminder-color:${theme.color};--reminder-soft:${theme.soft}"
            >
              <span class="action-reminder-icon"><i data-lucide="${theme.icon}"></i></span>
              <span class="action-reminder-copy">
                <span class="action-reminder-title">
                  <strong>${escapeHtml(item.application.company)} · ${escapeHtml(item.title)}</strong>
                  <em>${theme.label}</em>
                </span>
                <span>${escapeHtml(item.application.department || "部门待补充")} · ${escapeHtml(item.application.role)}</span>
                <small>${item.type === "review" ? "面试已结束，请补充面试评价" : "未开始前持续提醒"}</small>
              </span>
              <time>
                <span>${formatReminderDate(item.dueAt)}</span>
                <em>${reminderDistance(item.dueAt)}</em>
              </time>
              <i data-lucide="chevron-right"></i>
            </button>
          `;
        })
        .join("")
    : `
      <div class="empty-inline action-empty">
        <i data-lucide="circle-check-big"></i>
        <span>当前没有这类提醒</span>
      </div>
    `;

  renderInterviewCalendar();
  refreshIcons();
}

function renderIndustryDistribution() {
  const industryCounts = state.applications.reduce((result, item) => {
    result[item.industry] = (result[item.industry] || 0) + 1;
    return result;
  }, {});
  const industries = Object.entries(industryCounts).sort((a, b) => b[1] - a[1]);
  const maxIndustry = Math.max(1, ...industries.map((item) => item[1]));
  const colors = ["#16A36F", "#3478F6", "#F2A900", "#7357F6", "#EE5353", "#74788D"];
  document.getElementById("funnelIndustryDistribution").innerHTML = industries.length
    ? industries
        .slice(0, 8)
        .map(
          ([name, value], index) => `
            <div class="distribution-row">
              <span class="distribution-label">${escapeHtml(name)}</span>
              <div class="track">
                <div class="track-fill" style="width:${Math.max(3, Math.round((value / maxIndustry) * 100))}%;--bar-color:${colors[index % colors.length]}"></div>
              </div>
              <strong class="distribution-count">${value}</strong>
            </div>
          `,
        )
        .join("")
    : '<div class="empty-inline">新增投递后显示行业分布</div>';
}

function renderFunnel() {
  const currentCounts = Object.fromEntries(
    FUNNEL_STAGES.map((stage) => [
      stage,
      state.applications.filter((item) => item.status === stage).length,
    ]),
  );
  const reachedCounts = Object.fromEntries(
    FUNNEL_STAGES.map((stage, stageIndex) => [
      stage,
      state.applications.filter((item) => {
        const highestReached = Math.max(
          -1,
          ...getProgress(item).map((progress) => FUNNEL_STAGES.indexOf(progress.stage)),
        );
        return highestReached >= stageIndex;
      }).length,
    ]),
  );
  const maxReached = Math.max(1, ...Object.values(reachedCounts));
  const submitted = reachedCounts.applied || 0;
  const interviewCount = state.applications.filter((item) =>
    INTERVIEW_STAGES.has(item.status),
  ).length;
  const offerRate = submitted
    ? Math.round(((reachedCounts.offer || 0) / submitted) * 100)
    : 0;

  document.getElementById("funnelSummary").innerHTML = `
    <div><span>有效投递</span><strong>${submitted}</strong></div>
    <div><span>面试中</span><strong>${interviewCount}</strong></div>
    <div><span>Offer 转化率</span><strong>${offerRate}%</strong></div>
  `;
  document.getElementById("pipelineFunnel").innerHTML = FUNNEL_STAGES.map(
    (stage, index) => {
      const info = getStatus(stage);
      const current = currentCounts[stage];
      const reached = reachedCounts[stage];
      const previous = index > 0 ? reachedCounts[FUNNEL_STAGES[index - 1]] : 0;
      const conversion =
        index === 0 ? "—" : previous ? `${Math.round((reached / previous) * 100)}%` : "—";
      const width = Math.max(2, Math.round((reached / maxReached) * 100));
      return `
        <button
          class="pipeline-funnel-row"
          type="button"
          data-funnel-filter="${stage}"
          style="--stage-color:${info.color};--stage-width:${width}%"
          aria-label="${info.label}，当前 ${current}，累计 ${reached}，转化率 ${conversion}"
        >
          <span>${info.label}</span>
          <span class="pipeline-track"><span></span></span>
          <strong>${current} / ${reached}</strong>
          <em>${conversion}</em>
        </button>
      `;
    },
  ).join("");
  renderIndustryDistribution();
  refreshIcons();
}

function initializeSelects() {
  document.getElementById("statusFilter").innerHTML =
    '<option value="">全部进展</option>' +
    '<option value="interview">面试中（一面至终面）</option>' +
    statusOptions();
  document.getElementById("industryFilter").innerHTML =
    '<option value="">全部行业</option>' +
    INDUSTRIES.map((item) => `<option value="${item}">${item}</option>`).join("");
  ["statusInput", "captureStageInput", "progressStageInput"].forEach((id) => {
    document.getElementById(id).innerHTML = statusOptions("applied");
  });
  document.getElementById("industryInput").innerHTML = INDUSTRIES.map(
    (item) => `<option value="${item}">${item}</option>`,
  ).join("");
  ["channelInput", "captureChannelInput"].forEach((id) => {
    document.getElementById(id).innerHTML = CHANNELS.map(
      (item) => `<option value="${item}">${item}</option>`,
    ).join("");
  });
}

function statusMatchesFilter(application, filter) {
  if (!filter) return true;
  if (filter === "interview") return ["first", "second", "final"].includes(application.status);
  return application.status === filter;
}

function renderInlineProgressTimeline(application, expanded) {
  const progress = getProgress(application).reverse();
  return `
    <div
      class="inline-progress-panel"
      id="application-progress-${escapeHtml(application.id)}"
      aria-label="${escapeHtml(application.company)}的进展时间线"
      ${expanded ? "" : "hidden"}
    >
      ${
        progress.length
          ? progress
              .map(
                (item, index) => `
                  <button
                    class="inline-progress-item ${index === 0 ? "is-current" : ""}"
                    type="button"
                    data-progress-application="${application.id}"
                    data-progress-id="${item.id}"
                    aria-label="编辑 ${escapeHtml(application.company)} ${getStatus(item.stage).label}进展"
                  >
                    <span class="inline-progress-marker" style="--timeline-color:${getStatus(item.stage).color}"></span>
                    <time>${formatDate(item.eventDate)}</time>
                    <strong style="--timeline-color:${getStatus(item.stage).color}">${getStatus(item.stage).label}</strong>
                    <span title="${escapeHtml(item.note || "未填写备注")}">${escapeHtml(item.note || "未填写备注")}</span>
                    ${
                      item.scheduledAt
                        ? `<small>${escapeHtml(formatReminderDate(item.scheduledAt))}</small>`
                        : ""
                    }
                  </button>
                `,
              )
              .join("")
          : '<div class="inline-progress-empty">还没有进展记录</div>'
      }
    </div>
  `;
}

function toggleApplicationTimeline(id) {
  expandedApplicationId = expandedApplicationId === id ? "" : id;
  renderApplications();
}

function renderApplications() {
  const search = document.getElementById("applicationSearch").value.trim().toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const industry = document.getElementById("industryFilter").value;
  const overdueIds = new Set(getOverdueApplications().map((item) => item.id));

  const rows = [...state.applications]
    .filter((item) => {
      if (specialFilter === "overdue" && !overdueIds.has(item.id)) return false;
      if (specialFilter === "interview" && !["first", "second", "final"].includes(item.status)) {
        return false;
      }
      if (!statusMatchesFilter(item, status)) return false;
      if (industry && item.industry !== industry) return false;
      if (search) {
        const progressText = getProgress(item).map((entry) => entry.note).join(" ");
        const haystack =
          `${item.company} ${item.department} ${item.role} ${item.city} ${item.notes} ${item.channel} ${progressText}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const filterNotes = [];
  if (specialFilter === "overdue") filterNotes.push("仅显示待跟进记录");
  if (specialFilter === "interview") filterNotes.push("仅显示面试中的岗位");
  if (status) {
    filterNotes.push(
      status === "interview" ? "进展：面试中" : `进展：${getStatus(status).label}`,
    );
  }
  if (industry) filterNotes.push(`行业：${industry}`);
  if (search) filterNotes.push(`关键词：${search}`);
  const activeFilter = document.getElementById("activeFilter");
  activeFilter.hidden = filterNotes.length === 0;
  document.getElementById("activeFilterText").textContent = filterNotes.join(" · ");

  const remindersByApplication = new Map();
  getActionReminders()
    .sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt)))
    .forEach((reminder) => {
      if (!remindersByApplication.has(reminder.application.id)) {
        remindersByApplication.set(reminder.application.id, reminder);
      }
    });
  document.getElementById("applicationRows").innerHTML = rows
    .map((item) => {
      const latest = getLatestProgress(item);
      const progressCount = getProgress(item).length;
      const reminder = remindersByApplication.get(item.id);
      const theme = reminder ? reminderTheme(reminder.type) : null;
      const expanded = expandedApplicationId === item.id;
      return `
        <article
          class="compact-application-record ${expanded ? "is-expanded" : ""}"
        >
          <div
            class="compact-application-summary"
            data-application-summary="${item.id}"
          >
            <div class="compact-application-line primary-line">
              <strong class="compact-application-title">${escapeHtml(item.company)} · ${escapeHtml(item.role)}</strong>
              <select class="status-select status-${item.status}" data-status-id="${item.id}" aria-label="更新 ${escapeHtml(item.company)} ${escapeHtml(item.role)} 的进展">
                ${statusOptions(item.status)}
              </select>
              <button
                class="application-expand-button"
                type="button"
                data-toggle-application="${item.id}"
                aria-expanded="${expanded}"
                aria-controls="application-progress-${escapeHtml(item.id)}"
                aria-label="${expanded ? "收起" : "展开"} ${escapeHtml(item.company)} ${escapeHtml(item.role)} 的进展时间线"
                title="${expanded ? "收起进展" : "展开进展"}"
              >
                <i class="application-expand-icon" data-lucide="chevron-down"></i>
              </button>
            </div>
            <div class="compact-application-line secondary-line">
              <span class="compact-meta" title="${escapeHtml(item.department || "部门待补充")}"><i data-lucide="building-2"></i>${escapeHtml(item.department || "部门待补充")}</span>
              <span class="compact-meta"><i data-lucide="route"></i>${escapeHtml(item.channel)}</span>
              <span class="compact-meta"><i data-lucide="calendar-days"></i>${latest ? formatDate(latest.eventDate) : "—"}</span>
              <span class="compact-meta ${reminder ? "has-reminder" : ""}" ${theme ? `style="--meta-color:${theme.color}"` : ""}>
                <i data-lucide="${theme ? theme.icon : "bell-off"}"></i>
                ${reminder ? `${theme.label} ${reminderDistance(reminder.dueAt)}` : "暂无提醒"}
              </span>
              <span class="compact-meta"><i data-lucide="list-tree"></i>${progressCount} 条</span>
              <span class="compact-meta"><i data-lucide="image"></i>JD ${item.jdCount || 0} 张</span>
              <button class="row-action" type="button" data-edit-id="${item.id}" aria-label="编辑 ${escapeHtml(item.company)}" title="编辑岗位档案">
                <i data-lucide="pencil"></i>
              </button>
            </div>
          </div>
          ${renderInlineProgressTimeline(item, expanded)}
        </article>
      `;
    })
    .join("");

  document.getElementById("applicationEmpty").hidden = rows.length > 0;
  refreshIcons();
}

function stageMeta(stage) {
  return {
    open: { label: "开放中", className: "stage-open" },
    preheat: { label: "提前批", className: "stage-preheat" },
    watch: { label: "持续关注", className: "stage-watch" },
  }[stage] || { label: "持续关注", className: "stage-watch" };
}

function renderCompanies() {
  const categories = ["全部", ...new Set(COMPANIES.map((item) => item.category))];
  document.getElementById("companyFilters").innerHTML = categories
    .map(
      (category) => `
        <button class="filter-chip ${companyCategory === category ? "is-active" : ""}" type="button" data-company-category="${category}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");

  const search = document.getElementById("companySearch").value.trim().toLowerCase();
  const addedCompanies = new Set(state.applications.map((item) => item.company));
  const companies = COMPANIES.filter((company) => {
    if (companyCategory !== "全部" && company.category !== companyCategory) return false;
    if (search) {
      const haystack =
        `${company.name} ${company.category} ${company.direction} ${company.meta.join(" ")}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  document.getElementById("companyResultCount").textContent = `${companies.length} 家公司`;
  document.getElementById("companyGrid").innerHTML = companies
    .map((company) => {
      const stage = stageMeta(company.stage);
      const added = !isGuest && addedCompanies.has(company.name);
      return `
        <article class="company-card">
          <div class="company-card-head">
            <span class="company-logo" style="--logo-color:${company.color}">${escapeHtml(company.name.slice(0, 1))}</span>
            <span class="company-name">
              <strong>${escapeHtml(company.name)}</strong>
              <span>${escapeHtml(company.category)}</span>
            </span>
            <span class="company-stage ${stage.className}">${stage.label}</span>
          </div>
          <p class="company-direction">${escapeHtml(company.direction)}</p>
          <div class="company-meta">${company.meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
          <div class="company-actions">
            <a class="button ghost" href="${company.url}" target="_blank" rel="noreferrer">
              <i data-lucide="external-link"></i>官方入口
            </a>
            <button class="button ${added ? "is-added" : "primary"}" type="button" data-add-company="${escapeHtml(company.name)}" ${added ? "disabled" : ""}>
              <i data-lucide="${added ? "check" : "plus"}"></i>
              ${added ? "已在目标中" : "加入目标"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
  document.getElementById("companyEmpty").hidden = companies.length > 0;
  refreshIcons();
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

function getReviewCategory(category) {
  return REVIEW_CATEGORY_MAP[category] || REVIEW_CATEGORY_MAP.pending;
}

function categorizeInterviewQuestion(text) {
  const value = normalizeText(text);
  if (/反问|想问|想了解|什么问题|还有问题/.test(value)) return "reverse";
  if (/实习|项目|负责|职责|成果|数据|指标|困难|挑战|复盘|经历/.test(value)) {
    return "internship";
  }
  if (/自我介绍|介绍一下你自己|介绍自己|为什么投|为什么选择|职业规划|优点|缺点|到岗|意向|学校|专业|个人/.test(value)) {
    return "personal";
  }
  if (/业务|行业|用户|增长|运营|策略|产品|场景|方案|竞品|留存|转化|市场/.test(value)) {
    return "business";
  }
  return "pending";
}

function extractInterviewQuestions(transcript) {
  const fragments = String(transcript || "")
    .replace(/\r/g, "")
    .replace(/([？?])/g, "$1\n")
    .split(/\n+|(?<=[。！!])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  const questionCue =
    /[？?]|自我介绍|请介绍|介绍一下|说说|谈谈|为什么|是什么|怎么|如何|哪些|多少|能否|是否|有没有|你觉得|你认为|举个例子|具体负责|遇到过/;
  const seen = new Set();

  return fragments
    .filter((fragment) => questionCue.test(fragment))
    .filter((fragment) => !/^(候选人|我|应聘者)\s*[：:]/.test(fragment))
    .map((fragment) => {
      const originalText = fragment
        .replace(/^\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?\s*/, "")
        .trim();
      const question = originalText
        .replace(/^(面试官|HR|面试者|说话人\s*\d+|Speaker\s*\d+)\s*[：:]\s*/i, "")
        .trim();
      return {
        id: makeId(),
        category: categorizeInterviewQuestion(question),
        question,
        originalText,
        followUps: [],
        confidence: /[？?]/.test(question) ? 0.82 : 0.68,
      };
    })
    .filter((item) => {
      const key = normalizeText(item.question);
      if (!key || key.length < 3 || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 40);
}

function syncInterviewReviewDraftFromEditor() {
  if (!interviewReviewDraft) return;
  interviewReviewDraft.transcript =
    document.getElementById("interviewTranscriptInput").value.trim();
  interviewReviewDraft.summary =
    document.getElementById("interviewReviewSummaryInput").value.trim();
  interviewReviewDraft.questions = [
    ...document.querySelectorAll("[data-review-question-id]"),
  ]
    .map((element) => ({
      id: element.dataset.reviewQuestionId || makeId(),
      category: element.querySelector("[data-review-question-category]").value,
      question: element.querySelector("[data-review-question-text]").value.trim(),
      originalText: element
        .querySelector("[data-review-question-original]")
        .value.trim(),
      followUps: [],
      confidence: Number(element.dataset.reviewQuestionConfidence) || 0,
    }))
    .filter((item) => item.question);
}

function renderInterviewReviewEditor() {
  if (!interviewReviewDraft) return;
  const questions = interviewReviewDraft.questions || [];
  const resultSection = document.getElementById("reviewResultSection");
  resultSection.hidden = questions.length === 0;
  document.getElementById("reviewQuestionSummary").textContent =
    `${questions.length} 个问题`;

  const counts = REVIEW_CATEGORIES.map((category) => ({
    ...category,
    count: questions.filter((item) => item.category === category.value).length,
  })).filter((item) => item.count);
  document.getElementById("reviewCategorySummary").innerHTML = counts
    .map(
      (item) => `
        <span style="--category-color:${item.color}">
          ${item.label}<strong>${item.count}</strong>
        </span>
      `,
    )
    .join("");

  document.getElementById("reviewQuestionList").innerHTML = REVIEW_CATEGORIES
    .map((category) => {
      const categoryQuestions = questions.filter(
        (item) => item.category === category.value,
      );
      if (!categoryQuestions.length) return "";
      return `
        <section class="review-question-group" style="--category-color:${category.color}">
          <div class="review-question-group-title">
            <strong>${category.label}</strong>
            <span>${categoryQuestions.length} 题</span>
          </div>
          ${categoryQuestions
            .map((item) => {
              const index = questions.findIndex((question) => question.id === item.id);
              const expanded = expandedReviewQuestionIds.has(item.id);
              const safeId = escapeHtml(item.id);
              return `
                <article
                  class="review-question-editor ${expanded ? "is-expanded" : ""}"
                  data-review-question-id="${safeId}"
                  data-review-question-confidence="${item.confidence || 0}"
                  style="--category-color:${category.color}"
                >
                  <div class="review-question-index">${String(index + 1).padStart(2, "0")}</div>
                  <button
                    class="review-question-toggle"
                    type="button"
                    data-toggle-review-question="${safeId}"
                    aria-expanded="${expanded}"
                    aria-label="编辑第 ${index + 1} 个问题"
                  >
                    <span>${escapeHtml(item.question || "待补充问题")}</span>
                    <i data-lucide="${expanded ? "chevron-up" : "chevron-down"}"></i>
                  </button>
                  <button
                    class="review-question-category-chip"
                    type="button"
                    data-toggle-review-question="${safeId}"
                    aria-expanded="${expanded}"
                    style="--category-color:${category.color}"
                  >
                    ${category.label}
                  </button>
                  <button
                    class="row-action"
                    type="button"
                    data-remove-review-question="${safeId}"
                    aria-label="删除问题"
                    title="删除问题"
                  >
                    <i data-lucide="trash-2"></i>
                  </button>
                  <div class="review-question-details" ${expanded ? "" : "hidden"}>
                    <label class="review-question-category-field">
                      <span>分类</span>
                      <select data-review-question-category aria-label="问题分类">
                        ${REVIEW_CATEGORIES.map(
                          (option) =>
                            `<option value="${option.value}" ${option.value === item.category ? "selected" : ""}>${option.label}</option>`,
                        ).join("")}
                      </select>
                    </label>
                    <label class="review-question-text-field">
                      <span>整理后问题</span>
                      <input
                        data-review-question-text
                        value="${escapeHtml(item.question)}"
                        aria-label="整理后的问题"
                      >
                    </label>
                    <label class="review-question-original-field">
                      <span>原始提问</span>
                      <textarea data-review-question-original rows="2" aria-label="原始提问">${escapeHtml(item.originalText || item.question)}</textarea>
                    </label>
                  </div>
                </article>
              `;
            })
            .join("")}
        </section>
      `;
    })
    .join("");
  refreshIcons();
}

function openInterviewReviewDialog(applicationId, progressId) {
  const application = state.applications.find((item) => item.id === applicationId);
  const progress = application?.progress.find((item) => item.id === progressId);
  if (!application || !progress || !INTERVIEW_STAGES.has(progress.stage)) {
    showToast("未找到对应的面试进展");
    return;
  }
  selectedInterviewMedia = null;
  expandedReviewQuestionIds.clear();
  const existing = normalizeInterviewReview(progress.interviewReview);
  interviewReviewDraft = existing || {
    status: "reviewing",
    transcript: "",
    questions: [],
    summary: progress.review || "",
    analysisSource: "local",
    model: "",
    sourceFileName: "",
    sourceMimeType: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  document.getElementById("reviewApplicationId").value = application.id;
  document.getElementById("reviewProgressId").value = progress.id;
  document.getElementById("interviewReviewDialogTitle").textContent =
    existing ? "查看与编辑复盘" : "整理面试问题";
  document.getElementById("reviewContext").innerHTML = `
    <span class="review-context-icon"><i data-lucide="${getStatus(progress.stage).icon}"></i></span>
    <span>
      <strong>${escapeHtml(application.company)} · ${escapeHtml(application.role)}</strong>
      <small>${escapeHtml(application.department || "部门待补充")} · ${getStatus(progress.stage).label} · ${
        progress.scheduledAt
          ? escapeHtml(formatReminderDate(progress.scheduledAt))
          : escapeHtml(formatDate(progress.eventDate, true))
      }</small>
    </span>
  `;
  document.getElementById("interviewTranscriptInput").value =
    interviewReviewDraft.transcript;
  document.getElementById("interviewReviewSummaryInput").value =
    interviewReviewDraft.summary;
  document.getElementById("interviewMediaInput").value = "";
  document.getElementById("interviewMediaStatus").textContent =
    interviewReviewDraft.sourceFileName
      ? `${interviewReviewDraft.sourceFileName} · 原文件已释放`
      : "MP3、M4A、WAV、AAC、MP4、MOV、WebM";
  setInterviewTranscriptionStatus("", null);
  setInterviewTranscriptionBusy(false);
  document.getElementById("reviewAnalysisBadge").textContent =
    interviewReviewDraft.analysisSource === "ai"
      ? "AI 已整理"
      : cloudUser && cloudSyncReady
        ? "AI 可用"
        : "本地整理";
  renderInterviewReviewEditor();
  openDialog("interviewReviewDialog");
}

function selectInterviewMedia(file) {
  if (!file) return;
  const supported =
    file.type.startsWith("audio/") ||
    file.type.startsWith("video/") ||
    /\.(mp3|m4a|wav|aac|mp4|mov|webm)$/i.test(file.name);
  if (!supported) {
    showToast("请选择支持的录音或视频文件");
    return;
  }
  if (file.size > INTERVIEW_MEDIA_MAX_BYTES) {
    showToast("单个音视频请控制在 200MB 以内");
    return;
  }
  selectedInterviewMedia = file;
  document.getElementById("interviewMediaStatus").textContent =
    `${file.name} · ${formatFileSize(file.size)} · 等待转写`;
  document.getElementById("transcribeInterviewButton").disabled = false;
  showToast("文件已选择，可以开始转写");
}

function setInterviewTranscriptionStatus(message, progress = null) {
  const status = document.getElementById("interviewTranscriptionStatus");
  const progressBar = document.getElementById("interviewTranscriptionProgress");
  status.textContent = message;
  status.hidden = !message;
  progressBar.hidden = progress === null;
  if (progress !== null) {
    progressBar.value = Math.max(0, Math.min(100, Number(progress) || 0));
  }
}

function setInterviewTranscriptionBusy(busy) {
  const transcribeButton = document.getElementById("transcribeInterviewButton");
  const mediaInput = document.getElementById("interviewMediaInput");
  transcribeButton.disabled = busy || !selectedInterviewMedia;
  mediaInput.disabled = busy;
  document.getElementById("analyzeInterviewButton").disabled = busy;
  document.getElementById("saveInterviewReviewButton").disabled = busy;
  document.getElementById("transcribeInterviewButtonLabel").textContent =
    busy ? "正在转写" : "转写音视频";
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function interviewMediaFormat(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (extension === "mp3" || file.type === "audio/mpeg") return "mp3";
  if (extension === "wav" || /audio\/(wav|x-wav)/.test(file.type)) return "wav";
  if (extension === "ogg" || file.type === "audio/ogg") return "ogg";
  return "";
}

function writeWavString(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodeWav(audioBuffer) {
  const samples = audioBuffer.getChannelData(0);
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeWavString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeWavString(view, 8, "WAVE");
  writeWavString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeWavString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(
      44 + index * 2,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true,
    );
  }
  return new Blob([buffer], { type: "audio/wav" });
}

async function convertInterviewMediaToWav(file) {
  setInterviewTranscriptionStatus("正在提取音轨并转换格式", 3);
  const AudioContextClass = window.AudioContext || window["webkitAudioContext"];
  if (!AudioContextClass || !window.OfflineAudioContext) {
    throw new Error("当前浏览器不支持音视频转码，请改用 MP3、WAV 或 OGG");
  }
  const audioContext = new AudioContextClass();
  let decoded;
  try {
    decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new Error("无法读取该音视频的音轨，请转换为 MP3 或 WAV 后重试");
  } finally {
    await audioContext.close().catch(() => {});
  }
  const frameCount = Math.ceil(decoded.duration * 16000);
  const offlineContext = new OfflineAudioContext(1, frameCount, 16000);
  const source = offlineContext.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineContext.destination);
  source.start();
  const rendered = await offlineContext.startRendering();
  const wav = encodeWav(rendered);
  if (wav.size > INTERVIEW_MEDIA_MAX_BYTES) {
    throw new Error("转换后的音频超过 200MB，请压缩或拆分后重试");
  }
  const baseName = file.name.replace(/\.[^.]+$/, "").slice(0, 80) || "interview";
  return new File([wav], `${baseName}.wav`, { type: "audio/wav" });
}

async function prepareInterviewMedia(file) {
  const format = interviewMediaFormat(file);
  if (format) return { file, format };
  const converted = await convertInterviewMediaToWav(file);
  return { file: converted, format: "wav" };
}

function uploadInterviewMedia(file, path) {
  if (!window.tus?.Upload) {
    return supabaseClient.storage
      .from(CLOUD_INTERVIEW_MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      })
      .then(({ error }) => {
        if (error) throw error;
      });
  }
  return supabaseClient.auth.getSession().then(({ data, error }) => {
    const session = data?.session;
    if (error || !session?.access_token) {
      throw error || new Error("登录状态已失效，请重新登录");
    }
    const config = getCloudConfig();
    return new Promise((resolve, reject) => {
      const upload = new window.tus.Upload(file, {
        endpoint: `${config.url}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          apikey: config.key,
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024,
        metadata: {
          bucketName: CLOUD_INTERVIEW_MEDIA_BUCKET,
          objectName: path,
          contentType: file.type,
          cacheControl: "3600",
        },
        onError: reject,
        onProgress: (uploaded, total) => {
          const percent = total ? Math.round((uploaded / total) * 100) : 0;
          setInterviewTranscriptionStatus(`正在上传 ${percent}%`, percent);
        },
        onSuccess: resolve,
      });
      activeInterviewTranscription.upload = upload;
      upload.start();
    });
  });
}

async function invokeInterviewTranscription(body) {
  const { data, error } = await supabaseClient.functions.invoke(
    CLOUD_INTERVIEW_ASR_FUNCTION,
    { body },
  );
  if (error) throw error;
  if (!data || typeof data !== "object") {
    throw new Error("转写服务返回内容无效");
  }
  if (data.error) {
    const messages = {
      asr_not_configured: "Seed-ASR 尚未配置",
      asr_not_activated: "Seed-ASR 2.0 尚未开通，请先在火山控制台启用服务",
      silent_audio: "音视频中没有检测到清晰人声",
      media_not_found: "临时音频不存在，请重新上传",
    };
    throw new Error(messages[data.error] || "音视频转写失败");
  }
  return data;
}

async function cleanupInterviewTranscription(job = activeInterviewTranscription) {
  if (!job) return;
  job.cancelled = true;
  job.upload?.abort?.();
  activeInterviewTranscription = null;
  if (job.path && supabaseClient && cloudUser) {
    await invokeInterviewTranscription({
      action: "cancel",
      path: job.path,
    }).catch(() => {});
  }
}

async function transcribeSelectedInterviewMedia() {
  if (!checkGuestPermission()) return;
  if (!selectedInterviewMedia) {
    showToast("请先选择录音或视频");
    return;
  }
  if (!supabaseClient || !cloudUser || !cloudSyncReady) {
    showToast("登录后才能使用云端音视频转写");
    return;
  }
  const applicationId = document.getElementById("reviewApplicationId").value;
  const progressId = document.getElementById("reviewProgressId").value;
  if (!applicationId || !progressId) return;

  const originalFile = selectedInterviewMedia;
  const job = { path: "", taskId: "", upload: null, cancelled: false };
  activeInterviewTranscription = job;
  setInterviewTranscriptionBusy(true);
  try {
    const prepared = await prepareInterviewMedia(originalFile);
    if (job.cancelled) return;
    const safeApplicationId = applicationId.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeProgressId = progressId.replace(/[^a-zA-Z0-9_-]/g, "");
    const extension = prepared.format;
    job.path =
      `${cloudUser.id}/${safeApplicationId}_${safeProgressId}_${makeId()}.${extension}`;
    setInterviewTranscriptionStatus("正在上传 0%", 0);
    await uploadInterviewMedia(prepared.file, job.path);
    if (job.cancelled) return;

    setInterviewTranscriptionStatus("已上传，正在提交 Seed-ASR", 100);
    const started = await invokeInterviewTranscription({
      action: "start",
      path: job.path,
      format: prepared.format,
    });
    job.taskId = String(started.taskId || "");
    if (!job.taskId) throw new Error("转写任务创建失败");

    const deadline = Date.now() + INTERVIEW_ASR_TIMEOUT;
    let result = null;
    while (!job.cancelled && Date.now() < deadline) {
      setInterviewTranscriptionStatus("Seed-ASR 正在识别并区分说话人", null);
      await wait(INTERVIEW_ASR_POLL_INTERVAL);
      if (job.cancelled) return;
      const status = await invokeInterviewTranscription({
        action: "status",
        taskId: job.taskId,
        path: job.path,
      });
      if (status.status === "completed") {
        result = status;
        break;
      }
    }
    if (!result) throw new Error("转写等待超时，请稍后重新上传");
    document.getElementById("interviewTranscriptInput").value =
      String(result.transcript || "");
    interviewReviewDraft.transcript = String(result.transcript || "");
    interviewReviewDraft.sourceFileName = originalFile.name;
    interviewReviewDraft.sourceMimeType = originalFile.type;
    selectedInterviewMedia = null;
    activeInterviewTranscription = null;
    document.getElementById("interviewMediaInput").value = "";
    document.getElementById("interviewMediaStatus").textContent =
      `${originalFile.name} · 转写完成，原文件已删除`;
    setInterviewTranscriptionStatus("转写完成，正在整理问题", null);
    await analyzeInterviewTranscript();
    setInterviewTranscriptionStatus("原始音视频已从临时存储删除", null);
  } catch (error) {
    console.warn("Interview transcription failed.", error?.message || error);
    await cleanupInterviewTranscription(job);
    setInterviewTranscriptionStatus("", null);
    showToast(error?.message || "音视频转写失败");
  } finally {
    if (activeInterviewTranscription === job) {
      activeInterviewTranscription = null;
    }
    setInterviewTranscriptionBusy(false);
  }
}

function normalizeAiInterviewQuestions(result) {
  const normalized = [];
  const source = Array.isArray(result?.questions) ? result.questions : [];
  source.forEach((item) => {
    const category = REVIEW_CATEGORY_MAP[item?.category]
      ? item.category
      : "pending";
    const confidence = Math.max(0, Math.min(1, Number(item?.confidence) || 0));
    const question = String(item?.question || "").trim();
    if (question) {
      normalized.push({
        id: makeId(),
        category,
        question,
        originalText: String(item?.originalText || question).trim(),
        followUps: [],
        confidence,
      });
    }
    if (Array.isArray(item?.followUps)) {
      item.followUps
        .map((followUp) => String(followUp || "").trim())
        .filter(Boolean)
        .forEach((followUp) => {
          normalized.push({
            id: makeId(),
            category,
            question: followUp,
            originalText: followUp,
            followUps: [],
            confidence,
          });
        });
    }
  });
  return normalized.slice(0, 60);
}

async function analyzeInterviewTranscriptWithAi(transcript) {
  if (!supabaseClient || !cloudUser || !cloudSyncReady) return null;
  const applicationId = document.getElementById("reviewApplicationId").value;
  const progressId = document.getElementById("reviewProgressId").value;
  const application = state.applications.find((item) => item.id === applicationId);
  const progress = application?.progress.find((item) => item.id === progressId);
  if (!application || !progress) return null;

  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(
      () => reject(new Error("AI 整理超时")),
      CLOUD_INTERVIEW_AI_TIMEOUT,
    );
  });
  const invoke = supabaseClient.functions.invoke(CLOUD_INTERVIEW_AI_FUNCTION, {
    body: {
      transcript: transcript.slice(0, 60000),
      company: application.company,
      role: application.role,
      stage: getStatus(progress.stage).label,
    },
  });

  try {
    const { data, error } = await Promise.race([invoke, timeout]);
    if (error) throw error;
    if (!data?.result || typeof data.result !== "object") {
      throw new Error("AI 返回内容无效");
    }
    return {
      questions: normalizeAiInterviewQuestions(data.result),
      summary: String(data.result.summary || "").trim(),
      model: String(data.model || ""),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function analyzeInterviewTranscript() {
  if (!checkGuestPermission() || !interviewReviewDraft) return;
  const sessionVersion = cloudSessionVersion;
  const draft = interviewReviewDraft;
  const transcript = document.getElementById("interviewTranscriptInput").value.trim();
  if (!transcript) {
    showToast("请先粘贴面试转写文本");
    document.getElementById("interviewTranscriptInput").focus();
    return;
  }
  const button = document.getElementById("analyzeInterviewButton");
  const buttonLabel = document.getElementById("analyzeInterviewButtonLabel");
  button.disabled = true;
  buttonLabel.textContent = "正在整理";
  syncInterviewReviewDraftFromEditor();
  interviewReviewDraft.transcript = transcript;
  const localQuestions = extractInterviewQuestions(transcript);
  let aiResult = null;
  let aiFailed = false;
  try {
    aiResult = await analyzeInterviewTranscriptWithAi(transcript);
  } catch (error) {
    aiFailed = true;
    console.warn("Cloud interview analysis unavailable.", error?.message || error);
  } finally {
    button.disabled = false;
    buttonLabel.textContent = "AI 整理问题";
  }

  if (sessionVersion !== cloudSessionVersion || interviewReviewDraft !== draft) return;
  if (aiResult?.questions.length) {
    interviewReviewDraft.questions = aiResult.questions;
    interviewReviewDraft.analysisSource = "ai";
    interviewReviewDraft.model = aiResult.model;
    if (!interviewReviewDraft.summary && aiResult.summary) {
      interviewReviewDraft.summary = aiResult.summary;
      document.getElementById("interviewReviewSummaryInput").value = aiResult.summary;
    }
    document.getElementById("reviewAnalysisBadge").textContent = "AI 已整理";
    showToast(`AI 已整理 ${aiResult.questions.length} 个问题`);
  } else {
    interviewReviewDraft.questions = localQuestions;
    interviewReviewDraft.analysisSource = "local";
    interviewReviewDraft.model = "";
    document.getElementById("reviewAnalysisBadge").textContent = "本地整理";
    if (!interviewReviewDraft.questions.length) {
      showToast("暂未识别到明确问题，可手动添加");
      interviewReviewDraft.questions.push({
        id: makeId(),
        category: "pending",
        question: "",
        originalText: "",
        followUps: [],
        confidence: 0,
      });
    } else if (!aiResult) {
      showToast(
        aiFailed
          ? `AI 暂时不可用，本地已整理 ${interviewReviewDraft.questions.length} 个问题`
          : `本地已整理 ${interviewReviewDraft.questions.length} 个候选问题`,
      );
    }
  }
  document.getElementById("reviewResultSection").hidden = false;
  expandedReviewQuestionIds.clear();
  renderInterviewReviewEditor();
}

function addInterviewQuestion() {
  if (!interviewReviewDraft) return;
  syncInterviewReviewDraftFromEditor();
  const id = makeId();
  interviewReviewDraft.questions.push({
    id,
    category: "pending",
    question: "",
    originalText: "",
    followUps: [],
    confidence: 0,
  });
  expandedReviewQuestionIds.add(id);
  document.getElementById("reviewResultSection").hidden = false;
  renderInterviewReviewEditor();
  document
    .querySelector(`[data-review-question-id="${id}"] [data-review-question-text]`)
    ?.focus();
}

function removeInterviewQuestion(id) {
  if (!checkGuestPermission()) return;
  if (!interviewReviewDraft) return;
  syncInterviewReviewDraftFromEditor();
  expandedReviewQuestionIds.delete(id);
  interviewReviewDraft.questions = interviewReviewDraft.questions.filter(
    (item) => item.id !== id,
  );
  renderInterviewReviewEditor();
}

function toggleInterviewQuestion(id) {
  if (!interviewReviewDraft) return;
  syncInterviewReviewDraftFromEditor();
  if (expandedReviewQuestionIds.has(id)) {
    expandedReviewQuestionIds.delete(id);
  } else {
    expandedReviewQuestionIds.add(id);
  }
  renderInterviewReviewEditor();
  if (expandedReviewQuestionIds.has(id)) {
    document
      .querySelector(`[data-review-question-id="${id}"] [data-review-question-text]`)
      ?.focus();
  }
}

function saveInterviewReview() {
  if (!checkGuestPermission()) return;
  const applicationId = document.getElementById("reviewApplicationId").value;
  const progressId = document.getElementById("reviewProgressId").value;
  const application = state.applications.find((item) => item.id === applicationId);
  const progress = application?.progress.find((item) => item.id === progressId);
  if (!application || !progress || !interviewReviewDraft) return;

  syncInterviewReviewDraftFromEditor();
  if (!interviewReviewDraft.questions.length && !interviewReviewDraft.summary) {
    showToast("请至少保留一个问题或填写复盘备注");
    return;
  }
  const now = new Date().toISOString();
  progress.interviewReview = {
    ...interviewReviewDraft,
    status: "completed",
    sourceFileName: interviewReviewDraft.sourceFileName || "",
    sourceMimeType: interviewReviewDraft.sourceMimeType || "",
    updatedAt: now,
  };
  progress.review =
    interviewReviewDraft.summary ||
    progress.review ||
    `已整理 ${interviewReviewDraft.questions.length} 个面试问题`;
  application.updatedAt = now;
  selectedInterviewMedia = null;
  interviewReviewDraft = null;
  saveState();
  closeDialog("interviewReviewDialog");
  renderAll();
  showToast("面试复盘已保存");
}

function renderAll() {
  renderAuthGate();
  if (!canBrowseWorkspace()) {
    renderAccount();
    return;
  }
  document
    .querySelector(".app-shell")
    ?.classList.toggle("is-dashboard-shell", currentView === "dashboard");
  renderNavigation();
  renderAccount();
  if (currentView === "dashboard") renderDashboard();
  if (currentView === "funnel") renderFunnel();
  if (currentView === "applications") renderApplications();
  if (currentView === "reviews") renderInterviewReviews();
  if (currentView === "fairs") window.renderFairs?.();
  if (currentView === "companies") renderCompanies();
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\s·•\-_/（）()【】[\]，,。.!！?？:：；;]/g, "");
}

function findCompany(text) {
  const lowered = text.toLowerCase();
  const candidates = COMPANIES.flatMap((company) => [
    { company, token: company.name },
    ...company.aliases.map((token) => ({ company, token })),
  ]).sort((a, b) => b.token.length - a.token.length);
  return (
    candidates.find((item) => lowered.includes(item.token.toLowerCase())) || null
  );
}

function parseEventDate(text) {
  const now = new Date();
  const makeLocalDate = (year, month, day) => {
    const date = new Date(year, month - 1, day, 12);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "";
    }
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  if (/前天/.test(text)) return dateOffset(-2);
  if (/昨天|昨日/.test(text)) return dateOffset(-1);
  if (/今天|今日|刚刚/.test(text)) return today();

  let match = text.match(/(20\d{2})[-/.年](\d{1,2})[-/.月](\d{1,2})[日号]?/);
  if (match) return makeLocalDate(Number(match[1]), Number(match[2]), Number(match[3]));

  match = text.match(/(\d{1,2})月(\d{1,2})[日号]?/);
  if (match) {
    let year = now.getFullYear();
    const candidate = new Date(year, Number(match[1]) - 1, Number(match[2]), 12);
    if (candidate.getTime() - now.getTime() > 120 * 86400000) year -= 1;
    return makeLocalDate(year, Number(match[1]), Number(match[2]));
  }
  return today();
}

function parseChineseNumber(value) {
  const text = String(value || "").replace(/分$/, "");
  if (/^\d+$/.test(text)) return Number(text);
  const digits = { 零: 0, 〇: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (text === "十") return 10;
  if (text.includes("十")) {
    const [tens, ones] = text.split("十");
    return (tens ? digits[tens] : 1) * 10 + (ones ? digits[ones] : 0);
  }
  return digits[text];
}

function toLocalDateValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function makeLocalDateValue(year, month, day) {
  const date = new Date(year, month - 1, day, 12);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "";
  }
  return toLocalDateValue(date);
}

function parseScheduleDate(text) {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const addDays = (days, token) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return { date: toLocalDateValue(date), token };
  };

  const durationDays = text.match(/([零〇一二两三四五六七八九十\d]{1,3})\s*天内/);
  if (durationDays) {
    const days = parseChineseNumber(durationDays[1]);
    if (Number.isFinite(days)) return addDays(days, durationDays[0]);
  }

  const futureRelatives = [
    [/大后天/, 3],
    [/后天/, 2],
    [/明天|明日/, 1],
  ];
  for (const [pattern, days] of futureRelatives) {
    const match = text.match(pattern);
    if (match) return addDays(days, match[0]);
  }

  const weekdayMap = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 日: 7, 天: 7 };
  const weekdayDate = (weekday, weekOffset, token, rollForward = false) => {
    const currentWeekday = now.getDay() || 7;
    const date = new Date(now);
    date.setDate(
      now.getDate() - (currentWeekday - 1) + weekOffset * 7 + (weekday - 1),
    );
    if (rollForward && date < now) date.setDate(date.getDate() + 7);
    return { date: toLocalDateValue(date), token };
  };

  let match = text.match(/(?:下周|下星期)([一二三四五六日天])?/);
  if (match) return weekdayDate(weekdayMap[match[1]] || 1, 1, match[0]);

  match = text.match(/(?:本周|这周|本星期|这星期)([一二三四五六日天])/);
  if (match) return weekdayDate(weekdayMap[match[1]], 0, match[0]);

  match = text.match(/(?:周|星期|礼拜)([一二三四五六日天])/);
  if (match) return weekdayDate(weekdayMap[match[1]], 0, match[0], true);

  match = text.match(/(20\d{2})[-/.年](\d{1,2})[-/.月](\d{1,2})[日号]?/);
  if (match) {
    return {
      date: makeLocalDateValue(Number(match[1]), Number(match[2]), Number(match[3])),
      token: match[0],
    };
  }

  match = text.match(/(\d{1,2})月(\d{1,2})[日号]?/);
  if (match) {
    let year = now.getFullYear();
    const month = Number(match[1]);
    const day = Number(match[2]);
    const candidate = new Date(year, month - 1, day, 12);
    if (candidate.getTime() - now.getTime() < -120 * 86400000) year += 1;
    return { date: makeLocalDateValue(year, month, day), token: match[0] };
  }

  const currentAndPast = [
    [/今天|今日|今晚/, 0],
    [/昨天|昨日/, -1],
    [/前天/, -2],
  ];
  for (const [pattern, days] of currentAndPast) {
    const relativeMatch = text.match(pattern);
    if (relativeMatch) return addDays(days, relativeMatch[0]);
  }
  return null;
}

function parseClockExpressions(text) {
  const periodPattern = "凌晨|早上|上午|中午|下午|傍晚|晚上";
  const clockPattern = new RegExp(
    `(${periodPattern})?\\s*(?:(\\d{1,2})[:：](\\d{2})|([零〇一二两三四五六七八九十\\d]{1,3})[点时](半|[零〇一二两三四五六七八九十\\d]{1,3}分?)?)`,
    "g",
  );
  const matches = [];
  let match;
  while ((match = clockPattern.exec(text))) {
    const period = match[1] || "";
    let hour = match[2] ? Number(match[2]) : parseChineseNumber(match[4]);
    let minute = match[3]
      ? Number(match[3])
      : match[5] === "半"
        ? 30
        : parseChineseNumber(match[5] || "0");
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) continue;
    if (period === "下午" || period === "傍晚" || period === "晚上") {
      if (hour < 12) hour += 12;
    } else if (period === "中午") {
      if (hour < 11) hour += 12;
    } else if (period === "凌晨" && hour === 12) {
      hour = 0;
    }
    if (hour > 23 || minute > 59) continue;
    matches.push({
      raw: match[0],
      index: match.index,
      period,
      hour,
      minute,
    });
  }
  return matches;
}

function dateTimeFromParts(date, hour, minute) {
  if (!date) return "";
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseScheduledProgress(text, stage) {
  const scheduleCue =
    /(?:面试时间|面试日期|面试安排|会议时间|笔试时间|测评时间|考试时间|日期及时间|date\s*(?:&|and)?\s*time|interview\s*(?:date|time)|meeting\s*time)/i;
  const cueIndex = text.search(scheduleCue);
  const scheduleText = cueIndex >= 0 ? text.slice(cueIndex, cueIndex + 260) : text;
  const scheduleDate = parseScheduleDate(scheduleText) || parseScheduleDate(text);
  let clockSource = scheduleText;
  let clocks = parseClockExpressions(scheduleText);
  if (!clocks.length && scheduleText !== text) {
    clockSource = text;
    clocks = parseClockExpressions(text);
  }
  const timedStage = stage === "assessment" || INTERVIEW_STAGES.has(stage);
  const hasScheduleCue =
    /(安排|约在|定在|将于|面试时间|面试日期|会议时间|测评截止|笔试截止|截止(?:到|于)?|完成时间|考试时间|开考|date\s*(?:&|and)?\s*time|interview\s*(?:date|time))/i.test(
      scheduleText,
    );
  const hasFutureExpression =
    /(明天|明日|后天|大后天|下周|下星期|本周|这周|周[一二三四五六日天]|星期[一二三四五六日天]|\d+\s*天内)/.test(
      scheduleText,
    );
  const durationHours = scheduleText.match(
    /([零〇一二两三四五六七八九十\d]{1,3})\s*小时内/,
  );
  const preparationOnly =
    /(明天|明日|后天|大后天|下周(?:[一二三四五六日天])?|下星期(?:[一二三四五六日天])?|周[一二三四五六日天]|星期[一二三四五六日天]|\d{1,2}月\d{1,2}[日号]?)\s*(准备|复习|整理|练习|完善|修改|补充)/.test(
      scheduleText,
    );

  if (durationHours && (hasScheduleCue || timedStage)) {
    const hours = parseChineseNumber(durationHours[1]);
    if (Number.isFinite(hours)) {
      const target = new Date(Date.now() + hours * 3600000);
      return {
        scheduledAt: toDateTimeInput(target.toISOString()),
        endedAt: "",
      };
    }
  }

  if (preparationOnly && !hasScheduleCue && !clocks.length) {
    return { scheduledAt: "", endedAt: "" };
  }

  const scheduleDateIsFuture = scheduleDate && scheduleDate.date > today();
  const shouldParse =
    (scheduleDate &&
      (hasScheduleCue ||
        hasFutureExpression ||
        clocks.length ||
        (timedStage && scheduleDateIsFuture))) ||
    (clocks.length && (hasScheduleCue || timedStage));
  if (!shouldParse) return { scheduledAt: "", endedAt: "" };

  const date = scheduleDate ? scheduleDate.date : today();
  const defaultHour = stage === "assessment" ? 23 : 10;
  const defaultMinute = stage === "assessment" ? 59 : 0;
  const first = clocks[0] || { hour: defaultHour, minute: defaultMinute, period: "" };
  let scheduledAt = dateTimeFromParts(date, first.hour, first.minute);
  let endedAt = "";

  if (clocks.length > 1) {
    const second = { ...clocks[1] };
    const separator = clockSource.slice(
      first.index + first.raw.length,
      second.index,
    );
    if (/(?:到|至|[-—~～])/.test(separator)) {
      if (
        !second.period &&
        ["下午", "傍晚", "晚上"].includes(first.period) &&
        second.hour < 12
      ) {
        second.hour += 12;
      }
      endedAt = dateTimeFromParts(date, second.hour, second.minute);
      if (new Date(endedAt) <= new Date(scheduledAt)) {
        const nextDay = new Date(`${endedAt}:00`);
        nextDay.setDate(nextDay.getDate() + 1);
        endedAt = toDateTimeInput(nextDay.toISOString());
      }
    }
  }
  return { scheduledAt, endedAt };
}

function detectStage(text) {
  const lowered = text.toLowerCase();
  const rules = [
    { stage: "offer", keywords: ["offer", "录用", "意向书", "oc"] },
    { stage: "rejected", keywords: ["挂了", "被挂", "拒绝", "拒信", "未通过", "没过", "流程结束", "已结束"] },
    { stage: "final", keywords: ["终面", "最终面", "最终轮面试", "hr面", "hr 面", "final round", "hr interview"] },
    { stage: "second", keywords: ["二面", "第二轮面试", "二轮面试", "第2轮面试", "第二面", "second round", "round 2"] },
    { stage: "first", keywords: ["一面", "初面", "第一轮面试", "首轮面试", "第1轮面试", "进面", "面试邀请", "面试", "interview invitation", "first round", "round 1", "interview"] },
    { stage: "assessment", keywords: ["测评", "笔试", "在线测试"] },
    { stage: "applied", keywords: ["已投递", "投递了", "投了", "网申", "提交简历", "完成投递"] },
    { stage: "wish", keywords: ["想投", "关注", "收藏", "目标"] },
  ];
  for (const rule of rules) {
    if (rule.keywords.some((keyword) => lowered.includes(keyword.toLowerCase()))) {
      return rule.stage;
    }
  }
  return "other";
}

function detectChannel(text) {
  if (/(?:BOSS直聘|Boss直聘|Boss|BOSS)/i.test(text)) return "Boss";
  if (/(?:内推|内推码|找人推)/.test(text)) return "内推";
  if (/(?:线下|双选会|宣讲会|招聘会)/.test(text)) return "线下";
  if (/(?:官网|网申|校招官网|官方招聘)/.test(text)) return "官网";
  return "其他";
}

function cleanCapturedField(value, type = "generic") {
  let result = String(value || "")
    .split(/\n|\r|\||｜/)[0]
    .replace(/^[\s:：\-—]+|[\s,，;；。]+$/g, "")
    .replace(
      /\s*(?:面试时间|面试日期|面试地点|会议链接|部门|事业群|应聘岗位|岗位名称|职位名称|position|interview).*/i,
      "",
    )
    .trim();
  if (type === "role") result = result.replace(/(?:岗位|职位|岗)$/g, "").trim();
  return result.slice(0, type === "company" ? 40 : 30);
}

function extractLabeledField(text, labels, type = "generic") {
  const match = text.match(
    new RegExp(`(?:${labels})\\s*[:：]\\s*([^\\n\\r]{2,60})`, "i"),
  );
  return match ? cleanCapturedField(match[1], type) : "";
}

function inferCompanyFromText(text) {
  const labeled = extractLabeledField(
    text,
    "公司(?:名称)?|企业(?:名称)?|company(?:\\s*name)?",
    "company",
  );
  if (labeled) return labeled;
  const invitation = text.match(
    /([A-Za-z0-9\u4e00-\u9fa5·]{2,32}(?:有限责任公司|有限公司|集团|科技|网络|咨询|银行|汽车))(?=[^\n\r]{0,18}(?:面试|招聘|邀请))/,
  );
  return invitation ? cleanCapturedField(invitation[1], "company") : "";
}

function findMatchingApplications(company, department, role) {
  const companyKey = normalizeText(company);
  const departmentKey = normalizeText(department);
  const roleKey = normalizeText(role);
  return state.applications
    .map((application) => {
      let score = 0;
      const appCompany = normalizeText(application.company);
      const appDepartment = normalizeText(application.department);
      const appRole = normalizeText(application.role);
      if (companyKey && appCompany === companyKey) score += 8;
      else if (companyKey && (appCompany.includes(companyKey) || companyKey.includes(appCompany))) {
        score += 5;
      }
      if (roleKey && appRole === roleKey) score += 6;
      else if (roleKey && (appRole.includes(roleKey) || roleKey.includes(appRole))) score += 3;
      if (departmentKey && appDepartment === departmentKey) score += 3;
      else if (
        departmentKey &&
        appDepartment &&
        (appDepartment.includes(departmentKey) || departmentKey.includes(appDepartment))
      ) {
        score += 1;
      }
      return { application, score };
    })
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score);
}

function parseQuickCapture(text) {
  const raw = String(text || "").trim();
  const companyHit = findCompany(raw);
  let company = companyHit ? companyHit.company.name : inferCompanyFromText(raw);
  const companyToken = companyHit ? companyHit.token : "";
  const companyIndex = companyToken
    ? raw.toLowerCase().indexOf(companyToken.toLowerCase())
    : -1;
  const afterCompany = companyIndex >= 0
    ? raw.slice(companyIndex + companyToken.length)
    : raw;

  const labeledDepartment = extractLabeledField(
    raw,
    "应聘部门|面试部门|部门|事业群|business\\s*unit|department",
  );
  const departmentMatch = afterCompany.match(
    /([A-Za-z0-9\u4e00-\u9fa5]{2,16}(?:事业群|事业部|部门|产品部|业务部|运营部|技术部|市场部|销售部|研发部|平台部|中心|团队|业务线|项目组|小组|BG|BU))/i,
  );
  let department = labeledDepartment || (departmentMatch ? departmentMatch[1] : "");
  if (company && department.startsWith(company)) department = department.slice(company.length);
  if (companyToken && department.startsWith(companyToken)) {
    department = department.slice(companyToken.length);
  }

  const labeledRole = extractLabeledField(
    raw,
    "应聘岗位|面试岗位|应聘职位|岗位名称|职位名称|岗位|职位|job\\s*title|position",
    "role",
  );
  const existingRole = company
    ? state.applications
        .filter((item) => normalizeText(item.company) === normalizeText(company))
        .map((item) => item.role)
        .sort((a, b) => b.length - a.length)
        .find((role) => normalizeText(raw).includes(normalizeText(role)))
    : "";
  const keywordRole = ROLE_KEYWORDS.sort((a, b) => b.length - a.length).find((role) =>
    normalizeText(raw).includes(normalizeText(role)),
  );
  let role = labeledRole || existingRole || keywordRole || "";
  if (!role) {
    let roleArea = afterCompany;
    if (department) roleArea = roleArea.replace(department, "");
    const roleMatch = roleArea.match(
      /([A-Za-z0-9\u4e00-\u9fa5 +#/]{2,18}?)(?:岗位|岗)(?:已|进|收到|$|[，,。])/,
    );
    role = roleMatch ? roleMatch[1].trim() : "";
  }

  const stage = detectStage(raw);
  const channel = detectChannel(raw);
  const schedule = parseScheduledProgress(raw, stage);
  let eventDate = parseEventDate(raw);
  if (
    schedule.scheduledAt &&
    schedule.scheduledAt.slice(0, 10) > today() &&
    !/(昨天|昨日|前天|今天|今日|刚刚)/.test(raw)
  ) {
    eventDate = today();
  }
  const clauses = raw.split(/[，,；;。]/).map((item) => item.trim()).filter(Boolean);
  let note = clauses.length > 1 ? clauses.slice(1).join("；") : "";
  if (!note && stage === "other") note = raw;
  note = note
    .replace(/^(并且|然后|同时|另外|以及)/, "")
    .trim();

  let matches = findMatchingApplications(company, department, role);
  if (!company && matches.length === 1) {
    company = matches[0].application.company;
    matches = findMatchingApplications(company, department, role);
  }
  if (!role && matches.length === 1) role = matches[0].application.role;
  if (!department && matches.length === 1) department = matches[0].application.department;

  return {
    raw,
    company,
    department,
    role,
    stage,
    channel,
    eventDate,
    scheduledAt: schedule.scheduledAt,
    endedAt: schedule.endedAt,
    recordedAt: new Date().toISOString(),
    note,
    matches,
  };
}

function normalizeAiDate(value, fallback = "") {
  const date = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fallback;
  return Number.isNaN(new Date(`${date}T12:00:00`).getTime()) ? fallback : date;
}

function normalizeAiDateTime(value, fallback = "") {
  const dateTime = String(value || "").trim().slice(0, 16);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime)) return fallback;
  return Number.isNaN(new Date(dateTime).getTime()) ? fallback : dateTime;
}

function mergeAiCapture(localDraft, aiResult) {
  const aiStage = normalizeStatus(aiResult.stage);
  const stage =
    aiStage === "other" && localDraft.stage !== "other"
      ? localDraft.stage
      : aiStage;
  const company =
    cleanCapturedField(aiResult.company, "company") || localDraft.company;
  const department =
    cleanCapturedField(aiResult.department) || localDraft.department;
  const role =
    cleanCapturedField(aiResult.role, "role") || localDraft.role;
  const scheduledAt = normalizeAiDateTime(
    aiResult.scheduledAt,
    localDraft.scheduledAt,
  );
  let endedAt = normalizeAiDateTime(aiResult.endedAt, localDraft.endedAt);
  if (
    scheduledAt &&
    endedAt &&
    new Date(endedAt).getTime() <= new Date(scheduledAt).getTime()
  ) {
    endedAt = "";
  }

  let matches = findMatchingApplications(company, department, role);
  const matchedApplication = matches.length === 1 ? matches[0].application : null;

  return {
    ...localDraft,
    company: company || matchedApplication?.company || "",
    department: department || matchedApplication?.department || "",
    role: role || matchedApplication?.role || "",
    stage,
    channel: normalizeChannel(aiResult.channel || localDraft.channel),
    eventDate: normalizeAiDate(aiResult.eventDate, localDraft.eventDate),
    scheduledAt,
    endedAt,
    note: String(aiResult.note || localDraft.note || "").trim().slice(0, 500),
    matches,
    aiEnhanced: true,
    aiConfidence: Math.max(0, Math.min(1, Number(aiResult.confidence) || 0)),
    aiWarnings: Array.isArray(aiResult.warnings)
      ? aiResult.warnings.map((item) => String(item).trim()).filter(Boolean).slice(0, 5)
      : [],
  };
}

async function parseQuickCaptureWithAi(text, options = {}) {
  if (!supabaseClient || !cloudUser || !cloudSyncReady) return null;

  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(
      () => reject(new Error("AI 识别超时")),
      CLOUD_AI_TIMEOUT,
    );
  });
  const invoke = supabaseClient.functions.invoke(CLOUD_AI_FUNCTION, {
    body: {
      text: String(text || "").slice(0, 12000),
      source: options.source === "image" ? "image" : "text",
      currentDate: today(),
      timezone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai",
      existingApplications: state.applications.slice(0, 50).map((application) => ({
        company: application.company,
        department: application.department,
        role: application.role,
      })),
    },
  });

  try {
    const { data, error } = await Promise.race([invoke, timeout]);
    if (error) throw error;
    if (!data?.result || typeof data.result !== "object") {
      throw new Error("AI 返回内容无效");
    }
    return data.result;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function openCapturePreview(text, options = {}) {
  const sessionVersion = cloudSessionVersion;
  const localDraft = parseQuickCapture(text);
  let parsedDraft = localDraft;

  if (supabaseClient && cloudUser && cloudSyncReady) {
    quickAiBusy = true;
    renderQuickCaptureImage();
    showToast("正在使用 AI 提取关键信息");
    try {
      const aiResult = await parseQuickCaptureWithAi(text, options);
      if (aiResult) parsedDraft = mergeAiCapture(localDraft, aiResult);
    } catch (error) {
      if (sessionVersion !== cloudSessionVersion) return;
      console.warn("Cloud AI parsing unavailable.", error?.message || error);
      showToast("AI 暂时不可用，已切换为本地识别");
    } finally {
      if (sessionVersion === cloudSessionVersion) {
        quickAiBusy = false;
        renderQuickCaptureImage();
      }
    }
  }

  if (sessionVersion !== cloudSessionVersion) return;
  captureDraft = {
    ...parsedDraft,
    source: options.source || "text",
    sourceName: options.sourceName || "",
  };
  if (captureDraft.source === "image" && !captureDraft.aiEnhanced) {
    captureDraft.note = "";
  }
  capturePendingJdImages = [];
  const draft = captureDraft;
  const confidence = [draft.company, draft.role, draft.stage !== "other"].filter(Boolean).length;
  const confidenceText = draft.aiEnhanced
    ? draft.aiWarnings.length
      ? "AI 建议确认"
      : confidence === 3
        ? "AI 识别完整"
        : "AI 需要补充"
    : confidence === 3
      ? "识别完整"
      : confidence === 2
        ? "建议确认"
        : "需要补充";
  const sourceSummary =
    draft.source === "image"
      ? `邮件截图：${draft.sourceName} · 已提取 ${draft.raw.replace(/\s/g, "").length} 个字符`
      : draft.raw;
  document.getElementById("parseSummary").innerHTML = `
    <span class="parse-source"><i data-lucide="${draft.source === "image" ? "scan-text" : "quote"}"></i>${escapeHtml(sourceSummary)}</span>
    <span class="parse-confidence ${confidence === 3 && !draft.aiWarnings?.length ? "is-good" : ""}">${confidenceText}</span>
  `;

  const target = document.getElementById("captureTargetInput");
  target.innerHTML =
    '<option value="new">创建新的岗位记录</option>' +
    draft.matches
      .map(
        ({ application }, index) => `
          <option value="${application.id}" ${index === 0 ? "selected" : ""}>
            更新：${escapeHtml(application.company)}${application.department ? ` · ${escapeHtml(application.department)}` : ""} · ${escapeHtml(application.role)}
          </option>
        `,
      )
      .join("");
  if (!draft.matches.length) target.value = "new";

  document.getElementById("captureEventDateInput").value = draft.eventDate;
  document.getElementById("captureRecordedDateInput").value = formatDateTime(draft.recordedAt);
  document.getElementById("captureCompanyInput").value = draft.company;
  document.getElementById("captureDepartmentInput").value = draft.department;
  document.getElementById("captureRoleInput").value = draft.role;
  document.getElementById("captureStageInput").value = draft.stage;
  document.getElementById("captureChannelInput").value = draft.channel;
  document.getElementById("captureScheduledAtInput").value = draft.scheduledAt;
  document.getElementById("captureEndedAtInput").value = draft.endedAt;
  document.getElementById("captureNoteInput").value = draft.note;
  if (target.value !== "new") applyCaptureTarget();
  renderCaptureJdGallery();
  openDialog("capturePreviewDialog");
  refreshIcons();
}

function applyCaptureTarget() {
  const id = document.getElementById("captureTargetInput").value;
  if (id === "new") {
    if (captureDraft) {
      document.getElementById("captureCompanyInput").value = captureDraft.company;
      document.getElementById("captureDepartmentInput").value = captureDraft.department;
      document.getElementById("captureRoleInput").value = captureDraft.role;
      document.getElementById("captureChannelInput").value = captureDraft.channel;
    }
    renderCaptureJdGallery();
    return;
  }
  const application = state.applications.find((item) => item.id === id);
  if (!application) return;
  document.getElementById("captureCompanyInput").value = application.company;
  document.getElementById("captureDepartmentInput").value = application.department || "";
  document.getElementById("captureRoleInput").value = application.role;
  document.getElementById("captureChannelInput").value = application.channel;
  const available = Math.max(0, 10 - (application.jdCount || 0));
  if (capturePendingJdImages.length > available) {
    capturePendingJdImages = capturePendingJdImages.slice(0, available);
    showToast(`该岗位还可追加 ${available} 张 JD 截图`);
  }
  renderCaptureJdGallery();
}

async function saveCapture() {
  if (!checkGuestPermission()) return;
  const sessionVersion = cloudSessionVersion;
  const targetId = document.getElementById("captureTargetInput").value;
  const values = {
    company: document.getElementById("captureCompanyInput").value.trim(),
    department: document.getElementById("captureDepartmentInput").value.trim(),
    role: document.getElementById("captureRoleInput").value.trim(),
    stage: document.getElementById("captureStageInput").value,
    channel: document.getElementById("captureChannelInput").value,
    eventDate: document.getElementById("captureEventDateInput").value,
    scheduledAt: document.getElementById("captureScheduledAtInput").value,
    endedAt: document.getElementById("captureEndedAtInput").value,
    note: document.getElementById("captureNoteInput").value.trim(),
  };
  const recordedAt = captureDraft ? captureDraft.recordedAt : new Date().toISOString();
  const progressSource = captureDraft?.aiEnhanced
    ? captureDraft.source === "image"
      ? "image-ocr-ai"
      : "quick-capture-ai"
    : captureDraft?.source === "image"
      ? "image-ocr"
      : "quick-capture";
  const progress = createProgress(
    values.stage,
    values.eventDate,
    values.note,
    recordedAt,
    progressSource,
    values,
  );
  let application;

  if (targetId !== "new") {
    application = state.applications.find((item) => item.id === targetId);
    if (!application) return;
    application.company = values.company;
    application.department = values.department;
    application.role = values.role;
    application.channel = values.channel;
    application.progress.push(progress);
    application.updatedAt = recordedAt;
    if (values.stage === "applied" && !application.appliedDate) {
      application.appliedDate = values.eventDate;
    }
    if (values.scheduledAt) application.nextActionDate = values.scheduledAt.slice(0, 10);
    syncApplicationFromProgress(application);
  } else {
    const companyInfo = COMPANIES.find(
      (item) => normalizeText(item.name) === normalizeText(values.company),
    );
    application = syncApplicationFromProgress({
      id: makeId(),
      company: values.company,
      department: values.department,
      role: values.role,
      industry: companyInfo ? companyInfo.category : "其他",
      channel: values.channel,
      city: "",
      status: values.stage,
      appliedDate: values.stage === "applied" ? values.eventDate : "",
      nextActionDate: ["offer", "rejected"].includes(values.stage)
        ? ""
        : values.scheduledAt
          ? values.scheduledAt.slice(0, 10)
          : dateOffset(7),
      link: companyInfo ? companyInfo.url : "",
      notes: "",
      jdCount: 0,
      progress: [progress],
      createdAt: recordedAt,
      updatedAt: recordedAt,
    });
    state.applications.unshift(application);
  }

  saveState();
  if (capturePendingJdImages.length) {
    try {
      const existingImages =
        targetId === "new" ? [] : await getJdImages(application.id);
      if (sessionVersion !== cloudSessionVersion) return;
      const mergedImages = [...existingImages];
      const knownImages = new Set(existingImages.map((image) => image.dataUrl));
      capturePendingJdImages.forEach((image) => {
        if (mergedImages.length < 10 && !knownImages.has(image.dataUrl)) {
          mergedImages.push(image);
          knownImages.add(image.dataUrl);
        }
      });
      await putJdImages(application.id, mergedImages);
      if (sessionVersion !== cloudSessionVersion) return;
      application.jdCount = mergedImages.length;
    } catch (error) {
      if (sessionVersion !== cloudSessionVersion) return;
      showToast(`进展已保存，但 JD 图片保存失败：${error.message}`);
    }
  }
  saveState();
  document.getElementById("quickCaptureInput").value = "";
  closeDialog("capturePreviewDialog");
  clearQuickCaptureImage();
  captureDraft = null;
  capturePendingJdImages = [];
  specialFilter = "";
  document.getElementById("statusFilter").value = "";
  switchView("applications");
  renderAll();
  showToast(
    targetId === "new"
      ? `已创建 ${application.company} · ${application.role}`
      : `已记录 ${application.company} 的${getStatus(values.stage).label}进展`,
  );
}

async function openApplication(id = "") {
  const sessionVersion = cloudSessionVersion;
  const item = id ? state.applications.find((application) => application.id === id) : null;
  editingApplicationId = item ? item.id : "";
  document.getElementById("applicationForm").reset();
  document.getElementById("applicationId").value = editingApplicationId;
  document.getElementById("applicationDialogTitle").textContent = item ? "编辑岗位档案" : "新增岗位";
  document.getElementById("deleteApplicationButton").hidden = !item;
  document.getElementById("progressEditorSection").classList.toggle("is-disabled", !item);
  document.getElementById("openProgressButton").disabled = !item;

  document.getElementById("companyInput").value = item ? item.company : "";
  document.getElementById("departmentInput").value = item ? item.department : "";
  document.getElementById("roleInput").value = item ? item.role : "";
  document.getElementById("industryInput").value = item ? item.industry : INDUSTRIES[0];
  document.getElementById("statusInput").value = item ? item.status : "applied";
  document.getElementById("channelInput").value = item ? item.channel : "官网";
  document.getElementById("cityInput").value = item ? item.city : "";
  document.getElementById("appliedDateInput").value = item ? item.appliedDate : today();
  document.getElementById("nextActionDateInput").value = item
    ? item.nextActionDate
    : dateOffset(7);
  document.getElementById("linkInput").value = item ? item.link : "";
  document.getElementById("notesInput").value = item ? item.notes : "";

  const images = !isGuest && item ? await getJdImages(item.id).catch(() => []) : [];
  if (sessionVersion !== cloudSessionVersion) return;
  pendingJdImages = images;
  renderJdGallery();
  renderProgressTimeline(item);
  openDialog("applicationDialog");
  setTimeout(() => document.getElementById("companyInput").focus(), 50);
}

function renderProgressTimeline(application) {
  const container = document.getElementById("progressTimeline");
  if (!application) {
    container.innerHTML =
      '<div class="empty-editor">先保存岗位档案，再继续添加和编辑进展。</div>';
    refreshIcons();
    return;
  }
  const progress = getProgress(application).reverse();
  container.innerHTML = progress.length
    ? progress
        .map(
          (item, index) => `
            <div class="timeline-item ${index === 0 ? "is-latest" : ""}">
              <span class="timeline-marker" style="--timeline-color:${getStatus(item.stage).color}">
                <i data-lucide="${getStatus(item.stage).icon}"></i>
              </span>
              <span class="timeline-copy">
                <span class="timeline-title">
                  <strong>${getStatus(item.stage).label}</strong>
                  ${index === 0 ? "<em>当前</em>" : ""}
                  <small>
                    ${formatDate(item.eventDate, true)}
                    ${item.scheduledAt ? ` · ${formatReminderDate(item.scheduledAt)}` : ""}
                  </small>
                </span>
                <span class="timeline-detail">
                  <span class="timeline-note" title="${escapeHtml(item.note || "未填写备注")}">${item.note ? escapeHtml(item.note) : "未填写备注"}</span>
                  ${INTERVIEW_STAGES.has(item.stage) ? `<small class="${item.review ? "review-recorded" : "review-missing"}">${item.review ? "评价已记录" : "评价待补充"}</small>` : ""}
                </span>
              </span>
              <button class="row-action" type="button" data-progress-id="${item.id}" aria-label="编辑进展" title="编辑进展">
                <i data-lucide="pencil"></i>
              </button>
            </div>
          `,
        )
        .join("")
    : '<div class="empty-editor">还没有进展记录。</div>';
  refreshIcons();
}

function renderJdGallery() {
  document.getElementById("jdCount").textContent = `${pendingJdImages.length} 张`;
  document.getElementById("jdGallery").innerHTML = pendingJdImages
    .map(
      (image) => `
        <figure class="jd-thumb">
          <button type="button" data-view-jd="${image.id}" aria-label="查看 ${escapeHtml(image.name)}">
            <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}">
          </button>
          <figcaption title="${escapeHtml(image.name)}">${escapeHtml(image.name)}</figcaption>
          <button class="jd-remove" type="button" data-remove-jd="${image.id}" aria-label="删除图片" title="删除图片">
            <i data-lucide="x"></i>
          </button>
        </figure>
      `,
    )
    .join("");
  refreshIcons();
}

function renderCaptureJdGallery() {
  const targetId = document.getElementById("captureTargetInput")?.value || "new";
  const application =
    targetId === "new"
      ? null
      : state.applications.find((item) => item.id === targetId);
  const existingCount = application?.jdCount || 0;
  document.getElementById("captureJdCount").textContent = application
    ? `${capturePendingJdImages.length} 张待追加 · 已有 ${existingCount} 张`
    : `${capturePendingJdImages.length} 张`;
  document.getElementById("captureJdGallery").innerHTML = capturePendingJdImages
    .map(
      (image) => `
        <figure class="jd-thumb">
          <button type="button" data-view-capture-jd="${image.id}" aria-label="查看 ${escapeHtml(image.name)}">
            <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}">
          </button>
          <figcaption title="${escapeHtml(image.name)}">${escapeHtml(image.name)}</figcaption>
          <button class="jd-remove" type="button" data-remove-capture-jd="${image.id}" aria-label="删除图片" title="删除图片">
            <i data-lucide="x"></i>
          </button>
        </figure>
      `,
    )
    .join("");
  refreshIcons();
}

function fileToCompressedImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("只能添加图片文件"));
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      reject(new Error("单张图片不能超过 15MB"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("图片格式无法识别"));
      image.onload = () => {
        const maxSide = 1800;
        const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, width, height);
        resolve({
          id: makeId(),
          name: file.name || `JD截图_${Date.now()}.jpg`,
          type: "image/jpeg",
          dataUrl: canvas.toDataURL("image/jpeg", 0.84),
          createdAt: new Date().toISOString(),
        });
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function addJdFiles(files, context = "application") {
  const sessionVersion = cloudSessionVersion;
  const isCapture = context === "capture";
  const images = isCapture ? capturePendingJdImages : pendingJdImages;
  const targetId = isCapture
    ? document.getElementById("captureTargetInput").value
    : "";
  const targetApplication =
    isCapture && targetId !== "new"
      ? state.applications.find((item) => item.id === targetId)
      : null;
  const storedCount = targetApplication?.jdCount || 0;
  const available = Math.max(0, 10 - storedCount - images.length);
  const selected = [...files].slice(0, available);
  if (!selected.length) {
    showToast("每个岗位最多保存 10 张 JD 截图");
    return;
  }
  showToast("正在处理 JD 截图…");
  const results = await Promise.allSettled(selected.map(fileToCompressedImage));
  if (sessionVersion !== cloudSessionVersion) return;
  const added = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  const knownImages = new Set(images.map((image) => image.dataUrl));
  let uniqueAdded = 0;
  added.forEach((image) => {
    if (!knownImages.has(image.dataUrl)) {
      images.push(image);
      knownImages.add(image.dataUrl);
      uniqueAdded += 1;
    }
  });
  if (isCapture) renderCaptureJdGallery();
  else renderJdGallery();
  const failure = results.find((result) => result.status === "rejected");
  if (failure) showToast(failure.reason.message);
  else if (uniqueAdded) {
    showToast(
      `已添加 ${uniqueAdded} 张 JD 截图，${isCapture ? "确认记录" : "保存岗位"}后生效`,
    );
  }
  else showToast("相同的 JD 截图已存在");
}

async function saveApplicationFromForm() {
  if (!checkGuestPermission()) return;
  const sessionVersion = cloudSessionVersion;
  const id = document.getElementById("applicationId").value;
  const existing = id
    ? state.applications.find((application) => application.id === id)
    : null;
  const now = new Date().toISOString();
  const selectedStatus = document.getElementById("statusInput").value;
  const values = {
    company: document.getElementById("companyInput").value.trim(),
    department: document.getElementById("departmentInput").value.trim(),
    role: document.getElementById("roleInput").value.trim(),
    industry: document.getElementById("industryInput").value,
    channel: document.getElementById("channelInput").value,
    city: document.getElementById("cityInput").value.trim(),
    appliedDate: document.getElementById("appliedDateInput").value,
    nextActionDate: document.getElementById("nextActionDateInput").value,
    link: document.getElementById("linkInput").value.trim(),
    notes: document.getElementById("notesInput").value.trim(),
    jdCount: pendingJdImages.length,
    updatedAt: now,
  };
  let application;

  if (existing) {
    const previousStatus = existing.status;
    Object.assign(existing, values);
    if (previousStatus !== selectedStatus) {
      existing.progress.push(
        createProgress(selectedStatus, today(), "手动更新当前进展", now, "manual-status"),
      );
    }
    application = syncApplicationFromProgress(existing);
  } else {
    application = syncApplicationFromProgress({
      id: makeId(),
      ...values,
      status: selectedStatus,
      progress: [
        createProgress(
          selectedStatus,
          values.appliedDate || today(),
          "创建岗位档案",
          now,
          "manual",
        ),
      ],
      createdAt: now,
    });
    state.applications.unshift(application);
  }

  saveState();
  try {
    await putJdImages(application.id, pendingJdImages);
  } catch (error) {
    if (sessionVersion !== cloudSessionVersion) return;
    showToast(`岗位已保存，但 JD 图片保存失败：${error.message}`);
  }
  if (sessionVersion !== cloudSessionVersion) return;
  saveState();
  closeDialog("applicationDialog");
  renderAll();
  showToast(existing ? `已更新 ${application.company} 的岗位档案` : `已新增 ${application.company}`);
}

function openProgressDialog(progressId = "") {
  const application = state.applications.find((item) => item.id === editingApplicationId);
  if (!application) {
    showToast("请先保存岗位档案");
    return;
  }
  const progress = progressId
    ? application.progress.find((item) => item.id === progressId)
    : null;
  document.getElementById("progressIdInput").value = progress ? progress.id : "";
  document.getElementById("progressDialogTitle").textContent = progress ? "编辑进展" : "新增进展";
  document.getElementById("progressStageInput").value = progress ? progress.stage : application.status;
  document.getElementById("progressDateInput").value = progress ? progress.eventDate : today();
  document.getElementById("progressScheduledAtInput").value = progress
    ? toDateTimeInput(progress.scheduledAt)
    : "";
  document.getElementById("progressEndedAtInput").value = progress
    ? toDateTimeInput(progress.endedAt)
    : "";
  document.getElementById("progressNoteInput").value = progress ? progress.note : "";
  document.getElementById("progressReviewInput").value = progress ? progress.review : "";
  document.getElementById("progressRecordedAtInput").value = progress
    ? formatDateTime(progress.recordedAt)
    : "保存时自动记录";
  document.getElementById("deleteProgressButton").hidden = !progress;
  const structuredEntry = document.getElementById("structuredReviewEntry");
  const canOpenStructuredReview =
    Boolean(progress) && INTERVIEW_STAGES.has(progress.stage);
  structuredEntry.hidden = !canOpenStructuredReview;
  document.getElementById("openStructuredReviewLabel").textContent =
    progress?.interviewReview?.questions?.length ? "查看复盘" : "生成复盘";
  openDialog("progressDialog");
}

function saveProgressFromForm() {
  if (!checkGuestPermission()) return;
  const application = state.applications.find((item) => item.id === editingApplicationId);
  if (!application) return;
  const id = document.getElementById("progressIdInput").value;
  const existing = id ? application.progress.find((item) => item.id === id) : null;
  const values = {
    stage: document.getElementById("progressStageInput").value,
    eventDate: document.getElementById("progressDateInput").value,
    scheduledAt: document.getElementById("progressScheduledAtInput").value,
    endedAt: document.getElementById("progressEndedAtInput").value,
    note: document.getElementById("progressNoteInput").value.trim(),
    review: document.getElementById("progressReviewInput").value.trim(),
  };
  if (existing) {
    existing.stage = values.stage;
    existing.eventDate = values.eventDate;
    existing.scheduledAt = values.scheduledAt;
    existing.endedAt = values.endedAt;
    existing.note = values.note;
    existing.review = values.review;
  } else {
    application.progress.push(
      createProgress(
        values.stage,
        values.eventDate,
        values.note,
        new Date().toISOString(),
        "manual",
        values,
      ),
    );
  }
  application.updatedAt = new Date().toISOString();
  syncApplicationFromProgress(application);
  if (values.stage === "applied" && !application.appliedDate) {
    application.appliedDate = values.eventDate;
  }
  saveState();
  document.getElementById("statusInput").value = application.status;
  renderProgressTimeline(application);
  closeDialog("progressDialog");
  renderAll();
  showToast(existing ? "进展已更新" : "新进展已记录");
}

function deleteCurrentProgress() {
  if (!checkGuestPermission()) return;
  const application = state.applications.find((item) => item.id === editingApplicationId);
  const id = document.getElementById("progressIdInput").value;
  const progress = application && application.progress.find((item) => item.id === id);
  if (!application || !progress) return;
  confirmAction(
    "删除进展记录",
    `确认删除 ${formatDate(progress.eventDate)} 的“${getStatus(progress.stage).label}”记录吗？`,
    () => {
      application.progress = application.progress.filter((item) => item.id !== id);
      application.updatedAt = new Date().toISOString();
      syncApplicationFromProgress(application);
      saveState();
      document.getElementById("statusInput").value = application.status;
      renderProgressTimeline(application);
      closeDialog("progressDialog");
      closeConfirm();
      renderAll();
      showToast("进展记录已删除");
    },
  );
}

function updateApplicationStatus(id, status) {
  if (!checkGuestPermission()) {
    renderApplications();
    return;
  }
  const application = state.applications.find((item) => item.id === id);
  if (!application || application.status === status) return;
  const now = new Date().toISOString();
  application.progress.push(
    createProgress(status, today(), "从投递列表快速更新", now, "quick-status"),
  );
  application.updatedAt = now;
  if (status === "applied" && !application.appliedDate) application.appliedDate = today();
  if (["offer", "rejected"].includes(status)) application.nextActionDate = "";
  syncApplicationFromProgress(application);
  saveState();
  renderAll();
  showToast(`${application.company} 已更新为 ${getStatus(status).label}`);
}

function deleteCurrentApplication() {
  if (!checkGuestPermission()) return;
  const id = document.getElementById("applicationId").value;
  const application = state.applications.find((item) => item.id === id);
  if (!application) return;
  confirmAction(
    "删除岗位档案",
    `确认删除“${application.company} · ${application.role}”及其全部进展和 JD 截图吗？`,
    async () => {
      state.applications = state.applications.filter((item) => item.id !== id);
      await deleteJdImages(id).catch(() => {});
      saveState();
      closeConfirm();
      closeDialog("applicationDialog");
      if (expandedApplicationId === id) expandedApplicationId = "";
      renderAll();
      showToast("岗位档案已删除");
    },
  );
}

function addCompanyToApplications(companyName) {
  if (!checkGuestPermission()) return;
  const company = COMPANIES.find((item) => item.name === companyName);
  if (!company || state.applications.some((item) => item.company === company.name)) return;
  const now = new Date().toISOString();
  const application = syncApplicationFromProgress({
    id: makeId(),
    company: company.name,
    department: "",
    role: "待确认岗位",
    industry: company.category,
    channel: "官网",
    city: company.meta[0].split(" / ")[0],
    status: "wish",
    appliedDate: "",
    nextActionDate: dateOffset(7),
    link: company.url,
    notes: `关注方向：${company.direction}`,
    jdCount: 0,
    progress: [createProgress("wish", today(), "从公司导航加入目标", now, "company-library")],
    createdAt: now,
    updatedAt: now,
  });
  state.applications.unshift(application);
  saveState();
  renderAll();
  showToast(`${company.name} 已加入目标`);
}

function clearApplicationFilters() {
  specialFilter = "";
  document.getElementById("applicationSearch").value = "";
  document.getElementById("statusFilter").value = "";
  document.getElementById("industryFilter").value = "";
  renderApplications();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCsv() {
  if (!state.applications.length) {
    showToast("当前没有可导出的投递记录");
    return;
  }
  const headers = [
    "公司",
    "部门",
    "岗位",
    "行业",
    "最新进展",
    "投递日期",
    "最新进展日期",
    "记录条数",
    "JD截图数",
    "渠道",
    "城市",
    "下次跟进",
    "岗位链接",
    "岗位备注",
    "进展时间线",
  ];
  const rows = state.applications.map((item) => {
    const latest = getLatestProgress(item);
    const timeline = getProgress(item)
      .map(
        (progress) =>
          [
            `${progress.eventDate} ${getStatus(progress.stage).label}`,
            progress.scheduledAt ? `安排 ${formatDateTime(progress.scheduledAt)}` : "",
            progress.endedAt ? `结束 ${formatDateTime(progress.endedAt)}` : "",
            progress.note,
            progress.review ? `面试评价：${progress.review}` : "",
          ].filter(Boolean).join("；"),
      )
      .join(" | ");
    return [
      item.company,
      item.department,
      item.role,
      item.industry,
      latest ? getStatus(latest.stage).label : "",
      item.appliedDate,
      latest ? latest.eventDate : "",
      item.progress.length,
      item.jdCount || 0,
      item.channel,
      item.city,
      item.nextActionDate,
      item.link,
      item.notes,
      timeline,
    ];
  });
  const content = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replaceAll('"', '""').replaceAll("\n", " ")}"`)
        .join(","),
    )
    .join("\r\n");
  downloadBlob(
    new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }),
    `求职投递与进展_${today()}.csv`,
  );
  showToast("CSV 已导出");
}

function exportJson() {
  downloadBlob(
    new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
    `求职进度备份_${today()}.json`,
  );
  showToast("文本与进展备份已导出，JD 图片需在岗位中单独查看");
}

function mergeImportedState(imported) {
  if (!checkGuestPermission()) return;
  if (!imported || !Array.isArray(imported.applications)) {
    throw new Error("文件中没有有效的投递数据");
  }
  const migrated = migrateState(imported);
  const map = new Map(state.applications.map((item) => [item.id, item]));
  migrated.applications.forEach((item) => {
    const current = map.get(item.id);
    if (!current || String(item.updatedAt) > String(current.updatedAt)) map.set(item.id, item);
  });
  state.applications = [...map.values()];
  if (migrated.fairPlans && typeof migrated.fairPlans === "object") {
    state.fairPlans = { ...(state.fairPlans || {}), ...migrated.fairPlans };
  }
  saveState();
  renderAll();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-guest-login]")) {
      cloudReturnRoute = currentView;
      navigateRoute("login");
      return;
    }
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      switchView(viewButton.dataset.view);
      return;
    }
    const goView = event.target.closest("[data-go-view]");
    if (goView) {
      switchView(goView.dataset.goView, { filter: goView.dataset.filter || "" });
      return;
    }
    const reminderFilterButton = event.target.closest("[data-reminder-filter]");
    if (reminderFilterButton) {
      reminderFilter = reminderFilterButton.dataset.reminderFilter;
      document.querySelectorAll("[data-reminder-filter]").forEach((button) => {
        button.classList.toggle("is-active", button === reminderFilterButton);
      });
      renderDashboard();
      return;
    }
    const reminderItem = event.target.closest("[data-reminder-progress]");
    if (reminderItem) {
      editingApplicationId = reminderItem.dataset.reminderApplication;
      if (reminderItem.dataset.reminderType === "review") {
        openInterviewReviewDialog(
          reminderItem.dataset.reminderApplication,
          reminderItem.dataset.reminderProgress,
        );
      } else {
        openProgressDialog(reminderItem.dataset.reminderProgress);
      }
      return;
    }
    const reviewFilterButton = event.target.closest("[data-review-filter]");
    if (reviewFilterButton) {
      interviewReviewFilter = reviewFilterButton.dataset.reviewFilter;
      document.querySelectorAll("[data-review-filter]").forEach((button) => {
        button.classList.toggle("is-active", button === reviewFilterButton);
      });
      renderInterviewReviews();
      return;
    }
    const reviewItem = event.target.closest("[data-open-review-progress]");
    if (reviewItem) {
      if (reviewItem.dataset.reviewStatus === "upcoming") {
        editingApplicationId = reviewItem.dataset.openReviewApp;
        openProgressDialog(reviewItem.dataset.openReviewProgress);
      } else {
        openInterviewReviewDialog(
          reviewItem.dataset.openReviewApp,
          reviewItem.dataset.openReviewProgress,
        );
      }
      return;
    }
    const removeReviewQuestion = event.target.closest("[data-remove-review-question]");
    if (removeReviewQuestion) {
      removeInterviewQuestion(removeReviewQuestion.dataset.removeReviewQuestion);
      return;
    }
    const toggleReviewQuestion = event.target.closest("[data-toggle-review-question]");
    if (toggleReviewQuestion) {
      toggleInterviewQuestion(toggleReviewQuestion.dataset.toggleReviewQuestion);
      return;
    }
    const funnelFilter = event.target.closest("[data-funnel-filter]");
    if (funnelFilter) {
      specialFilter = "";
      switchView("applications", { filter: funnelFilter.dataset.funnelFilter });
      return;
    }
    const stat = event.target.closest("[data-stat-filter]");
    if (stat) {
      specialFilter = ["overdue", "interview"].includes(stat.dataset.statFilter)
        ? stat.dataset.statFilter
        : "";
      switchView("applications", { filter: stat.dataset.statFilter });
      return;
    }
    const edit = event.target.closest("[data-edit-id]");
    if (edit) {
      openApplication(edit.dataset.editId);
      return;
    }
    const applicationToggle = event.target.closest("[data-toggle-application]");
    if (applicationToggle) {
      toggleApplicationTimeline(applicationToggle.dataset.toggleApplication);
      return;
    }
    const applicationSummary = event.target.closest("[data-application-summary]");
    if (
      applicationSummary &&
      !event.target.closest("button, select, input, textarea, a, label")
    ) {
      toggleApplicationTimeline(applicationSummary.dataset.applicationSummary);
      return;
    }
    if (event.target.closest("[data-open-application]")) {
      openApplication();
      return;
    }
    const category = event.target.closest("[data-company-category]");
    if (category) {
      companyCategory = category.dataset.companyCategory;
      renderCompanies();
      return;
    }
    const addCompany = event.target.closest("[data-add-company]");
    if (addCompany) {
      addCompanyToApplications(addCompany.dataset.addCompany);
      return;
    }
    const example = event.target.closest("[data-quick-example]");
    if (example) {
      document.getElementById("quickCaptureInput").value = example.dataset.quickExample;
      document.getElementById("quickCaptureInput").focus();
      return;
    }
    const progressButton = event.target.closest("[data-progress-id]");
    if (progressButton) {
      if (progressButton.dataset.progressApplication) {
        editingApplicationId = progressButton.dataset.progressApplication;
      }
      openProgressDialog(progressButton.dataset.progressId);
      return;
    }
    const calendarEvent = event.target.closest("[data-calendar-progress]");
    if (calendarEvent) {
      editingApplicationId = calendarEvent.dataset.calendarApplication;
      openProgressDialog(calendarEvent.dataset.calendarProgress);
      return;
    }
    const viewCaptureJd = event.target.closest("[data-view-capture-jd]");
    if (viewCaptureJd) {
      const image = capturePendingJdImages.find(
        (item) => item.id === viewCaptureJd.dataset.viewCaptureJd,
      );
      if (image) {
        document.getElementById("lightboxImage").src = image.dataUrl;
        document.getElementById("imageLightbox").hidden = false;
      }
      return;
    }
    const removeCaptureJd = event.target.closest("[data-remove-capture-jd]");
    if (removeCaptureJd) {
      capturePendingJdImages = capturePendingJdImages.filter(
        (item) => item.id !== removeCaptureJd.dataset.removeCaptureJd,
      );
      renderCaptureJdGallery();
      return;
    }
    const viewJd = event.target.closest("[data-view-jd]");
    if (viewJd) {
      const image = pendingJdImages.find((item) => item.id === viewJd.dataset.viewJd);
      if (image) {
        document.getElementById("lightboxImage").src = image.dataUrl;
        document.getElementById("imageLightbox").hidden = false;
      }
      return;
    }
    const removeJd = event.target.closest("[data-remove-jd]");
    if (removeJd) {
      pendingJdImages = pendingJdImages.filter((item) => item.id !== removeJd.dataset.removeJd);
      renderJdGallery();
      return;
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeDialog(closeButton.dataset.closeDialog);
  });

  document.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("[data-status-id]");
    if (statusSelect) {
      updateApplicationStatus(statusSelect.dataset.statusId, statusSelect.value);
      return;
    }
    if (event.target.matches("[data-review-question-category]")) {
      syncInterviewReviewDraftFromEditor();
      renderInterviewReviewEditor();
    }
  });

  document.getElementById("quickCaptureForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (quickOcrBusy || quickAiBusy) return;
    const text = document.getElementById("quickCaptureInput").value.trim();
    if (!text) {
      showToast("先写下一条投递或进展信息");
      return;
    }
    await openCapturePreview(text);
  });
  const quickCapture = document.querySelector(".quick-capture");
  const quickImageInput = document.getElementById("quickImageInput");
  document.getElementById("quickImageButton").addEventListener("click", () => {
    if (!quickOcrBusy && !quickAiBusy) quickImageInput.click();
  });
  document.getElementById("quickImageRemoveButton").addEventListener(
    "click",
    clearQuickCaptureImage,
  );
  quickImageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) await recognizeQuickCaptureImage(file);
    event.target.value = "";
  });
  ["dragenter", "dragover"].forEach((name) => {
    quickCapture.addEventListener(name, (event) => {
      if (![...(event.dataTransfer?.items || [])].some((item) => item.type.startsWith("image/"))) {
        return;
      }
      event.preventDefault();
      quickCapture.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((name) => {
    quickCapture.addEventListener(name, (event) => {
      if (name === "drop") event.preventDefault();
      quickCapture.classList.remove("is-dragging");
    });
  });
  quickCapture.addEventListener("drop", (event) => {
    const image = [...(event.dataTransfer?.files || [])].find((file) =>
      file.type.startsWith("image/"),
    );
    if (image) recognizeQuickCaptureImage(image);
  });
  document.getElementById("captureTargetInput").addEventListener("change", applyCaptureTarget);
  document.getElementById("capturePreviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    await saveCapture();
  });

  document.getElementById("globalAddButton").addEventListener("click", () => openApplication());
  document.getElementById("applicationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    await saveApplicationFromForm();
  });
  document
    .getElementById("deleteApplicationButton")
    .addEventListener("click", deleteCurrentApplication);

  document.getElementById("openProgressButton").addEventListener("click", () => {
    openProgressDialog();
  });
  document.getElementById("progressForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    saveProgressFromForm();
  });
  document
    .getElementById("deleteProgressButton")
    .addEventListener("click", deleteCurrentProgress);
  document.getElementById("openStructuredReviewButton").addEventListener("click", () => {
    const progressId = document.getElementById("progressIdInput").value;
    const applicationId = editingApplicationId;
    closeDialog("progressDialog");
    openInterviewReviewDialog(applicationId, progressId);
  });

  document.getElementById("interviewMediaInput").addEventListener("change", (event) => {
    selectInterviewMedia(event.target.files[0]);
  });
  document
    .getElementById("transcribeInterviewButton")
    .addEventListener("click", transcribeSelectedInterviewMedia);
  document
    .getElementById("analyzeInterviewButton")
    .addEventListener("click", analyzeInterviewTranscript);
  document
    .getElementById("addInterviewQuestionButton")
    .addEventListener("click", addInterviewQuestion);
  document.getElementById("interviewReviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveInterviewReview();
  });

  const bindJdDropzone = (dropzoneId, inputId, context) => {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    dropzone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        input.click();
      }
    });
    input.addEventListener("change", async (event) => {
      await addJdFiles(event.target.files, context);
      event.target.value = "";
    });
    ["dragenter", "dragover"].forEach((name) => {
      dropzone.addEventListener(name, (event) => {
        event.preventDefault();
        dropzone.classList.add("is-dragging");
      });
    });
    ["dragleave", "drop"].forEach((name) => {
      dropzone.addEventListener(name, (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragging");
      });
    });
    dropzone.addEventListener("drop", (event) => {
      addJdFiles(event.dataTransfer.files, context);
    });
  };
  bindJdDropzone("jdDropzone", "jdFileInput", "application");
  bindJdDropzone("captureJdDropzone", "captureJdFileInput", "capture");

  document.addEventListener("paste", (event) => {
    const files = [...(event.clipboardData?.items || [])]
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter(Boolean);
    if (!files.length) return;
    if (document.getElementById("capturePreviewDialog").open) {
      event.preventDefault();
      addJdFiles(files, "capture");
    } else if (document.getElementById("applicationDialog").open) {
      event.preventDefault();
      addJdFiles(files, "application");
    } else if (currentView === "dashboard") {
      event.preventDefault();
      recognizeQuickCaptureImage(files[0]);
    }
  });
  document.getElementById("closeLightboxButton").addEventListener("click", () => {
    document.getElementById("imageLightbox").hidden = true;
  });
  document.getElementById("imageLightbox").addEventListener("click", (event) => {
    if (event.target.id === "imageLightbox") {
      document.getElementById("imageLightbox").hidden = true;
    }
  });

  ["applicationSearch", "statusFilter", "industryFilter"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      if (id === "statusFilter" && document.getElementById(id).value) specialFilter = "";
      renderApplications();
    });
  });
  document.getElementById("clearFilterButton").addEventListener("click", clearApplicationFilters);
  document.getElementById("companySearch").addEventListener("input", renderCompanies);
  document.getElementById("exportCsvButton").addEventListener("click", exportCsv);
  document.getElementById("reminderSort").addEventListener("change", renderDashboard);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document
    .getElementById("notificationToggle")
    .addEventListener("click", toggleInterviewNotifications);
  document.getElementById("calendarPreviousButton").addEventListener("click", () => {
    calendarWeekOffset -= 1;
    renderInterviewCalendar();
  });
  document.getElementById("calendarTodayButton").addEventListener("click", () => {
    calendarWeekOffset = 0;
    renderInterviewCalendar();
  });
  document.getElementById("calendarNextButton").addEventListener("click", () => {
    calendarWeekOffset += 1;
    renderInterviewCalendar();
  });

  const openAccount = () => {
    navigateRoute(cloudUser ? "cloud" : "login");
  };
  document.getElementById("authGateLoginButton").addEventListener("click", openAccount);
  document.getElementById("guestLoginButton").addEventListener("click", openAccount);
  document.getElementById("authGateThemeButton").addEventListener("click", toggleTheme);
  document.getElementById("accountButton").addEventListener("click", openAccount);
  document.getElementById("accountForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("accountEmailInput");
    const email = emailInput.value.trim();
    if (cloudOtpPending) {
      const otpInput = document.getElementById("accountOtpInput");
      const token = otpInput.value.replace(/\D/g, "").slice(0, 6);
      otpInput.value = token;
      if (token.length !== 6 || !otpInput.checkValidity()) {
        otpInput.reportValidity();
        return;
      }
      await verifyCloudLoginCode(cloudOtpEmail || email, token);
      return;
    }
    if (!email || !emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }
    await sendCloudLoginCode(email);
  });
  document.getElementById("accountOtpInput").addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
  });
  document.getElementById("accountChangeEmailButton").addEventListener("click", () => {
    clearCloudOtpState();
    setCloudStatus("signed-out");
    const input = document.getElementById("accountEmailInput");
    input.disabled = false;
    input.focus();
    input.select();
  });
  document.getElementById("accountResendButton").addEventListener("click", async () => {
    if (!cloudOtpEmail || Date.now() < cloudOtpResendAt) return;
    await sendCloudLoginCode(cloudOtpEmail);
  });
  document
    .getElementById("clearAccountButton")
    .addEventListener("click", signOutCloudAccount);

  const openData = () => {
    document.getElementById("clearCloudWorkspaceButton").hidden = false;
    openDialog("dataDialog");
  };
  document.getElementById("dataButton").addEventListener("click", openData);
  document.getElementById("exportJsonButton").addEventListener("click", exportJson);
  document.getElementById("importJsonInput").addEventListener("change", (event) => {
    if (!checkGuestPermission()) {
      event.target.value = "";
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        mergeImportedState(JSON.parse(reader.result));
        closeDialog("dataDialog");
        showToast("备份已合并");
      } catch (error) {
        showToast(error.message || "备份文件格式不正确");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  });
  document.getElementById("resetDemoButton").addEventListener("click", () => {
    confirmAction(
      "恢复示例数据",
      `${cloudUser ? "当前账户" : "当前本地"}的文本记录和 JD 截图将被清空，并恢复为示例数据。`,
      async () => {
        const applicationIds = state.applications.map((application) => application.id);
        await clearAssetDb(applicationIds).catch(() => {});
        state = buildDemoState();
        if (cloudUser?.email) state.account = { email: cloudUser.email };
        saveState();
        closeConfirm();
        closeDialog("dataDialog");
        clearApplicationFilters();
        switchView("dashboard");
        renderAll();
        showToast("示例数据已恢复");
      },
    );
  });
  document.getElementById("clearCloudWorkspaceButton").addEventListener("click", () => {
    if (!checkGuestPermission()) return;
    confirmAction(
      "清空当前云端工作区",
      `确认永久删除 ${cloudUser.email} 的全部岗位、进展、双选会计划和 JD 截图吗？其他邮箱不受影响。`,
      clearCurrentCloudWorkspace,
    );
  });

  document.getElementById("confirmCancelButton").addEventListener("click", closeConfirm);
  document.getElementById("confirmAcceptButton").addEventListener("click", () => {
    if (confirmCallback) confirmCallback();
  });
  document.getElementById("confirmPopover").addEventListener("click", (event) => {
    if (event.target.id === "confirmPopover") closeConfirm();
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => {
      resetGuestPermissionPrompt(dialog);
      if (dialog.id === "accountDialog" && ["cloud", "login"].includes(window.location.hash.slice(1))) {
        if (canBrowseWorkspace()) {
          cloudReturnRoute = "";
          window.history.replaceState(null, "", `#${currentView}`);
        }
      }
      if (dialog.id === "capturePreviewDialog") {
        const sourceWasImage = captureDraft?.source === "image";
        capturePendingJdImages = [];
        captureDraft = null;
        if (sourceWasImage) clearQuickCaptureImage();
      }
      if (dialog.id === "interviewReviewDialog") {
        cleanupInterviewTranscription();
        selectedInterviewMedia = null;
        interviewReviewDraft = null;
        document.getElementById("interviewMediaInput").value = "";
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("quickCaptureInput").focus();
    }
    if (event.key === "Escape" && !document.getElementById("imageLightbox").hidden) {
      document.getElementById("imageLightbox").hidden = true;
    }
  });
}

async function init() {
  applyTheme();
  initializeSelects();
  bindEvents();
  bindNotificationWorkerMessages();
  getNotificationWorkerRegistration();
  renderAll();
  const requestedView = window.location.hash.slice(1);
  navigateRoute(requestedView || "dashboard");
  window.addEventListener("hashchange", () => {
    navigateRoute(window.location.hash.slice(1));
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) applyTheme();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkInterviewNotifications();
  });
  refreshIcons();
  await initializeCloudSync();
  await checkInterviewNotifications();
  notificationTimer = window.setInterval(checkInterviewNotifications, 60000);
}

document.addEventListener("DOMContentLoaded", init);
