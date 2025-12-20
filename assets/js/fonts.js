---
---
// Font Loading Module
// Lazy loads optional Google Fonts only when needed

window.CFL = window.CFL || {};

CFL.fonts = (function() {
    'use strict';

    // Map of font keys to Google Fonts family names
    // Only includes optional fonts (not Inter or JetBrains Mono which are always loaded)
    var fontMap = {
        'fraunces': 'Fraunces:wght@400;600;700',
        'caprasimo': 'Caprasimo',
        'chonburi': 'Chonburi',
        'dm-serif': 'DM+Serif+Display',
        'abril': 'Abril+Fatface',
        'bricolage': 'Bricolage+Grotesque:wght@400;600;700',
        'calistoga': 'Calistoga',
        'varela': 'Varela+Round',
        'fredoka': 'Fredoka:wght@400;600',
        'nunito': 'Nunito:wght@400;600;700'
    };

    // Track which fonts have been loaded
    var loadedFonts = new Set();

    /**
     * Load a Google Font by family name
     * @param {string} fontKey - Font key from settings (e.g., 'fraunces', 'bricolage')
     * @returns {boolean} - True if font was loaded (or already loaded), false if not found
     */
    function loadFont(fontKey) {
        // Default font doesn't need loading (uses system fonts)
        if (fontKey === 'default') {
            return true;
        }

        // Check if already loaded
        if (loadedFonts.has(fontKey)) {
            return true;
        }

        // Get Google Fonts family name
        var fontFamily = fontMap[fontKey];
        if (!fontFamily) {
            console.warn('[CFL.fonts] Unknown font key:', fontKey);
            return false;
        }

        // Check if link already exists in DOM
        var existingLink = document.querySelector('link[data-font="' + fontKey + '"]');
        if (existingLink) {
            loadedFonts.add(fontKey);
            return true;
        }

        // Create and append link element
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=' + fontFamily + '&display=swap';
        link.setAttribute('data-font', fontKey);
        link.setAttribute('data-loaded', 'true');

        // Add to head
        document.head.appendChild(link);

        // Track as loaded
        loadedFonts.add(fontKey);

        console.log('[CFL.fonts] Loaded font:', fontKey);
        return true;
    }

    /**
     * Preload fonts that user has previously selected (from localStorage)
     * This ensures fonts are ready when user returns to site
     */
    function preloadUserFont() {
        try {
            // Check localStorage for saved font preference
            var config = window.CFL_CONFIG || {};
            var storageKeys = (config.storage_keys || {});
            var scopeKey = storageKeys.settings_scope || 'cflSettingsScope';
            var savedScope = localStorage.getItem(scopeKey) || 'site';

            // Get saved settings for current scope
            var settingsKey = savedScope === 'site'
                ? (storageKeys.settings_site || 'cflSettingsSite')
                : 'cflSettingsPage:' + window.location.pathname;

            var saved = localStorage.getItem(settingsKey);
            if (saved) {
                try {
                    var settings = JSON.parse(saved);
                    if (settings.font && settings.font !== 'default') {
                        loadFont(settings.font);
                    }
                } catch (e) {
                    // Invalid JSON, ignore
                }
            }
        } catch (e) {
            console.warn('[CFL.fonts] Error preloading user font:', e);
        }
    }

    /**
     * Load fonts when settings widget is opened for the first time
     * This ensures all optional fonts are available when user browses the font selector
     */
    function loadAllOptionalFonts() {
        Object.keys(fontMap).forEach(function(fontKey) {
            loadFont(fontKey);
        });
    }

    // Public API
    return {
        loadFont: loadFont,
        preloadUserFont: preloadUserFont,
        loadAllOptionalFonts: loadAllOptionalFonts,
        isLoaded: function(fontKey) {
            return loadedFonts.has(fontKey) || fontKey === 'default';
        }
    };
})();

// Auto-preload user's saved font preference on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        CFL.fonts.preloadUserFont();
    });
} else {
    CFL.fonts.preloadUserFont();
}
