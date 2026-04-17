/**
 *  STUDENT 3: Avesh
 * Focus: Analytics Dashboard Page
 * Responsibility: Data Visualization & Stats
 *
 * Reads from: data.tasks (Wakas), data.habits (Ayesha), data.xp / data.level (Himanshu)
 * Rule: Avesh is the "Viewer" — does NOT modify tasks or habits arrays.
 *       Only reads getData() and updates the UI.
 */

document.addEventListener("DOMContentLoaded", () => {
    initAnalytics();
});

// ─────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────
function initAnalytics() {
    console.log("Avesh's Module: Initializing...");
    renderStatsCards();        // Requirement 1: Stats Cards
    renderLeaderboard();       // Team leaderboard — Wakas / Ayesha / Himanshu
    renderGrowthChart();       // Requirement 2: Growth Chart (Chart.js line graph)
    renderEfficiencyScore();   // Requirement 3: Productivity Score
    renderTasksBreakdown();    // Tasks list with names
    renderHabitsBreakdown();   // Habits list with names & streaks
    updateTopBar();            // Show XP / Level from Himanshu's data
}

// ─────────────────────────────────────────────────────────────
// 1. STATS CARDS
//    - % of tasks completed vs total  (Wakas's data)
//    - Habits done today               (Ayesha's data)
//    - Best streak                     (Ayesha's data)
//    - XP / Level                      (Himanshu's data)
// ─────────────────────────────────────────────────────────────
function renderStatsCards() {
    const data = getData();

    // --- Tasks (Wakas) ---
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const taskRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    setEl("kpi-tasks-done", completedTasks);
    setEl("kpi-tasks-rate", `${taskRate}% completion`);
    setEl("task-rate-big", `${taskRate}%`);   // big number inside Efficiency card

    // --- Habits (Ayesha) ---
    const totalHabits = data.habits.length;
    const habitsDoneToday = data.habits.filter(h => h.completedToday).length;
    const habitRate = totalHabits > 0
        ? Math.round((habitsDoneToday / totalHabits) * 100)
        : 0;

    setEl("kpi-habits-today", habitsDoneToday);
    setEl("kpi-habits-rate", `${habitRate}% done`);

    // Best streak across all habits
    const bestStreak = data.habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    setEl("kpi-streak", bestStreak);

    // --- XP / Level (Himanshu) ---
    setEl("kpi-xp",    data.user?.xp    ?? data.xp    ?? 0);
    setEl("kpi-level", `Level ${data.user?.level ?? data.level ?? 1}`);
}

// ─────────────────────────────────────────────────────────────
// 2. GROWTH CHART  (Chart.js line graph)
//    - X-axis labels pulled from REAL habit names (Ayesha's data)
//    - Shows tasks completed per day (last 7 days)
//    - Shows habits completed per day (last 7 days)
//    - Falls back to dummy data so chart always renders
// ─────────────────────────────────────────────────────────────
function renderGrowthChart() {
    const ctx = document.getElementById("growthChart")?.getContext("2d");
    if (!ctx) return;

    const data = getData();
    const tasks = data.tasks || [];
    const habits = data.habits || [];

    // Build last-7-day date strings + weekday labels
    const dayLabels   = [];
    const taskCounts  = [];
    const habitCounts = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);          // "YYYY-MM-DD"
        const label = d.toLocaleDateString("en-US", { weekday: "short" });

        dayLabels.push(label);

        // Tasks completed on this day
        const doneTasks = tasks.filter(t =>
            t.completed && t.completedAt && t.completedAt.slice(0, 10) === dateStr
        ).length;
        taskCounts.push(doneTasks);

        // Habits completed on this day (Ayesha stores history array per habit)
        const doneHabits = habits.filter(h =>
            Array.isArray(h.history) && h.history.includes(dateStr)
        ).length;
        habitCounts.push(doneHabits);
    }

    // If no real data yet, use dummy values so chart is visible
    const noRealData = taskCounts.every(v => v === 0) && habitCounts.every(v => v === 0);
    const finalTasks = noRealData ? [2, 5, 3, 8, 4, 3, 6] : taskCounts;
    const finalHabits = noRealData ? [1, 3, 2, 4, 3, 2, 5] : habitCounts;

    // Use REAL habit names as a subtitle/note (pulled from Ayesha's data)
    const habitNames = habits.map(h => h.name).filter(Boolean);
    const trackedLabel = habitNames.length > 0
        ? `Habits tracked: ${habitNames.join(", ")}`
        : "Habits Completed";

    // Hide placeholder
    const ph = document.getElementById("chart-placeholder");
    if (ph) ph.style.display = "none";

    // ── Custom plugin: label highest & lowest point on each dataset ──
    const peakAnnotator = {
        id: "peakAnnotator",
        afterDatasetsDraw(chart) {
            const { ctx } = chart;

            // dataset 0 = Wakas (tasks), dataset 1 = Ayesha (habits)
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
                    ctx.font         = "bold 10px Inter, sans-serif";
                    ctx.textAlign    = "center";
                    ctx.textBaseline = "middle";

                    if (val === maxVal) {
                        // Pill background above the point
                        const label = `▲ ${owner.name} (High)`;
                        const tw    = ctx.measureText(label).width + 10;
                        const ty    = point.y - 22;
                        ctx.fillStyle = owner.color + "22";
                        ctx.beginPath();
                        ctx.roundRect(point.x - tw / 2, ty - 9, tw, 18, 8);
                        ctx.fill();
                        ctx.fillStyle = owner.color;
                        ctx.fillText(label, point.x, ty);
                    }

                    if (val === minVal && minVal !== maxVal) {
                        // Pill background below the point
                        const label = `▼ ${owner.name} (Low)`;
                        const tw    = ctx.measureText(label).width + 10;
                        const ty    = point.y + 22;
                        ctx.fillStyle = owner.color + "22";
                        ctx.beginPath();
                        ctx.roundRect(point.x - tw / 2, ty - 9, tw, 18, 8);
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
        plugins: [peakAnnotator],
        data: {
            labels: dayLabels,
            datasets: [
                {
                    label: "Tasks Completed",
                    data: finalTasks,
                    borderColor: "#0d9488",
                    backgroundColor: "rgba(13, 148, 136, 0.12)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#0d9488",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: trackedLabel,
                    data: finalHabits,
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#6366f1",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            layout: { padding: { top: 30 } },   // room for top labels
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "#94a3b8",
                        font: { family: "Inter", size: 11 },
                        boxWidth: 10,
                        padding: 16,
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#f1f5f9",
                    bodyColor: "#94a3b8",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 10,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#94a3b8",
                        font: { size: 11 },
                        stepSize: 1,
                    },
                    grid: { color: "rgba(241, 245, 249, 0.06)" }
                },
                x: {
                    ticks: { color: "#94a3b8", font: { size: 11 } },
                    grid: { display: false }
                }
            }
        }
    });
}

// ─────────────────────────────────────────────────────────────
// 3. EFFICIENCY / PRODUCTIVITY SCORE
//    Formula: based on how many habits were checked today
//             combined with task completion rate
//    Updates: the SVG ring + the big % number
// ─────────────────────────────────────────────────────────────
function renderEfficiencyScore() {
    const data = getData();

    // Task completion rate (Wakas)
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const taskRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    // Habit completion rate TODAY (Ayesha)
    const totalHabits = data.habits.length;
    const habitsDoneToday = data.habits.filter(h => h.completedToday).length;
    const habitRate = totalHabits > 0
        ? Math.round((habitsDoneToday / totalHabits) * 100)
        : 0;

    // Productivity Score = average of both
    const score = Math.round((taskRate + habitRate) / 2);

    // Animate SVG ring (circumference of r=54 circle = 2π×54 ≈ 339.3)
    const circumference = 2 * Math.PI * 54;
    const arc = document.getElementById("score-arc");
    const scoreText = document.getElementById("score-value");

    if (arc) {
        const offset = circumference - (score / 100) * circumference;
        // Small delay so CSS transition fires
        setTimeout(() => { arc.style.strokeDashoffset = offset; }, 100);
    }
    if (scoreText) {
        scoreText.textContent = `${score}%`;
    }

    // Also update the text card below the ring
    setEl("task-rate-big", `${taskRate}%`);
}

// ─────────────────────────────────────────────────────────────
// TEAM LEADERBOARD
//   Wakas    → XP from completed tasks (each task has an .xp field)
//   Ayesha   → XP from habits done today (×20) + total streak days (×5)
//   Himanshu → XP from data.user.xp (he tracks the global XP pool)
// ─────────────────────────────────────────────────────────────
function renderLeaderboard() {
    const data = getData();
    const container = document.getElementById("leaderboard-list");
    if (!container) return;

    // ── Wakas (Task Manager) ──────────────────────────────────
    const completedTasks = data.tasks.filter(t => t.completed);
    const wakasTasksDone = completedTasks.length;
    const totalTasks     = data.tasks.length;
    const wakasXP        = completedTasks.reduce((sum, t) => sum + (t.xp || 10), 0);

    // ── Ayesha (Habit Tracker) ────────────────────────────────
    const habitsDoneToday = data.habits.filter(h => h.completedToday).length;
    const totalHabits     = data.habits.length;
    const totalStreak     = data.habits.reduce((sum, h) => sum + (h.streak || 0), 0);
    const ayeshaXP        = (habitsDoneToday * 20) + (totalStreak * 5);

    // ── Himanshu (Gamification) ───────────────────────────────
    const himanshuXP    = (data.user && data.user.xp)   ? data.user.xp    : (data.xp    || 0);
    const himanshuLevel = (data.user && data.user.level) ? data.user.level : (data.level || 1);

    const members = [
        {
            name:      "Wakas",
            role:      "Task Manager",
            icon:      "check-square",
            color:     "#0d9488",
            bg:        "rgba(13,148,136,0.15)",
            xpEarned:  wakasXP,
            detail:    `${wakasTasksDone} / ${totalTasks} tasks completed`,
        },
        {
            name:      "Ayesha",
            role:      "Habit Tracker",
            icon:      "calendar-check",
            color:     "#6366f1",
            bg:        "rgba(99,102,241,0.15)",
            xpEarned:  ayeshaXP,
            detail:    `${habitsDoneToday} / ${totalHabits} habits today • ${totalStreak} streak days`,
        },
        {
            name:      "Himanshu",
            role:      "Gamification",
            icon:      "award",
            color:     "#fbbf24",
            bg:        "rgba(251,191,36,0.15)",
            xpEarned:  himanshuXP,
            detail:    `Level ${himanshuLevel} • ${himanshuXP} total XP earned`,
        }
    ];

    // Sort highest XP first for ranking
    members.sort((a, b) => b.xpEarned - a.xpEarned);
    const topXP = members[0].xpEarned || 1;
    const medals = ["🥇", "🥈", "🥉"];

    container.innerHTML = members.map((m, i) => {
        const barPct = Math.min(Math.round((m.xpEarned / topXP) * 100), 100);
        return `
        <div style="display:flex;align-items:center;gap:1rem;padding:0.9rem 0;border-bottom:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:1.5rem;min-width:32px;text-align:center;">${medals[i]}</div>
            <div style="width:38px;height:38px;border-radius:50%;background:${m.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${m.icon}" style="width:16px;height:16px;color:${m.color};"></i>
            </div>
            <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem;">
                    <span style="font-weight:700;font-size:0.95rem;color:var(--text-main,#f1f5f9);">${m.name}</span>
                    <span style="font-size:0.8rem;color:${m.color};font-weight:700;white-space:nowrap;">${m.xpEarned} XP</span>
                </div>
                <div style="font-size:0.72rem;color:var(--text-muted,#94a3b8);margin:0.2rem 0 0.45rem;">${m.detail}</div>
                <div class="habit-bar-bg">
                    <div class="habit-bar-fill" style="width:${barPct}%;background:linear-gradient(90deg,${m.color},${m.color}99);"></div>
                </div>
            </div>
        </div>`;
    }).join("");

    if (window.lucide) lucide.createIcons();
}

// ─────────────────────────────────────────────────────────────
// TASKS BREAKDOWN — shows every task by name + completion status
// ─────────────────────────────────────────────────────────────
function renderTasksBreakdown() {
    const data = getData();
    const tasks = data.tasks || [];
    const container = document.getElementById("tasks-list");
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = `<div class="empty-state">No tasks yet — add tasks in the Task Manager.</div>`;
        return;
    }

    container.innerHTML = tasks.map(t => {
        const name = escHtml(t.title || t.name || t.text || "Task");
        const done = !!t.completed;
        const statusColor = done ? "#34d399" : "#f87171";
        const statusLabel = done ? "✓ Completed" : "⏳ Pending";

        // Priority badge (if the task has priority info)
        const priority = t.priority || "";
        let badgeHtml = "";
        if (priority) {
            const badgeColor = priority === "high" ? "#f43f5e"
                : priority === "medium" ? "#fbbf24"
                : "#6366f1";
            const badgeBg   = priority === "high" ? "rgba(244,63,94,0.15)"
                : priority === "medium" ? "rgba(251,191,36,0.15)"
                : "rgba(99,102,241,0.15)";
            badgeHtml = `<span style="font-size:0.68rem;padding:2px 8px;border-radius:99px;background:${badgeBg};color:${badgeColor};font-weight:600;text-transform:capitalize;">${escHtml(priority)}</span>`;
        }

        const barColor = done
            ? "linear-gradient(90deg,#34d399,#0d9488)"
            : "rgba(248,113,113,0.25)";
        const barWidth = done ? 100 : 0;

        return `
        <div class="habit-row">
            <div class="habit-row-header">
                <span style="display:flex;align-items:center;gap:0.5rem;">${name} ${badgeHtml}</span>
                <span style="color:${statusColor};font-size:0.75rem;font-weight:600;">${statusLabel}</span>
            </div>
            <div class="habit-bar-bg">
                <div class="habit-bar-fill" style="width:${barWidth}%;background:${barColor};"></div>
            </div>
        </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// BONUS: Habit streak bars (uses REAL habit names from Ayesha)
// ─────────────────────────────────────────────────────────────
function renderHabitsBreakdown() {
    const data = getData();
    const habits = data.habits || [];
    const container = document.getElementById("habits-list");
    if (!container) return;

    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No habits yet — Ayesha's Habit Tracker will populate this section.
            </div>`;
        return;
    }

    const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak || 0), 1) || 1;

    // perfect days = days where every habit was completed (approx from stats)
    const perfectDays = (data.stats && data.stats.perfectDays) ? data.stats.perfectDays : 0;
    setEl("habit-score-big", perfectDays);

    container.innerHTML = habits.map(h => {
        const streak = h.streak || 0;
        const pct = Math.min(Math.round((streak / maxStreak) * 100), 100);
        const doneColor = h.completedToday ? "#34d399" : "#f87171";
        const doneLabel = h.completedToday ? "✓ Done today" : "Not done today";

        return `
        <div class="habit-row">
            <div class="habit-row-header">
                <span>${escHtml(h.name || "Habit")}</span>
                <span style="display:flex;gap:0.75rem;align-items:center;">
                    <span style="color:${doneColor};font-size:0.75rem;">${doneLabel}</span>
                    <span>${streak} day streak</span>
                </span>
            </div>
            <div class="habit-bar-bg">
                <div class="habit-bar-fill" style="width:${pct}%;"></div>
            </div>
        </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// Update top-bar with live XP / Level (Himanshu's data)
// ─────────────────────────────────────────────────────────────
function updateTopBar() {
    const data = getData();
    setEl("user-level", `Level ${data.user?.level ?? data.level ?? 1}`);
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/** Safely set textContent of an element by id */
function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/** Escape HTML to avoid XSS when rendering habit/task names */
function escHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
