/**
 *  STUDENT 3: Avesh
 * Focus: Analytics Dashboard Page
 * Responsibility: Data Visualization & Stats
 */

document.addEventListener("DOMContentLoaded", () => {
    initAnalytics();
});

function initAnalytics() {
    console.log("Avesh's Module: Initializing...");
    calculateStats();
    renderGrowthChart();
}

/**
 * Calculates and renders:
 * 1. Task Completion Rate (%)
 * 2. Productivity Score (based on habits completed today + task completion rate)
 */
function calculateStats() {
    const data = getData();

    // --- Task Efficiency ---
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const taskStatsEl = document.querySelector("#task-stats div");
    if (taskStatsEl) {
        taskStatsEl.textContent = `${completionRate}%`;
        // Color-code based on performance
        taskStatsEl.style.color = completionRate >= 75
            ? "#0d9488"      // teal = great
            : completionRate >= 40
                ? "#f59e0b"  // amber = okay
                : "#ef4444"; // red = needs work
    }

    // --- Productivity Score ---
    // Formula: (habits completed today * 30) + (task completion rate * 0.7)
    // Max possible ≈ 100+ if all habits done and all tasks complete
    const totalHabits = data.habits.length;
    const completedHabitsToday = data.habits.filter(h => h.completedToday).length;
    const habitContribution = totalHabits > 0
        ? Math.round((completedHabitsToday / totalHabits) * 70)
        : 0;
    const taskContribution = Math.round(completionRate * 0.3);
    const productivityScore = habitContribution + taskContribution;

    const habitStatsEl = document.querySelector("#habit-stats div");
    if (habitStatsEl) {
        habitStatsEl.textContent = productivityScore;
        habitStatsEl.style.color = productivityScore >= 70
            ? "#0d9488"
            : productivityScore >= 40
                ? "#f59e0b"
                : "#ef4444";
    }
}

/**
 * Renders a Chart.js line graph showing habit streak progress.
 * Labels = habit names, Data = streak counts (real data, not random).
 * Also overlays task completion as a second dataset.
 */
function renderGrowthChart() {
    const data = getData();
    const ctx = document.getElementById('growthChart')?.getContext('2d');
    if (!ctx) return;

    // Hide placeholder text
    const placeholder = document.getElementById("chart-placeholder");
    if (placeholder) placeholder.style.display = "none";

    // Dataset 1: Habit streaks (one data point per habit)
    const habitLabels = data.habits.map(h => h.name);
    const habitStreaks = data.habits.map(h => h.streak);

    // Dataset 2: Task completion rate as a flat reference line
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100) / 10  // scale to similar range as streaks
        : 0;
    const taskLine = habitLabels.map(() => completionRate);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: habitLabels,
            datasets: [
                {
                    label: 'Habit Streak (days)',
                    data: habitStreaks,
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.12)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0d9488',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2.5
                },
                {
                    label: 'Task Completion Index',
                    data: taskLine,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    fill: false,
                    tension: 0,
                    pointBackgroundColor: '#f59e0b',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2,
                    borderDash: [5, 4]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        font: { family: 'Inter', size: 12 },
                        color: '#64748b',
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return ` Streak: ${context.parsed.y} days`;
                            } else {
                                return ` Task Index: ${context.parsed.y.toFixed(1)}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 }
                    }
                }
            }
        }
    });
}