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
    renderPlaceholderChart();
}

/**
 * STUDENT 3 (Avesh): Implement stat calculations
 * 1. Get tasks and habits from getData()
 * 2. Calculate completion percentages
 * 3. Update the UI
 */
function calculateStats() {
    const data = getData();
    
    // Example Task Calc
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const rate = totalTasks > 0 ? Math.round((completedTasks/totalTasks) * 100) : 0;
    
    const taskStatsEl = document.querySelector("#task-stats div");
    if (taskStatsEl) taskStatsEl.textContent = `${rate}%`;

    // Efficiency / Productivity Score Calc
    const completedHabits = data.habits.filter(h => h.completedToday).length;
    const habitStatsEl = document.querySelector("#habit-stats div");
    if (habitStatsEl) {
        // Calculate a Productivity Score based on habits checked today (e.g., 50 points per completed habit today)
        const productivityScore = completedHabits * 50;
        habitStatsEl.textContent = productivityScore;
    }
}

/**
 * STUDENT 3 (Avesh): Build a real chart here.
 * You can use Chart.js (already included in analytics.html)
 */
function renderPlaceholderChart() {
    const data = getData();
    const ctx = document.getElementById('growthChart')?.getContext('2d');
    if (!ctx) return;

    // Hint: Avesh, use data.stats or data.tasks to build map data for this chart
    document.getElementById("chart-placeholder").style.display = "none";
    
    // Use habit names as labels for the chart
    const labels = data.habits.map(h => h.name);
    // Generate some dummy values based on the number of labels
    const dummyData = labels.map(() => Math.floor(Math.random() * 10) + 1);
    
    // Minimal Chart.js example
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Growth Trend',
                data: dummyData,
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' } 
                },
                x: { grid: { display: false } }
            }
        }
    });
}
