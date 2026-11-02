(function () {
  const fairUi = {
    tab: "offline",
    layout: "week",
    rangeMonths: 1,
    weekOffset: 0,
    selectedSchools: new Set(),
    compareIds: new Set(),
    fairs: [],
    sources: [],
    loading: false,
    error: "",
    loadedKey: "",
    loadedUserId: "",
    plansLoading: false,
    detailCache: new Map(),
  };
  const PLAN_STATES = {
    none: "未关注",
    saved: "已收藏",
    planned: "计划参加",
    attended: "已参加",
    skipped: "不参加",
  };

  function apiBase() {
    const configured = String(window.JOBFLOW_CLOUD_CONFIG?.fairApiUrl || "").trim();
    if (configured) return configured.replace(/\/$/, "");
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      return "http://localhost:8787";
    }
    return "";
  }

  function beijingDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function localDate(value) {
    return new Date(`${value}T12:00:00`);
  }

  function addDays(value, count) {
    const date = typeof value === "string" ? localDate(value) : new Date(value);
    date.setDate(date.getDate() + count);
    return beijingDate(date);
  }

  function addMonths(value, count) {
    const date = typeof value === "string" ? localDate(value) : new Date(value);
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + count);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(day, lastDay));
    return beijingDate(date);
  }

  function startOfWeek(value = beijingDate()) {
    const date = localDate(value);
    const day = date.getDay();
    date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    return beijingDate(date);
  }

  function formatFairDate(value, includeYear = false) {
    if (!value) return "待核实";
    const options = includeYear
      ? { year: "numeric", month: "short", day: "numeric" }
      : { month: "short", day: "numeric" };
    return new Intl.DateTimeFormat("zh-CN", options).format(localDate(value));
  }

  function formatCheckedAt(value) {
    if (!value) return "尚无";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "尚无";
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  function dateTime(date, time, fallbackTime = "12:00") {
    if (!date) return null;
    const result = new Date(`${date}T${time || fallbackTime}:00+08:00`);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  function currentPlans() {
    if (!state.fairPlans || typeof state.fairPlans !== "object") state.fairPlans = {};
    return state.fairPlans;
  }

  function relatedFairIds(fairId) {
    const fair = fairUi.fairs.find((item) => item.id === fairId || item.relatedIds?.includes(fairId)) ||
      fairUi.detailCache.get(fairId) || currentPlans()[fairId]?.fair;
    return [...new Set([fairId, ...(fair?.relatedIds || [])])];
  }

  function planFor(fairId) {
    const plans = currentPlans();
    return relatedFairIds(fairId).map((id) => plans[id]).filter(Boolean)
      .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")) ||
        String(a.fairId).localeCompare(String(b.fairId)))[0] || null;
  }

  function fairFor(fairId) {
    return (
      fairUi.detailCache.get(fairId) ||
      fairUi.fairs.find((item) => item.id === fairId || item.relatedIds?.includes(fairId)) ||
      planFor(fairId)?.fair ||
      null
    );
  }

  async function authHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (!supabaseClient || !cloudUser) return headers;
    const { data } = await supabaseClient.auth.getSession();
    const token = data?.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async function requestApi(path, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const publicRead = method === "GET" && (
      /^\/api\/fairs(?:\?[^#]*|\/[^/?#]+)?$/.test(path) || path === "/api/fair-sources"
    );
    if (!publicRead && !hasWorkspaceAccess()) {
      if (method !== "GET") checkGuestPermission();
      throw new Error("请登录后使用个人双选会计划");
    }
    const base = apiBase();
    if (!base) throw new Error("双选会采集服务尚未配置");
    const sessionVersion = cloudSessionVersion;
    const headers = {
      ...(publicRead ? { "Content-Type": "application/json" } : await authHeaders()),
      ...(options.headers || {}),
    };
    if (!publicRead && (sessionVersion !== cloudSessionVersion || !hasWorkspaceAccess())) throw new Error("登录状态已变更");
    const response = await fetch(`${base}${path}`, {
      ...options,
      headers,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || `请求失败（${response.status}）`);
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function getRange() {
    const todayValue = beijingDate();
    return { from: todayValue, to: addMonths(todayValue, fairUi.rangeMonths) };
  }

  async function loadFairs(force = false) {
    const sessionVersion = cloudSessionVersion;
    const { from, to } = getRange();
    const key = `${from}:${to}`;
    if (!force && fairUi.loadedKey === key && fairUi.fairs.length) return;
    fairUi.loading = true;
    fairUi.error = "";
    renderFairs();
    try {
      const [fairResult, sourceResult] = await Promise.all([
        requestApi(`/api/fairs?from=${from}&to=${to}`),
        requestApi("/api/fair-sources"),
      ]);
      if (sessionVersion !== cloudSessionVersion) return;
      fairUi.fairs = Array.isArray(fairResult.fairs) ? fairResult.fairs : [];
      fairUi.sources = Array.isArray(sourceResult.sources) ? sourceResult.sources : [];
      fairUi.loadedKey = key;
      refreshFairFilterOptions();
      await loadFairPlans();
    } catch (error) {
      if (sessionVersion !== cloudSessionVersion) return;
      fairUi.error = error.message || "双选会数据暂时无法读取";
    } finally {
      if (sessionVersion === cloudSessionVersion) {
        fairUi.loading = false;
        renderFairs();
      }
    }
  }

  async function loadFairPlans() {
    if (isGuest || !hasWorkspaceAccess()) return;
    const userId = cloudUser?.id || "";
    if (!userId || fairUi.loadedUserId === userId || fairUi.plansLoading) return;
    fairUi.plansLoading = true;
    try {
      const result = await requestApi("/api/fair-plans");
      if (cloudUser?.id !== userId) return;
      const plans = {};
      (result.plans || []).forEach((entry) => {
        plans[entry.fairId] = entry;
      });
      state.fairPlans = { ...currentPlans(), ...plans };
      fairUi.loadedUserId = userId;
      saveState();
    } catch (error) {
      if (error.status !== 401) console.warn("Fair plans API unavailable.", error.message);
    } finally {
      fairUi.plansLoading = false;
    }
  }

  function eligibilityType(fair) {
    const text = `${fair.eligibility || ""} ${fair.entryNote || ""}`;
    if (!text.trim()) return "unknown";
    if (/仅限|本校|校内|本院/.test(text)) return "restricted";
    if (/外校|社会|各高校|高校毕业生|毕业生均可|不限/.test(text)) return "open";
    return "unknown";
  }

  function filteredFairs() {
    const query = normalizeText(document.getElementById("fairSearchInput")?.value || "");
    const district = document.getElementById("fairDistrictFilter")?.value || "";
    const scope = document.getElementById("fairScopeFilter")?.value || "";
    const eligibility = document.getElementById("fairEligibilityFilter")?.value || "";
    const hiddenTab = fairUi.tab === "hidden";
    return fairUi.fairs
      .filter((fair) => {
        const plan = planFor(fair.id)?.payload || {};
        if (fairUi.tab === "schedule") return plan.state && plan.state !== "none";
        if (hiddenTab) return Boolean(plan.hidden);
        if (plan.hidden) return false;
        return fair.mode === fairUi.tab;
      })
      .filter((fair) => {
        if (fairUi.selectedSchools.size) {
          const related = [fair.school, fair.campus, fair.organizer]
            .filter(Boolean)
            .some((value) =>
              [...fairUi.selectedSchools].some((school) => String(value).includes(school)),
            );
          if (!related) return false;
        }
        if (district && fair.district !== district) return false;
        if (scope && fair.scopeLevel !== scope) return false;
        if (eligibility && eligibilityType(fair) !== eligibility) return false;
        if (query) {
          const haystack = normalizeText(
            [
              fair.title,
              fair.school,
              fair.organizer,
              fair.place,
              ...(fair.companies || []).map((item) => item.name),
            ].join(" "),
          );
          if (!haystack.includes(query)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (fairUi.tab === "online") {
          const todayValue = beijingDate();
          const aOpen = a.date <= todayValue && (a.endDate || a.date) >= todayValue;
          const bOpen = b.date <= todayValue && (b.endDate || b.date) >= todayValue;
          if (aOpen !== bOpen) return aOpen ? -1 : 1;
          return String(a.endDate || a.date).localeCompare(String(b.endDate || b.date));
        }
        return (
          String(a.date).localeCompare(String(b.date)) ||
          Number(a.scopeRank || 99) - Number(b.scopeRank || 99) ||
          Number(!a.comprehensive) - Number(!b.comprehensive) ||
          String(a.startTime || "99:99").localeCompare(String(b.startTime || "99:99"))
        );
      });
  }

  function fairTime(fair) {
    if (!fair.date) return "时间待核实";
    if (fair.mode === "online" && fair.endDate && fair.endDate !== fair.date) {
      return `${formatFairDate(fair.date, true)} - ${formatFairDate(fair.endDate, true)}`;
    }
    const clocks =
      fair.startTime && fair.endTime
        ? ` ${fair.startTime}-${fair.endTime}`
        : fair.startTime
          ? ` ${fair.startTime} 起`
          : " 时刻待核实";
    return `${formatFairDate(fair.date, true)}${clocks}`;
  }

  function companiesLabel(fair) {
    const labels = {
      unsupported: "企业名单暂未接入",
      unpublished: "企业名单待公布",
      partial: `部分名单${fair.companyCount ? ` · ${fair.companyCount} 家` : ""}`,
      published: `名单已公布${fair.companyCount ? ` · ${fair.companyCount} 家` : ""}`,
    };
    return labels[fair.companiesStatus] || "名单状态待核实";
  }

  function fairRow(fair) {
    const plan = planFor(fair.id)?.payload || {};
    const selected = fairUi.compareIds.has(fair.id);
    const status = fair.status === "cancelled"
      ? "已取消"
      : fair.mode === "online" && fair.date <= beijingDate() && (fair.endDate || fair.date) >= beijingDate()
        ? "正在开放"
        : fair.mode === "online"
          ? "即将开放"
          : fair.scopeLevel || "待核实";
    const issue = (fair.issues || [])[0];
    return `
      <article class="fair-row ${fair.status === "cancelled" ? "is-cancelled" : ""}">
        <div class="fair-row-main">
          <div class="fair-row-title-line">
            <h3>${escapeHtml(fair.title)}</h3>
            <span class="fair-status ${fair.mode === "online" ? "is-online" : ""} ${fair.status === "cancelled" ? "is-danger" : ""}">${escapeHtml(status)}</span>
          </div>
          <div class="fair-row-meta">
            <span><i data-lucide="clock-3"></i>${escapeHtml(fairTime(fair))}</span>
            <span><i data-lucide="${fair.mode === "online" ? "monitor" : "map-pin"}"></i>${escapeHtml(fair.mode === "online" ? "线上会场" : fair.place || "地点待核实")}</span>
            <span><i data-lucide="school"></i>${escapeHtml(fair.school || fair.publisher || "举办学校待核实")}</span>
          </div>
          <div class="fair-row-flags">
            <span>${escapeHtml(fair.eligibility || "入场条件待核实")}</span>
            <span>${escapeHtml(fair.studentDeadline || "学生预约截止待公布")}</span>
            <span>${escapeHtml(companiesLabel(fair))}</span>
            <span class="fair-checked-at">最近核实 ${escapeHtml(formatCheckedAt(fair.checkedAt))}</span>
            ${fair.sources?.length > 1 ? `<span>${fair.sources.length} 个来源</span>` : ""}
            ${plan.state && plan.state !== "none" ? `<span class="fair-plan-state">${escapeHtml(PLAN_STATES[plan.state])}</span>` : ""}
            ${issue ? `<span class="fair-issue">${escapeHtml(issue)}</span>` : ""}
          </div>
        </div>
        <div class="fair-row-actions">
          <button class="icon-button" type="button" data-fair-detail="${fair.id}" aria-label="查看详情" title="查看详情"><i data-lucide="panel-right-open"></i></button>
          <button class="icon-button ${plan.state === "saved" ? "is-active" : ""}" type="button" data-fair-save="${fair.id}" aria-label="收藏或编辑计划" title="收藏或编辑计划"><i data-lucide="bookmark"></i></button>
          <button class="icon-button ${plan.state === "planned" ? "is-active" : ""}" type="button" data-fair-plan="${fair.id}" aria-label="计划参加" title="计划参加"><i data-lucide="calendar-check-2"></i></button>
          <button class="icon-button" type="button" data-fair-hide="${fair.id}" aria-label="${plan.hidden ? "恢复显示" : "隐藏"}" title="${plan.hidden ? "恢复显示" : "隐藏"}"><i data-lucide="${plan.hidden ? "eye" : "eye-off"}"></i></button>
          <button class="fair-compare-toggle ${selected ? "is-active" : ""}" type="button" data-fair-compare="${fair.id}" aria-pressed="${selected}" aria-label="加入对比" title="加入对比"><i data-lucide="columns-3"></i></button>
        </div>
      </article>
    `;
  }

  function weekDates() {
    const start = addDays(startOfWeek(), fairUi.weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }

  function renderGroupedList(fairs, includeEmptyDays) {
    let dates;
    if (includeEmptyDays) {
      dates = weekDates();
    } else {
      dates = [...new Set(fairs.map((fair) => fair.date))];
    }
    const weekday = new Intl.DateTimeFormat("zh-CN", { weekday: "short" });
    return dates
      .map((date) => {
        const rows = fairs.filter((fair) => fair.date === date);
        return `
          <section class="fair-date-group">
            <div class="fair-date-label">
              <strong>${escapeHtml(formatFairDate(date))}</strong>
              <span>${escapeHtml(weekday.format(localDate(date)))}</span>
            </div>
            <div class="fair-date-events">
              ${rows.length ? rows.map(fairRow).join("") : '<p class="fair-empty-date">暂无活动</p>'}
            </div>
          </section>
        `;
      })
      .join("");
  }

  function renderMonth(fairs) {
    const anchor = localDate(addDays(startOfWeek(), fairUi.weekOffset * 7));
    const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12);
    const gridStart = localDate(startOfWeek(beijingDate(first)));
    const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
    const headings = ["一", "二", "三", "四", "五", "六", "日"]
      .map((item) => `<div class="fair-month-heading">周${item}</div>`)
      .join("");
    return `
      <div class="fair-month-grid">
        ${headings}
        ${days
          .map((date) => {
            const rows = fairs.filter((fair) => fair.date === date);
            const outside = localDate(date).getMonth() !== first.getMonth();
            return `
              <div class="fair-month-day ${outside ? "is-outside" : ""}">
                <span class="fair-month-date">${localDate(date).getDate()}</span>
                ${rows
                  .slice(0, 3)
                  .map(
                    (fair) =>
                      `<button class="fair-month-event" type="button" data-fair-detail="${fair.id}">${escapeHtml(fair.startTime || "")} ${escapeHtml(fair.title)}</button>`,
                  )
                  .join("")}
                ${rows.length > 3 ? `<span class="fair-month-date">另 ${rows.length - 3} 场</span>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSchoolChips() {
    const element = document.getElementById("fairSchoolChips");
    const chips = [...fairUi.selectedSchools]
      .map(
        (school) =>
          `<span class="fair-school-chip">${escapeHtml(school)}<button type="button" data-fair-remove-school="${escapeHtml(school)}" aria-label="移除 ${escapeHtml(school)}"><i data-lucide="x"></i></button></span>`,
      )
      .join("");
    element.innerHTML =
      chips +
      (fairUi.selectedSchools.size
        ? '<button class="text-button" type="button" data-fair-clear-schools>清空学校</button>'
        : "");
  }

  function renderCompareBar() {
    const bar = document.getElementById("fairCompareBar");
    const selected = [...fairUi.compareIds].map(fairFor).filter(Boolean);
    bar.hidden = !selected.length || currentView !== "fairs";
    document.getElementById("fairCompareLabel").textContent =
      selected.length < 2
        ? `已选 ${selected.length}/3，再选 1 场即可对比`
        : `已选 ${selected.length}/3`;
    document.getElementById("fairCompareItems").innerHTML = selected
      .map(
        (fair) =>
          `<button type="button" data-fair-remove-compare="${fair.id}" title="移出对比">${escapeHtml(fair.title.slice(0, 18))} ×</button>`,
      )
      .join("");
    document.getElementById("fairCompareOpenButton").disabled = selected.length < 2;
  }

  function plannedItems() {
    const seen = new Set();
    return Object.keys(currentPlans()).map((id) => {
      const entry = planFor(id);
      if (!entry || seen.has(entry.fairId)) return null;
      seen.add(entry.fairId);
      return { ...entry, fair: fairFor(entry.fairId) || entry.fair };
    })
      .filter((entry) => entry?.payload?.state === "planned" && entry.fair)
      .sort((a, b) =>
        `${a.payload.date || a.fair.date}${a.payload.startTime || ""}`.localeCompare(
          `${b.payload.date || b.fair.date}${b.payload.startTime || ""}`,
        ),
      );
  }

  function getPlanInterval(entry) {
    const plan = entry.payload;
    const fair = entry.fair;
    const selectedDate = plan.date || fair.date;
    const startTime = plan.startTime || fair.startTime;
    const endDate = plan.endDate || selectedDate;
    const endTime = plan.endTime || fair.endTime;
    if (!selectedDate || !startTime || !endTime) return null;
    const start = dateTime(selectedDate, startTime);
    let end = dateTime(endDate, endTime);
    if (end && start && end <= start) end = new Date(end.getTime() + 86400000);
    return start && end ? { start, end } : null;
  }

  function allScheduleIntervals(excludeFairId = "") {
    const applicationIntervals = state.applications.flatMap((application) =>
      getProgress(application)
        .filter((progress) => progress.scheduledAt)
        .map((progress) => {
          const start = new Date(progress.scheduledAt);
          const explicit = new Date(progress.endedAt);
          const end =
            !Number.isNaN(explicit.getTime()) && explicit > start
              ? explicit
              : new Date(start.getTime() + 3600000);
          return {
            id: progress.id,
            title: `${application.company} · ${getStatus(progress.stage).label}`,
            place: application.city,
            start,
            end,
            transferMinutes: 0,
          };
        }),
    );
    const fairIntervals = plannedItems()
      .filter((entry) => !relatedFairIds(excludeFairId).includes(entry.fairId))
      .map((entry) => {
        const interval = getPlanInterval(entry);
        return interval
          ? {
              id: entry.fairId,
              title: entry.fair.title,
              place: entry.fair.place,
              ...interval,
              transferMinutes: Number(entry.payload.transferMinutes || 60),
            }
          : null;
      })
      .filter(Boolean);
    return [...applicationIntervals, ...fairIntervals].filter(
      (item) => !Number.isNaN(item.start.getTime()) && !Number.isNaN(item.end.getTime()),
    );
  }

  function conflictsForFair(fair) {
    const plan = planFor(fair.id)?.payload || {
      date: fair.date,
      endDate: fair.date,
      startTime: fair.startTime,
      endTime: fair.endTime,
      transferMinutes: 60,
    };
    const interval = getPlanInterval({ payload: plan, fair });
    if (!interval) return ["缺少明确时刻，需人工核实"];
    const transfer = Number(plan.transferMinutes || 60) * 60000;
    return allScheduleIntervals(fair.id)
      .filter((item) => {
        const overlaps = interval.start < item.end && item.start < interval.end;
        const beforeGap = item.start.getTime() - interval.end.getTime();
        const afterGap = interval.start.getTime() - item.end.getTime();
        return overlaps || (beforeGap >= 0 && beforeGap < transfer) || (afterGap >= 0 && afterGap < transfer);
      })
      .map((item) => item.title);
  }

  function renderSidebar() {
    const week = weekDates();
    const planned = plannedItems().filter((entry) => {
      const value = entry.payload.date || entry.fair.date;
      return value >= week[0] && value <= week[6];
    });
    document.getElementById("fairWeekSchedule").innerHTML = planned.length
      ? planned
          .map(
            (entry) => `
              <div class="fair-side-item">
                <strong>${escapeHtml(entry.fair.title)}</strong>
                <span>${escapeHtml(formatFairDate(entry.payload.date || entry.fair.date))} ${escapeHtml(entry.payload.startTime || entry.fair.startTime || "时刻待核实")}</span>
                <small>${escapeHtml(entry.fair.place || "地点待核实")}</small>
              </div>
            `,
          )
          .join("")
      : '<p class="fair-empty-date">本周暂无参会计划</p>';

    const alerts = [];
    const now = Date.now();
    Object.values(currentPlans()).forEach((entry) => {
      if (!entry?.fair || !entry.payload) return;
      const fair = entry.fair;
      if (Number(fair.revision || 0) > Number(entry.payload.acceptedRevision || 0)) {
        alerts.push(`${fair.title} 有官方信息更新，等待确认`);
      }
      const start = dateTime(entry.payload.date || fair.date, entry.payload.startTime || fair.startTime);
      if (entry.payload.state === "planned" && start) {
        const hours = (start.getTime() - now) / 3600000;
        if (hours > 0 && hours <= 24) alerts.push(`${fair.title} 将在 24 小时内开始`);
      }
      const deadline = dateTime(fair.studentDeadlineDate, fair.studentDeadlineTime, "23:59");
      if (deadline) {
        const hours = (deadline.getTime() - now) / 3600000;
        if (hours > 0 && hours <= 48) alerts.push(`${fair.title} 预约即将截止`);
      }
    });
    document.getElementById("fairAlerts").innerHTML = alerts.length
      ? alerts
          .slice(0, 8)
          .map(
            (message) =>
              `<div class="fair-alert-row"><i data-lucide="bell-ring"></i><span>${escapeHtml(message)}</span></div>`,
          )
          .join("")
      : '<p class="fair-empty-date">暂无临近提醒或待确认变更</p>';
  }

  function sourceStatus(source, now = Date.now()) {
    if (source.enabled === false || (source.enabled !== true && source.status === "待适配")) {
      return { kind: "pending", label: "尚未接入", className: "is-warning" };
    }
    if (source.status === "暂时异常") {
      return { kind: "error", label: "最近更新失败", className: "is-error" };
    }
    if (!source.lastSuccessAt) {
      return { kind: "waiting", label: "等待首次采集", className: "is-warning" };
    }
    const lastSuccess = new Date(source.lastSuccessAt).getTime();
    if (!Number.isFinite(lastSuccess) || now - lastSuccess > 26 * 3600000) {
      return { kind: "warning", label: "超过一天未成功更新", className: "is-warning" };
    }
    const onlyUnsupportedCompanies = /^企业名单接口未接入[^;]*$/.test(source.errorSummary || "");
    if (source.status === "部分异常" && !onlyUnsupportedCompanies) {
      return { kind: "warning", label: "活动信息更新不完整", className: "is-warning" };
    }
    return { kind: "ok", label: "活动已更新", className: "is-ok" };
  }

  function sourceErrorLabel(value) {
    if (/HTTP 403|source_http_403/.test(value || "")) return "来源网站拒绝访问（403）";
    if (/timeout|timed out|time budget/i.test(value || "")) return "来源请求超时，本轮未完成";
    if (/source network request failed|source_network_error/.test(value || "")) return "来源网站连接失败，本轮未完成";
    if (/^企业名单接口未接入[^;]*$/.test(value || "")) return "";
    return value || "";
  }

  function renderSourceSummary() {
    const element = document.getElementById("fairSourceSummary");
    if (!fairUi.sources.length) {
      element.textContent = fairUi.loading ? "正在读取来源状态…" : "来源状态暂不可用";
    } else {
      const statuses = fairUi.sources.map((source) => sourceStatus(source));
      const failed = statuses.filter((item) => item.kind === "error").length;
      const warning = statuses.filter((item) => item.kind === "warning").length;
      const pending = statuses.filter((item) => item.kind === "pending").length;
      const waiting = statuses.filter((item) => item.kind === "waiting").length;
      const message = failed ? `${failed} 个来源更新失败`
        : warning ? `${warning} 个来源待核实`
          : waiting ? `${waiting} 个来源等待采集` : "来源更新正常";
      element.textContent = `已加载 ${fairUi.fairs.length} 场 · ${message}`;
      element.title = pending ? `${pending} 个来源尚未接入，点击查看最近成功时间` : "查看最近成功时间与采集详情";
    }
  }

  function renderFairs() {
    if (!canBrowseWorkspace()) {
      document.getElementById("fairCompareBar").hidden = true;
      return;
    }
    if (!document.getElementById("fairList")) return;
    if (!fairUi.loadedKey && !fairUi.loading) {
      loadFairs();
      return;
    }
    if (cloudUser?.id && fairUi.loadedUserId !== cloudUser.id && !fairUi.plansLoading) {
      window.setTimeout(loadFairPlans, 0);
    }
    const list = document.getElementById("fairList");
    const stateElement = document.getElementById("fairState");
    const weekNav = document.getElementById("fairWeekNav");
    if (fairUi.loading && !fairUi.fairs.length) {
      stateElement.hidden = false;
      stateElement.textContent = "正在读取已采集的双选会数据…";
      list.innerHTML = "";
    } else if (fairUi.error) {
      stateElement.hidden = false;
      stateElement.innerHTML = `${escapeHtml(fairUi.error)}<br><button class="button ghost" type="button" data-fair-retry>重新读取</button>`;
      list.innerHTML = "";
    } else {
      const fairs = filteredFairs();
      let visible = fairs;
      if (fairUi.layout === "week" && fairUi.tab === "offline") {
        const dates = weekDates();
        visible = fairs.filter((fair) => fair.date >= dates[0] && fair.date <= dates[6]);
      }
      stateElement.hidden = Boolean(visible.length);
      stateElement.textContent = visible.length ? "" : "当前条件下没有双选会";
      list.innerHTML =
        fairUi.layout === "month"
          ? renderMonth(fairs)
          : renderGroupedList(visible, fairUi.layout === "week" && fairUi.tab === "offline");
      document.getElementById("fairResultSummary").textContent = `${visible.length} 场活动`;
      if (fairUi.loading) {
        document.getElementById("fairResultSummary").textContent += " · 更新中";
      }
    }
    weekNav.hidden = fairUi.layout === "list" || fairUi.tab !== "offline";
    document.querySelectorAll("[data-fair-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.fairTab === fairUi.tab);
    });
    document.querySelectorAll("[data-fair-layout]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.fairLayout === fairUi.layout);
    });
    document.querySelectorAll("[data-fair-range]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.fairRange) === fairUi.rangeMonths);
    });
    renderSchoolChips();
    renderCompareBar();
    renderSidebar();
    renderSourceSummary();
    refreshIcons();
  }
  window.renderFairs = renderFairs;
  window.resetFairSession = () => {
    fairUi.fairs = [];
    fairUi.sources = [];
    fairUi.loadedKey = "";
    fairUi.loadedUserId = "";
    fairUi.loading = false;
    fairUi.plansLoading = false;
    fairUi.error = "";
    fairUi.compareIds.clear();
    fairUi.detailCache.clear();
    document.getElementById("fairCompareBar").hidden = true;
  };

  function refreshFairFilterOptions() {
    const schools = [...new Set(fairUi.fairs.map((fair) => fair.school).filter(Boolean))].sort();
    document.getElementById("fairSchoolOptions").innerHTML = schools
      .map((school) => `<option value="${escapeHtml(school)}"></option>`)
      .join("");
    const districts = [...new Set(fairUi.fairs.map((fair) => fair.district).filter(Boolean))].sort();
    document.getElementById("fairDistrictFilter").innerHTML =
      '<option value="">全部区域</option>' +
      districts
        .map((district) => `<option value="${escapeHtml(district)}">${escapeHtml(district)}</option>`)
        .join("");
  }

  function ensureSignedIn() {
    return checkGuestPermission();
  }

  function normalizedLocalPlan(fair, overrides = {}) {
    const current = planFor(fair.id);
    return {
      fairId: current?.fairId || fair.id,
      payload: {
        state: "saved",
        hidden: false,
        registered: false,
        note: "",
        date: fair.date,
        endDate: fair.date,
        startTime: fair.startTime || "",
        endTime: fair.endTime || "",
        transferMinutes: 60,
        seenRevision: Number(fair.revision || 0),
        acceptedRevision: Number(fair.revision || 0),
        ...(current?.payload || {}),
        ...overrides,
      },
      revision: Number(current?.revision || 0),
      updatedAt: new Date().toISOString(),
      fair: { ...fair, id: current?.fairId || fair.id, companies: fair.companies || [] },
    };
  }

  async function persistPlan(fair, overrides) {
    if (!checkGuestPermission()) return false;
    const userId = cloudUser?.id || "";
    const previous = planFor(fair.id);
    const next = normalizedLocalPlan(fair, overrides);
    const planId = next.fairId;
    currentPlans()[planId] = next;
    saveState();
    renderFairs();
    renderInterviewCalendar();
    try {
      const result = await requestApi(`/api/fair-plans/${encodeURIComponent(planId)}`, {
        method: "PUT",
        body: JSON.stringify({ revision: next.revision, payload: next.payload }),
      });
      if (cloudUser?.id !== userId) return;
      currentPlans()[planId] = {
        ...next,
        revision: result.revision,
        updatedAt: new Date().toISOString(),
      };
      saveState();
      renderFairs();
    } catch (error) {
      if (cloudUser?.id !== userId) return;
      if (error.status === 409) {
        if (previous) currentPlans()[planId] = previous;
        else delete currentPlans()[planId];
        saveState();
        await loadFairPlansAfterConflict();
        showToast("计划已在其他设备更新，请重新操作");
        return false;
      } else {
        console.warn("Fair plan API sync unavailable.", error.message);
        showToast("计划已保存到当前账户，采集 API 暂未同步");
      }
    }
    return true;
  }

  async function loadFairPlansAfterConflict() {
    fairUi.loadedUserId = "";
    await loadFairPlans();
    renderFairs();
  }

  function openPlanDialog(fair, initialState) {
    if (!fair) return;
    const plan = normalizedLocalPlan(
      fair,
      !planFor(fair.id) && initialState ? { state: initialState } : {},
    ).payload;
    document.getElementById("fairPlanId").value = fair.id;
    document.getElementById("fairPlanTitle").textContent = fair.title;
    document.getElementById("fairPlanState").value = plan.state === "none" ? "saved" : plan.state;
    document.getElementById("fairPlanRegistered").checked = plan.registered;
    document.getElementById("fairPlanDate").value = plan.date || fair.date;
    document.getElementById("fairPlanEndDate").value = plan.endDate || plan.date || fair.date;
    document.getElementById("fairPlanStartTime").value = plan.startTime || "";
    document.getElementById("fairPlanEndTime").value = plan.endTime || "";
    document.getElementById("fairPlanTransfer").value = plan.transferMinutes ?? 60;
    document.getElementById("fairPlanNote").value = plan.note || "";
    openDialog("fairPlanDialog");
  }

  async function openFairDetail(fairId) {
    const sessionVersion = cloudSessionVersion;
    let fair = fairFor(fairId);
    try {
      const result = await requestApi(`/api/fairs/${encodeURIComponent(fairId)}`);
      if (sessionVersion !== cloudSessionVersion) return;
      fair = result.fair;
      fairUi.detailCache.set(fairId, fair);
    } catch (error) {
      if (sessionVersion !== cloudSessionVersion) return;
      if (!fair) {
        showToast(error.message || "详情读取失败");
        return;
      }
    }
    const companies = fair.companies || [];
    const observations = fair.observations || fair.sources || [];
    const changes = fair.changes || [];
    const mapUrl = `https://map.baidu.com/search/${encodeURIComponent(fair.place || fair.title)}`;
    document.getElementById("fairDetailTitle").textContent = fair.title;
    document.getElementById("fairDetailBody").innerHTML = `
      <section class="fair-detail-section">
        <dl class="fair-detail-grid">
          <dt>时间</dt><dd>${escapeHtml(fairTime(fair))}</dd>
          <dt>完整地址</dt><dd>${escapeHtml(fair.place || "待核实")} ${fair.mode === "offline" && fair.place ? `<a href="${mapUrl}" target="_blank" rel="noopener noreferrer">地图搜索</a>` : ""}</dd>
          <dt>主办 / 承办</dt><dd>${escapeHtml([fair.organizer, fair.undertaker].filter(Boolean).join(" / ") || "待公布")}</dd>
          <dt>发布学校</dt><dd>${escapeHtml(fair.publisher || "待核实")}</dd>
          <dt>入场条件</dt><dd>${escapeHtml(fair.eligibility || "待核实")}</dd>
          <dt>入场说明</dt><dd>${escapeHtml(fair.entryNote || "待公布")}</dd>
          <dt>学生预约截止</dt><dd>${escapeHtml(fair.studentDeadline || "待公布")}</dd>
          <dt>层级</dt><dd>${escapeHtml(fair.scopeLevel || "待核实")} · ${escapeHtml(fair.scopeBasis || "待核实")}</dd>
          <dt>名单完整度</dt><dd>${escapeHtml(companiesLabel({ ...fair, companyCount: companies.length }))}</dd>
          <dt>最近核实</dt><dd>${escapeHtml(formatCheckedAt(fair.checkedAt))}</dd>
          ${fair.issues?.length ? `<dt>核实提示</dt><dd>${escapeHtml(fair.issues.join("；"))}</dd>` : ""}
        </dl>
      </section>
      <section class="fair-detail-section">
        <h3>企业与岗位</h3>
        ${companies.length
          ? `<ul class="fair-company-list">${companies.map((company) => `<li><strong>${escapeHtml(company.name)}</strong>${company.stand ? ` · ${escapeHtml(company.stand)}` : ""}${company.positions?.length ? `<br>${escapeHtml(company.positions.join("、"))}` : ""}</li>`).join("")}</ul>`
          : '<p class="fair-description">企业名单待公布或本次采集未完整获取，不能据此视为 0 家。</p>'}
      </section>
      <section class="fair-detail-section">
        <h3>公告正文</h3>
        <p class="fair-description">${escapeHtml(fair.description || "正文待公布")}</p>
      </section>
      <section class="fair-detail-section">
        <h3>来源与变更</h3>
        <p class="fair-description">${observations.length ? observations.map((item) => `${item.sourceId || item.name} · ${formatCheckedAt(item.checkedAt)}`).join("\n") : "来源待核实"}${changes.length ? `\n变更记录：${changes.map((item) => `v${item.revision} ${item.fields.join("、")}`).join("；")}` : ""}</p>
        ${fair.url ? `<p><a href="${escapeHtml(fair.url)}" target="_blank" rel="noopener noreferrer">查看官方原文</a></p>` : ""}
        ${fair.sources?.length > 1 ? `<p class="fair-description">同场活动的其他发布来源：${fair.sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name || source.id)}</a>`).join(" · ")}</p>` : ""}
      </section>
    `;
    openDialog("fairDetailDialog");
    refreshIcons();
  }

  function toggleCompare(fairId) {
    if (fairUi.compareIds.has(fairId)) {
      fairUi.compareIds.delete(fairId);
    } else if (fairUi.compareIds.size >= 3) {
      showToast("最多对比 3 场活动");
      return;
    } else {
      fairUi.compareIds.add(fairId);
    }
    renderFairs();
  }

  async function renderComparison() {
    const sessionVersion = cloudSessionVersion;
    let selected = [...fairUi.compareIds].map(fairFor).filter(Boolean);
    if (selected.length < 2) return;
    await Promise.all(
      selected.map(async (fair) => {
        if (Array.isArray(fair.companies)) return;
        try {
          const result = await requestApi(`/api/fairs/${encodeURIComponent(fair.id)}`);
          if (sessionVersion !== cloudSessionVersion) return;
          fairUi.detailCache.set(fair.id, result.fair);
        } catch (error) {
          console.warn("Fair detail unavailable for comparison.", error.message);
        }
      }),
    );
    if (sessionVersion !== cloudSessionVersion) return;
    selected = [...fairUi.compareIds].map(fairFor).filter(Boolean);
    const search = document.getElementById("fairSearchInput").value.trim();
    const companySets = selected.map(
      (fair) => new Set((fair.companies || []).map((item) => item.name)),
    );
    const common =
      companySets.every((set) => set.size)
        ? [...companySets[0]].filter((name) => companySets.every((set) => set.has(name)))
        : null;
    const rows = [
      ["时间", ...selected.map(fairTime)],
      ["地点", ...selected.map((fair) => fair.place || "待核实")],
      ["入场资格", ...selected.map((fair) => fair.eligibility || "待核实")],
      ["名单完整度", ...selected.map(companiesLabel)],
      [
        "关键词命中",
        ...selected.map((fair) =>
          !search
            ? "未输入关键词"
            : fair.companiesStatus === "unpublished"
              ? "名单未公布，无法判断"
              : (fair.companies || []).some((item) => normalizeText(item.name).includes(normalizeText(search)))
                ? `已提取名单中命中“${search}”`
                : `已提取名单中未命中“${search}”`,
        ),
      ],
      [
        "已有日程冲突",
        ...selected.map((fair) => {
          const conflicts = conflictsForFair(fair);
          return conflicts.length ? conflicts.join("；") : "未发现";
        }),
      ],
      [
        "所选活动之间",
        ...selected.map((fair) => {
          const current = getPlanInterval({
            fair,
            payload: planFor(fair.id)?.payload || {
              date: fair.date,
              endDate: fair.date,
              startTime: fair.startTime,
              endTime: fair.endTime,
            },
          });
          if (!current) return "缺少明确时刻，无法判断";
          const conflicts = selected
            .filter((other) => other.id !== fair.id)
            .filter((other) => {
              const interval = getPlanInterval({
                fair: other,
                payload: planFor(other.id)?.payload || {
                  date: other.date,
                  endDate: other.date,
                  startTime: other.startTime,
                  endTime: other.endTime,
                },
              });
              return interval && current.start < interval.end && interval.start < current.end;
            })
            .map((other) => other.title);
          return conflicts.length ? conflicts.join("；") : "未发现";
        }),
      ],
    ];
    if (common) rows.push(["共同企业", ...selected.map(() => common.length ? common.join("、") : "已公布名单中无共同企业")]);
    else rows.push(["共同企业", ...selected.map(() => "名单不完整，无法判断")]);
    document.getElementById("fairCompareBody").innerHTML = `
      <table class="fair-compare-table">
        <thead><tr><th>比较项</th>${selected.map((fair) => `<th>${escapeHtml(fair.title)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `<${index ? "td" : "th"}>${escapeHtml(cell)}</${index ? "td" : "th"}>`).join("")}</tr>`).join("")}</tbody>
      </table>
    `;
    openDialog("fairCompareDialog");
  }

  function renderSourcesDialog() {
    const now = Date.now();
    document.getElementById("fairSourceBody").innerHTML = `
      <p class="fair-source-note">活动保留最近成功获取的数据；更新失败时仍可查看。以下时间均为北京时间。</p>
      <div class="fair-source-list">
        ${fairUi.sources
          .map((source) => {
            const status = sourceStatus(source, now);
            const error = sourceErrorLabel(source.errorSummary);
            const companiesUnsupported = source.companiesSupported === false || source.companiesStatus === "unsupported"
              || /^企业名单接口未接入/.test(source.errorSummary || "");
            return `
              <div class="fair-source-row">
                <div>
                  <strong>${escapeHtml(source.name)}</strong>
                  <small>${escapeHtml(source.note || "")}</small>
                  <small>最近成功更新：${escapeHtml(formatCheckedAt(source.lastSuccessAt))}</small>
                  <small>最近尝试：${escapeHtml(formatCheckedAt(source.lastAttemptAt))} · 活动完整核实：${escapeHtml(formatCheckedAt(source.lastCompleteAt))}</small>
                  <small>已保存 ${Number(source.itemCount || 0)} 条活动${source.detailsPending ? ` · ${Number(source.detailsPending)} 场详情待续采` : ""}</small>
                  ${companiesUnsupported ? "<small>企业名单暂未接入，不影响活动更新。</small>" : ""}
                  ${source.companiesStatus === "error" ? "<small>企业名单本轮读取失败，已保留此前获取的名单。</small>" : ""}
                  ${source.companiesPending ? `<small>${Number(source.companiesPending)} 场企业名单待补充，不影响活动更新。</small>` : ""}
                  ${error ? `<small>${escapeHtml(error)}${source.lastSuccessAt ? "；当前可查看此前保存的活动。" : ""}</small>` : ""}
                </div>
                <span class="fair-source-state ${status.className}">${escapeHtml(status.label)}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
    openDialog("fairSourceDialog");
  }

  function escapeIcs(value) {
    return String(value || "")
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  }

  function foldIcs(line) {
    const bytes = new TextEncoder().encode(line);
    if (bytes.length <= 75) return line;
    const chunks = [];
    let chunk = "";
    for (const character of line) {
      if (new TextEncoder().encode(chunk + character).length > 73) {
        chunks.push(chunk);
        chunk = character;
      } else {
        chunk += character;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks.join("\r\n ");
  }

  function exportFairIcs() {
    const planned = plannedItems();
    if (!planned.length) {
      showToast("暂无可导出的参会计划");
      return;
    }
    const events = planned
      .map((entry) => {
        const fair = entry.fair;
        const plan = entry.payload;
        const startDate = plan.date || fair.date;
        const endDate = plan.endDate || startDate;
        if (!startDate) return "";
        const uid = `${fair.id}@offerflow`;
        const details = `${fair.place || "地点待核实"}\\n${plan.note || ""}\\n${fair.url || ""}`;
        if (!plan.startTime && !fair.startTime) {
          return [
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}/, "")}`,
            `DTSTART;VALUE=DATE:${startDate.replaceAll("-", "")}`,
            `DTEND;VALUE=DATE:${addDays(endDate, 1).replaceAll("-", "")}`,
            `SUMMARY:${escapeIcs(fair.title)}`,
            `DESCRIPTION:${escapeIcs(details)}`,
            "END:VEVENT",
          ].join("\r\n");
        }
        const start = `${startDate.replaceAll("-", "")}T${(plan.startTime || fair.startTime).replace(":", "")}00`;
        const end = `${endDate.replaceAll("-", "")}T${(plan.endTime || fair.endTime || plan.startTime || fair.startTime).replace(":", "")}00`;
        return [
          "BEGIN:VEVENT",
          `UID:${uid}`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\\.\\d{3}/, "")}`,
          `DTSTART;TZID=Asia/Shanghai:${start}`,
          `DTEND;TZID=Asia/Shanghai:${end}`,
          `SUMMARY:${escapeIcs(fair.title)}`,
          `LOCATION:${escapeIcs(fair.place || "地点待核实")}`,
          `DESCRIPTION:${escapeIcs(details)}`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .filter(Boolean);
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//OfferFlow//Job Fairs//ZH-CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR",
    ]
      .flatMap((line) => line.split("\r\n").map(foldIcs))
      .join("\r\n");
    downloadBlob(
      new Blob([content], { type: "text/calendar;charset=utf-8" }),
      `OfferFlow双选会日程_${beijingDate()}.ics`,
    );
    showToast("ICS 日程快照已导出，官方改期后需重新导出");
  }

  window.getFairCalendarEvents = function () {
    return plannedItems()
      .map((entry) => {
        const interval = getPlanInterval(entry);
        if (!interval) return null;
        return {
          kind: "fair",
          fair: entry.fair,
          start: interval.start,
          end: interval.end,
          isAssessment: false,
          transferMinutes: Number(entry.payload.transferMinutes || 60),
          conflict: false,
        };
      })
      .filter(Boolean);
  };

  window.clearFairPlans = async function () {
    if (!checkGuestPermission()) return false;
    const plans = currentPlans();
    const revisions = Object.fromEntries(
      Object.entries(plans).map(([fairId, entry]) => [fairId, Number(entry?.revision || 0)]),
    );
    if (apiBase() && Object.keys(revisions).length) {
      await requestApi("/api/fair-plans", {
        method: "DELETE",
        body: JSON.stringify({ revisions }),
      });
    }
    state.fairPlans = {};
    fairUi.loadedUserId = "";
    fairUi.compareIds.clear();
  };

  function bindFairEvents() {
    document.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-fair-tab]");
      if (tab) {
        fairUi.tab = tab.dataset.fairTab;
        fairUi.weekOffset = 0;
        renderFairs();
        return;
      }
      const layout = event.target.closest("[data-fair-layout]");
      if (layout) {
        fairUi.layout = layout.dataset.fairLayout;
        renderFairs();
        return;
      }
      const range = event.target.closest("[data-fair-range]");
      if (range) {
        fairUi.rangeMonths = Number(range.dataset.fairRange);
        fairUi.loadedKey = "";
        loadFairs(true);
        return;
      }
      const week = event.target.closest("[data-fair-week]");
      if (week) {
        const direction = Number(week.dataset.fairWeek);
        fairUi.weekOffset = direction === 0 ? 0 : fairUi.weekOffset + direction;
        renderFairs();
        return;
      }
      const detail = event.target.closest("[data-fair-detail], [data-calendar-fair]");
      if (detail) {
        openFairDetail(detail.dataset.fairDetail || detail.dataset.calendarFair);
        return;
      }
      const save = event.target.closest("[data-fair-save]");
      if (save) {
        openPlanDialog(fairFor(save.dataset.fairSave), "saved");
        return;
      }
      const plan = event.target.closest("[data-fair-plan]");
      if (plan) {
        openPlanDialog(fairFor(plan.dataset.fairPlan), "planned");
        return;
      }
      const hide = event.target.closest("[data-fair-hide]");
      if (hide) {
        if (!ensureSignedIn()) return;
        const fair = fairFor(hide.dataset.fairHide);
        const current = planFor(fair.id)?.payload || {};
        fairUi.compareIds.delete(fair.id);
        persistPlan(fair, { state: current.state || "none", hidden: !current.hidden });
        return;
      }
      const compare = event.target.closest("[data-fair-compare]");
      if (compare) {
        toggleCompare(compare.dataset.fairCompare);
        return;
      }
      const removeCompare = event.target.closest("[data-fair-remove-compare]");
      if (removeCompare) {
        fairUi.compareIds.delete(removeCompare.dataset.fairRemoveCompare);
        renderFairs();
        return;
      }
      const removeSchool = event.target.closest("[data-fair-remove-school]");
      if (removeSchool) {
        fairUi.selectedSchools.delete(removeSchool.dataset.fairRemoveSchool);
        renderFairs();
        return;
      }
      if (event.target.closest("[data-fair-clear-schools]")) {
        fairUi.selectedSchools.clear();
        renderFairs();
        return;
      }
      if (event.target.closest("[data-fair-retry]")) loadFairs(true);
    });
    document.getElementById("fairSearchInput").addEventListener("input", renderFairs);
    ["fairDistrictFilter", "fairScopeFilter", "fairEligibilityFilter"].forEach((id) => {
      document.getElementById(id).addEventListener("change", renderFairs);
    });
    document.getElementById("fairSchoolInput").addEventListener("change", (event) => {
      const value = event.target.value.trim();
      if (value) fairUi.selectedSchools.add(value);
      event.target.value = "";
      renderFairs();
    });
    document.getElementById("fairCompareClearButton").addEventListener("click", () => {
      fairUi.compareIds.clear();
      renderFairs();
    });
    document.getElementById("fairCompareOpenButton").addEventListener("click", renderComparison);
    document.getElementById("fairSourceButton").addEventListener("click", renderSourcesDialog);
    document.getElementById("fairExportIcsButton").addEventListener("click", exportFairIcs);
    document.getElementById("fairPlanForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!checkGuestPermission()) return;
      const fair = fairFor(document.getElementById("fairPlanId").value);
      if (!fair) return;
      const dateValue = document.getElementById("fairPlanDate").value;
      const endDateValue = document.getElementById("fairPlanEndDate").value;
      if (endDateValue < dateValue) {
        showToast("结束日期不能早于开始日期");
        return;
      }
      const saved = await persistPlan(fair, {
        state: document.getElementById("fairPlanState").value,
        registered: document.getElementById("fairPlanRegistered").checked,
        date: dateValue,
        endDate: endDateValue,
        startTime: document.getElementById("fairPlanStartTime").value,
        endTime: document.getElementById("fairPlanEndTime").value,
        transferMinutes: Number(document.getElementById("fairPlanTransfer").value || 60),
        note: document.getElementById("fairPlanNote").value.trim(),
        acceptedRevision: Number(fair.revision || 0),
        seenRevision: Number(fair.revision || 0),
      });
      if (saved) closeDialog("fairPlanDialog");
    });
  }

  function initFairs() {
    bindFairEvents();
    loadFairs();
    window.setInterval(() => loadFairs(true), 5 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) loadFairs(true);
    });
  }

  document.addEventListener("DOMContentLoaded", initFairs);
})();
