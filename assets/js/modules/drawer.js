/**
 * CFL Settings Drawer Module
 * Handles the slide-in settings drawer panel
 */

let drawer = null;
let backdrop = null;

/**
 * Initialize the settings drawer
 */
export function init() {
    drawer = document.getElementById('cfl-drawer');
    backdrop = document.getElementById('cfl-drawer-backdrop');

    if (!drawer || !backdrop) return;

    const openBtn = document.getElementById('cfl-nav-settings-btn');
    const closeBtn = document.getElementById('cfl-drawer-close');

    if (openBtn) {
        openBtn.addEventListener('click', open);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    backdrop.addEventListener('click', close);

    // Escape key closes drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            close();
        }
    });
}

/**
 * Open the settings drawer
 */
export function open() {
    if (!drawer || !backdrop) return;
    drawer.setAttribute('data-open', 'true');
    backdrop.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
}

/**
 * Close the settings drawer
 */
export function close() {
    if (!drawer || !backdrop) return;
    drawer.setAttribute('data-open', 'false');
    backdrop.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
}

/**
 * Toggle the settings drawer
 */
export function toggle() {
    if (isOpen()) {
        close();
    } else {
        open();
    }
}

/**
 * Check if the drawer is currently open
 */
export function isOpen() {
    return drawer && drawer.getAttribute('data-open') === 'true';
}

export default {
    init,
    open,
    close,
    toggle,
    isOpen
};
