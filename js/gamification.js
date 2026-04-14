/**
 * STUDENT 4: Himanshu
 * Focus: Gamification Page
 * Responsibility: XP & Leveling Logic
 */

document.addEventListener("DOMContentLoaded", () => {
    initGamification();
});

function initGamification() {
    console.log("Himanshu's Module: Initializing...");
    renderGamification();
}

/**
 * STUDENT 4 (Himanshu): Implement XP rendering
 * 1. Calculate how much XP is needed for next level
 * 2. Update the badge and history
 */
function renderGamification() {
    const data = getData();
    
    // Update Big Badge
    const badge = document.getElementById("current-level-display");
    if (badge) badge.textContent = data.user.level;
    
    // Update XP Description
    const desc = document.getElementById("xp-description");
    if (desc) {
        const remaining = data.user.targetXp - data.user.xp;
        desc.textContent = `You need ${remaining} more XP to reach Level ${data.user.level + 1}`;
    }
}

/**
 * STUDENT 4 (Himanshu): Implement "Claim Reward" logic
 * Suggestion:
 * 1. When clicked, add 100 XP to user.xp
 * 2. If user.xp >= targetXp, level up!
 * 3. saveData() and refresh UI
 */
document.getElementById("claim-reward-btn")?.addEventListener("click", () => {
    // Himanshu: Implement reward logic here
    alert("Himanshu! Implement the 100 XP reward logic here and check for Level Up conditions.");
});
