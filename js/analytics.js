/**
 * STUDENT 3: Avesh
 * Focus: Analytics Dashboard
 * Responsibility: Data Visualization & Stats
 *
 * Reads from: data.tasks (Wakas), data.habits (Ayesha), data.xp/level (Himanshu)
 * Rule: Avesh is the "Viewer" — never modifies tasks or habits arrays.
 */

document.addEventListener("DOMContentLoaded", initAnalytics);

// ─────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────
function initAnalytics() {
    // Compute shared stats ONCE and pass them down — no duplicate calculations
    const stats = computeStats();

    renderTopBar(stats);
    renderKPICards(stats);
    renderLeaderboard(stats);
    renderGrowthChart(stats);
    renderEfficiencyScore(stats);
    renderTasksBreakdown(stats);
    renderHabitsBreakdown(stats);
}

// ─────────────────────────────────────────────────────────────
// SHARED COMPUTATION — called once, results reused by every render fn
// ─────────────────────────────────────────────────────────────
function computeStats() {
    const data = getData();

    const tasks    = data.tasks   || [];
    const habits   = data.habits  || [];
    const user     = data.user    || {};

    // Tasks (Wakas)
    const totalTasks     = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    const doneCount      = completedTasks.length;
    const taskRate       = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    // Habits (Ayesha)
    const totalHabits     = habits.length;
    const habitsDoneToday = habits.filter(h => h.completedToday).length;
    const habitRate       = totalHabits > 0 ? Math.round((habitsDoneToday / totalHabits) * 100) : 0;
    const bestStreak      = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const totalStreak     = habits.reduce((sum, h) => sum + (h.streak || 0), 0);

    // XP / Level (Himanshu)
    const xp    = user.xp    ?? data.xp    ?? 0;
    const level = user.level ?? data.level ?? 1;

    // Productivity score = average of task + habit completion rates
    const productivityScore = Math.round((taskRate + habitRate) / 2);

    // Leaderboard XP
    const wakasXP   = completedTasks.reduce((sum, t) => sum + (t.xp || 10), 0);
    const ayeshaXP  = (habitsDoneToday * 20) + (totalStreak * 5);
    const perfectDays = data.stats?.perfectDays ?? 0;

    return {
        data, tasks, habits, user,
        totalTasks, doneCount, completedTasks, taskRate,
        totalHabits, habitsDoneToday, habitRate,
        bestStreak, totalStreak,
        xp, level,
        productivityScore,
        wakasXP, ayeshaXP,
        perfectDays,
    };
}

// ─────────────────────────────────────────────────────────────
// TOP BAR
// ─────────────────────────────────────────────────────────────
function renderTopBar({ level }) {
    setEl("user-level", `Level ${level}`);
}

// ─────────────────────────────────────────────────────────────
// KPI CARDS
// ─────────────────────────────────────────────────────────────
function renderKPICards({ doneCount, taskRate, habitsDoneToday, habitRate, bestStreak, xp, level }) {
    setEl("kpi-tasks-done",   doneCount);
    setEl("kpi-tasks-rate",   `${taskRate}% completion`);
    setEl("kpi-habits-today", habitsDoneToday);
    setEl("kpi-habits-rate",  `${habitRate}% done`);
    setEl("kpi-streak",       bestStreak);
    setEl("kpi-xp",           xp);
    setEl("kpi-level",        `Level ${level}`);
}

// ─────────────────────────────────────────────────────────────
// EFFICIENCY / PRODUCTIVITY SCORE
// ─────────────────────────────────────────────────────────────
function renderEfficiencyScore({ productivityScore, taskRate, habitRate }) {
    // SVG ring: circumference of r=52 circle = 2π×52 ≈ 326.7
    const CIRCUMFERENCE = 2 * Math.PI * 52;
    const arc = document.getElementById("score-arc");

    if (arc) {
        const offset = CIRCUMFERENCE - (productivityScore / 100) * CIRCUMFERENCE;
        // Small timeout lets the CSS transition fire after paint
        setTimeout(() => { arc.style.strokeDashoffset = offset; }, 120);
    }

    setEl("score-value",      `${productivityScore}%`);
    setEl("score-task-rate",  `${taskRate}%`);
    setEl("score-habit-rate", `${habitRate}%`);
}

// ─────────────────────────────────────────────────────────────
// TEAM LEADERBOARD
// ─────────────────────────────────────────────────────────────
function renderLeaderboard({ wakasXP, ayeshaXP, xp: himanshuXP, level: himanshuLevel, doneCount, totalTasks, habitsDoneToday, totalHabits, totalStreak }) {
    const container = document.getElementById("leaderboard-list");
    if (!container) return;

    const members = [
        {
            name:     "Wakas",
            role:     "Task Manager",
            icon:     "check-square",
            color:    "#0d9488",
            bg:       "rgba(13,148,136,0.12)",
            initials: "WK",
            xp:       wakasXP,
            detail:   `${doneCount} / ${totalTasks} tasks completed`,
        },
        {
            name:     "Ayesha",
            role:     "Habit Tracker",
            icon:     "calendar-check",
            color:    "#6366f1",
            bg:       "rgba(99,102,241,0.12)",
            initials: "AY",
            xp:       ayeshaXP,
            detail:   `${habitsDoneToday} / ${totalHabits} habits today · ${totalStreak} streak days`,
        },
        {
            name:     "Himanshu",
            role:     "Gamification",
            icon:     "award",
            color:    "#f59e0b",
            bg:       "rgba(245,158,11,0.12)",
            initials: "HM",
            xp:       himanshuXP,
            detail:   `Level ${himanshuLevel} · ${himanshuXP} total XP`,
        },
    ];

    members.sort((a, b) => b.xp - a.xp);
    const topXP  = members[0].xp || 1;
    const medals = ["🥇", "🥈", "🥉"];

    container.innerHTML = members.map((m, i) => {
        const pct = Math.min(Math.round((m.xp / topXP) * 100), 100);
        return `
        <div class="lb-row">
            <div class="lb-medal">${medals[i]}</div>
            <div class="lb-avatar" style="background:${m.bg};color:${m.color};">${m.initials}</div>
            <div class="lb-info">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="lb-name">${escHtml(m.name)}</span>
                    <span class="lb-xp" style="color:${m.color};">${m.xp} XP</span>
                </div>
                <div class="lb-detail">${escHtml(m.detail)}</div>
                <div class="habit-bar-bg" style="margin-top:6px;">
                    <div class="habit-bar-fill" style="width:${pct}%;background:${m.color};"></div>
                </div>
            </div>
        </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// GROWTH CHART — Chart.js line graph, last 7 days
// ─────────────────────────────────────────────────────────────
function renderGrowthChart({ tasks, habits }) {
    const ctx = document.getElementById("growthChart")?.getContext("2d");
    if (!ctx) return;

    // Build 7-day labels + counts
    const dayLabels   = [];
    const taskCounts  = [];
    const habitCounts = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        dayLabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));

        taskCounts.push(
            tasks.filter(t => t.completed && t.completedAt?.slice(0, 10) === dateStr).length
        );
        habitCounts.push(
            habits.filter(h => Array.isArray(h.history) && h.history.includes(dateStr)).length
        );
    }

    // Fallback dummy data so chart always renders visually
    const noData       = taskCounts.every(v => v === 0) && habitCounts.every(v => v === 0);
    const finalTasks   = noData ? [2, 5, 3, 8, 4, 3, 6] : taskCounts;
    const finalHabits  = noData ? [1, 3, 2, 4, 3, 2, 5] : habitCounts;

    // Update the custom legend label with real habit names
    const habitNames = habits.map(h => h.name).filter(Boolean);
    const legendEl   = document.getElementById("habits-legend-label");
    if (legendEl && habitNames.length > 0) {
        legendEl.textContent = `Habits: ${habitNames.join(", ")}`;
    }

    // Custom plugin: mark highest & lowest per dataset
    const peakPlugin = {
        id: "peakPlugin",
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const owners = [
                { name: "Wakas",  color: "#0d9488" },
                { name: "Ayesha", color: "#6366f1" },
            ];

            chart.data.datasets.forEach((dataset, dsi) => {
                const meta   = chart.getDatasetMeta(dsi);
                const values = dataset.data;
                if (!values.length) return;

                const owner  = owners[dsi] || { name: "?", color: "#94a3b8" };
                const maxVal = Math.max(...values);
                const minVal = Math.min(...values);

                meta.data.forEach((point, i) => {
                    const val = values[i];
                    ctx.save();
                    ctx.font         = "500 10px Inter, system-ui";
                    ctx.textAlign    = "center";
                    ctx.textBaseline = "middle";

                    if (val === maxVal) {
                        const label = `▲ ${owner.name}`;
                        const tw    = ctx.measureText(label).width + 12;
                        const ty    = point.y - 20;
                        ctx.fillStyle   = owner.color + "18";
                        ctx.beginPath();
                        ctx.roundRect(point.x - tw / 2, ty - 8, tw, 16, 6);
                        ctx.fill();
                        ctx.fillStyle = owner.color;
                        ctx.fillText(label, point.x, ty);
                    }

                    if (val === minVal && minVal !== maxVal) {
                        const label = `▼ ${owner.name}`;
                        const tw    = ctx.measureText(label).width + 12;
                        const ty    = point.y + 20;
                        ctx.fillStyle   = owner.color + "18";
                        ctx.beginPath();
                        ctx.roundRect(point.x - tw / 2, ty - 8, tw, 16, 6);
                        ctx.fill();
                        ctx.fillStyle = owner.color;
                        ctx.fillText(label, point.x, ty);
                    }

                    ctx.restore();
                });
            });
        }
    };

    new Chart(ctx, {
        type: "line",
        plugins: [peakPlugin],
        data: {
            labels: dayLabels,
            datasets: [
                {
                    label: "Tasks",
                    data: finalTasks,
                    borderColor: "#0d9488",
                    backgroundColor: "rgba(13,148,136,0.08)",
                    fill: true,
                    tension: 0.45,
                    pointBackgroundColor: "#0d9488",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2,
                },
                {
                    label: "Habits",
                    data: finalHabits,
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99,102,241,0.08)",
                    fill: true,
                    tension: 0.45,
                    pointBackgroundColor: "#6366f1",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2,
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // Hide Chart.js default legend — we built a custom HTML one
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#1e293b",
                    titleColor: "#f1f5f9",
                    bodyColor: "#94a3b8",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8,
                }
            },
            interaction: { mode: "index", intersect: false },
            layout: { padding: { top: 28 } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 11, family: "Inter" },
                        stepSize: 1,
                        precision: 0,
                    },
                    grid: { color: "rgba(100,116,139,0.1)" },
                },
                x: {
                    ticks: { color: "#94a3b8", font: { size: 11, family: "Inter" } },
                    grid: { display: false },
                }
            }
        }
    });
}

// ─────────────────────────────────────────────────────────────
// TASKS BREAKDOWN
// ─────────────────────────────────────────────────────────────
function renderTasksBreakdown({ tasks }) {
    const container = document.getElementById("tasks-list");
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = `<div class="empty-state">No tasks yet — add tasks in the Task Manager.</div>`;
        return;
    }

    container.innerHTML = tasks.map(t => {
        const name   = escHtml(t.title || t.name || t.text || "Untitled task");
        const done   = !!t.completed;
        const pill   = done
            ? `<span class="completion-pill pill-done">✓ Completed</span>`
            : `<span class="completion-pill pill-pending">⏳ Pending</span>`;

        const p = (t.priority || "").toLowerCase();
        const badgeClass = p === "high" ? "badge-high" : p === "medium" ? "badge-medium" : p === "low" ? "badge-low" : "";
        const badge = p ? `<span class="badge ${badgeClass}">${p}</span>` : "";

        const barStyle = done
            ? `width:100%;background:linear-gradient(90deg,#0d9488,#6366f1);`
            : `width:0%;`;

        return `
        <div class="habit-row">
            <div class="habit-row-header">
                <span style="display:flex;align-items:center;gap:6px;">${name}${badge}</span>
                ${pill}
            </div>
            <div class="habit-bar-bg">
                <div class="habit-bar-fill" style="${barStyle}"></div>
            </div>
        </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// HABITS BREAKDOWN
// ─────────────────────────────────────────────────────────────
function renderHabitsBreakdown({ habits, perfectDays }) {
    const container = document.getElementById("habits-list");
    if (!container) return;

    setEl("habit-score-big", perfectDays);

    if (habits.length === 0) {
        container.innerHTML = `<div class="empty-state">No habits yet — Ayesha's Habit Tracker will populate this.</div>`;
        return;
    }

    const maxStreak = Math.max(...habits.map(h => h.streak || 0), 1);

    container.innerHTML = habits.map(h => {
        const streak    = h.streak || 0;
        const pct       = Math.min(Math.round((streak / maxStreak) * 100), 100);
        const doneColor = h.completedToday ? "#0d9488" : "#f43f5e";
        const doneLabel = h.completedToday ? "✓ Done today" : "Not done today";

        return `
        <div class="habit-row">
            <div class="habit-row-header">
                <span>${escHtml(h.name || "Habit")}</span>
                <span style="display:flex;align-items:center;gap:0.75rem;">
                    <span style="color:${doneColor};font-size:0.75rem;font-weight:600;">${doneLabel}</span>
                    <span style="font-weight:600;color:var(--text-main);">${streak} day streak</span>
                </span>
            </div>
            <div class="habit-bar-bg">
                <div class="habit-bar-fill" style="width:${pct}%;"></div>
            </div>
        </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Safely set textContent of an element by ID */
function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/** Escape HTML — prevents XSS from user-entered task/habit names */
function escHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}