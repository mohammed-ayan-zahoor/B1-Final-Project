/**
 * 🔵 STUDENT 3: Avesh
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
}

/**
 * STUDENT 3 (Avesh): Build a real chart here.
 * You can use Chart.js (already included in analytics.html)
 */
function renderPlaceholderChart() {
    const ctx = document.getElementById('growthChart')?.getContext('2d');
    if (!ctx) return;

    // Hint: Avesh, use data.stats or data.tasks to build map data for this chart
    document.getElementById("chart-placeholder").style.display = "none";
    
    // Minimal Chart.js example
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Tasks Completed',
                data: [2, 5, 3, 8, 4, 3, 6],
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
