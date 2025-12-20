/**
 * CFL Storage Utilities
 * Safe localStorage/sessionStorage operations with error handling
 */

export function safeGet(storage, key, fallback) {
    try {
        const value = storage.getItem(key);
        return value === null ? fallback : value;
    } catch (e) {
        console.warn('[CFL] Storage get failed', key, e?.message || e);
        return fallback;
    }
}

export function safeSet(storage, key, value) {
    try {
        storage.setItem(key, value);
    } catch (e) {
        console.warn('[CFL] Storage set failed', key, e?.message || e);
    }
}

export function safeRemove(storage, key) {
    try {
        storage.removeItem(key);
    } catch (e) {
        console.warn('[CFL] Storage remove failed', key, e?.message || e);
    }
}

export function safeParse(value, fallback) {
    if (value === null || typeof value === 'undefined') return fallback;
    try {
        return JSON.parse(value);
    } catch (e) {
        console.warn('[CFL] JSON parse failed', e?.message || e);
        return fallback;
    }
}

// Export as default object for backwards compatibility
export default {
    get: safeGet,
    set: safeSet,
    remove: safeRemove,
    parse: safeParse
};
