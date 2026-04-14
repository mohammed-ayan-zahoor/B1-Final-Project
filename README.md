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

## Individual Student Briefs

### 1. Wakas – Task Manager (tasks.html)
**Goal**: Build a system to manage academic to-do lists.
- **Your Data**: You own the `tasks: []` array in the main data object.
- **To Build**:
  - An input field to add new tasks.
  - A rendering loop that shows all tasks (from `getData()`).
  - A "Toggle Complete" feature: when clicked, it updates the completed boolean of that task and saves the data.
  - A "Delete" feature to remove items from the array.
- **Integration**: Every time you complete a task, you should pass a message (or a call) to Himanshu's module to increase the user's XP.

### 2. Ayesha – Habit Tracker (habits.html)
**Goal**: Help users stay consistent with daily routines.
- **Your Data**: You own the `habits: []` array.
- **To Build**:
  - A list of habits (e.g., "Coding", "Meditation").
  - A toggle button for "Completed Today". 
  - **Streak Logic**: If a user completes a habit, increment their streak counter. If they skip a day, the streak should reset.
  - A "Global Momentum" counter at the top showing the user's highest streak.
- **Integration**: Your streaks will be read by Avesh to be turned into growth charts.

### 3. Avesh – Analytics Dashboard (analytics.html)
**Goal**: Turn raw lists into visual motivation.
- **Your Data**: Read from `tasks`, `habits`, and `stats`.
- **To Build**:
  - **Stats Cards**: Calculate the % of tasks completed vs. total.
  - **Growth Charts**: Use the included Chart.js library to create a line graph. Use dummy values for now, but ensure you are pulling the labels (like habit names) from the real data.
  - **Efficiency Score**: Calculate a "Productivity Score" based on how many habits were checked today.
- **Integration**: You are the "Viewer." Your job is to display what Wakas and Ayesha are building.

### 4. Himanshu – Gamification (gamification.html)
**Goal**: Make productivity feel like a video game.
- **Your Data**: You own the `user: {}` object (XP, Level, targetXp).
- **To Build**:
  - **XP Bar**: A visual progress bar that reflects the current XP vs. Next Level XP.
  - **Level-Up System**: Implement logic where if user.xp >= user.targetXp, the user.level increments and the target XP increases for the next level.
  - **XP History**: A list showing "XP Logs" (e.g., "Task Complete: +50 XP").
  - **Daily Bonus**: A button that gives the user a one-time +100 XP reward (simulating a daily check-in).

---

## Final Goal: "Integration Day"
At the end of the sprint, we will connect all modules. 
- **Wakas** logs a task → **Himanshu's** XP increases.
- **Ayesha** checks a habit → **Avesh's** chart updates.

**Let's build something elite!**
