/**
 *  STUDENT 1: Wakas
 * Focus: Task Manager Page
 * Responsibility: Task CRUD (Create, Read, Update, Delete)
 */

document.addEventListener("DOMContentLoaded", () => {
    initTasks();
});

function initTasks() {
    console.log("Wakas's Module: Initializing...");
    renderTasks();

    //  FEATURE: Search Listener
    document.getElementById("task-search")?.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        renderTasks(query);
    });
}

/**
 * STUDENT 1 (Wakas): Implement this function
 * 1. Get data using getData()
 * 2. Loop through data.tasks
 * 3. Update the #tasks-list container
 */
function renderTasks(searchQuery = "") {
    const data = getData();
    const container = document.getElementById("tasks-list");

    if (!container) return;

    // Filter tasks based on search query
    let tasksToShow = data.tasks;
    if (searchQuery) {
        tasksToShow = tasksToShow.filter(t => t.text.toLowerCase().includes(searchQuery));
    }

    // FEATURE 4: Sorting (Uncompleted first, then completed)
    tasksToShow.sort((a, b) => a.completed - b.completed);

    // FEATURE 7: Improved Empty State with Image
    if (tasksToShow.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem 1rem; background: var(--bg-card); border-radius: 12px; border: 2px dashed var(--border);">
                <img src="assets/Tasks empty_state.png" alt="No tasks" style="width: 100%; max-width: 350px; height: auto; margin-bottom: 1.5rem; opacity: 0.8;">
                <h4 style="color: var(--text-main); margin-bottom: 0.5rem;">No tasks found</h4>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${searchQuery ? "Try a different search term" : "Add some tasks to get started!"}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = tasksToShow.map(task => `
        <div class="card" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <input type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} style="accent-color: var(--primary); width: 18px; height: 18px; cursor: pointer;">
                <span style="${task.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''} font-size: 0.95rem;">
                    ${task.text}
                </span>
            </div>
            <div style="display: flex; gap: 8px;">
                <!-- FEATURE 3: Edit Button -->
                <button class="btn edit-btn" data-id="${task.id}" style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); padding: 6px 12px; font-size: 0.8rem; border: none; border-radius: 6px; cursor: pointer;">
                    <i data-lucide="edit-3" style="width: 14px;"></i>
                </button>
                <button class="btn delete-btn" data-id="${task.id}" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 6px 12px; font-size: 0.8rem; border: none; border-radius: 6px; cursor: pointer;">
                    <i data-lucide="trash-2" style="width: 14px;"></i>
                </button>
            </div>
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
        const data = getData();
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            xp: 10
        };
        data.tasks.push(newTask);
        saveData(data);
        renderTasks();
        input.value = "";
    }
});

/**
 * STUDENT 1 (Wakas): Toggle Task Completion
 */
document.getElementById("tasks-list")?.addEventListener("change", (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        const taskId = parseInt(e.target.getAttribute("data-id"));
        const data = getData();

        const task = data.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = e.target.checked;
            saveData(data);
            renderTasks();
        }
    }
});

/**
 * STUDENT 1 (Wakas): Delete Task
 */
document.getElementById("tasks-list")?.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {
        const taskId = parseInt(deleteBtn.getAttribute("data-id"));
        const data = getData();
        data.tasks = data.tasks.filter(t => t.id !== taskId);
        saveData(data);
        renderTasks();
    }

    if (editBtn) {
        const taskId = parseInt(editBtn.getAttribute("data-id"));
        const data = getData();
        const task = data.tasks.find(t => t.id === taskId);
        
        if (task) {
            openInputModal({
                title: "Edit Task",
                defaultValue: task.text,
                onSave: (newText) => {
                    task.text = newText;
                    saveData(data);
                    renderTasks();
                }
            });
        }
    }
});
