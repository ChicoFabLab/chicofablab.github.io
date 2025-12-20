/**
 * CFL Dark Mode Module
 * Handles dark/light theme switching with system preference support
 */

const KEY = 'cfl-dark-mode';

/**
 * Initialize dark mode based on saved preference or system preference
 */
export function init() {
    const html = document.documentElement;
    const saved = localStorage.getItem(KEY);
    const prefersDark = saved === 'true' ||
        (saved === null && matchMedia('(prefers-color-scheme:dark)').matches);
    html.dataset.theme = prefersDark ? 'dark' : 'light';
}

/**
 * Toggle between dark and light mode
 */
export function toggle() {
    const html = document.documentElement;
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem(KEY, isDark ? 'false' : 'true');
    return !isDark; // Returns new dark mode state
}

/**
 * Check if dark mode is currently active
 */
export function isDark() {
    return document.documentElement.dataset.theme === 'dark';
}

/**
 * Set specific theme
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme === 'dark' ? 'true' : 'false');
}

// Export default object for backwards compatibility
export default {
    init,
    toggle,
    isDark,
    setTheme
};
