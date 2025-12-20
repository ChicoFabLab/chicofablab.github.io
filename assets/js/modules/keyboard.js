/**
 * CFL Keyboard Shortcuts Module
 * Handles keyboard shortcuts for quick navigation and actions
 */

/**
 * Check if the event target is an input element
 * @param {Event} e - Keyboard event
 * @returns {boolean}
 */
function isTyping(e) {
    const tag = e.target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
}

/**
 * Initialize keyboard shortcuts
 * @param {Object} handlers - Object mapping shortcuts to handler functions
 */
export function init(handlers = {}) {
    const defaultHandlers = {
        // "/" focuses search
        '/': (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('wiki-search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        },
        // "d" toggles dark mode
        'd': () => {
            if (window.toggleDarkMode) {
                window.toggleDarkMode();
            }
        },
        // "," opens settings
        ',': (e) => {
            e.preventDefault();
            const drawer = document.getElementById('cfl-drawer');
            const backdrop = document.getElementById('cfl-drawer-backdrop');
            if (drawer && backdrop) {
                const isOpen = drawer.getAttribute('data-open') === 'true';
                drawer.setAttribute('data-open', (!isOpen).toString());
                backdrop.setAttribute('data-open', (!isOpen).toString());
                document.body.style.overflow = isOpen ? '' : 'hidden';
            }
        },
        // "?" shows keyboard shortcuts help
        '?': (e) => {
            e.preventDefault();
            if (window.CFL && window.CFL.showKeyboardHelp) {
                window.CFL.showKeyboardHelp();
            }
        }
    };

    const mergedHandlers = { ...defaultHandlers, ...handlers };

    document.addEventListener('keydown', (e) => {
        // Ignore if user is typing
        if (isTyping(e)) return;

        // Ignore if modifier keys are pressed (except for ?)
        if ((e.ctrlKey || e.metaKey) && e.key !== '?') return;
        if (e.shiftKey && e.key !== '?') return;

        const handler = mergedHandlers[e.key];
        if (handler) {
            handler(e);
        }
    });
}

/**
 * Create and show keyboard shortcuts help modal
 */
export function createHelpModal() {
    const existing = document.getElementById('keyboard-help-modal');
    if (existing) return existing;

    const modal = document.createElement('div');
    modal.className = 'keyboard-help-modal';
    modal.id = 'keyboard-help-modal';
    modal.innerHTML = `
        <div class="keyboard-help-modal__backdrop"></div>
        <div class="keyboard-help-modal__content">
            <div class="keyboard-help-modal__header">
                <h2>Keyboard Shortcuts</h2>
                <button class="keyboard-help-modal__close" aria-label="Close">&times;</button>
            </div>
            <div class="keyboard-help-modal__body">
                <div class="keyboard-help-modal__section">
                    <h3>Navigation</h3>
                    <div class="keyboard-help-modal__row"><kbd>/</kbd><span>Focus search</span></div>
                    <div class="keyboard-help-modal__row"><kbd>Esc</kbd><span>Clear search / close panels</span></div>
                </div>
                <div class="keyboard-help-modal__section">
                    <h3>Appearance</h3>
                    <div class="keyboard-help-modal__row"><kbd>d</kbd><span>Toggle dark mode</span></div>
                    <div class="keyboard-help-modal__row"><kbd>,</kbd><span>Open settings</span></div>
                </div>
                <div class="keyboard-help-modal__section">
                    <h3>Help</h3>
                    <div class="keyboard-help-modal__row"><kbd>?</kbd><span>Show this help</span></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.keyboard-help-modal__backdrop').addEventListener('click', () => hideHelpModal(modal));
    modal.querySelector('.keyboard-help-modal__close').addEventListener('click', () => hideHelpModal(modal));

    return modal;
}

export function showHelpModal() {
    const modal = createHelpModal();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

export function hideHelpModal(modal) {
    if (!modal) modal = document.getElementById('keyboard-help-modal');
    if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
}

export default {
    init,
    createHelpModal,
    showHelpModal,
    hideHelpModal
};
