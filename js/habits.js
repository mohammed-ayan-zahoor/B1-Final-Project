/**
 *  STUDENT 2: Ayesha
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
 * STUDENT 2 (Ayesha): Implement this function
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
                
                <button class="btn" onclick="toggleHabit(${habit.id})"
    style="background: ${habit.completedToday ? 'var(--primary)' : 'var(--bg-main)'}; 
    color: ${habit.completedToday ? 'white' : 'var(--text-muted)'}">
    
    <i data-lucide="${habit.completedToday ? 'check' : 'circle'}" style="width: 18px;"></i>

</button>
            
            
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
 * STUDENT 2 (Ayesha): Implement "Toggle Habit" logic
 * Clicking the button should:
 * 1. Toggle habit.completedToday
 * 2. If completing, increment streak
 * 3. saveData() and re-render
 */

    function toggleHabit(id) {
    const data = getData();

    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toDateString();

    if (!habit.completedToday) {
        habit.completedToday = true;

        if (habit.lastCompletedDate) {
            const lastDate = new Date(habit.lastCompletedDate);
            const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                habit.streak++;
            } else {
                habit.streak = 1;
            }
        } else {
            habit.streak = 1;
        }

        habit.lastCompletedDate = today;

    } else {
        habit.completedToday = false;
    }

    saveData(data);
    renderHabits();
}
   

