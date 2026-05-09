document.addEventListener("DOMContentLoaded", () => {
    initHabits();
});

function initHabits() {
    renderHabits();
}

function renderHabits() {
    const data = getData();
    const container = document.getElementById("habits-list");

    if (!container) return;

    container.innerHTML = data.habits.map(habit => `
        <div class="card" style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; border-left:4px solid ${habit.completedToday ? 'var(--primary)' : 'transparent'};">

            <div>
                <h4 style="margin:0;">${habit.name}</h4>
                <p style="margin:0; font-size:0.8rem; color:gray;">
                    Current Streak: ${habit.streak} days
                </p>
            </div>

            <button class="btn"
                onclick="toggleHabit(${habit.id})"
                style="background:${habit.completedToday ? 'var(--primary)' : '#eee'}; color:${habit.completedToday ? '#fff' : '#000'};">

                ${habit.completedToday ? '✓ Done' : 'Mark Done'}

            </button>

        </div>
    `).join("");

    const globalStreakEl = document.getElementById("global-streak");

    if (globalStreakEl) {
        const maxStreak = Math.max(...data.habits.map(h => h.streak), 0);
        globalStreakEl.textContent = maxStreak;
    }

    lucide.createIcons();
}

function toggleHabit(id) {
    const data = getData();

    const habit = data.habits.find(h => h.id === id);
    if (!habit) return;

    if (!habit.completedToday) {
        habit.completedToday = true;
        habit.streak++;
    } else {
        habit.completedToday = false;
    }

    saveData(data);
    renderHabits();
}

