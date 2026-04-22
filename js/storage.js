/**
 * STORAGE.JS - The Central Data Layer
 * 
 * This file is the "Single Source of Truth" for the entire application.
 * All developers must use these functions to read and write data.
 */

const STORAGE_KEY = "studentOS_data";

/**
 * INITIAL DATA STRUCTURE
 * Standardized across all modules.
 */
const DEFAULT_DATA = {
    tasks: [
        { id: 1, text: "Complete Project Base", completed: true, xp: 50 },
        { id: 2, text: "Set up Team Workflow", completed: false, xp: 20 }
    ],
    habits: [
        { id: 1, name: "Morning Meditation", streak: 5, completedToday: false },
        { id: 2, name: "Coding Practice", streak: 12, completedToday: true }
        { id: 3, name: "Reading", streak: 3, completedToday: false }
        { id: 3, name: "Exercise", streak: 7, completedToday: false }
        { id: 3, name: "Sleep on time", streak: 10, completedToday: false }
        
],}
    ],
    user: {
        name: "Student Alpha",
        xp: 1250,
        level: 5,
        targetXp: 2000
    },
    stats: {
        totalTasksCompleted: 45,
        totalHabitDays: 120
    }
};

/**
 * Retrieves the current state from localStorage.
 * If no data exists, it seeds the storage with DEFAULT_DATA.
 * @returns {Object} The complete application state.
 */
function getData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        // First time initialization
        saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
    }
    return JSON.parse(saved);
}

/**
 * Saves the provided data object to localStorage.
 * @param {Object} data - The updated application state.
 */
function saveData(data) {
    if (!data || typeof data !== 'object') {
        console.error("Storage Error: Invalid data provided to saveData().");
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Helper: Reset storage to default
 * Useful for students during development.
 */
function resetStorage() {
    saveData(DEFAULT_DATA);
    window.location.reload();
}

// Ensure the storage is initialized immediately
getData();
