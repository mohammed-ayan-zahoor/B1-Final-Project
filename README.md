# StudentOS – Team Orchestration Guide

Welcome to the **StudentOS – Growth Dashboard** project. This is a production-ready starter designed for a collaborative team environment.

---

## Team Distribution

| Developer | Page | Module Focus | Responsibility |
| :--- | :--- | :--- | :--- |
| **1. Wakas** | `tasks.html` | Task Manager | Task CRUD, Completion logic, status updates. |
| **2. Ayesha** | `habits.html` | Habit Tracker | Daily habit grids, Streak logic, tracking. |
| **3. Avesh** | `analytics.html` | Analytics | Data visualization for both tasks & habits. |
| **4. Himanshu** | `gamification.html` | Gamification | XP progression, Leveling systems, Rewards. |

---

## The Architecture

### 1. Page-Based Ownership
Each developer is responsible for their own `.html` and associated `.js` file.
- **Wakas**: `tasks.html` & `js/tasks.js`
- **Ayesha**: `habits.html` & `js/habits.js`
- **Avesh**: `analytics.html` & `js/analytics.js`
- **Himanshu**: `gamification.html` & `js/gamification.js`

### 2. Central Data Layer (`storage.js`)
The "Brain" of the app. All data MUST be handled through these shared functions:
- `getData()`: Retrieves the entire `studentOS` state.
- `saveData(data)`: Saves the updated state back to `localStorage`.

### 3. Design System (`styles.css`)
A unified Apple-level UI system. Use the provided CSS variables and the `.glass-card` class to ensure visual consistency across all pages.

---

## Shared Data Structure
All modules must read and write to this single object structure in `localStorage`:

```json
{
  "tasks": [],
  "habits": [],
  "xp": 0,
  "level": 1,
  "stats": {}
}
```

---

## Team Rules (The "Golden Rules")

1. **No Cross-Editing**: Never edit another developer's `.js` file.
2. **Single Source of Truth**: Only use `storage.js` for data persistence.
3. **UI Consistency**: Use the shared `.glass-card` and CSS variables. No custom random colors.
4. **Integration First**: Always check how your changes might affect the `Analytics` or `Gamification` modules.

---

## 10-Minute Challenge (Do this FIRST)
Before building your UI, ensure you can communicate with the storage:
1. Open your page in the browser.
2. In the console, try: 
   ```js
   const data = getData();
   data.test = "Connection successful";
   saveData(data);
   console.log(getData());
   ```
3. If you see the output, you are ready to build!

---

## Final Goal: "Integration Day"
At the end of the sprint, we will connect all modules. 
- **Wakas** logs a task → **Himanshu's** XP increases.
- **Ayesha** checks a habit → **Avesh's** chart updates.

**Let's build something elite!**
