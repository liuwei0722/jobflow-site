const STAGES = [
  { value: "wish", label: "想投", color: "#68787e", soft: "#edf2f4", icon: "bookmark" },
  { value: "applied", label: "已投递", color: "#3269aa", soft: "#eaf1f8", icon: "send" },
  { value: "assessment", label: "测评", color: "#7950a6", soft: "#f2ebf8", icon: "file-check-2" },
  { value: "first", label: "一面", color: "#bb7618", soft: "#fff1dc", icon: "messages-square" },
  { value: "second", label: "二面", color: "#9c5708", soft: "#fff0d7", icon: "message-square-more" },
  { value: "final", label: "终面", color: "#7e4509", soft: "#f9ead4", icon: "users-round" },
  { value: "offer", label: "Offer", color: "#087f5b", soft: "#e4f4ee", icon: "badge-check" },
  { value: "rejected", label: "已结束", color: "#b23a48", soft: "#fae9eb", icon: "circle-x" },
];

const STAGE_MAP = Object.fromEntries(STAGES.map((stage) => [stage.value, stage]));
const FUNNEL_STAGE_VALUES = ["applied", "assessment", "first", "second", "final", "offer"];

const APPLICATIONS = [
  {
    id: "byte",
    company: "字节跳动",
    department: "商业化部门",
    role: "AI 策略运营",
    stage: "second",
    history: ["applied", "assessment", "first", "second"],
    stageDate: -1,
    appliedDate: -16,
    jdCount: 3,
    industry: "互联网平台",
    city: "北京",
    note: "二面安排在明天下午，准备业务案例拆解",
    color: "#315efb",
  },
  {
    id: "meituan",
    company: "美团",
    department: "到店事业群",
    role: "商业分析",
    stage: "assessment",
    history: ["applied", "assessment"],
    stageDate: -2,
    appliedDate: -12,
    jdCount: 2,
    industry: "本地生活",
    city: "北京",
    note: "在线测评将在两天后截止",
    color: "#bd8500",
  },
  {
    id: "xiaohongshu",
    company: "小红书",
    department: "商业化事业部",
    role: "商业化运营",
    stage: "first",
    history: ["applied", "assessment", "first"],
    stageDate: -1,
    appliedDate: -18,
    jdCount: 2,
    industry: "内容社区",
    city: "上海",
    note: "一面已结束，尚未填写面试评价",
    color: "#d8334f",
  },
  {
    id: "tencent",
    company: "腾讯",
    department: "PCG",
    role: "产品运营",
    stage: "first",
    history: ["applied", "first"],
    stageDate: 0,
    appliedDate: -9,
    jdCount: 1,
    industry: "互联网平台",
    city: "深圳",
    note: "一面将在三天后进行",
    color: "#0878d1",
  },
  {
    id: "baidu",
    company: "百度",
    department: "文心产品部",
    role: "AI 产品运营",
    stage: "offer",
    history: ["applied", "assessment", "first", "second", "final", "offer"],
    stageDate: -1,
    appliedDate: -31,
    jdCount: 4,
    industry: "AI / 大模型",
    city: "北京",
    note: "已收到录用意向",
    color: "#2932e1",
  },
  {
    id: "moonshot",
    company: "月之暗面",
    department: "用户增长团队",
    role: "用户增长运营",
    stage: "applied",
    history: ["applied"],
    stageDate: -4,
    appliedDate: -4,
    jdCount: 1,
    industry: "AI / 大模型",
    city: "北京",
    note: "等待简历筛选",
    color: "#252a2d",
  },
  {
    id: "ant",
    company: "蚂蚁集团",
    department: "数字金融事业群",
    role: "策略运营",
    stage: "wish",
    history: ["wish"],
    stageDate: -5,
    appliedDate: null,
    jdCount: 2,
    industry: "金融 / 咨询",
    city: "杭州",
    note: "完善支付业务案例后投递",
    color: "#1677c8",
  },
  {
    id: "jd",
    company: "京东",
    department: "零售业务",
    role: "平台运营",
    stage: "rejected",
    history: ["applied", "assessment", "rejected"],
    stageDate: -8,
    appliedDate: -24,
    jdCount: 2,
    industry: "电商 / 零售",
    city: "北京",
    note: "流程已结束",
    color: "#c9282d",
  },
];

const COMPANIES = [
  { name: "字节跳动", category: "互联网平台", direction: "策略运营、产品运营、商业分析", state: "开放中", color: "#315efb" },
  { name: "腾讯", category: "互联网平台", direction: "产品策划、内容运营、用户研究", state: "提前批", color: "#0878d1" },
  { name: "美团", category: "本地生活", direction: "策略运营、商业分析、供给运营", state: "开放中", color: "#bd8500" },
  { name: "小红书", category: "内容社区", direction: "社区运营、商业化运营、内容策略", state: "提前批", color: "#d8334f" },
  { name: "百度", category: "AI / 大模型", direction: "AI 产品运营、策略分析、用户增长", state: "开放中", color: "#2932e1" },
  { name: "蚂蚁集团", category: "金融 / 咨询", direction: "策略运营、数字金融、商业分析", state: "开放中", color: "#1677c8" },
];

const VIEW_META = {
  overview: { eyebrow: "求职行动中心", title: "总览" },
  funnel: { eyebrow: "阶段转化分析", title: "漏斗" },
  applications: { eyebrow: "全流程管理", title: "投递管理" },
  companies: { eyebrow: "目标公司库", title: "公司导航" },
};

let currentView = "overview";
let reminderFilter = "assessment";
let selectedReminderId = "";
let applicationStageFilter = "";
let companyCategory = "全部";
let toastTimer = null;

function dateOffset(days, time = "12:00") {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function timestampOffset(days, hours = 0) {
  const date = dateOffset(days);
  date.setHours(date.getHours() + hours);
  return date;
}

const REMINDERS = [
  {
    id: "interview-byte",
    applicationId: "byte",
    type: "interview",
    title: "二面提醒",
    eventName: "二面",
    dueAt: dateOffset(1, "14:00"),
    createdAt: timestampOffset(0, -1),
    note: "腾讯会议，预计 45 分钟；准备业务归因与增长策略案例。",
    status: "pending",
  },
  {
    id: "assessment-meituan",
    applicationId: "meituan",
    type: "assessment",
    title: "测评截止提醒",
    eventName: "在线测评",
    dueAt: dateOffset(2, "23:59"),
    createdAt: timestampOffset(0, -3),
    note: "测评链接已收到，建议预留 90 分钟一次完成。",
    status: "pending",
  },
  {
    id: "review-xhs",
    applicationId: "xiaohongshu",
    type: "review",
    title: "完成一面复盘",
    eventName: "面试评价",
    dueAt: dateOffset(0, "20:00"),
    createdAt: timestampOffset(0, -5),
    note: "一面已结束，尚未记录问题、自我评价和改进事项。",
    status: "pending",
  },
  {
    id: "interview-tencent",
    applicationId: "tencent",
    type: "interview",
    title: "一面提醒",
    eventName: "一面",
    dueAt: dateOffset(3, "10:30"),
    createdAt: timestampOffset(-1, 2),
    note: "视频面试，重点准备内容生态和用户增长分析。",
    status: "pending",
  },
  {
    id: "review-baidu",
    applicationId: "baidu",
    type: "review",
    title: "完成终面复盘",
    eventName: "面试评价",
    dueAt: dateOffset(-2, "19:00"),
    createdAt: timestampOffset(-2, 1),
    note: "终面评价已完成，沉淀了 AI 产品商业化问题。",
    status: "done",
  },
];

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date, includeTime = false) {
  if (!date) return "—";
  const options = {
    month: "2-digit",
    day: "2-digit",
    weekday: includeTime ? "short" : undefined,
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  };
  return new Intl.DateTimeFormat("zh-CN", options).format(date);
}

function formatDateOffset(days) {
  return formatDate(dateOffset(days));
}

function relativeDue(date) {
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const days = Math.round((target - startToday) / 86400000);
  if (days < 0) return `已过 ${Math.abs(days)} 天`;
  if (days === 0) return "今天";
  if (days === 1) return "明天";
  return `${days} 天后`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function switchView(view) {
  if (!VIEW_META[view]) return;
  currentView = view;
  document.querySelectorAll(".demo-view").forEach((element) => {
    element.classList.toggle("is-active", element.id === `view-${view}`);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  document.getElementById("pageEyebrow").textContent = VIEW_META[view].eyebrow;
  document.getElementById("pageTitle").textContent = VIEW_META[view].title;
  window.history.replaceState(null, "", `#${view}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function renderOverviewStats() {
  const pending = REMINDERS.filter((item) => item.status === "pending");
  const review = pending.filter((item) => item.type === "review").length;
  const upcoming = pending.filter((item) => item.type !== "review").length;
  const interviewing = APPLICATIONS.filter((item) =>
    ["first", "second", "final"].includes(item.stage),
  ).length;
  const stats = [
    { label: "有效岗位", value: 8, note: "全部求职岗位", color: "#68787e", icon: "layers-3" },
    { label: "面试中", value: interviewing, note: "一面至终面", color: "#a8640a", icon: "messages-square" },
    { label: "近期安排", value: upcoming, note: "未来三天内", color: "#3269aa", icon: "calendar-clock" },
    { label: "待复盘", value: review, note: "面试评价待补充", color: "#b23a48", icon: "clipboard-pen-line" },
  ];
  document.getElementById("overviewStats").innerHTML = stats
    .map(
      (item) => `
        <article class="overview-stat" style="--stat-color:${item.color}">
          <span>${item.label}<i data-lucide="${item.icon}"></i></span>
          <strong>${item.value}</strong>
          <small>${item.note}</small>
        </article>
      `,
    )
    .join("");
}

function reminderTheme(type) {
  if (type === "review") {
    return {
      label: "复盘待办",
      icon: "clipboard-pen-line",
      color: "#b23a48",
      soft: "#fae9eb",
    };
  }
  if (type === "assessment") {
    return {
      label: "测评",
      icon: "file-check-2",
      color: "#7950a6",
      soft: "#f2ebf8",
    };
  }
  return {
    label: "面试",
    icon: "calendar-clock",
    color: "#3269aa",
    soft: "#eaf1f8",
  };
}

function getReminderItems() {
  const sort = document.getElementById("reminderSort").value;
  return REMINDERS.filter(
    (item) => item.status === "pending" && item.type === reminderFilter,
  ).sort((a, b) => {
    if (sort === "due-asc") return a.dueAt - b.dueAt;
    return b.createdAt - a.createdAt;
  });
}

function renderReminders() {
  const items = getReminderItems();
  const pending = REMINDERS.filter((item) => item.status === "pending").length;
  document.getElementById("pendingReminderCount").textContent = `${pending} 项提醒`;
  document.getElementById("reminderNavCount").textContent = pending;
  document.getElementById("reminderList").innerHTML = items.length
    ? items
        .map((item) => {
          const application = APPLICATIONS.find((entry) => entry.id === item.applicationId);
          const theme = reminderTheme(item.type);
          const dueState = relativeDue(item.dueAt);
          const timeColor =
            item.dueAt < new Date() && item.status !== "done" ? "#b23a48" : theme.color;
          return `
            <button
              class="reminder-item"
              type="button"
              data-reminder-id="${item.id}"
              style="--icon-color:${theme.color};--icon-soft:${theme.soft};--kind-color:${theme.color};--kind-soft:${theme.soft};--time-color:${timeColor}"
            >
              <span class="reminder-icon"><i data-lucide="${theme.icon}"></i></span>
              <span class="reminder-copy">
                <span class="reminder-title">
                  <strong>${escapeHtml(application.company)} · ${escapeHtml(item.title)}</strong>
                  <em class="reminder-kind">${theme.label}</em>
                </span>
                <span>${escapeHtml(application.department)} · ${escapeHtml(application.role)}</span>
                <small>${item.type === "review" ? "面试结束后自动生成" : "进入时间前 3 天提醒"}</small>
              </span>
              <time class="reminder-time">
                <span>${formatDate(item.dueAt, true)}</span>
                <em>${dueState}</em>
              </time>
              <i data-lucide="chevron-right"></i>
            </button>
          `;
        })
        .join("")
    : `
      <div class="demo-empty">
        <i data-lucide="circle-check-big"></i>
        <strong>当前没有这类提醒</strong>
      </div>
    `;
  refreshIcons();
}

function renderFunnel() {
  const currentCounts = Object.fromEntries(
    STAGES.map((stage) => [
      stage.value,
      APPLICATIONS.filter((item) => item.stage === stage.value).length,
    ]),
  );
  const reachedCounts = Object.fromEntries(
    FUNNEL_STAGE_VALUES.map((value, stageIndex) => [
      value,
      APPLICATIONS.filter((item) => {
        const highestReached = Math.max(
          -1,
          ...item.history.map((stage) => FUNNEL_STAGE_VALUES.indexOf(stage)),
        );
        return highestReached >= stageIndex;
      }).length,
    ]),
  );
  const maxCount = Math.max(1, ...Object.values(reachedCounts));
  const funnelStages = FUNNEL_STAGE_VALUES.map((value) => STAGE_MAP[value]);
  document.getElementById("interactiveFunnel").innerHTML = funnelStages.map((stage) => {
    const currentCount = currentCounts[stage.value];
    const pipelineIndex = FUNNEL_STAGE_VALUES.indexOf(stage.value);
    const reachedCount = reachedCounts[stage.value];
    const previousCount =
      pipelineIndex > 0 ? reachedCounts[FUNNEL_STAGE_VALUES[pipelineIndex - 1]] : 0;
    const conversion =
      pipelineIndex === 0
        ? "—"
        : previousCount
          ? `${Math.round((reachedCount / previousCount) * 100)}%`
          : "—";
    const width = Math.max(2, Math.round((reachedCount / maxCount) * 100));
    return `
      <button
        class="funnel-step"
        type="button"
        data-funnel-stage="${stage.value}"
        style="--step-color:${stage.color};--step-width:${width}%"
        aria-label="${stage.label}，当前 ${currentCount}，累计 ${reachedCount}，转化率 ${conversion}"
      >
        <span>${stage.label}</span>
        <span class="funnel-track"><span class="funnel-fill"></span></span>
        <strong class="funnel-numbers">${currentCount} / ${reachedCount}</strong>
        <strong class="funnel-rate">${conversion}</strong>
      </button>
    `;
  }).join("");
  refreshIcons();
}

function renderIndustry() {
  const colors = ["#087f5b", "#3269aa", "#a8640a", "#7950a6", "#b23a48"];
  const counts = APPLICATIONS.reduce((result, item) => {
    result[item.industry] = (result[item.industry] || 0) + 1;
    return result;
  }, {});
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map((item) => item[1]));
  document.getElementById("industryBars").innerHTML = rows
    .map(
      ([name, count], index) => `
        <div class="industry-row" style="--industry-color:${colors[index % colors.length]};--industry-width:${Math.round((count / max) * 100)}%">
          <span>${escapeHtml(name)}</span>
          <span class="industry-track"><span></span></span>
          <strong>${count}</strong>
        </div>
      `,
    )
    .join("");
}

function renderApplicationStageOptions() {
  document.getElementById("applicationStageFilter").innerHTML =
    '<option value="">全部进展</option>' +
    STAGES.map(
      (stage) =>
        `<option value="${stage.value}" ${applicationStageFilter === stage.value ? "selected" : ""}>${stage.label}</option>`,
    ).join("");
}

function reminderForApplication(applicationId) {
  return REMINDERS.find(
    (item) => item.applicationId === applicationId && item.status === "pending",
  );
}

function renderApplications() {
  const search = document.getElementById("applicationSearch").value.trim().toLowerCase();
  const stageFilter = document.getElementById("applicationStageFilter").value;
  applicationStageFilter = stageFilter;
  const rows = APPLICATIONS.filter((item) => {
    if (stageFilter && item.stage !== stageFilter) return false;
    if (search) {
      const haystack =
        `${item.company} ${item.department} ${item.role} ${item.note}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  }).sort((a, b) => b.stageDate - a.stageDate);

  const filterText = [];
  if (stageFilter) filterText.push(`进展：${STAGE_MAP[stageFilter].label}`);
  if (search) filterText.push(`关键词：${search}`);
  const activeFilter = document.getElementById("activeApplicationFilter");
  activeFilter.hidden = filterText.length === 0;
  document.getElementById("activeApplicationFilterText").textContent = filterText.join(" · ");

  document.getElementById("applicationRows").innerHTML = rows
    .map((item) => {
      const stage = STAGE_MAP[item.stage];
      const reminder = reminderForApplication(item.id);
      const reminderLabel = reminder
        ? `${reminderTheme(reminder.type).label} ${relativeDue(reminder.dueAt)}`
        : "暂无提醒";
      return `
        <button class="compact-job-record" type="button" data-edit-job="${item.id}" data-application-id="${item.id}">
          <div class="compact-job-line primary-line">
            <strong class="compact-job-title">${escapeHtml(item.company)} · ${escapeHtml(item.role)}</strong>
            <span class="stage-pill" style="--pill-color:${stage.color};--pill-soft:${stage.soft}">${stage.label}</span>
          </div>
          <div class="compact-job-line secondary-line">
            <span class="compact-job-meta" title="${escapeHtml(item.department)}"><i data-lucide="building-2"></i>${escapeHtml(item.department)}</span>
            <span class="compact-job-meta"><i data-lucide="calendar-days"></i>${formatDateOffset(item.stageDate)}</span>
            <span class="compact-job-meta ${reminder ? "has-reminder" : ""}"><i data-lucide="${reminder ? reminderTheme(reminder.type).icon : "bell-off"}"></i>${escapeHtml(reminderLabel)}</span>
            <span class="compact-job-meta"><i data-lucide="image"></i>JD ${item.jdCount} 张</span>
            <span class="table-action" aria-hidden="true">
              <i data-lucide="pencil"></i>
            </span>
          </div>
        </button>
      `;
    })
    .join("");
  document.getElementById("applicationEmpty").hidden = rows.length > 0;
  refreshIcons();
}

function renderCompanyChips() {
  const categories = ["全部", ...new Set(COMPANIES.map((item) => item.category))];
  document.getElementById("companyChips").innerHTML = categories
    .map(
      (category) => `
        <button class="${companyCategory === category ? "is-active" : ""}" type="button" data-company-category="${category}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join("");
}

function renderCompanies() {
  const search = document.getElementById("companySearch").value.trim().toLowerCase();
  const rows = COMPANIES.filter((item) => {
    if (companyCategory !== "全部" && item.category !== companyCategory) return false;
    if (search && !`${item.name} ${item.direction}`.toLowerCase().includes(search)) return false;
    return true;
  });
  document.getElementById("companyGrid").innerHTML = rows
    .map(
      (item) => `
        <article class="company-card">
          <div class="company-card-head">
            <span class="company-letter" style="--company-color:${item.color}">${escapeHtml(item.name.slice(0, 1))}</span>
            <span>
              <strong>${escapeHtml(item.name)}</strong>
              <span>${escapeHtml(item.category)}</span>
            </span>
            <span class="company-state">${escapeHtml(item.state)}</span>
          </div>
          <p>${escapeHtml(item.direction)}</p>
          <div class="company-card-actions">
            <button class="demo-button secondary" type="button"><i data-lucide="external-link"></i>官方入口</button>
            <button class="demo-button primary" type="button" data-add-target="${escapeHtml(item.name)}"><i data-lucide="plus"></i>加入目标</button>
          </div>
        </article>
      `,
    )
    .join("");
  refreshIcons();
}

function openReminder(id) {
  const reminder = REMINDERS.find((item) => item.id === id);
  const application = reminder
    ? APPLICATIONS.find((item) => item.id === reminder.applicationId)
    : null;
  if (!reminder || !application) return;
  selectedReminderId = id;
  const theme = reminderTheme(reminder.type);
  document.getElementById("dialogEyebrow").textContent = theme.label;
  document.getElementById("dialogTitle").textContent = `${application.company} · ${reminder.title}`;
  document.getElementById("dialogBody").innerHTML = `
    <div class="reminder-detail-grid">
      <div><span>公司 / 部门</span><strong>${escapeHtml(application.company)} · ${escapeHtml(application.department)}</strong></div>
      <div><span>岗位</span><strong>${escapeHtml(application.role)}</strong></div>
      <div><span>事项</span><strong>${escapeHtml(reminder.eventName)}</strong></div>
      <div><span>时间</span><strong>${formatDate(reminder.dueAt, true)} · ${relativeDue(reminder.dueAt)}</strong></div>
    </div>
    <p class="dialog-note">${escapeHtml(reminder.note)}</p>
  `;
  const action = document.getElementById("dialogPrimaryAction");
  action.hidden = reminder.status === "done";
  action.innerHTML =
    reminder.type === "review"
      ? '<i data-lucide="clipboard-check"></i>完成面试评价'
      : '<i data-lucide="check"></i>标记已知晓';
  document.getElementById("reminderDialog").showModal();
  refreshIcons();
}

function completeCurrentReminder() {
  const reminder = REMINDERS.find((item) => item.id === selectedReminderId);
  if (!reminder) return;
  reminder.status = "done";
  document.getElementById("reminderDialog").close();
  renderOverviewStats();
  renderReminders();
  renderApplications();
  showToast(reminder.type === "review" ? "面试评价已完成，复盘待办已关闭" : "提醒已标记为已知晓");
}

function jumpToApplication(applicationId, stage = "") {
  const application = APPLICATIONS.find((item) => item.id === applicationId);
  if (!application) return;
  applicationStageFilter = stage;
  renderApplicationStageOptions();
  document.getElementById("applicationStageFilter").value = stage;
  document.getElementById("applicationSearch").value = stage ? "" : application.company;
  renderApplications();
  switchView("applications");
  if (document.getElementById("reminderDialog").open) {
    document.getElementById("reminderDialog").close();
  }
}

function parseCapture(text) {
  const company =
    ["字节跳动", "字节", "腾讯", "美团", "小红书", "百度", "蚂蚁"].find((item) =>
      text.includes(item),
    ) || "待确认公司";
  const stage =
    STAGES.find((item) => text.toLowerCase().includes(item.label.toLowerCase())) ||
    (text.includes("面试") ? STAGE_MAP.first : STAGE_MAP.applied);
  const schedule =
    text.includes("后天") ? "后天" : text.includes("明天") ? "明天" : "日期待确认";
  return { company: company === "字节" ? "字节跳动" : company, stage, schedule };
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      switchView(viewButton.dataset.view);
      return;
    }
    const reminderFilterButton = event.target.closest("[data-reminder-filter]");
    if (reminderFilterButton) {
      reminderFilter = reminderFilterButton.dataset.reminderFilter;
      document.querySelectorAll("[data-reminder-filter]").forEach((button) => {
        button.classList.toggle("is-active", button === reminderFilterButton);
      });
      renderReminders();
      return;
    }
    const reminder = event.target.closest("[data-reminder-id]");
    if (reminder) {
      openReminder(reminder.dataset.reminderId);
      return;
    }
    const funnel = event.target.closest("[data-funnel-stage]");
    if (funnel) {
      applicationStageFilter = funnel.dataset.funnelStage;
      renderApplicationStageOptions();
      document.getElementById("applicationStageFilter").value = applicationStageFilter;
      document.getElementById("applicationSearch").value = "";
      renderApplications();
      switchView("applications");
      return;
    }
    const job = event.target.closest("[data-job-id]");
    if (job) {
      jumpToApplication(job.dataset.jobId);
      return;
    }
    const editJob = event.target.closest("[data-edit-job]");
    if (editJob) {
      const application = APPLICATIONS.find((item) => item.id === editJob.dataset.editJob);
      showToast(`${application.company} · ${application.role}：正式版沿用现有编辑抽屉`);
      return;
    }
    const companyCategoryButton = event.target.closest("[data-company-category]");
    if (companyCategoryButton) {
      companyCategory = companyCategoryButton.dataset.companyCategory;
      renderCompanyChips();
      renderCompanies();
      return;
    }
    const addTarget = event.target.closest("[data-add-target]");
    if (addTarget) {
      addTarget.disabled = true;
      addTarget.innerHTML = '<i data-lucide="check"></i>已加入';
      showToast(`${addTarget.dataset.addTarget} 已加入目标`);
      refreshIcons();
      return;
    }
    const closeDialog = event.target.closest("[data-close-dialog]");
    if (closeDialog) {
      document.getElementById("reminderDialog").close();
      return;
    }
    const commitCapture = event.target.closest("[data-commit-capture]");
    if (commitCapture) {
      document.getElementById("captureResult").hidden = true;
      document.getElementById("captureInput").value = "";
      showToast("Demo：识别结果已写入岗位进展");
    }
  });

  document.getElementById("captureForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("captureInput");
    const text = input.value.trim();
    if (!text) {
      showToast("先输入一条投递或进展信息");
      return;
    }
    const parsed = parseCapture(text);
    const result = document.getElementById("captureResult");
    result.innerHTML = `
      <i data-lucide="scan-text"></i>
      <span><strong>${escapeHtml(parsed.company)}</strong> · ${parsed.stage.label} · ${parsed.schedule}</span>
      <button class="demo-button secondary" type="button" data-commit-capture>确认记录</button>
    `;
    result.hidden = false;
    refreshIcons();
  });

  document.getElementById("reminderSort").addEventListener("change", renderReminders);
  document.getElementById("applicationSearch").addEventListener("input", renderApplications);
  document
    .getElementById("applicationStageFilter")
    .addEventListener("change", renderApplications);
  document.getElementById("companySearch").addEventListener("input", renderCompanies);

  document.getElementById("clearApplicationFilter").addEventListener("click", () => {
    applicationStageFilter = "";
    document.getElementById("applicationSearch").value = "";
    renderApplicationStageOptions();
    renderApplications();
  });

  document.getElementById("dialogPrimaryAction").addEventListener("click", completeCurrentReminder);
  document.getElementById("dialogOpenJob").addEventListener("click", () => {
    const reminder = REMINDERS.find((item) => item.id === selectedReminderId);
    if (reminder) jumpToApplication(reminder.applicationId);
  });

  document.getElementById("addButton").addEventListener("click", () => {
    showToast("正式版将打开现有的新增投递弹窗");
  });
  document.getElementById("exportCsvDemoButton").addEventListener("click", () => {
    showToast("Demo：CSV 导出入口已收纳到右上角");
  });

  document.getElementById("reminderDialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });
}

function init() {
  document.getElementById("todayLabel").textContent = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
  renderOverviewStats();
  renderReminders();
  renderFunnel();
  renderIndustry();
  renderApplicationStageOptions();
  renderApplications();
  renderCompanyChips();
  renderCompanies();
  bindEvents();
  const requestedView = window.location.hash.slice(1);
  if (VIEW_META[requestedView]) switchView(requestedView);
  refreshIcons();
}

document.addEventListener("DOMContentLoaded", init);
