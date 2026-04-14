/**
 * MAIN.JS - Shared Dashboard Logic
 * This file handles global UI updates and standardizes the dashboard experience.
 */

document.addEventListener("DOMContentLoaded", () => {
    updateDashboardUI();
    
    // Highlight active nav link based on current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

/**
 * Updates the common UI elements across all pages
 * (Sidebar info, XP bars, etc.)
 */
function updateDashboardUI() {
    const data = getData();
    
    // Update User Profile in Sidebar/TopBar
    const usernameEl = document.getElementById("username");
    const userLevelEl = document.getElementById("user-level");
    
    if (usernameEl) usernameEl.textContent = data.user.name;
    if (userLevelEl) userLevelEl.textContent = `Level ${data.user.level}`;
    
    // Update Dashboard specific elements (if they exist on the page)
    const xpBar = document.getElementById("xp-bar");
    const xpRatio = document.getElementById("xp-ratio");
    const nextLevel = document.getElementById("next-level");

    if (xpBar) {
        const percentage = (data.user.xp / data.user.targetXp) * 100;
        xpBar.style.width = `${percentage}%`;
    }

    if (xpRatio) {
        xpRatio.textContent = `${data.user.xp} / ${data.user.targetXp} XP`;
    }

    if (nextLevel) {
        nextLevel.textContent = data.user.level + 1;
    }
    
    // Summary render for Dashboard
    renderDashboardSummaries(data);
}

/**
 * Renders quick-view lists on the main index.html
 */
function renderDashboardSummaries(data) {
    const taskContainer = document.getElementById("dashboard-tasks");
    const habitContainer = document.getElementById("dashboard-habits");
    
    if (taskContainer) {
        const pendingTasks = data.tasks.filter(t => !t.completed).slice(0, 3);
        if (pendingTasks.length === 0) {
            taskContainer.innerHTML = `<p style="color: var(--primary);">All caught up!</p>`;
        } else {
            taskContainer.innerHTML = pendingTasks.map(t => `
                <div style="margin-bottom: 12px; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; border: 1px solid var(--border);">
                    <i data-lucide="circle" style="width: 14px; color: var(--primary);"></i>
                    ${t.text}
                </div>
            `).join('');
            if (window.lucide) lucide.createIcons();
        }
    }
    
    if (habitContainer) {
        const topHabits = data.habits.slice(0, 3);
        habitContainer.innerHTML = topHabits.map(h => `
            <div style="margin-bottom: 12px; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; padding: 8px; border-radius: 8px; border: 1px solid var(--border);">
                <span>${h.name}</span>
                <span style="color: #f97316; font-weight: 700; font-size: 0.75rem; background: #fff7ed; padding: 2px 8px; border-radius: 12px;">${h.streak} 🔥</span>
            </div>
        `).join('');
    }
}
