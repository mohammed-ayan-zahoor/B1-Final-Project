/**
 * 🟢 STUDENT 1: Wakas
 * Focus: Task Manager Page
 * Responsibility: Task CRUD (Create, Read, Update, Delete)
 */

document.addEventListener("DOMContentLoaded", () => {
    initTasks();
});

function initTasks() {
    console.log("Wakas's Module: Initializing...");
    renderTasks();

    // 💣 10-MINUTE CHALLENGE: 
    // Try adding a new task directly via console and see if it saves.
    // Example: 
    // const d = getData(); d.tasks.push({id: Date.now(), text: "Wakas was here", completed: false}); saveData(d);
}

/**
 * STUDENT 1 (Wakas): Implement this function
 * 1. Get data using getData()
 * 2. Loop through data.tasks
 * 3. Update the #tasks-list container
 */
function renderTasks() {
    const data = getData();
    const container = document.getElementById("tasks-list");
    
    if (!container) return;

    // Placeholder rendering logic
    if (data.tasks.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary);">No tasks yet. Add one above!</p>`;
        return;
    }

    container.innerHTML = data.tasks.map(task => `
        <div class="card" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} style="accent-color: var(--primary); width: 18px; height: 18px;">
                <span style="${task.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
                    ${task.text}
                </span>
            </div>
            <button class="btn" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 6px 12px; font-size: 0.8rem;">
                <i data-lucide="trash-2" style="width: 14px;"></i>
            </button>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

/**
 * STUDENT 1 (Wakas): Implement event listener for Add Button
 */
document.getElementById("add-task-btn")?.addEventListener("click", () => {
    const input = document.getElementById("task-input");
    const text = input.value.trim();
    
    if (text) {
        alert("Wakas! This is where you implement the logic to save tasks and call saveData().");
        // Steps: 1. getData(), 2. Push new task, 3. saveData(), 4. renderTasks(), 5. Clear input
        input.value = "";
    }
});
