/**
 * 🟡 STUDENT 2: Ayesh
 * Focus: Habit Tracker Page
 * Responsibility: Habit CRUD + Streak Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    initHabits();
});

function initHabits() {
    console.log("Ayesh's Module: Initializing...");
    renderHabits();
}

/**
 * STUDENT 2 (Ayesh): Implement this function
 */
function renderHabits() {
    const data = getData();
    const container = document.getElementById("habits-list");
    
    if (!container) return;

    container.innerHTML = data.habits.map(habit => `
        <div class="card" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid ${habit.completedToday ? 'var(--primary)' : 'transparent'};">
            <div>
                <h4 style="margin: 0; font-size: 1rem;">${habit.name}</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0;">Current Streak: ${habit.streak} days</p>
            </div>
            <button class="btn" style="background: ${habit.completedToday ? 'var(--primary)' : 'var(--bg-main)'}; color: ${habit.completedToday ? 'white' : 'var(--text-muted)'}">
                <i data-lucide="${habit.completedToday ? 'check' : 'circle'}" style="width: 18px;"></i>
            </button>
        </div>
    `).join('');

    // Update global streak counter
    const globalStreakEl = document.getElementById("global-streak");
    if (globalStreakEl) {
        const maxStreak = Math.max(...data.habits.map(h => h.streak), 0);
        globalStreakEl.textContent = maxStreak;
    }

    if (window.lucide) lucide.createIcons();
}

/**
 * STUDENT 2 (Ayesh): Implement "Toggle Habit" logic
 * Clicking the button should:
 * 1. Toggle habit.completedToday
 * 2. If completing, increment streak
 * 3. saveData() and re-render
 */
function toggleHabit(id) {
    // Ayesh: Logic goes here
}
