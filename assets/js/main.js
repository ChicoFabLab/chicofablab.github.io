---
---
    // Central settings configuration - loaded from _data/settings.yml
    // This is the single source of truth for all site settings
    try {
        window.CFL_CONFIG = {{ site.data.settings | jsonify }};
    } catch (e) {
        console.warn('[CFL] Settings config not loaded, using fallbacks');
        window.CFL_CONFIG = {};
    }

    document.addEventListener('DOMContentLoaded', function() {
        function safeGet(storage, key, fallback) {
            try {
                var value = storage.getItem(key);
                return value === null ? fallback : value;
            } catch (e) {
                console.warn('[CFL] Storage get failed', key, e && e.message ? e.message : e);
                return fallback;
            }
        }

        function safeSet(storage, key, value) {
            try {
                storage.setItem(key, value);
            } catch (e) {
                console.warn('[CFL] Storage set failed', key, e && e.message ? e.message : e);
            }
        }

        function safeRemove(storage, key) {
            try {
                storage.removeItem(key);
            } catch (e) {
                console.warn('[CFL] Storage remove failed', key, e && e.message ? e.message : e);
            }
        }

        function safeParse(value, fallback) {
            if (value === null || typeof value === 'undefined') return fallback;
            try {
                return JSON.parse(value);
            } catch (e) {
                console.warn('[CFL] JSON parse failed', e && e.message ? e.message : e);
                return fallback;
            }
        }

        // =====================
        // SIMPLE DARK MODE (15 lines)
        // =====================
        (function() {
            var KEY = 'cfl-dark-mode';
            var html = document.documentElement;

            // Apply saved preference or system preference
            var saved = localStorage.getItem(KEY);
            var prefersDark = saved === 'true' ||
                (saved === null && matchMedia('(prefers-color-scheme:dark)').matches);
            html.dataset.theme = prefersDark ? 'dark' : 'light';

            // Simple toggle function exposed globally
            window.toggleDarkMode = function() {
                var isDark = html.dataset.theme === 'dark';
                html.dataset.theme = isDark ? 'light' : 'dark';
                localStorage.setItem(KEY, isDark ? 'false' : 'true');
            };

            // Check if currently dark
            window.isDarkMode = function() {
                return html.dataset.theme === 'dark';
            };
        })();

        // =====================
        // MOBILE NAVIGATION MENU
        // =====================
        (function initMobileNav() {
            var toggle = document.getElementById('mobile-menu-toggle');
            var nav = document.getElementById('main-nav');

            if (!toggle || !nav) return;

            toggle.addEventListener('click', function() {
                var isOpen = nav.classList.contains('is-open');

                if (isOpen) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                } else {
                    nav.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            });

            // Close menu when clicking a nav link
            nav.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (nav.classList.contains('is-open') &&
                    !nav.contains(e.target) &&
                    !toggle.contains(e.target)) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        })();

        // =====================
        // SETTINGS DRAWER
        // =====================
        (function initDrawer() {
            var drawer = document.getElementById('cfl-drawer');
            var backdrop = document.getElementById('cfl-drawer-backdrop');
            var openBtn = document.getElementById('cfl-nav-settings-btn');
            var closeBtn = document.getElementById('cfl-drawer-close');
            var darkModeToggle = document.getElementById('cfl-dark-mode-toggle');
            var fontSelect = document.getElementById('cfl-drawer-font-select');
            var resetBtn = document.getElementById('cfl-reset-settings');

            if (!drawer || !backdrop) return;

            function openDrawer() {
                drawer.setAttribute('data-open', 'true');
                backdrop.setAttribute('data-open', 'true');
                document.body.style.overflow = 'hidden';
            }

            function closeDrawer() {
                drawer.setAttribute('data-open', 'false');
                backdrop.setAttribute('data-open', 'false');
                document.body.style.overflow = '';
            }

            // Open drawer
            if (openBtn) {
                openBtn.addEventListener('click', openDrawer);
            }

            // Close drawer
            if (closeBtn) {
                closeBtn.addEventListener('click', closeDrawer);
            }
            if (backdrop) {
                backdrop.addEventListener('click', closeDrawer);
            }

            // Escape key closes drawer
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') {
                    closeDrawer();
                }
            });

            // Dark mode toggle - simple button click
            if (darkModeToggle) {
                darkModeToggle.addEventListener('click', function() {
                    toggleDarkMode();
                });
            }

            // Font select - sync with existing settings if available
            if (fontSelect) {
                var config = window.CFL_CONFIG || {};
                var fontKey = (config.storage_keys && config.storage_keys.font) || 'cfl-font';
                var defaultFont = (config.defaults && config.defaults.font) || 'default';
                var savedFont = safeGet(localStorage, fontKey, defaultFont);
                fontSelect.value = savedFont;

                // Prevent backdrop from closing drawer when clicking select
                fontSelect.addEventListener('mousedown', function(e) {
                    e.stopPropagation();
                });

                fontSelect.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                fontSelect.addEventListener('change', function() {
                    var font = fontSelect.value;
                    // Use the CFL API to apply font (handles loading, CSS vars, and persistence)
                    if (window.CFL && window.CFL.setFont) {
                        window.CFL.setFont(font);
                    } else {
                        // Fallback if CFL API not ready: save to localStorage and dispatch event
                        var config = window.CFL_CONFIG || {};
                        var fontKey = (config.storage_keys && config.storage_keys.font) || 'cfl-font';
                        safeSet(localStorage, fontKey, font);
                        document.dispatchEvent(new CustomEvent('cfl-font-change', { detail: { font: font } }));
                    }
                });
            }

            // Reset settings
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    if (confirm('Reset all settings to defaults?')) {
                        var config = window.CFL_CONFIG || {};
                        var keys = config.storage_keys || {};
                        safeRemove(localStorage, keys.dark_mode || 'cfl-dark-mode');
                        safeRemove(localStorage, keys.font || 'cfl-font');
                        safeRemove(localStorage, keys.theme || 'cfl-theme');
                        // Reset dark mode to light
                        document.documentElement.dataset.theme = 'light';
                        localStorage.setItem('cfl-dark-mode', 'false');
                        var config = window.CFL_CONFIG || {};
                        var defaultFont = (config.defaults && config.defaults.font) || 'default';
                        if (fontSelect) fontSelect.value = defaultFont;
                        if (window.CFLSettings && window.CFLSettings.reset) {
                            window.CFLSettings.reset();
                        }
                        closeDrawer();
                    }
                });
            }
        })();

        // =====================
        // TOC DEFAULT (MOBILE)
        // =====================
        (function initTocCollapse() {
            var tocDetails = document.querySelectorAll('.cfl-toc__details');
            if (!tocDetails.length) return;
            if (window.matchMedia('(max-width: 900px)').matches) {
                for (var i = 0; i < tocDetails.length; i++) {
                    tocDetails[i].removeAttribute('open');
                }
            }
        })();

        // =====================
        // DAILY TIP DISMISS
        // =====================
        (function initDailyTip() {
            var tip = document.getElementById('daily-tip');
            var dismissBtn = document.getElementById('daily-tip-dismiss');
            if (!tip || !dismissBtn) return;

            // Check if already dismissed today
            var dismissedDate = safeGet(localStorage, 'cfl-tip-dismissed', '');
            var today = new Date().toDateString();
            if (dismissedDate === today) {
                tip.hidden = true;
                return;
            }

            dismissBtn.addEventListener('click', function() {
                tip.hidden = true;
                safeSet(localStorage, 'cfl-tip-dismissed', today);
            });
        })();

        // =====================
        // KEYBOARD SHORTCUTS
        // =====================
        (function initKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Ignore if user is typing in an input/textarea
                var tag = e.target.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
                    return;
                }

                // "/" focuses search
                if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    var searchInput = document.getElementById('wiki-search-input');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                }

                // "d" toggles dark mode
                if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    toggleDarkMode();
                }

                // "," opens settings
                if (e.key === ',' && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    var drawer = document.getElementById('cfl-drawer');
                    var backdrop = document.getElementById('cfl-drawer-backdrop');
                    if (drawer && backdrop) {
                        var isOpen = drawer.getAttribute('data-open') === 'true';
                        drawer.setAttribute('data-open', (!isOpen).toString());
                        backdrop.setAttribute('data-open', (!isOpen).toString());
                        document.body.style.overflow = isOpen ? '' : 'hidden';
                    }
                }

                // "?" shows keyboard shortcuts help
                if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    CFL.showKeyboardHelp();
                }
            });
        })();

        // Keyboard shortcuts help modal
        (function initKeyboardHelp() {
            window.CFL = window.CFL || {};

            var helpModal = null;

            function createHelpModal() {
                var modal = document.createElement('div');
                modal.className = 'keyboard-help-modal';
                modal.id = 'keyboard-help-modal';
                modal.innerHTML = [
                    '<div class="keyboard-help-modal__backdrop"></div>',
                    '<div class="keyboard-help-modal__content">',
                    '  <div class="keyboard-help-modal__header">',
                    '    <h2>Keyboard Shortcuts</h2>',
                    '    <button class="keyboard-help-modal__close" aria-label="Close">&times;</button>',
                    '  </div>',
                    '  <div class="keyboard-help-modal__body">',
                    '    <div class="keyboard-help-modal__section">',
                    '      <h3>Navigation</h3>',
                    '      <div class="keyboard-help-modal__row"><kbd>/</kbd><span>Focus search</span></div>',
                    '      <div class="keyboard-help-modal__row"><kbd>Esc</kbd><span>Clear search / close panels</span></div>',
                    '    </div>',
                    '    <div class="keyboard-help-modal__section">',
                    '      <h3>Appearance</h3>',
                    '      <div class="keyboard-help-modal__row"><kbd>d</kbd><span>Toggle dark mode</span></div>',
                    '      <div class="keyboard-help-modal__row"><kbd>,</kbd><span>Open settings</span></div>',
                    '    </div>',
                    '    <div class="keyboard-help-modal__section">',
                    '      <h3>Help</h3>',
                    '      <div class="keyboard-help-modal__row"><kbd>?</kbd><span>Show this help</span></div>',
                    '    </div>',
                    '  </div>',
                    '</div>'
                ].join('');
                document.body.appendChild(modal);
                return modal;
            }

            function showHelp() {
                if (!helpModal) {
                    helpModal = createHelpModal();
                    helpModal.querySelector('.keyboard-help-modal__backdrop').addEventListener('click', hideHelp);
                    helpModal.querySelector('.keyboard-help-modal__close').addEventListener('click', hideHelp);
                }
                helpModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                CFL.sounds.pop();
            }

            function hideHelp() {
                if (helpModal) {
                    helpModal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            }

            // Close on Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && helpModal && helpModal.classList.contains('is-open')) {
                    hideHelp();
                }
            });

            CFL.showKeyboardHelp = showHelp;
            CFL.hideKeyboardHelp = hideHelp;
        })();

        // Check for eldritch corruption (the void remembers...)
        (function checkVoidCorruption() {
            var corruption = parseInt(safeGet(localStorage, 'voidCorruption', '0'), 10) || 0;
            if (corruption > 0) {
                document.body.classList.add('eldritch-mode');
                // Whisper to the console...
                if (corruption >= 50) {
                    console.log('%c👁️ The void sees you...', 'color: #8b00ff; font-size: 20px; text-shadow: 0 0 10px #8b00ff;');
                }
                if (corruption >= 100) {
                    console.log('%c🌀 FULLY CONSUMED', 'color: #ff00ff; font-size: 24px; font-weight: bold;');
                }
            }
        })();

        // =====================================================================
        // WEB AUDIO SOUND EFFECTS SYSTEM
        // =====================================================================
        //
        // PURPOSE: Provides synthesized sound effects for UI interactions
        //
        // USAGE:
        //   CFL.sounds.click()      - Quick blip for button clicks
        //   CFL.sounds.success()    - Ascending tones for positive feedback
        //   CFL.sounds.magic()      - Arpeggio for special buttons
        //   CFL.sounds.setEnabled(false)  - Disable all sounds
        //
        // HOW IT WORKS:
        //   Uses Web Audio API to generate tones in real-time via oscillators.
        //   No audio files needed - all sounds are mathematically synthesized.
        //
        // STORAGE:
        //   localStorage.cflSoundsEnabled - 'true'/'false'
        //   localStorage.cflSoundsVolume  - float 0.0-1.0
        //
        // SEE: docs/SOUND-SYSTEM.md for full documentation
        // =====================================================================
        window.CFL = window.CFL || {};

        CFL.sounds = (function() {
            var audioContext = null;
            var enabled = safeGet(localStorage, 'cflSoundsEnabled', 'true') !== 'false';
            var volume = parseFloat(safeGet(localStorage, 'cflSoundsVolume', '0.3')) || 0.3;

            function getContext() {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                return audioContext;
            }

            function playTone(frequency, type, duration, volumeMod) {
                if (!enabled) return;
                try {
                    var ctx = getContext();
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();

                    osc.type = type || 'sine';
                    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    var vol = volume * (volumeMod || 1);
                    gain.gain.setValueAtTime(vol, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + duration);
                } catch(e) { console.log('Sound error:', e); }
            }

            function playNoise(duration, volumeMod) {
                if (!enabled) return;
                try {
                    var ctx = getContext();
                    var bufferSize = ctx.sampleRate * duration;
                    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    var data = buffer.getChannelData(0);
                    for (var i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    var noise = ctx.createBufferSource();
                    noise.buffer = buffer;
                    var gain = ctx.createGain();
                    var filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = 1000;
                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);
                    var vol = volume * (volumeMod || 0.3);
                    gain.gain.setValueAtTime(vol, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
                    noise.start();
                } catch(e) {}
            }

            return {
                // Basic sounds
                click: function() { playTone(800, 'sine', 0.05, 0.5); },
                pop: function() { playTone(600, 'sine', 0.08, 0.6); playTone(900, 'sine', 0.04, 0.3); },
                success: function() {
                    playTone(523, 'sine', 0.1, 0.4);
                    setTimeout(function() { playTone(659, 'sine', 0.1, 0.4); }, 100);
                    setTimeout(function() { playTone(784, 'sine', 0.15, 0.5); }, 200);
                },
                error: function() {
                    playTone(200, 'sawtooth', 0.15, 0.3);
                    setTimeout(function() { playTone(150, 'sawtooth', 0.2, 0.3); }, 100);
                },
                hover: function() { playTone(1200, 'sine', 0.03, 0.2); },
                whoosh: function() {
                    playTone(400, 'sine', 0.15, 0.3);
                    playNoise(0.1, 0.2);
                },
                ding: function() { playTone(1047, 'sine', 0.3, 0.4); },

                // Fun sounds
                boing: function() {
                    var ctx = getContext();
                    if (!enabled || !ctx) return;
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
                    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.3);
                },
                zap: function() {
                    playTone(2000, 'sawtooth', 0.05, 0.3);
                    playTone(100, 'sawtooth', 0.1, 0.2);
                },
                magic: function() {
                    [523, 659, 784, 1047, 1319].forEach(function(f, i) {
                        setTimeout(function() { playTone(f, 'sine', 0.15, 0.3); }, i * 50);
                    });
                },
                coin: function() {
                    playTone(988, 'square', 0.05, 0.3);
                    setTimeout(function() { playTone(1319, 'square', 0.15, 0.3); }, 50);
                },
                powerup: function() {
                    [262, 330, 392, 523, 659, 784].forEach(function(f, i) {
                        setTimeout(function() { playTone(f, 'square', 0.08, 0.25); }, i * 60);
                    });
                },
                glitch: function() {
                    for (var i = 0; i < 5; i++) {
                        setTimeout(function() {
                            playTone(Math.random() * 2000 + 100, 'sawtooth', 0.03, 0.2);
                        }, i * 30);
                    }
                },
                laser: function() {
                    var ctx = getContext();
                    if (!enabled || !ctx) return;
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(1500, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    gain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.2);
                },
                explosion: function() {
                    playNoise(0.3, 0.5);
                    playTone(80, 'sine', 0.3, 0.4);
                },
                eldritch: function() {
                    playTone(50, 'sine', 0.5, 0.4);
                    playTone(53, 'sine', 0.5, 0.3);
                    setTimeout(function() { playTone(47, 'sawtooth', 0.3, 0.2); }, 200);
                },

                // Settings
                setEnabled: function(val) { enabled = val; safeSet(localStorage, 'cflSoundsEnabled', val); },
                setVolume: function(val) { volume = val; safeSet(localStorage, 'cflSoundsVolume', val); },
                isEnabled: function() { return enabled; },
                getVolume: function() { return volume; }
            };
        })();

        // =====================================================================
        // PRIVACY DISCLAIMER SYSTEM
        // =====================================================================
        //
        // PURPOSE: Shows a privacy disclaimer on first visit and provides
        //          data management controls (export/clear)
        //
        // STORAGE:
        //   localStorage.cflPrivacyAccepted - 'true' if dismissed
        //
        // SEE: _includes/privacy-disclaimer.html for HTML structure
        // =====================================================================
        CFL.privacy = (function() {
            var STORAGE_KEY = 'cflPrivacyAccepted';

            function isAccepted() {
                return safeGet(localStorage, STORAGE_KEY, 'false') === 'true';
            }

            function accept() {
                safeSet(localStorage, STORAGE_KEY, 'true');
            }

            function showDisclaimer() {
                var disclaimer = document.getElementById('cfl-privacy-disclaimer');
                if (disclaimer) {
                    disclaimer.removeAttribute('hidden');
                }
            }

            function hideDisclaimer() {
                var disclaimer = document.getElementById('cfl-privacy-disclaimer');
                if (disclaimer) {
                    disclaimer.setAttribute('hidden', '');
                }
            }

            function showDataModal() {
                var modal = document.getElementById('cfl-data-modal');
                if (modal) {
                    modal.removeAttribute('hidden');
                    updateDataStats();
                }
            }

            function hideDataModal() {
                var modal = document.getElementById('cfl-data-modal');
                if (modal) {
                    modal.setAttribute('hidden', '');
                }
            }

            function showConfirmModal() {
                var modal = document.getElementById('cfl-confirm-modal');
                if (modal) {
                    modal.removeAttribute('hidden');
                }
            }

            function hideConfirmModal() {
                var modal = document.getElementById('cfl-confirm-modal');
                if (modal) {
                    modal.setAttribute('hidden', '');
                }
            }

            function updateDataStats() {
                var statsContainer = document.querySelector('#cfl-data-stats .cfl-data-modal__stats');
                if (!statsContainer) return;

                var achievements = safeParse(safeGet(localStorage, 'cflAchievements', '{}'), {});
                var stats = safeParse(safeGet(localStorage, 'cflStats', '{}'), {});
                var unlockedCount = Object.keys(achievements).length;
                var clickCount = stats.clicks || 0;
                var pageCount = (stats.pages || []).length;
                var xp = CFL.achievements ? CFL.achievements.getTotalXP() : 0;

                statsContainer.innerHTML = [
                    '<div class="cfl-data-modal__stat">',
                    '  <div class="cfl-data-modal__stat-value">' + unlockedCount + '</div>',
                    '  <div class="cfl-data-modal__stat-label">Achievements</div>',
                    '</div>',
                    '<div class="cfl-data-modal__stat">',
                    '  <div class="cfl-data-modal__stat-value">' + xp + '</div>',
                    '  <div class="cfl-data-modal__stat-label">Total XP</div>',
                    '</div>',
                    '<div class="cfl-data-modal__stat">',
                    '  <div class="cfl-data-modal__stat-value">' + clickCount + '</div>',
                    '  <div class="cfl-data-modal__stat-label">Clicks</div>',
                    '</div>',
                    '<div class="cfl-data-modal__stat">',
                    '  <div class="cfl-data-modal__stat-value">' + pageCount + '</div>',
                    '  <div class="cfl-data-modal__stat-label">Pages Visited</div>',
                    '</div>'
                ].join('');
            }

            function exportData() {
                var data = {
                    exportDate: new Date().toISOString(),
                    achievements: safeParse(safeGet(localStorage, 'cflAchievements', '{}'), {}),
                    stats: safeParse(safeGet(localStorage, 'cflStats', '{}'), {}),
                    preferences: {
                        font: safeGet(localStorage, 'cflSettingsSite', null),
                        sounds: safeGet(localStorage, 'cflSoundsEnabled', 'true'),
                        soundVolume: safeGet(localStorage, 'cflSoundsVolume', '0.3')
                    },
                    easterEggs: safeParse(safeGet(localStorage, 'cflFoundEggs', '[]'), []),
                    voidCorruption: safeGet(localStorage, 'voidCorruption', '0')
                };

                var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'cfl-wiki-data-' + new Date().toISOString().split('T')[0] + '.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                if (CFL.sounds) CFL.sounds.success();
                if (CFL.toast) {
                    CFL.toast({
                        icon: '📥',
                        title: 'Data Exported!',
                        message: 'Your progress has been saved to a file.',
                        variant: 'success',
                        iconAnim: 'bounce'
                    });
                }
            }

            function clearAllData() {
                // List of all CFL localStorage keys to clear
                var keysToRemove = [
                    'cflAchievements',
                    'cflStats',
                    'cflPrivacyAccepted',
                    'cflSettingsSite',
                    'cflSettingsScope',
                    'cflSettingsDebug',
                    'cflSettingsHidden',
                    'cflSoundsEnabled',
                    'cflSoundsVolume',
                    'cflFoundEggs',
                    'voidCorruption'
                ];

                keysToRemove.forEach(function(key) {
                    safeRemove(localStorage, key);
                });

                // Also clear any page-specific settings
                Object.keys(localStorage).forEach(function(key) {
                    if (key.startsWith('cflSettingsPage:')) {
                        safeRemove(localStorage, key);
                    }
                });

                if (CFL.sounds) CFL.sounds.whoosh();
                if (CFL.toast) {
                    CFL.toast({
                        icon: '🗑️',
                        title: 'Data Cleared',
                        message: 'All progress has been reset. Refreshing...',
                        variant: 'info',
                        iconAnim: 'shake'
                    });
                }

                // Reload page after a brief delay
                setTimeout(function() {
                    window.location.reload();
                }, 1500);
            }

            function init() {
                // Show disclaimer if not yet accepted
                if (!isAccepted()) {
                    // Small delay to let page render first
                    setTimeout(showDisclaimer, 1000);
                }

                // Accept button
                var acceptBtn = document.getElementById('cfl-privacy-accept');
                if (acceptBtn) {
                    acceptBtn.addEventListener('click', function() {
                        accept();
                        hideDisclaimer();
                        if (CFL.sounds) CFL.sounds.success();
                    });
                }

                // Close button (also accepts)
                var closeBtn = document.getElementById('cfl-privacy-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        accept();
                        hideDisclaimer();
                    });
                }

                // Manage data button
                var manageBtn = document.getElementById('cfl-privacy-manage');
                if (manageBtn) {
                    manageBtn.addEventListener('click', function() {
                        accept();
                        hideDisclaimer();
                        showDataModal();
                    });
                }

                // Data modal close handlers
                var dataModal = document.getElementById('cfl-data-modal');
                if (dataModal) {
                    dataModal.querySelectorAll('[data-close]').forEach(function(el) {
                        el.addEventListener('click', hideDataModal);
                    });
                }

                // Export button
                var exportBtn = document.getElementById('cfl-data-export');
                if (exportBtn) {
                    exportBtn.addEventListener('click', exportData);
                }

                // Clear button (shows confirmation)
                var clearBtn = document.getElementById('cfl-data-clear');
                if (clearBtn) {
                    clearBtn.addEventListener('click', showConfirmModal);
                }

                // Confirm modal handlers
                var confirmModal = document.getElementById('cfl-confirm-modal');
                if (confirmModal) {
                    // Close on backdrop click
                    confirmModal.addEventListener('click', function(e) {
                        if (e.target === confirmModal || e.target.hasAttribute('data-close') || e.target.closest('[data-close]')) {
                            hideConfirmModal();
                        }
                    });
                }

                // Confirm clear button
                var confirmClearBtn = document.getElementById('cfl-confirm-clear');
                if (confirmClearBtn) {
                    confirmClearBtn.addEventListener('click', function() {
                        hideConfirmModal();
                        hideDataModal();
                        clearAllData();
                    });
                }

                // Close modals on Escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        var confirmModal = document.getElementById('cfl-confirm-modal');
                        var dataModal = document.getElementById('cfl-data-modal');
                        if (confirmModal && !confirmModal.hasAttribute('hidden')) {
                            hideConfirmModal();
                        } else if (dataModal && !dataModal.hasAttribute('hidden')) {
                            hideDataModal();
                        }
                    }
                });
            }

            // Initialize on DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }

            return {
                isAccepted: isAccepted,
                accept: accept,
                showDataModal: showDataModal,
                hideDataModal: hideDataModal,
                showConfirmModal: showConfirmModal,
                hideConfirmModal: hideConfirmModal,
                exportData: exportData,
                clearAllData: clearAllData
            };
        })();

        // =====================================================================
        // ACHIEVEMENT SYSTEM
        // =====================================================================
        //
        // PURPOSE: Gamification layer that tracks user interactions and
        //          unlocks badges for various accomplishments.
        //
        // USAGE:
        //   CFL.achievements.unlock('achievement-id')  - Manually unlock
        //   CFL.achievements.trackClick('buttonType')  - Auto-called on clicks
        //   CFL.achievements.getStats()               - { clicks, pages, buttonTypes }
        //   CFL.achievements.isUnlocked('id')         - Check if unlocked
        //   CFL.achievements.getTotalXP()             - Get total XP earned
        //   CFL.achievements.getLevel()               - Get current level info
        //
        // ACHIEVEMENTS (~30 total):
        //   Progression: first-click, button-10, button-50, button-100, explorer
        //   3D Printing: 3d-curious, filament-fan, slicer-starter, print-pro, layer-legend
        //   Laser:       beam-beginner, material-master, focus-finder, cut-champion, precision-pro
        //   CNC:         mill-curious, feeds-speeds, toolpath-trainee, cnc-commander
        //   Special:     rainbow, void-gazer, corrupted, cleansed, all-buttons, sound-on
        //   Time-based:  night-owl, early-bird
        //   Secrets:     easter-egg, speed-demon, konami
        //
        // RARITY TIERS (with XP values):
        //   Common (5 XP)     - Basic interactions
        //   Uncommon (15 XP)  - Page visits, basic progress
        //   Rare (30 XP)      - Completing sections
        //   Epic (50 XP)      - Learning path completion
        //   Legendary (100 XP) - Master achievements
        //
        // STORAGE:
        //   localStorage.cflAchievements - { id: { time: timestamp }, ... }
        //   localStorage.cflStats        - { clicks, pages[], buttonTypes[] }
        //
        // SEE: docs/ACHIEVEMENTS.md for full documentation
        // =====================================================================
        CFL.achievements = (function() {
            // XP values by rarity
            var XP_VALUES = {
                common: 5,
                uncommon: 15,
                rare: 30,
                epic: 50,
                legendary: 100
            };

            // Level thresholds
            var LEVELS = [
                { level: 1, xp: 0, name: 'Curious Visitor', icon: '👀' },
                { level: 2, xp: 50, name: 'Apprentice Maker', icon: '🔧' },
                { level: 3, xp: 150, name: 'Fab Lab Regular', icon: '⚡' },
                { level: 4, xp: 300, name: 'Workshop Warrior', icon: '🛠️' },
                { level: 5, xp: 500, name: 'Master Maker', icon: '🎯' },
                { level: 6, xp: 750, name: 'Fab Lab Legend', icon: '👑' }
            ];

            var achievements = {
                // ============ PROGRESSION (Site Interaction) ============
                'first-click': {
                    name: 'First Click',
                    desc: 'Click your first button',
                    icon: '🖱️',
                    sound: 'coin',
                    category: 'progression',
                    rarity: 'common',
                    progress: { current: 0, target: 1 }
                },
                'button-10': {
                    name: 'Button Masher',
                    desc: 'Click 10 buttons',
                    icon: '🔘',
                    sound: 'success',
                    category: 'progression',
                    rarity: 'common',
                    progress: { current: 0, target: 10 }
                },
                'button-50': {
                    name: 'Click Champion',
                    desc: 'Click 50 buttons',
                    icon: '🏆',
                    sound: 'powerup',
                    category: 'progression',
                    rarity: 'uncommon',
                    progress: { current: 0, target: 50 }
                },
                'button-100': {
                    name: 'Button Legend',
                    desc: 'Click 100 buttons',
                    icon: '👑',
                    sound: 'magic',
                    category: 'progression',
                    rarity: 'rare',
                    progress: { current: 0, target: 100 }
                },
                'explorer': {
                    name: 'Explorer',
                    desc: 'Visit 5 different pages',
                    icon: '🧭',
                    sound: 'whoosh',
                    category: 'progression',
                    rarity: 'common',
                    progress: { current: 0, target: 5 }
                },
                'explorer-10': {
                    name: 'Pathfinder',
                    desc: 'Visit 10 different pages',
                    icon: '🗺️',
                    sound: 'success',
                    category: 'progression',
                    rarity: 'uncommon',
                    progress: { current: 0, target: 10 }
                },

                // ============ 3D PRINTING PATH ============
                '3d-curious': {
                    name: '3D Curious',
                    desc: 'Visit the 3D Printing wiki page',
                    icon: '🖨️',
                    sound: 'pop',
                    category: '3d-printing',
                    rarity: 'common'
                },
                'filament-fan': {
                    name: 'Filament Fan',
                    desc: 'Learn about 3 different filament types',
                    icon: '🧵',
                    sound: 'success',
                    category: '3d-printing',
                    rarity: 'uncommon',
                    progress: { current: 0, target: 3 }
                },
                'slicer-starter': {
                    name: 'Slicer Starter',
                    desc: 'Read about slicing software',
                    icon: '🔪',
                    sound: 'pop',
                    category: '3d-printing',
                    rarity: 'uncommon'
                },
                'print-pro': {
                    name: 'Print Pro',
                    desc: 'Complete all 3D printing wiki pages',
                    icon: '🎓',
                    sound: 'powerup',
                    category: '3d-printing',
                    rarity: 'epic',
                    progress: { current: 0, target: 5 }
                },
                'layer-legend': {
                    name: 'Layer Legend',
                    desc: 'Master 3D printing (all achievements)',
                    icon: '🏅',
                    sound: 'magic',
                    category: '3d-printing',
                    rarity: 'legendary'
                },

                // ============ LASER CUTTING PATH ============
                'beam-beginner': {
                    name: 'Beam Beginner',
                    desc: 'Visit the Laser Cutting wiki page',
                    icon: '✂️',
                    sound: 'pop',
                    category: 'laser',
                    rarity: 'common'
                },
                'material-master': {
                    name: 'Material Master',
                    desc: 'Learn about different laser materials',
                    icon: '🪵',
                    sound: 'success',
                    category: 'laser',
                    rarity: 'uncommon',
                    progress: { current: 0, target: 3 }
                },
                'focus-finder': {
                    name: 'Focus Finder',
                    desc: 'Read about focus calibration',
                    icon: '🎯',
                    sound: 'pop',
                    category: 'laser',
                    rarity: 'uncommon'
                },
                'cut-champion': {
                    name: 'Cut Champion',
                    desc: 'Complete all laser cutting wiki pages',
                    icon: '🏆',
                    sound: 'powerup',
                    category: 'laser',
                    rarity: 'epic',
                    progress: { current: 0, target: 5 }
                },
                'precision-pro': {
                    name: 'Precision Pro',
                    desc: 'Master laser cutting (all achievements)',
                    icon: '💎',
                    sound: 'magic',
                    category: 'laser',
                    rarity: 'legendary'
                },

                // ============ CNC PATH ============
                'mill-curious': {
                    name: 'Mill Curious',
                    desc: 'Visit the CNC wiki page',
                    icon: '🔧',
                    sound: 'pop',
                    category: 'cnc',
                    rarity: 'common'
                },
                'feeds-speeds': {
                    name: 'Feeds & Speeds',
                    desc: 'Read about feeds and speeds',
                    icon: '⚙️',
                    sound: 'success',
                    category: 'cnc',
                    rarity: 'uncommon'
                },
                'toolpath-trainee': {
                    name: 'Toolpath Trainee',
                    desc: 'Learn about toolpaths',
                    icon: '📐',
                    sound: 'pop',
                    category: 'cnc',
                    rarity: 'uncommon'
                },
                'cnc-commander': {
                    name: 'CNC Commander',
                    desc: 'Complete all CNC wiki pages',
                    icon: '🎖️',
                    sound: 'powerup',
                    category: 'cnc',
                    rarity: 'epic',
                    progress: { current: 0, target: 4 }
                },

                // ============ SPECIAL ============
                'rainbow': {
                    name: 'Taste the Rainbow',
                    desc: 'Click a rainbow button',
                    icon: '🌈',
                    sound: 'magic',
                    category: 'special',
                    rarity: 'rare'
                },
                'void-gazer': {
                    name: 'Void Gazer',
                    desc: 'Visit The Void',
                    icon: '👁️',
                    sound: 'eldritch',
                    category: 'special',
                    rarity: 'rare'
                },
                'corrupted': {
                    name: 'Corrupted Soul',
                    desc: 'Reach 100% void corruption',
                    icon: '🌀',
                    sound: 'eldritch',
                    category: 'special',
                    rarity: 'epic'
                },
                'cleansed': {
                    name: 'Purified',
                    desc: 'Cleanse the void corruption',
                    icon: '✨',
                    sound: 'magic',
                    category: 'special',
                    rarity: 'rare'
                },
                'all-buttons': {
                    name: 'Completionist',
                    desc: 'Click every fun button type',
                    icon: '⭐',
                    sound: 'powerup',
                    category: 'special',
                    rarity: 'epic',
                    progress: { current: 0, target: 15 }
                },
                'sound-on': {
                    name: 'Audiophile',
                    desc: 'Enable sound effects',
                    icon: '🔊',
                    sound: 'powerup',
                    category: 'special',
                    rarity: 'common'
                },

                // ============ TIME-BASED ============
                'night-owl': {
                    name: 'Night Owl',
                    desc: 'Browse after midnight',
                    icon: '🦉',
                    sound: 'pop',
                    category: 'time',
                    rarity: 'uncommon'
                },
                'early-bird': {
                    name: 'Early Bird',
                    desc: 'Browse before 6am',
                    icon: '🐦',
                    sound: 'ding',
                    category: 'time',
                    rarity: 'uncommon'
                },

                // ============ SECRETS ============
                'easter-egg': {
                    name: 'Egg Hunter',
                    desc: 'Find a hidden easter egg',
                    icon: '🥚',
                    sound: 'coin',
                    category: 'secret',
                    rarity: 'rare'
                },
                'speed-demon': {
                    name: 'Speed Demon',
                    desc: 'Click 5 buttons in 2 seconds',
                    icon: '⚡',
                    sound: 'zap',
                    category: 'secret',
                    rarity: 'rare'
                },
                'konami': {
                    name: 'Old School',
                    desc: 'Enter the Konami code',
                    icon: '🎮',
                    sound: 'powerup',
                    category: 'secret',
                    rarity: 'legendary'
                },
                'all-eggs': {
                    name: 'Master Hunter',
                    desc: 'Find all 5 hidden easter eggs',
                    icon: '🏆',
                    sound: 'magic',
                    category: 'secret',
                    rarity: 'legendary',
                    progress: { current: 0, target: 5 }
                },
                'pong-master': {
                    name: 'Pong Champion',
                    desc: 'Win a game of Pong',
                    icon: '🏓',
                    sound: 'success',
                    category: 'secret',
                    rarity: 'rare'
                },
                'sbip-master': {
                    name: 'Space Defender',
                    desc: 'Beat all waves in Super Block Invaders Pong',
                    icon: '🚀',
                    sound: 'success',
                    category: 'secret',
                    rarity: 'legendary'
                }
            };

            var unlocked = safeParse(safeGet(localStorage, 'cflAchievements', '{}'), {});
            var stats = safeParse(safeGet(localStorage, 'cflStats', '{"clicks":0,"pages":[],"buttonTypes":[]}'), { clicks: 0, pages: [], buttonTypes: [] });
            var recentClicks = [];

            function save() {
                safeSet(localStorage, 'cflAchievements', JSON.stringify(unlocked));
                safeSet(localStorage, 'cflStats', JSON.stringify(stats));
            }

            // Track current level before unlock (for level-up detection)
            var lastKnownLevel = null;

            function getCurrentLevel() {
                var xp = getTotalXP();
                for (var i = LEVELS.length - 1; i >= 0; i--) {
                    if (xp >= LEVELS[i].xp) {
                        return LEVELS[i];
                    }
                }
                return LEVELS[0];
            }

            // Initialize last known level
            lastKnownLevel = getCurrentLevel().level;

            function unlock(id) {
                if (unlocked[id]) return false;
                if (!achievements[id]) return false;

                // Store level before unlock
                var levelBefore = getCurrentLevel().level;

                unlocked[id] = { time: Date.now() };
                save();

                var ach = achievements[id];
                var rarity = ach.rarity || 'common';
                var xpGained = XP_VALUES[rarity] || 0;

                // Play sound based on rarity
                if (CFL.sounds) {
                    if (rarity === 'legendary') {
                        CFL.sounds.magic();
                    } else if (rarity === 'epic') {
                        CFL.sounds.powerup();
                    } else if (ach.sound) {
                        CFL.sounds[ach.sound]();
                    } else {
                        CFL.sounds.coin();
                    }
                }

                // Show achievement toast with XP
                if (CFL.toast) {
                    var rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
                    CFL.toast({
                        icon: ach.icon,
                        title: '🏅 Achievement Unlocked!',
                        message: ach.name + ' (+' + xpGained + ' XP)',
                        variant: rarity === 'legendary' ? 'party' : (rarity === 'epic' ? 'success' : 'info'),
                        iconAnim: 'bounce',
                        duration: 5000
                    });
                }

                console.log('%c🏅 Achievement: ' + ach.name + ' (+' + xpGained + ' XP)',
                    'color: gold; font-size: 16px; font-weight: bold;');

                // Check for level up
                var levelAfter = getCurrentLevel();
                if (levelAfter.level > levelBefore) {
                    lastKnownLevel = levelAfter.level;
                    triggerLevelUp(levelAfter);
                }

                return true;
            }

            // Level up celebration
            function triggerLevelUp(levelInfo) {
                // Play level up sound
                if (CFL.sounds) {
                    CFL.sounds.powerup();
                    setTimeout(function() { CFL.sounds.magic(); }, 300);
                }

                // Show level up toast after a delay
                setTimeout(function() {
                    if (CFL.toast) {
                        CFL.toast({
                            icon: levelInfo.icon,
                            title: '⬆️ LEVEL UP!',
                            message: 'You are now Level ' + levelInfo.level + ': ' + levelInfo.name + '!',
                            variant: 'party',
                            iconAnim: 'bounce',
                            duration: 7000
                        });
                    }
                }, 1500);

                // Add temporary level-up class to body for CSS effects
                document.body.classList.add('cfl-level-up');
                setTimeout(function() {
                    document.body.classList.remove('cfl-level-up');
                }, 3000);

                // Log to console
                console.log('%c⬆️ LEVEL UP! Level ' + levelInfo.level + ': ' + levelInfo.name,
                    'color: #f59e0b; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #f59e0b;');
            }

            function trackClick(buttonType) {
                stats.clicks++;
                recentClicks.push(Date.now());
                recentClicks = recentClicks.filter(function(t) { return Date.now() - t < 2000; });

                // Update progress for progression achievements
                if (achievements['first-click']) achievements['first-click'].progress.current = Math.min(stats.clicks, 1);
                if (achievements['button-10']) achievements['button-10'].progress.current = Math.min(stats.clicks, 10);
                if (achievements['button-50']) achievements['button-50'].progress.current = Math.min(stats.clicks, 50);
                if (achievements['button-100']) achievements['button-100'].progress.current = Math.min(stats.clicks, 100);
                if (achievements['explorer']) achievements['explorer'].progress.current = Math.min(stats.pages.length, 5);
                if (achievements['all-buttons']) achievements['all-buttons'].progress.current = Math.min(stats.buttonTypes.length, 15);

                if (stats.clicks === 1) unlock('first-click');
                if (stats.clicks >= 10) unlock('button-10');
                if (stats.clicks >= 50) unlock('button-50');
                if (stats.clicks >= 100) unlock('button-100');
                if (recentClicks.length >= 5) unlock('speed-demon');

                if (buttonType && stats.buttonTypes.indexOf(buttonType) === -1) {
                    stats.buttonTypes.push(buttonType);
                    if (buttonType === 'rainbow') unlock('rainbow');
                    // Check for completionist (15+ unique button types)
                    if (stats.buttonTypes.length >= 15) unlock('all-buttons');
                }

                save();
            }

            function trackPage(path) {
                if (stats.pages.indexOf(path) === -1) {
                    stats.pages.push(path);
                    if (stats.pages.length >= 5) unlock('explorer');
                    if (stats.pages.length >= 10) unlock('explorer-10');
                }

                // Fab Lab learning path achievements based on page visits
                var pathLower = path.toLowerCase();

                // 3D Printing path
                if (pathLower.includes('3d-print') || pathLower.includes('3d_print') || pathLower.includes('printing')) {
                    unlock('3d-curious');
                }
                if (pathLower.includes('filament')) {
                    // Track filament types learned
                    if (!stats.filamentTypes) stats.filamentTypes = [];
                    var filamentMatch = pathLower.match(/pla|abs|petg|tpu|nylon/);
                    if (filamentMatch && stats.filamentTypes.indexOf(filamentMatch[0]) === -1) {
                        stats.filamentTypes.push(filamentMatch[0]);
                        if (achievements['filament-fan']) {
                            achievements['filament-fan'].progress.current = stats.filamentTypes.length;
                        }
                        if (stats.filamentTypes.length >= 3) unlock('filament-fan');
                    }
                }
                if (pathLower.includes('slic') || pathLower.includes('cura') || pathLower.includes('prusaslicer')) {
                    unlock('slicer-starter');
                }

                // Laser Cutting path
                if (pathLower.includes('laser')) {
                    unlock('beam-beginner');
                }
                if (pathLower.includes('material') && pathLower.includes('laser')) {
                    unlock('material-master');
                }
                if (pathLower.includes('focus') || pathLower.includes('calibrat')) {
                    unlock('focus-finder');
                }

                // CNC path
                if (pathLower.includes('cnc') || pathLower.includes('mill')) {
                    unlock('mill-curious');
                }
                if (pathLower.includes('feed') || pathLower.includes('speed')) {
                    unlock('feeds-speeds');
                }
                if (pathLower.includes('toolpath')) {
                    unlock('toolpath-trainee');
                }

                // Special pages
                if (pathLower.includes('/void')) unlock('void-gazer');

                save();
            }

            // Calculate total XP earned
            function getTotalXP() {
                var total = 0;
                Object.keys(unlocked).forEach(function(id) {
                    var ach = achievements[id];
                    if (ach && ach.rarity) {
                        total += XP_VALUES[ach.rarity] || 0;
                    }
                });
                return total;
            }

            // Get current level info
            function getLevel() {
                var xp = getTotalXP();
                var currentLevel = LEVELS[0];
                var nextLevel = LEVELS[1];

                for (var i = LEVELS.length - 1; i >= 0; i--) {
                    if (xp >= LEVELS[i].xp) {
                        currentLevel = LEVELS[i];
                        nextLevel = LEVELS[i + 1] || null;
                        break;
                    }
                }

                var progress = 0;
                if (nextLevel) {
                    var xpInLevel = xp - currentLevel.xp;
                    var xpNeeded = nextLevel.xp - currentLevel.xp;
                    progress = Math.min((xpInLevel / xpNeeded) * 100, 100);
                } else {
                    progress = 100; // Max level
                }

                return {
                    level: currentLevel.level,
                    name: currentLevel.name,
                    icon: currentLevel.icon,
                    xp: xp,
                    xpForCurrentLevel: currentLevel.xp,
                    xpForNextLevel: nextLevel ? nextLevel.xp : currentLevel.xp,
                    progress: progress,
                    isMaxLevel: !nextLevel
                };
            }

            // Get XP value for an achievement
            function getXP(id) {
                var ach = achievements[id];
                if (ach && ach.rarity) {
                    return XP_VALUES[ach.rarity] || 0;
                }
                return 0;
            }

            // Get achievements by learning path
            function getByPath(path) {
                return Object.keys(achievements).filter(function(id) {
                    return achievements[id].category === path;
                });
            }

            // Get path progress (completed/total)
            function getPathProgress(path) {
                var pathAchievements = getByPath(path);
                var completed = pathAchievements.filter(function(id) {
                    return !!unlocked[id];
                }).length;
                return {
                    completed: completed,
                    total: pathAchievements.length,
                    percent: pathAchievements.length > 0 ? (completed / pathAchievements.length) * 100 : 0
                };
            }

            // Time-based achievements
            var hour = new Date().getHours();
            if (hour >= 0 && hour < 6) unlock('early-bird');
            if (hour >= 0 && hour < 5) unlock('night-owl');

            // Track current page
            trackPage(window.location.pathname);

            // Update explorer progress
            if (achievements['explorer']) {
                achievements['explorer'].progress.current = Math.min(stats.pages.length, 5);
            }
            if (achievements['explorer-10']) {
                achievements['explorer-10'].progress.current = Math.min(stats.pages.length, 10);
            }

            return {
                unlock: unlock,
                trackClick: trackClick,
                trackPage: trackPage,
                isUnlocked: function(id) { return !!unlocked[id]; },
                getUnlocked: function() { return Object.keys(unlocked); },
                getUnlockedData: function() { return unlocked; },
                getStats: function() { return stats; },
                getAll: function() { return achievements; },
                getByCategory: function(category) {
                    return Object.keys(achievements).filter(function(id) {
                        return achievements[id].category === category;
                    });
                },
                getTotalXP: getTotalXP,
                getLevel: getLevel,
                getXP: getXP,
                getByPath: getByPath,
                getPathProgress: getPathProgress,
                getLevels: function() { return LEVELS; },
                getXPValues: function() { return XP_VALUES; },
                reset: function() {
                    unlocked = {};
                    stats = { clicks: 0, pages: [], buttonTypes: [], filamentTypes: [] };
                    // Reset progress
                    Object.keys(achievements).forEach(function(id) {
                        if (achievements[id].progress) {
                            achievements[id].progress.current = 0;
                        }
                    });
                    save();
                }
            };
        })();

        // =====================================================================
        // KONAMI CODE EASTER EGG
        // =====================================================================
        //
        // PURPOSE: Classic gaming easter egg that triggers rainbow mode
        //
        // THE CODE: ↑ ↑ ↓ ↓ ← → ← → B A
        //
        // WHAT HAPPENS:
        //   1. body.konami-mode class added (10 seconds)
        //   2. CFL.sounds.powerup() plays
        //   3. Toast notification appears
        //   4. Unlocks 'konami' and 'easter-egg' achievements
        //
        // SEE: docs/EASTER-EGGS.md for full documentation
        // =====================================================================
        (function konamiCode() {
            var pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            var current = 0;

            document.addEventListener('keydown', function(e) {
                if (e.key === pattern[current]) {
                    current++;
                    if (current === pattern.length) {
                        current = 0;
                        CFL.achievements.unlock('konami');
                        CFL.achievements.unlock('easter-egg');

                        // Rainbow mode!
                        document.body.classList.add('konami-mode');
                        CFL.sounds.powerup();

                        if (CFL.toast) {
                            CFL.toast({
                                icon: '🎮',
                                title: '↑↑↓↓←→←→BA',
                                message: 'KONAMI CODE ACTIVATED! Rainbow mode enabled!',
                                variant: 'party',
                                iconAnim: 'bounce',
                                duration: 5000
                            });
                        }

                        setTimeout(function() {
                            document.body.classList.remove('konami-mode');
                        }, 10000);
                    }
                } else {
                    current = 0;
                }
            });
        })();

        // =====================================================================
        // AUTO-ATTACH SOUNDS TO BUTTONS
        // =====================================================================
        //
        // PURPOSE: Automatically plays contextual sounds when buttons are clicked
        //
        // HOW IT WORKS:
        //   - Listens for clicks on any .cfl-btn element
        //   - Checks button's CSS classes to determine which sound to play
        //   - Also tracks button type for achievement system
        //
        // SOUND MAPPING:
        //   --rainbow, --holo, --aurora    → magic()
        //   --bouncy, --rubber             → boing()
        //   --neon, --electric             → zap()
        //   --glitch, --vhs, --static      → glitch()
        //   --3d, --pixel                  → coin()
        //   --eldritch                     → eldritch()
        //   --fire, --lava                 → explosion()
        //   (default)                      → click()
        //
        // SEE: docs/SOUND-SYSTEM.md for full sound list
        // =====================================================================
        (function attachButtonSounds() {
            document.addEventListener('click', function(e) {
                var btn = e.target.closest('.cfl-btn');
                if (!btn) return;

                // Track achievement
                var btnClass = btn.className;
                var buttonType = null;
                var match = btnClass.match(/cfl-btn--(\w+)/);
                if (match) buttonType = match[1];
                CFL.achievements.trackClick(buttonType);

                // Play appropriate sound
                if (btnClass.includes('--rainbow')) { CFL.sounds.magic(); }
                else if (btnClass.includes('--bouncy') || btnClass.includes('--rubber')) { CFL.sounds.boing(); }
                else if (btnClass.includes('--neon') || btnClass.includes('--electric')) { CFL.sounds.zap(); }
                else if (btnClass.includes('--glitch') || btnClass.includes('--vhs') || btnClass.includes('--static')) { CFL.sounds.glitch(); }
                else if (btnClass.includes('--3d') || btnClass.includes('--pixel')) { CFL.sounds.coin(); }
                else if (btnClass.includes('--eldritch')) { CFL.sounds.eldritch(); }
                else if (btnClass.includes('--confetti') || btnClass.includes('--party')) { CFL.sounds.powerup(); }
                else if (btnClass.includes('--holo') || btnClass.includes('--aurora')) { CFL.sounds.magic(); }
                else if (btnClass.includes('--portal') || btnClass.includes('--spin')) { CFL.sounds.whoosh(); }
                else if (btnClass.includes('--fire') || btnClass.includes('--lava')) { CFL.sounds.explosion(); }
                else if (btnClass.includes('--danger')) { CFL.sounds.error(); }
                else if (btnClass.includes('--success')) { CFL.sounds.success(); }
                else { CFL.sounds.click(); }
            });

            // Hover sounds (subtle)
            document.addEventListener('mouseover', function(e) {
                var btn = e.target.closest('.cfl-btn');
                if (btn && CFL.sounds.isEnabled()) {
                    // Only play hover sound occasionally to avoid annoyance
                    if (Math.random() > 0.7) CFL.sounds.hover();
                }
            });
        })();

        // =====================================================================
        // UNIFIED FLOATING ACTION BAR
        // =====================================================================
        //
        // PURPOSE: Single expandable FAB that consolidates all floating buttons
        //
        // ELEMENTS:
        //   - Main FAB (+) - Expands/collapses the bar
        //   - Settings (⚙️) - Opens font/color settings widget
        //   - Achievements (🏆) - Opens achievements panel
        //   - Sound (🔊/🔇) - Toggles sound effects
        //
        // LAYOUT: Horizontal bar at bottom-right, expands leftward
        //
        // SEE: docs/FAB-BAR.md for full documentation
        // =====================================================================
        (function createUnifiedFabBar() {
            // =================================================================
            // CREATE DOM STRUCTURE
            // =================================================================

            // Main container: flex row-reverse layout, fixed bottom-right
            var fabBar = document.createElement('div');
            fabBar.className = 'cfl-fab-bar';
            fabBar.id = 'cfl-fab-bar';

            // Main toggle button: + icon that rotates 45° when open
            // This is the primary entry point - always visible
            var mainBtn = document.createElement('button');
            mainBtn.className = 'cfl-fab-bar__main';
            mainBtn.innerHTML = '<span class="cfl-fab-bar__main-icon">+</span>';
            mainBtn.title = 'Quick actions';
            mainBtn.setAttribute('aria-label', 'Toggle quick actions menu');

            // Container for action buttons: hidden by default, slides in when open
            // Uses row-reverse so items appear left-to-right: [Settings] [Achievements] [Sound] [+]
            var itemsContainer = document.createElement('div');
            itemsContainer.className = 'cfl-fab-bar__items';

            // Settings button
            var settingsItem = document.createElement('button');
            settingsItem.className = 'cfl-fab-bar__item cfl-fab-bar__item--settings';
            settingsItem.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span class="cfl-fab-bar__label">Settings</span>';
            settingsItem.title = 'Site settings';

            // Achievements button (🏆)
            var achItem = document.createElement('button');
            achItem.className = 'cfl-fab-bar__item cfl-fab-bar__item--achievements';
            achItem.innerHTML = '🏆<span class="cfl-fab-bar__label">Achievements</span>';
            achItem.title = 'Achievements';

            // Sound toggle button (🔊)
            var soundItem = document.createElement('button');
            soundItem.className = 'cfl-fab-bar__item cfl-fab-bar__item--sound';
            soundItem.innerHTML = (CFL.sounds.isEnabled() ? '🔊' : '🔇') + '<span class="cfl-fab-bar__label">Sound</span>';
            soundItem.setAttribute('data-enabled', CFL.sounds.isEnabled());
            soundItem.title = 'Toggle sounds';

            // Append items to container (reverse order for row-reverse layout)
            itemsContainer.appendChild(settingsItem);
            itemsContainer.appendChild(achItem);
            itemsContainer.appendChild(soundItem);

            // Append to FAB bar
            fabBar.appendChild(mainBtn);
            fabBar.appendChild(itemsContainer);
            document.body.appendChild(fabBar);

            // =================================================================
            // EVENT HANDLERS
            // =================================================================

            // Main toggle: Opens/closes the FAB bar
            // CSS handles the animation (items slide in, icon rotates)
            mainBtn.addEventListener('click', function() {
                fabBar.classList.toggle('cfl-fab-bar--open');
                CFL.sounds.click();  // Audio feedback
            });

            // Click outside to close: Standard UX pattern
            // Prevents accidental clicks from keeping bar open
            document.addEventListener('click', function(e) {
                if (!fabBar.contains(e.target) && fabBar.classList.contains('cfl-fab-bar--open')) {
                    fabBar.classList.remove('cfl-fab-bar--open');
                }
            });

            // =================================================================
            // SETTINGS MENU (replaces orbit)
            // =================================================================

            // Create the settings menu with inline controls (no blur overlay)
            var settingsMenu = document.createElement('div');
            settingsMenu.className = 'cfl-settings-menu';
            settingsMenu.id = 'cfl-settings-menu';
            settingsMenu.innerHTML = [
                '<div class="cfl-settings-menu__header">',
                '  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings',
                '</div>',
                '<div class="cfl-settings-menu__body">',
                '  <!-- Font Section -->',
                '  <div class="cfl-settings-menu__section" data-section="fonts">',
                '    <button class="cfl-settings-menu__section-header" data-toggle="fonts">',
                '      <span class="cfl-settings-menu__icon">Aa</span>',
                '      <span class="cfl-settings-menu__label">Fonts</span>',
                '      <span class="cfl-settings-menu__chevron">▼</span>',
                '    </button>',
                '    <div class="cfl-settings-menu__section-content" data-content="fonts">',
                '      <select class="cfl-settings-menu__select" id="cfl-inline-font-select">',
                '        <option value="default">Default (Georgia)</option>',
                '        <option value="fraunces">Fraunces (soft serif)</option>',
                '        <option value="caprasimo">Caprasimo (bubbly)</option>',
                '        <option value="chonburi">Chonburi (retro)</option>',
                '        <option value="dm-serif">DM Serif (editorial)</option>',
                '        <option value="abril">Abril Fatface (dramatic)</option>',
                '        <option value="bricolage">Bricolage (playful)</option>',
                '        <option value="calistoga">Calistoga (retro)</option>',
                '        <option value="varela">Varela Round (soft)</option>',
                '        <option value="fredoka">Fredoka (rounded)</option>',
                '        <option value="nunito">Nunito (clean)</option>',
                '      </select>',
                '    </div>',
                '  </div>',
                '  <!-- Colors Section -->',
                '  <div class="cfl-settings-menu__section" data-section="colors">',
                '    <button class="cfl-settings-menu__section-header" data-toggle="colors">',
                '      <span class="cfl-settings-menu__icon">🎨</span>',
                '      <span class="cfl-settings-menu__label">Colors</span>',
                '      <span class="cfl-settings-menu__chevron">▼</span>',
                '    </button>',
                '    <div class="cfl-settings-menu__section-content" data-content="colors">',
                '      <div class="cfl-settings-menu__swatches">',
                '        <button class="cfl-settings-menu__swatch" data-theme="default" title="Default Red">',
                '          <span style="background: #e63946;"></span>',
                '        </button>',
                '        <button class="cfl-settings-menu__swatch" data-theme="teal" title="Teal">',
                '          <span style="background: #0f766e;"></span>',
                '        </button>',
                '        <button class="cfl-settings-menu__swatch" data-theme="amber" title="Amber">',
                '          <span style="background: #d97706;"></span>',
                '        </button>',
                '        <button class="cfl-settings-menu__swatch" data-theme="plum" title="Plum">',
                '          <span style="background: #9333ea;"></span>',
                '        </button>',
                '      </div>',
                '    </div>',
                '  </div>',
                '  <div class="cfl-settings-menu__divider"></div>',
                '  <!-- Quick Actions -->',
                '  <button class="cfl-settings-menu__item" data-action="quick-font" data-font="fraunces">',
                '    <span class="cfl-settings-menu__icon">🫧</span>',
                '    <span class="cfl-settings-menu__label">Soft Serif</span>',
                '  </button>',
                '  <button class="cfl-settings-menu__item" data-action="quick-font" data-font="bricolage">',
                '    <span class="cfl-settings-menu__icon">✨</span>',
                '    <span class="cfl-settings-menu__label">Playful Sans</span>',
                '  </button>',
                '  <div class="cfl-settings-menu__divider"></div>',
                '  <button class="cfl-settings-menu__item" data-action="reset">',
                '    <span class="cfl-settings-menu__icon">↺</span>',
                '    <span class="cfl-settings-menu__label">Reset to Default</span>',
                '  </button>',
                '</div>'
            ].join('');
            document.body.appendChild(settingsMenu);

            // =================================================================
            // INLINE SETTINGS HANDLERS (menu stays open, live preview)
            // =================================================================

            // Toggle accordion sections
            settingsMenu.querySelectorAll('.cfl-settings-menu__section-header').forEach(function(header) {
                header.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var section = header.closest('.cfl-settings-menu__section');
                    var sectionName = section.getAttribute('data-section');
                    section.classList.toggle('is-open');
                    CFL.sounds.click();

                    // Lazy load all optional fonts when fonts section is opened
                    if (sectionName === 'fonts' && window.CFL && window.CFL.fonts && window.CFL.fonts.loadAllOptionalFonts) {
                        window.CFL.fonts.loadAllOptionalFonts();
                    }
                });
            });

            // Inline font select - changes apply instantly via CFL API, menu stays open
            var inlineFontSelect = settingsMenu.querySelector('#cfl-inline-font-select');
            if (inlineFontSelect) {
                inlineFontSelect.addEventListener('change', function(e) {
                    e.stopPropagation();
                    var newFont = e.target.value;
                    // Use CFL API if available (set up by initSettingsWidget)
                    if (window.CFL && window.CFL.setFont) {
                        window.CFL.setFont(newFont);
                    }
                    CFL.sounds.pop();
                });
            }

            // Inline color swatches - changes apply instantly via CFL API, menu stays open
            settingsMenu.querySelectorAll('.cfl-settings-menu__swatch').forEach(function(swatch) {
                swatch.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var theme = swatch.getAttribute('data-theme');
                    // Use CFL API if available
                    if (window.CFL && window.CFL.setTheme) {
                        window.CFL.setTheme(theme);
                    }
                    // Update active state in this menu
                    settingsMenu.querySelectorAll('.cfl-settings-menu__swatch').forEach(function(s) {
                        s.classList.remove('is-active');
                    });
                    swatch.classList.add('is-active');
                    CFL.sounds.pop();
                });
            });

            // Quick font buttons - instant change, menu stays open
            settingsMenu.querySelectorAll('[data-action="quick-font"]').forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var font = btn.getAttribute('data-font');
                    if (window.CFL && window.CFL.setFont) {
                        window.CFL.setFont(font);
                    }
                    if (inlineFontSelect) {
                        inlineFontSelect.value = font;
                    }
                    CFL.sounds.pop();
                });
            });

            // Reset button
            var resetBtn = settingsMenu.querySelector('[data-action="reset"]');
            if (resetBtn) {
                resetBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Use CFL API if available
                    if (window.CFL && window.CFL.resetSettings) {
                        window.CFL.resetSettings();
                    }
                    // Update UI
                    if (inlineFontSelect) {
                        inlineFontSelect.value = 'default';
                    }
                    settingsMenu.querySelectorAll('.cfl-settings-menu__swatch').forEach(function(s) {
                        s.classList.toggle('is-active', s.getAttribute('data-theme') === 'default');
                    });
                    CFL.sounds.success();
                });
            }

            // Settings button - toggle the new settings menu
            settingsItem.addEventListener('click', function(e) {
                e.stopPropagation();
                var isOpen = settingsMenu.classList.contains('is-open');

                // Close achievements panel if open
                var achPanel = document.querySelector('.cfl-achievements-panel');
                if (achPanel) achPanel.classList.remove('is-open');

                // Toggle settings menu
                settingsMenu.classList.toggle('is-open');
                fabBar.classList.remove('cfl-fab-bar--open');

                // No need to sync - FAB menu no longer has dark mode toggle

                CFL.sounds.pop();
            });

            // Close settings menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!settingsMenu.contains(e.target) &&
                    !settingsItem.contains(e.target) &&
                    settingsMenu.classList.contains('is-open')) {
                    settingsMenu.classList.remove('is-open');
                }
            });

            // Sound toggle
            soundItem.addEventListener('click', function(e) {
                e.stopPropagation();
                var newState = !CFL.sounds.isEnabled();
                CFL.sounds.setEnabled(newState);
                soundItem.innerHTML = (newState ? '🔊' : '🔇') + '<span class="cfl-fab-bar__label">Sound</span>';
                soundItem.setAttribute('data-enabled', newState);
                if (newState) {
                    CFL.sounds.success();
                    CFL.achievements.unlock('sound-on');
                }
            });

            // =================================================================
            // CREATE ACHIEVEMENTS PANEL
            // =================================================================
            // Enhanced UI with level display, category tabs, progress indicators
            // Structure: Header > Level Bar > Tabs > List > Stats footer
            var panel = document.createElement('div');
            panel.className = 'cfl-achievements-panel';
            panel.innerHTML = [
                '<div class="cfl-achievements-header">',
                '  <div class="cfl-achievements-header__title">',
                '    <span>🏆</span>',
                '    <div>',
                '      <div class="cfl-achievements-header__main">Achievements</div>',
                '      <div class="cfl-achievements-header__subtitle">Unlock them all!</div>',
                '    </div>',
                '  </div>',
                '  <button class="close-panel" aria-label="Close">✕</button>',
                '</div>',
                '<div class="cfl-achievements-level" id="cfl-achievements-level">',
                '  <!-- Level display populated by JS -->',
                '</div>',
                '<div class="cfl-achievements-tabs">',
                '  <button class="cfl-achievements-tab active" data-category="all">All</button>',
                '  <button class="cfl-achievements-tab" data-category="progression">🧭 Explorer</button>',
                '  <button class="cfl-achievements-tab" data-category="3d-printing">🖨️ 3D Print</button>',
                '  <button class="cfl-achievements-tab" data-category="laser">✂️ Laser</button>',
                '  <button class="cfl-achievements-tab" data-category="cnc">🔧 CNC</button>',
                '  <button class="cfl-achievements-tab" data-category="special">⭐ Special</button>',
                '  <button class="cfl-achievements-tab" data-category="secret">🔒 Secrets</button>',
                '</div>',
                '<div class="cfl-achievements-list"></div>',
                '<div class="cfl-achievements-stats"></div>'
            ].join('');
            document.body.appendChild(panel);

            var currentCategory = 'all';

            function formatTime(timestamp) {
                if (!timestamp) return '';
                var date = new Date(timestamp);
                var now = new Date();
                var diff = now - date;
                var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                if (days === 0) return 'Today';
                if (days === 1) return 'Yesterday';
                if (days < 7) return days + ' days ago';
                return date.toLocaleDateString();
            }

            // Update the achievements panel with current data
            // Handles level display, filtering, sorting, progress, rarity, and stats
            function updatePanel() {
                var list = panel.querySelector('.cfl-achievements-list');
                var statsEl = panel.querySelector('.cfl-achievements-stats');
                var levelEl = panel.querySelector('#cfl-achievements-level');
                var all = CFL.achievements.getAll();
                var unlocked = CFL.achievements.getUnlocked();
                var unlockedData = CFL.achievements.getUnlockedData();
                var achStats = CFL.achievements.getStats();

                // Update level display
                var levelInfo = CFL.achievements.getLevel();
                var xpToNext = levelInfo.isMaxLevel ? '' : ' / ' + levelInfo.xpForNextLevel;
                levelEl.innerHTML = [
                    '<div class="cfl-achievements-level__badge">' + levelInfo.icon + '</div>',
                    '<div class="cfl-achievements-level__info">',
                    '  <div class="cfl-achievements-level__name">Level ' + levelInfo.level + '</div>',
                    '  <div class="cfl-achievements-level__title">' + levelInfo.name + '</div>',
                    '  <div class="cfl-achievements-level__progress">',
                    '    <div class="cfl-achievements-level__progress-bar" style="width: ' + levelInfo.progress + '%"></div>',
                    '  </div>',
                    '  <div class="cfl-achievements-level__xp">' + levelInfo.xp + xpToNext + ' XP</div>',
                    '</div>'
                ].join('');

                // Filter achievements by selected category
                var achievementIds = Object.keys(all);
                if (currentCategory !== 'all') {
                    achievementIds = achievementIds.filter(function(id) {
                        return all[id].category === currentCategory;
                    });
                }

                // Sort: unlocked first (by rarity desc), then by unlock time (newest first), then locked
                var rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
                achievementIds.sort(function(a, b) {
                    var aUnlocked = unlocked.indexOf(a) !== -1;
                    var bUnlocked = unlocked.indexOf(b) !== -1;
                    if (aUnlocked && !bUnlocked) return -1;
                    if (!aUnlocked && bUnlocked) return 1;
                    if (aUnlocked && bUnlocked) {
                        // Sort by rarity first (higher rarity first), then by time
                        var aRarity = rarityOrder[all[a].rarity] || 0;
                        var bRarity = rarityOrder[all[b].rarity] || 0;
                        if (aRarity !== bRarity) return bRarity - aRarity;
                        return (unlockedData[b].time || 0) - (unlockedData[a].time || 0);
                    }
                    return 0;
                });

                list.innerHTML = '';
                if (achievementIds.length === 0) {
                    list.innerHTML = '<div class="cfl-achievements-empty">No achievements in this category</div>';
                } else {
                    achievementIds.forEach(function(id) {
                        var ach = all[id];
                        var isUnlocked = unlocked.indexOf(id) !== -1;
                        var unlockTime = unlockedData[id] ? unlockedData[id].time : null;
                        var progress = ach.progress;
                        var progressPercent = progress ? Math.min((progress.current / progress.target) * 100, 100) : 0;
                        var rarity = ach.rarity || 'common';
                        var xp = CFL.achievements.getXP(id);

                        var div = document.createElement('div');
                        div.className = 'cfl-achievement cfl-achievement--' + rarity + ' ' + (isUnlocked ? 'cfl-achievement--unlocked' : 'cfl-achievement--locked');
                        div.setAttribute('data-id', id);
                        div.setAttribute('data-rarity', rarity);

                        var progressBar = '';
                        if (progress && !isUnlocked) {
                            progressBar = '<div class="cfl-achievement__progress"><div class="cfl-achievement__progress-bar" style="width: ' + progressPercent + '%"></div><span class="cfl-achievement__progress-text">' + progress.current + '/' + progress.target + '</span></div>';
                        }

                        var lockIcon = isUnlocked ? '' : '<div class="cfl-achievement__lock">🔒</div>';
                        var timestamp = isUnlocked && unlockTime ? '<div class="cfl-achievement__time">' + formatTime(unlockTime) + '</div>' : '';

                        // Capitalize rarity for display
                        var rarityDisplay = rarity.charAt(0).toUpperCase() + rarity.slice(1);
                        var rarityBadge = '<span class="cfl-achievement__rarity cfl-achievement__rarity--' + rarity + '">' + rarityDisplay + '</span>';
                        var xpBadge = '<span class="cfl-achievement__xp">+' + xp + ' XP</span>';

                        div.innerHTML = [
                            '<div class="cfl-achievement__icon">' + ach.icon + lockIcon + '</div>',
                            '<div class="cfl-achievement__info">',
                            '  <div class="cfl-achievement__header">',
                            '    <div class="cfl-achievement__name">' + ach.name + '</div>',
                            '    ' + rarityBadge + xpBadge,
                            '  </div>',
                            '  <div class="cfl-achievement__desc">' + (isUnlocked ? ach.desc : '???') + '</div>',
                            progressBar,
                            timestamp,
                            '</div>'
                        ].join('');

                        list.appendChild(div);
                    });
                }

                var categoryCount = currentCategory === 'all' ? achievementIds.length : achievementIds.length;
                var categoryUnlocked = achievementIds.filter(function(id) { return unlocked.indexOf(id) !== -1; }).length;
                var totalXP = CFL.achievements.getTotalXP();

                statsEl.innerHTML = [
                    '<div class="cfl-achievements-stats__item">',
                    '  <span class="cfl-achievements-stats__label">Progress:</span>',
                    '  <span>' + categoryUnlocked + '/' + categoryCount + '</span>',
                    '</div>',
                    '<div class="cfl-achievements-stats__item">',
                    '  <span class="cfl-achievements-stats__label">Total:</span>',
                    '  <span>' + unlocked.length + '/' + Object.keys(all).length + '</span>',
                    '</div>',
                    '<div class="cfl-achievements-stats__item">',
                    '  <span class="cfl-achievements-stats__label">XP:</span>',
                    '  <span>' + totalXP + '</span>',
                    '</div>'
                ].join('');
            }

            // =================================================================
            // TAB SWITCHING
            // =================================================================
            // Handle category filter tab clicks
            panel.querySelectorAll('.cfl-achievements-tab').forEach(function(tab) {
                tab.addEventListener('click', function() {
                    panel.querySelectorAll('.cfl-achievements-tab').forEach(function(t) { t.classList.remove('active'); });
                    tab.classList.add('active');
                    currentCategory = tab.getAttribute('data-category');
                    updatePanel();
                    CFL.sounds.pop();
                });
            });

            // =================================================================
            // SCROLL LOCK MANAGEMENT (Improved for Mobile)
            // =================================================================
            // Prevent body scrolling when panel is open
            // Uses multiple techniques for cross-browser/device support
            var scrollY = 0;
            var isScrollLocked = false;

            function lockScroll() {
                if (isScrollLocked) return;
                isScrollLocked = true;
                scrollY = window.scrollY;

                // Standard overflow hidden
                document.body.style.overflow = 'hidden';

                // iOS fix: position fixed with top offset
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + scrollY + 'px';
                document.body.style.width = '100%';

                // Prevent touch scrolling on mobile
                document.body.style.touchAction = 'none';
            }

            function unlockScroll() {
                if (!isScrollLocked) return;
                isScrollLocked = false;

                // Remove all scroll lock styles
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.touchAction = '';

                // Restore scroll position
                window.scrollTo(0, scrollY);
            }

            // Close panel helper with safety checks
            function closePanel() {
                try {
                    if (panel && panel.classList.contains('is-open')) {
                        panel.classList.remove('is-open');
                        unlockScroll();
                    }
                } catch (e) {
                    console.warn('[CFL] Error closing panel:', e);
                }
            }

            // =================================================================
            // PANEL TOGGLE HANDLERS (Improved Stability)
            // =================================================================
            // Toggle panel visibility and manage scroll lock
            achItem.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();

                try {
                    var wasOpen = panel.classList.contains('is-open');

                    // Close settings menu if open
                    var settingsMenu = document.getElementById('cfl-settings-menu');
                    if (settingsMenu && settingsMenu.classList.contains('is-open')) {
                        settingsMenu.classList.remove('is-open');
                    }

                    if (wasOpen) {
                        closePanel();
                    } else {
                        panel.classList.add('is-open');
                        updatePanel();
                        lockScroll();
                        if (CFL.sounds) CFL.sounds.pop();
                    }

                    fabBar.classList.remove('cfl-fab-bar--open');
                } catch (e) {
                    console.warn('[CFL] Error toggling achievements panel:', e);
                }
            });

            // Close button with safety
            panel.querySelector('.close-panel').addEventListener('click', function(e) {
                e.stopPropagation();
                closePanel();
                if (CFL.sounds) CFL.sounds.click();
            });

            // Close panel and unlock scroll when clicking outside
            // Improved: checks for all panel-related elements and uses capture phase
            function handleOutsideClick(e) {
                try {
                    // Don't close if click is inside panel or trigger button
                    if (panel.contains(e.target) || achItem.contains(e.target)) {
                        return;
                    }

                    // Don't close if panel isn't open
                    if (!panel.classList.contains('is-open')) {
                        return;
                    }

                    // Close the panel
                    closePanel();
                } catch (err) {
                    console.warn('[CFL] Error in outside click handler:', err);
                }
            }

            // Use both click and touchend for better mobile support
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('touchend', handleOutsideClick, { passive: true });

            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && panel.classList.contains('is-open')) {
                    closePanel();
                }
            });

            // Check for unlocked achievements and update notification badge
            function checkNewAchievements() {
                var unlocked = CFL.achievements.getUnlocked();
                if (unlocked.length > 0) {
                    achItem.setAttribute('data-new', 'true');
                }
                // Update panel if it's open
                if (panel.classList.contains('is-open')) {
                    updatePanel();
                }
            }
            checkNewAchievements();

            // Hook into achievement unlock system to auto-refresh panel
            // Wraps original unlock function to trigger panel update
            var originalUnlock = CFL.achievements.unlock;
            CFL.achievements.unlock = function(id) {
                var result = originalUnlock.call(this, id);
                if (result) {
                    setTimeout(checkNewAchievements, 100);
                }
                return result;
            };
        })();

        // =====================================================================
        // EASTER EGG HUNT
        // =====================================================================
        //
        // PURPOSE: Hides collectible emoji around the page for users to find
        //
        // HOW IT WORKS:
        //   - 5 eggs with fixed positions (but only 20% chance to spawn each)
        //   - Found eggs are tracked in localStorage (don't respawn)
        //   - Clicking an egg triggers sound, achievement, and toast
        //
        // EGGS:
        //   🥚 (5%, 30%)   🐣 (95%, 60%)   🌟 (10%, 85%)
        //   🍀 (90%, 15%)  🎁 (50%, 95%)
        //
        // STYLING:
        //   - 10% opacity by default (nearly invisible)
        //   - 100% opacity + grow + rotate on hover
        //   - Disappears with animation when clicked
        //
        // STORAGE:
        //   localStorage.cflFoundEggs - JSON array of found indices [0,2,4]
        //
        // SEE: docs/EASTER-EGGS.md for full documentation
        // =====================================================================
        (function createEasterEggs() {
            var eggs = [
                { emoji: '🥚', x: '5%', y: '30%' },
                { emoji: '🐣', x: '95%', y: '60%' },
                { emoji: '🌟', x: '10%', y: '85%' },
                { emoji: '🍀', x: '90%', y: '15%' },
                { emoji: '🎁', x: '50%', y: '95%' }
            ];

            var foundEggs = safeParse(safeGet(localStorage, 'cflFoundEggs', '[]'), []);

            eggs.forEach(function(egg, index) {
                if (foundEggs.indexOf(index) !== -1) return; // Already found

                // Only show egg 20% of the time on page load
                if (Math.random() > 0.2) return;

                var eggEl = document.createElement('div');
                eggEl.className = 'easter-egg';
                eggEl.innerHTML = egg.emoji;
                eggEl.style.left = egg.x;
                eggEl.style.top = egg.y;
                document.body.appendChild(eggEl);

                eggEl.addEventListener('click', function() {
                    foundEggs.push(index);
                    safeSet(localStorage, 'cflFoundEggs', JSON.stringify(foundEggs));
                    eggEl.classList.add('easter-egg--found');

                    CFL.sounds.coin();
                    CFL.achievements.unlock('easter-egg');

                    if (CFL.toast) {
                        CFL.toast({
                            icon: egg.emoji,
                            title: 'Easter Egg Found!',
                            message: 'You found a hidden ' + egg.emoji + '! ' + (5 - foundEggs.length) + ' more to find!',
                            variant: 'party',
                            iconAnim: 'bounce'
                        });
                    }

                    setTimeout(function() { eggEl.remove(); }, 500);
                });
            });
        })();

        // Add copy buttons to code snippets and all code blocks
        var copyIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        var checkIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';

        // Add copy button helper
        function addCopyButton(container, codeElement, className) {
            if (!codeElement || container.querySelector('.' + className)) return;
            var btn = document.createElement('button');
            btn.className = className;
            btn.innerHTML = copyIcon + ' Copy';
            btn.title = 'Copy to clipboard';
            container.style.position = 'relative';
            container.appendChild(btn);

            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigator.clipboard.writeText(codeElement.textContent.trim()).then(function() {
                    btn.classList.add(className + '--copied');
                    btn.innerHTML = checkIcon + ' Copied';
                    CFL.sounds.pop();
                    setTimeout(function() {
                        btn.classList.remove(className + '--copied');
                        btn.innerHTML = copyIcon + ' Copy';
                    }, 2000);
                }).catch(function() {
                    // Fallback for older browsers
                    var textarea = document.createElement('textarea');
                    textarea.value = codeElement.textContent.trim();
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    btn.classList.add(className + '--copied');
                    btn.innerHTML = checkIcon + ' Copied';
                    setTimeout(function() {
                        btn.classList.remove(className + '--copied');
                        btn.innerHTML = copyIcon + ' Copy';
                    }, 2000);
                });
            });
        }

        // Code snippet content (existing)
        document.querySelectorAll('.code-snippet__content').forEach(function(content) {
            addCopyButton(content, content.querySelector('code'), 'code-snippet__copy');
        });

        // All pre > code blocks (syntax highlighted code)
        document.querySelectorAll('pre code, .highlight pre').forEach(function(code) {
            var pre = code.closest('pre');
            if (pre && !pre.querySelector('.code-copy-btn')) {
                addCopyButton(pre, code, 'code-copy-btn');
            }
        });

        // Search clear button functionality
        document.querySelectorAll('.cfl-search__clear').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var input = this.parentElement.querySelector('.cfl-search__input');
                if (input) {
                    input.value = '';
                    input.focus();
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        });

        // Theme toggle syncing
        function syncThemeToggles() {
            var isDark = document.documentElement.dataset.theme === 'dark';
            document.querySelectorAll('.cfl-theme-toggle__input').forEach(function(input) {
                input.checked = isDark;
            });
        }

        syncThemeToggles();

        document.querySelectorAll('.cfl-theme-toggle__input').forEach(function(input) {
            input.addEventListener('change', function() {
                if (typeof window.toggleDarkMode === 'function') {
                    window.toggleDarkMode();
                } else {
                    document.documentElement.dataset.theme = input.checked ? 'dark' : 'light';
                }
                syncThemeToggles();
            });
        });

        // Tabs functionality
        document.querySelectorAll('.cfl-tabs').forEach(function(tabContainer) {
            var tabs = tabContainer.querySelectorAll('.cfl-tabs__tab');
            tabs.forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var targetId = this.getAttribute('data-tab');

                    // Deactivate all tabs and panels
                    tabContainer.querySelectorAll('.cfl-tabs__tab').forEach(function(t) {
                        t.classList.remove('cfl-tabs__tab--active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    tabContainer.querySelectorAll('.cfl-tabs__panel').forEach(function(p) {
                        p.classList.remove('cfl-tabs__panel--active');
                        p.setAttribute('hidden', '');
                    });

                    // Activate clicked tab and its panel
                    this.classList.add('cfl-tabs__tab--active');
                    this.setAttribute('aria-selected', 'true');
                    var panel = tabContainer.querySelector('[data-panel="' + targetId + '"]');
                    if (panel) {
                        panel.classList.add('cfl-tabs__panel--active');
                        panel.removeAttribute('hidden');
                    }
                });
            });
        });

        // Toast notification system
        window.CFL = window.CFL || {};

        // Create toast container if it doesn't exist
        if (!document.querySelector('.cfl-toast-container')) {
            var container = document.createElement('div');
            container.className = 'cfl-toast-container';
            document.body.appendChild(container);
        }

        // Toast function
        window.CFL.toast = function(options) {
            var container = document.querySelector('.cfl-toast-container');
            var toast = document.createElement('div');
            toast.className = 'cfl-toast cfl-toast--' + (options.variant || 'info');

            var iconAnim = options.iconAnim || 'pop';
            toast.innerHTML =
                '<span class="cfl-toast__icon cfl-toast__icon--' + iconAnim + '">' + (options.icon || '✨') + '</span>' +
                '<div class="cfl-toast__content">' +
                    '<div class="cfl-toast__title">' + (options.title || 'Notification') + '</div>' +
                    '<div class="cfl-toast__message">' + (options.message || '') + '</div>' +
                '</div>';

            container.appendChild(toast);

            // Auto remove after duration
            setTimeout(function() {
                toast.classList.add('cfl-toast--leaving');
                setTimeout(function() {
                    toast.remove();
                }, 300);
            }, options.duration || 3000);
        };

        // Fun toast presets
        window.CFL.toasts = {
            primary: function() {
                CFL.toast({ icon: '🚀', title: 'Blast off!', message: 'Primary action initiated. Ready for launch!', variant: 'info', iconAnim: 'bounce' });
            },
            secondary: function() {
                CFL.toast({ icon: '🎭', title: 'Behind the scenes', message: 'Secondary actions are the unsung heroes.', variant: 'info', iconAnim: 'pop' });
            },
            ghost: function() {
                CFL.toast({ icon: '👻', title: 'Boo!', message: 'Ghost buttons are spooky subtle.', variant: 'info', iconAnim: 'shake' });
            },
            danger: function() {
                CFL.toast({ icon: '🔥', title: 'Danger zone!', message: 'Handle with care. This is serious business.', variant: 'danger', iconAnim: 'shake' });
            },
            success: function() {
                CFL.toast({ icon: '🎉', title: 'Woohoo!', message: 'Everything worked perfectly!', variant: 'success', iconAnim: 'bounce' });
            },
            small: function() {
                CFL.toast({ icon: '🐜', title: 'Small but mighty!', message: 'Size doesn\'t matter, impact does.', variant: 'info', iconAnim: 'pop' });
            },
            medium: function() {
                CFL.toast({ icon: '🎯', title: 'Right on target!', message: 'The Goldilocks zone of buttons.', variant: 'info', iconAnim: 'pop' });
            },
            large: function() {
                CFL.toast({ icon: '🦖', title: 'Go big!', message: 'Large and in charge. No squinting required!', variant: 'info', iconAnim: 'bounce' });
            },
            rocket: function() {
                CFL.toast({ icon: '🚀', title: '3... 2... 1... Liftoff!', message: 'Houston, we have ignition!', variant: 'party', iconAnim: 'bounce' });
            },
            pizza: function() {
                CFL.toast({ icon: '🍕', title: 'Pizza time!', message: 'You deserve a slice. Great work!', variant: 'warning', iconAnim: 'spin' });
            },
            unicorn: function() {
                CFL.toast({ icon: '🦄', title: 'Magical!', message: 'Unicorns approve of this action.', variant: 'party', iconAnim: 'bounce' });
            },
            coffee: function() {
                CFL.toast({ icon: '☕', title: 'Coffee break!', message: 'Refueling creativity levels...', variant: 'warning', iconAnim: 'pop' });
            },
            sparkles: function() {
                CFL.toast({ icon: '✨', title: 'Sparkle sparkle!', message: 'Adding a little magic to your day.', variant: 'party', iconAnim: 'spin' });
            },
            music: function() {
                CFL.toast({ icon: '🎵', title: 'Feel the beat!', message: 'Dancing through the code...', variant: 'info', iconAnim: 'bounce' });
            },
            brain: function() {
                CFL.toast({ icon: '🧠', title: 'Big brain time!', message: '200 IQ play detected.', variant: 'success', iconAnim: 'pop' });
            },
            fire: function() {
                CFL.toast({ icon: '🔥', title: 'This is fire!', message: 'Absolutely blazing performance!', variant: 'danger', iconAnim: 'shake' });
            },
            party: function() {
                CFL.toast({ icon: '🎊', title: 'Party mode!', message: 'Let\'s celebrate! Confetti everywhere!', variant: 'party', iconAnim: 'bounce' });
            },
            robot: function() {
                CFL.toast({ icon: '🤖', title: 'Beep boop!', message: 'Automation activated. Humans optional.', variant: 'info', iconAnim: 'shake' });
            },
            heart: function() {
                CFL.toast({ icon: '❤️', title: 'Sending love!', message: 'You\'re doing amazing!', variant: 'danger', iconAnim: 'pop' });
            },
            lightning: function() {
                CFL.toast({ icon: '⚡', title: 'Lightning fast!', message: 'Speed is your superpower!', variant: 'warning', iconAnim: 'shake' });
            },
            cat: function() {
                CFL.toast({ icon: '🐱', title: 'Meow!', message: 'Cats approve. That\'s the highest honor.', variant: 'info', iconAnim: 'bounce' });
            },
            dog: function() {
                CFL.toast({ icon: '🐕', title: 'Good human!', message: 'Tail wagging intensifies!', variant: 'success', iconAnim: 'shake' });
            }
        };

        // Slider value display
        document.querySelectorAll('.cfl-slider__input').forEach(function(slider) {
            var valueDisplay = slider.closest('.cfl-slider__wrapper')?.querySelector('.cfl-slider__value');
            if (valueDisplay) {
                slider.addEventListener('input', function() {
                    valueDisplay.textContent = this.value;
                });
            }
        });

        // Segmented control switching
        document.querySelectorAll('.cfl-segmented').forEach(function(segmented) {
            segmented.querySelectorAll('.cfl-segmented__btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    segmented.querySelectorAll('.cfl-segmented__btn').forEach(function(b) {
                        b.classList.remove('cfl-segmented__btn--active');
                    });
                    this.classList.add('cfl-segmented__btn--active');
                });
            });
        });

        // Rating stars interaction
        document.querySelectorAll('.cfl-rating').forEach(function(rating) {
            var stars = rating.querySelectorAll('.cfl-rating__star');
            stars.forEach(function(star, index) {
                star.addEventListener('click', function() {
                    stars.forEach(function(s, i) {
                        if (i <= index) {
                            s.classList.add('cfl-rating__star--filled');
                        } else {
                            s.classList.remove('cfl-rating__star--filled');
                        }
                    });
                });
            });
        });

        // Color picker value display
        document.querySelectorAll('.cfl-color-picker__input').forEach(function(picker) {
            var valueDisplay = picker.closest('.cfl-color-picker')?.querySelector('.cfl-color-picker__value');
            if (valueDisplay) {
                picker.addEventListener('input', function() {
                    valueDisplay.textContent = this.value;
                });
            }
        });

        // File upload drag and drop
        document.querySelectorAll('.cfl-upload').forEach(function(upload) {
            upload.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('cfl-upload--dragover');
            });
            upload.addEventListener('dragleave', function() {
                this.classList.remove('cfl-upload--dragover');
            });
            upload.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('cfl-upload--dragover');
                var files = e.dataTransfer.files;
                if (files.length) {
                    CFL.toast({ icon: '📁', title: 'Files received!', message: files.length + ' file(s) dropped', variant: 'success', iconAnim: 'bounce' });
                }
            });
        });

        // =====================================================================
        // WIKI SEARCH & FILTER SYSTEM
        // =====================================================================
        //
        // PURPOSE: Client-side search and category filtering for wiki pages
        //
        // ELEMENTS:
        //   - Search input (#wiki-search-input)
        //   - Category pills (.category-pill)
        //   - Card grid (#wiki-card-grid)
        //   - Results count (#wiki-results-count)
        //   - No results message (#wiki-no-results)
        //
        // =====================================================================
        (function initWikiSearch() {
            var searchInput = document.getElementById('wiki-search-input');
            var searchClear = document.getElementById('wiki-search-clear');
            var cardGrid = document.getElementById('wiki-card-grid');
            var resultsCount = document.getElementById('wiki-results-count');
            var noResults = document.getElementById('wiki-no-results');
            var resetBtn = document.getElementById('wiki-reset-filters');
            var categoryPills = document.querySelectorAll('.category-pill');

            // Exit if not on home page with wiki cards
            if (!cardGrid || !searchInput) return;

            var cards = cardGrid.querySelectorAll('.wiki-card');
            var currentCategory = 'all';
            var currentSearch = '';

            // Filter cards based on search and category
            function filterCards() {
                var visibleCount = 0;
                var searchLower = currentSearch.toLowerCase().trim();

                cards.forEach(function(card) {
                    var title = card.getAttribute('data-title') || '';
                    var excerpt = card.getAttribute('data-excerpt') || '';
                    var category = card.getAttribute('data-category') || '';

                    var matchesSearch = !searchLower ||
                        title.indexOf(searchLower) !== -1 ||
                        excerpt.indexOf(searchLower) !== -1;

                    var matchesCategory = currentCategory === 'all' ||
                        category === currentCategory;

                    var isVisible = matchesSearch && matchesCategory;

                    if (isVisible) {
                        card.classList.remove('wiki-card--hidden');
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.classList.add('wiki-card--hidden');
                        card.style.display = 'none';
                    }
                });

                // Update results count
                if (resultsCount) {
                    if (currentSearch || currentCategory !== 'all') {
                        resultsCount.textContent = 'Showing ' + visibleCount + ' of ' + cards.length + ' pages';
                    } else {
                        resultsCount.textContent = 'Showing all ' + cards.length + ' pages';
                    }
                }

                // Show/hide no results message
                if (noResults) {
                    if (visibleCount === 0) {
                        noResults.style.display = 'block';
                        cardGrid.style.display = 'none';
                    } else {
                        noResults.style.display = 'none';
                        cardGrid.style.display = '';
                    }
                }

                // Update clear button visibility
                if (searchClear) {
                    searchClear.style.opacity = currentSearch ? '1' : '0';
                    searchClear.style.pointerEvents = currentSearch ? 'auto' : 'none';
                }
            }

            // Search input handler with debounce
            var searchTimeout;
            searchInput.addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(function() {
                    currentSearch = e.target.value;
                    filterCards();
                }, 150);
            });

            // Clear search button
            if (searchClear) {
                searchClear.addEventListener('click', function() {
                    searchInput.value = '';
                    currentSearch = '';
                    filterCards();
                    searchInput.focus();
                    if (CFL.sounds) CFL.sounds.click();
                });
            }

            // Category pill click handlers
            categoryPills.forEach(function(pill) {
                pill.addEventListener('click', function() {
                    // Update active state
                    categoryPills.forEach(function(p) {
                        p.classList.remove('category-pill--active');
                    });
                    pill.classList.add('category-pill--active');

                    // Update filter
                    currentCategory = pill.getAttribute('data-category');
                    filterCards();

                    if (CFL.sounds) CFL.sounds.pop();
                });
            });

            // Reset filters button
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    searchInput.value = '';
                    currentSearch = '';
                    currentCategory = 'all';

                    // Reset active pill
                    categoryPills.forEach(function(p) {
                        p.classList.remove('category-pill--active');
                        if (p.getAttribute('data-category') === 'all') {
                            p.classList.add('category-pill--active');
                        }
                    });

                    filterCards();
                    if (CFL.sounds) CFL.sounds.success();
                });
            }

            // Keyboard shortcut: "/" to focus search
            document.addEventListener('keydown', function(e) {
                if (e.key === '/' && document.activeElement !== searchInput) {
                    // Don't trigger if typing in an input
                    if (document.activeElement.tagName === 'INPUT' ||
                        document.activeElement.tagName === 'TEXTAREA') {
                        return;
                    }
                    e.preventDefault();
                    searchInput.focus();
                }
                // ESC to clear and blur search
                if (e.key === 'Escape' && document.activeElement === searchInput) {
                    searchInput.value = '';
                    currentSearch = '';
                    filterCards();
                    searchInput.blur();
                }
            });

            // Initial state
            filterCards();
        })();

        // =====================================================================
        // OPPORTUNITIES FILTER SYSTEM
        // =====================================================================
        (function initOpportunitiesFilter() {
            var list = document.getElementById('opportunity-list');
            var filters = document.getElementById('opportunity-filters');
            var resultsCount = document.getElementById('opportunity-results-count');
            var noResults = document.getElementById('opportunity-no-results');
            var resetBtn = document.getElementById('opportunity-reset-filters');

            if (!list || !filters) return;

            var items = list.querySelectorAll('.opportunity-card');
            var pills = filters.querySelectorAll('.category-pill');
            var currentCategory = 'all';

            function filterItems() {
                var visibleCount = 0;

                items.forEach(function(item) {
                    var category = item.getAttribute('data-category') || '';
                    var matchesCategory = currentCategory === 'all' || category === currentCategory;

                    if (matchesCategory) {
                        item.classList.remove('opportunity-card--hidden');
                        item.style.display = '';
                        visibleCount++;
                    } else {
                        item.classList.add('opportunity-card--hidden');
                        item.style.display = 'none';
                    }
                });

                if (resultsCount) {
                    if (currentCategory === 'all') {
                        resultsCount.textContent = 'Showing all ' + items.length + ' opportunities';
                    } else {
                        resultsCount.textContent = 'Showing ' + visibleCount + ' of ' + items.length + ' opportunities';
                    }
                }

                if (noResults) {
                    if (visibleCount === 0) {
                        noResults.style.display = 'block';
                        list.style.display = 'none';
                    } else {
                        noResults.style.display = 'none';
                        list.style.display = '';
                    }
                }
            }

            pills.forEach(function(pill) {
                pill.addEventListener('click', function() {
                    pills.forEach(function(p) {
                        p.classList.remove('category-pill--active');
                    });
                    pill.classList.add('category-pill--active');
                    currentCategory = pill.getAttribute('data-category') || 'all';
                    filterItems();
                    if (CFL.sounds) CFL.sounds.pop();

                    // Scroll active pill into view on mobile (horizontal scroll)
                    if (window.innerWidth < 720) {
                        pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                });
            });

            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    currentCategory = 'all';
                    pills.forEach(function(p) {
                        p.classList.remove('category-pill--active');
                        if (p.getAttribute('data-category') === 'all') {
                            p.classList.add('category-pill--active');
                        }
                    });
                    filterItems();
                    if (CFL.sounds) CFL.sounds.success();
                });
            }

            // Sticky filter shadow on scroll (mobile)
            if (window.innerWidth < 720) {
                var lastScrollY = 0;
                var ticking = false;

                function updateFilterShadow() {
                    if (window.scrollY > 10) {
                        filters.classList.add('is-scrolled');
                    } else {
                        filters.classList.remove('is-scrolled');
                    }
                    ticking = false;
                }

                window.addEventListener('scroll', function() {
                    lastScrollY = window.scrollY;
                    if (!ticking) {
                        window.requestAnimationFrame(updateFilterShadow);
                        ticking = true;
                    }
                }, { passive: true });
            }

            // Requirements expand/collapse on mobile
            var requirements = list.querySelectorAll('.opportunity-card__requirements');
            requirements.forEach(function(req) {
                var items = req.querySelectorAll('li');
                if (items.length > 2 && window.innerWidth < 720) {
                    req.setAttribute('data-has-more', 'true');
                    req.setAttribute('data-more-text', '+ ' + (items.length - 2) + ' more');

                    req.addEventListener('click', function() {
                        req.classList.toggle('is-expanded');
                        if (req.classList.contains('is-expanded')) {
                            req.setAttribute('data-more-text', 'Show less');
                        } else {
                            req.setAttribute('data-more-text', '+ ' + (items.length - 2) + ' more');
                        }
                    });
                }
            });

            filterItems();
        })();

        // Floating settings widget (font switcher + scope)
        (function initSettingsWidget() {
            var settings = document.getElementById('cfl-settings');
            if (!settings) return;

            var fab = settings.querySelector('.cfl-settings__fab');
            var orbitButtons = settings.querySelectorAll('.cfl-settings__orbit-btn');
            var panels = settings.querySelectorAll('.cfl-settings__panel');
            var fontSelect = document.getElementById('cfl-font-select');
            var scopeToggle = document.getElementById('cfl-settings-scope');
            var debugToggle = document.getElementById('cfl-settings-debug');
            var resetButton = settings.querySelector('[data-action="reset-scope"]');
            var scrim = settings.querySelector('[data-scrim]');
            var swatches = settings.querySelectorAll('.cfl-settings__swatch');
            var dismissBtn = document.getElementById('cfl-settings-dismiss');
            var navSettingsBtn = document.getElementById('cfl-nav-settings-btn');

            // Load settings from central config (_data/settings.yml)
            var config = window.CFL_CONFIG || {};
            var STATE_KEYS = config.state_keys || {
                scope: 'cflSettingsScope',
                site: 'cflSettingsSite',
                pagePrefix: 'cflSettingsPage:',
                hidden: 'cflSettingsHidden'
            };

            // Build fonts object from config
            var fonts = {};
            if (config.fonts) {
                Object.keys(config.fonts).forEach(function(key) {
                    fonts[key] = {
                        heading: config.fonts[key].heading,
                        body: config.fonts[key].body,
                        ui: config.fonts[key].ui
                    };
                });
            } else {
                // Fallback if config not loaded
                fonts = {
                    default: { heading: "'Georgia', 'Times New Roman', serif", body: "'Georgia', 'Times New Roman', serif", ui: "'Inter', system-ui, sans-serif" }
                };
            }

            // Build themes object from config
            var themes = {};
            if (config.themes) {
                Object.keys(config.themes).forEach(function(key) {
                    var theme = config.themes[key];
                    themes[key] = key === 'default' ? {} : {
                        '--accent': theme.accent,
                        '--accent-hover': theme.accent_hover,
                        '--accent-secondary': theme.accent_secondary,
                        '--accent-secondary-hover': theme.accent_secondary_hover
                    };
                });
            } else {
                // Fallback if config not loaded
                themes = { default: {} };
            }

            // Initialize state from config defaults
            var config = window.CFL_CONFIG || {};
            var defaults = config.defaults || {};
            var state = {
                scope: defaults.settings_scope || 'site',
                font: defaults.font || 'default',
                theme: defaults.theme || 'default',
                debug: defaults.settings_debug !== false,
                openPanel: null
            };

            function logger() {
                if (!state.debug) return;
                var args = Array.prototype.slice.call(arguments);
                args.unshift('[CFL settings]');
                console.info.apply(console, args);
            }

            function storageForScope(scope) {
                return scope === 'site' ? localStorage : sessionStorage;
            }

            function scopeKey(scope) {
                return scope === 'site' ? STATE_KEYS.site : STATE_KEYS.pagePrefix + window.location.pathname;
            }

            function readScopePreference() {
                var savedScope = safeGet(localStorage, STATE_KEYS.scope, null);
                if (savedScope === 'page' || savedScope === 'site') {
                    state.scope = savedScope;
                }
                if (scopeToggle) {
                    scopeToggle.checked = state.scope === 'site';
                }
            }

            function readDebugPreference() {
                var config = window.CFL_CONFIG || {};
                var debugKey = (config.storage_keys && config.storage_keys.settings_debug) || 'cflSettingsDebug';
                var defaultDebug = (config.defaults && config.defaults.settings_debug !== false) || true;
                var saved = safeGet(localStorage, debugKey, null);
                state.debug = saved === null ? defaultDebug : saved !== 'false';
                if (debugToggle) debugToggle.checked = state.debug;
            }

            function readFontPreference() {
                var config = window.CFL_CONFIG || {};
                var defaults = config.defaults || {};
                var defaultFont = defaults.font || 'default';
                var defaultTheme = defaults.theme || 'default';
                var storage = storageForScope(state.scope);
                var key = scopeKey(state.scope);
                var stored = safeParse(safeGet(storage, key, null), null);
                state.font = stored && stored.font && fonts[stored.font] ? stored.font : defaultFont;
                state.theme = stored && stored.theme && themes[stored.theme] ? stored.theme : defaultTheme;
                if (fontSelect) fontSelect.value = state.font;
            }

            function applyFont() {
                // Load font if not already loaded (lazy loading)
                if (window.CFL && window.CFL.fonts && window.CFL.fonts.loadFont) {
                    window.CFL.fonts.loadFont(state.font);
                }

                var chosen = fonts[state.font] || fonts.default;
                var root = document.documentElement;
                root.style.setProperty('--font-heading', chosen.heading);
                root.style.setProperty('--font-body', chosen.body);
                root.style.setProperty('--font-ui', chosen.ui);
                logger('Applied font', state.font, 'scope', state.scope);
            }

            function updateActiveSwatch() {
                swatches.forEach(function(swatch) {
                    var t = swatch.getAttribute('data-theme');
                    swatch.classList.toggle('is-active', t === state.theme);
                });
            }

            function applyTheme() {
                var root = document.documentElement;
                // Reset to defaults first
                root.style.removeProperty('--accent');
                root.style.removeProperty('--accent-hover');
                root.style.removeProperty('--accent-secondary');
                root.style.removeProperty('--accent-secondary-hover');
                var chosen = themes[state.theme] || themes.default;
                Object.keys(chosen).forEach(function(key) {
                    root.style.setProperty(key, chosen[key]);
                });
                updateActiveSwatch();
                logger('Applied theme', state.theme, 'scope', state.scope);
            }

            function persist() {
                var storage = storageForScope(state.scope);
                var key = scopeKey(state.scope);
                safeSet(storage, key, JSON.stringify({ font: state.font, theme: state.theme }));
                safeSet(localStorage, STATE_KEYS.scope, state.scope);
                logger('Persisted settings', { scope: state.scope, font: state.font, theme: state.theme });
            }

            function resetCurrentScope() {
                var storage = storageForScope(state.scope);
                safeRemove(storage, scopeKey(state.scope));
                var config = window.CFL_CONFIG || {};
                var defaults = config.defaults || {};
                state.font = defaults.font || 'default';
                state.theme = defaults.theme || 'default';
                if (fontSelect) fontSelect.value = state.font;
                applyFont();
                applyTheme();
                persist();
                logger('Reset settings for scope', state.scope);
            }

            function dismissSettings() {
                closePanels();
                settings.classList.add('cfl-settings--hidden');
                safeSet(localStorage, STATE_KEYS.hidden, 'true');
                if (navSettingsBtn) {
                    navSettingsBtn.classList.add('cfl-nav-settings--active');
                }
                logger('Settings widget dismissed');
            }

            function showSettings() {
                settings.classList.remove('cfl-settings--hidden');
                safeRemove(localStorage, STATE_KEYS.hidden);
                if (navSettingsBtn) {
                    navSettingsBtn.classList.remove('cfl-nav-settings--active');
                }
                logger('Settings widget shown');
            }

            function checkHiddenState() {
                var isHidden = safeGet(localStorage, STATE_KEYS.hidden, 'false') === 'true';
                if (isHidden) {
                    settings.classList.add('cfl-settings--hidden');
                    if (navSettingsBtn) {
                        navSettingsBtn.classList.add('cfl-nav-settings--active');
                    }
                }
            }

            function openOrbitOnly() {
                state.openPanel = null;
                settings.classList.add('cfl-settings--open');
                fab.setAttribute('aria-expanded', 'true');
                panels.forEach(function(panel) { panel.setAttribute('hidden', ''); });
                settings.removeAttribute('data-open-panel');
                if (scrim) scrim.setAttribute('hidden', '');

                // Show labels briefly so users learn what icons do
                settings.classList.add('cfl-settings--labels-visible');
                setTimeout(function() {
                    settings.classList.remove('cfl-settings--labels-visible');
                }, 2000);
            }

            function openPanel(panelId) {
                state.openPanel = panelId;
                settings.classList.add('cfl-settings--open');
                fab.setAttribute('aria-expanded', 'true');
                panels.forEach(function(panel) {
                    var active = panel.getAttribute('data-panel') === panelId;
                    panel.toggleAttribute('hidden', !active);
                });
                settings.setAttribute('data-open-panel', panelId);
                if (scrim) scrim.removeAttribute('hidden');

                // Lazy load all optional fonts when fonts panel is opened
                // This ensures fonts are available when user browses the dropdown
                if (panelId === 'fonts' && window.CFL && window.CFL.fonts && window.CFL.fonts.loadAllOptionalFonts) {
                    window.CFL.fonts.loadAllOptionalFonts();
                }
            }

            function closePanels() {
                state.openPanel = null;
                settings.classList.remove('cfl-settings--open');
                fab.setAttribute('aria-expanded', 'false');
                panels.forEach(function(panel) {
                    panel.setAttribute('hidden', '');
                });
                settings.removeAttribute('data-open-panel');
                if (scrim) scrim.setAttribute('hidden', '');
            }

            function togglePanels(panelId) {
                if (state.openPanel === panelId) {
                    closePanels();
                } else {
                    openPanel(panelId);
                }
            }

            // Event wiring
            if (fab) {
                fab.addEventListener('click', function() {
                    if (settings.classList.contains('cfl-settings--open') && !state.openPanel) {
                        closePanels();
                    } else if (settings.classList.contains('cfl-settings--open') && state.openPanel) {
                        openOrbitOnly();
                    } else {
                        openOrbitOnly();
                    }
                });
            }

            function positionOrbitButtons() {
                if (!orbitButtons.length) return;
                // Read CSS variable for orbit radius, fallback to 90
                var computedStyle = getComputedStyle(settings);
                var cssRadius = parseInt(computedStyle.getPropertyValue('--orbit-radius')) || 90;
                var radius = cssRadius;
                // Quarter circle from bottom-right: -90° (up) to -180° (left)
                var startDeg = -90;
                var endDeg = -180;
                var steps = orbitButtons.length > 1 ? orbitButtons.length - 1 : 1;
                orbitButtons.forEach(function(btn, index) {
                    var angleDeg = startDeg + ((endDeg - startDeg) * (index / steps));
                    var angleRad = angleDeg * (Math.PI / 180);
                    var tx = Math.cos(angleRad) * radius;
                    var ty = Math.sin(angleRad) * radius;
                    btn.style.setProperty('--tx', tx.toFixed(2) + 'px');
                    btn.style.setProperty('--ty', ty.toFixed(2) + 'px');
                });
            }

            positionOrbitButtons();
            // Reposition on resize to handle responsive breakpoint changes
            window.addEventListener('resize', positionOrbitButtons);

            orbitButtons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    var panelId = e.currentTarget.getAttribute('data-panel');
                    var action = e.currentTarget.getAttribute('data-action');

                    if (action === 'quick-font') {
                        var quickFont = e.currentTarget.getAttribute('data-font');
                        if (fonts[quickFont]) {
                            state.font = quickFont;
                            if (fontSelect) fontSelect.value = quickFont;
                            applyFont();
                            persist();
                            logger('Quick font applied from orbit', quickFont);
                        }
                        return;
                    }

                    if (panelId) {
                        openPanel(panelId);
                    }
                });
            });

            // Old settings menu items handler removed - now using inline controls
            // that keep the menu open for live preview (see createUnifiedFabBar)

            if (fontSelect) {
                fontSelect.addEventListener('change', function(e) {
                    state.font = e.target.value;
                    applyFont();
                    applyTheme();
                    persist();
                });
            }

            if (scopeToggle) {
                scopeToggle.addEventListener('change', function(e) {
                    state.scope = e.target.checked ? 'site' : 'page';
                    readFontPreference();
                    applyFont();
                    applyTheme();
                    persist();
                });
            }

            if (debugToggle) {
                debugToggle.addEventListener('change', function(e) {
                    state.debug = e.target.checked;
                    var config = window.CFL_CONFIG || {};
                    var debugKey = (config.storage_keys && config.storage_keys.settings_debug) || 'cflSettingsDebug';
                    safeSet(localStorage, debugKey, state.debug ? 'true' : 'false');
                    if (state.debug) {
                        logger('Debug logging enabled');
                    } else {
                        console.info('[CFL settings] Debug logging disabled');
                    }
                });
            }

            if (resetButton) {
                resetButton.addEventListener('click', function() {
                    resetCurrentScope();
                });
            }

            if (scrim) {
                scrim.addEventListener('click', function() {
                    closePanels();
                });
            }

            if (dismissBtn) {
                dismissBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dismissSettings();
                });
            }

            if (navSettingsBtn) {
                navSettingsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (settings.classList.contains('cfl-settings--hidden')) {
                        showSettings();
                        // Open the menu after showing
                        setTimeout(function() {
                            openOrbitOnly();
                        }, 100);
                    } else {
                        // Toggle the menu
                        if (settings.classList.contains('cfl-settings--open')) {
                            closePanels();
                        } else {
                            openOrbitOnly();
                        }
                    }
                });
            }

            swatches.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    var theme = e.currentTarget.getAttribute('data-theme');
                    if (themes[theme]) {
                        state.theme = theme;
                        swatches.forEach(function(s) { s.classList.toggle('is-active', s === btn); });
                        applyTheme();
                        persist();
                        logger('Theme changed', theme);
                    }
                });
            });

            document.addEventListener('click', function(event) {
                // Don't close if click was inside the old settings widget OR the new dropdown menu
                var newSettingsMenu = document.getElementById('cfl-settings-menu');
                if (!settings.contains(event.target) && (!newSettingsMenu || !newSettingsMenu.contains(event.target))) {
                    closePanels();
                }
            });

            document.addEventListener('keyup', function(event) {
                if (event.key === 'Escape') {
                    closePanels();
                }
            });

            window.addEventListener('pagehide', function() {
                safeRemove(sessionStorage, scopeKey('page'));
            });

            // Expose global API for inline settings menu
            window.CFL = window.CFL || {};
            window.CFL.setFont = function(fontKey) {
                if (fonts[fontKey]) {
                    state.font = fontKey;
                    // Sync all font selects
                    if (fontSelect) fontSelect.value = fontKey;
                    var inlineFontSelect = document.getElementById('cfl-inline-font-select');
                    if (inlineFontSelect) inlineFontSelect.value = fontKey;
                    var drawerFontSelect = document.getElementById('cfl-drawer-font-select');
                    if (drawerFontSelect) drawerFontSelect.value = fontKey;
                    applyFont();
                    persist();
                    logger('Font set via API:', fontKey);
                }
            };
            window.CFL.setTheme = function(themeKey) {
                if (themes[themeKey]) {
                    state.theme = themeKey;
                    applyTheme();
                    persist();
                    logger('Theme set via API:', themeKey);
                }
            };
            window.CFL.resetSettings = function() {
                resetCurrentScope();
            };

            // Init
            checkHiddenState();
            readScopePreference();
            readDebugPreference();
            readFontPreference();
            applyFont();
            applyTheme();
            persist();
            logger('Settings widget initialized', state);

            // Sync all font selects with current state
            var inlineFontSelect = document.getElementById('cfl-inline-font-select');
            if (inlineFontSelect) {
                inlineFontSelect.value = state.font;
            }
            var drawerFontSelect = document.getElementById('cfl-drawer-font-select');
            if (drawerFontSelect) {
                drawerFontSelect.value = state.font;
            }
        })();
    });
