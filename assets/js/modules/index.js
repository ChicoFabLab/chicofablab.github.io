/**
 * CFL JavaScript Modules Index
 *
 * This file serves as the entry point for ES modules.
 * Import and re-export all modules for convenient access.
 *
 * Usage:
 *   import { darkMode, storage, keyboard } from './modules/index.js';
 *   darkMode.init();
 *
 * Or import individual modules:
 *   import darkMode from './modules/dark-mode.js';
 */

export { default as storage } from './storage.js';
export { default as darkMode } from './dark-mode.js';
export { default as keyboard } from './keyboard.js';
export { default as drawer } from './drawer.js';

// Re-export individual functions for tree-shaking
export { safeGet, safeSet, safeRemove, safeParse } from './storage.js';
export { init as initDarkMode, toggle as toggleDarkMode, isDark } from './dark-mode.js';
export { init as initKeyboard, showHelpModal, hideHelpModal } from './keyboard.js';
export { init as initDrawer, open as openDrawer, close as closeDrawer } from './drawer.js';
