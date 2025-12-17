/**
 * Super Block Invaders Pong - Configuration
 * All game constants and settings
 */

const SBIP_CONFIG = {
    // Canvas
    WIDTH: 800,
    HEIGHT: 500,

    // Paddle
    PADDLE_WIDTH: 12,
    PADDLE_HEIGHT: 80,
    PADDLE_SPEED: 7,
    PADDLE_MARGIN: 25,

    // Ball
    BALL_RADIUS: 8,
    BALL_BASE_SPEED: 5,
    BALL_MAX_SPEED: 12,

    // Bricks
    BRICK_ROWS: 5,
    BRICK_COLS: 4,
    BRICK_WIDTH: 25,
    BRICK_HEIGHT: 15,
    BRICK_GAP: 3,
    BRICK_MARGIN: 60, // Distance from paddle

    // Brick types
    BRICK_TYPES: {
        NORMAL: { health: 1, color: '#4CAF50', points: 100 },
        STRONG: { health: 2, color: '#FF9800', points: 200 },
        SUPER: { health: 3, color: '#F44336', points: 300 },
        INDESTRUCTIBLE: { health: Infinity, color: '#607D8B', points: 0 }
    },

    // Invaders
    INVADER_ROWS: 2,
    INVADER_COLS: 6,
    INVADER_SIZE: 28,
    INVADER_GAP: 15,
    INVADER_SPEED: 0.8,
    INVADER_DROP: 20,
    INVADER_SHOOT_CHANCE: 0.008, // Per invader per frame

    // Invader types
    INVADER_TYPES: {
        BASIC: { emoji: '👾', health: 1, points: 150, shootChance: 0.008 },
        FAST: { emoji: '👻', health: 1, points: 200, shootChance: 0.012 },
        TANK: { emoji: '🤖', health: 3, points: 400, shootChance: 0.005 },
        BOSS: { emoji: '👹', health: 10, points: 1000, shootChance: 0.02, size: 50 }
    },

    // Lasers
    LASER_WIDTH: 4,
    LASER_HEIGHT: 15,
    LASER_SPEED: 6,

    // Powerups
    POWERUP_SIZE: 20,
    POWERUP_SPEED: 2,
    POWERUP_DROP_CHANCE: 0.25, // 25% chance when destroying brick/invader

    // Powerup types
    POWERUP_TYPES: {
        LIFE: { emoji: '❤️', duration: 0, description: '+1 Life' },
        EXTEND: { emoji: '📏', duration: 15000, description: 'Big Paddle' },
        SHIELD: { emoji: '🛡️', duration: 0, description: 'Block 1 Hit' },
        LASER: { emoji: '🔫', duration: 10000, description: 'Shoot Lasers' },
        SPEED: { emoji: '⚡', duration: 0, description: 'Speed Ball' },
        MULTI: { emoji: '🌟', duration: 0, description: 'Multi-Ball' },
        MAGNET: { emoji: '🧲', duration: 0, description: 'Catch Ball' },
        FIRE: { emoji: '🔥', duration: 5000, description: 'Fire Ball' },
        SLOW: { emoji: '🐢', duration: 8000, description: 'Slow Motion' },
        POINTS: { emoji: '💎', duration: 0, description: '+500 Points' }
    },

    // Lives
    STARTING_LIVES: 3,
    MAX_LIVES: 5,

    // Scoring
    POINTS_POWERUP: 50,
    POINTS_WAVE_CLEAR: 1000,
    COMBO_TIMEOUT: 2000, // ms before combo resets
    COMBO_MULTIPLIER: 0.25, // Each combo adds 25% to base points

    // Waves
    WAVES: [
        { invaderRows: 2, invaderCols: 5, brickPattern: 'normal', speed: 1 },
        { invaderRows: 2, invaderCols: 6, brickPattern: 'mixed', speed: 1.1 },
        { invaderRows: 3, invaderCols: 5, brickPattern: 'mixed', speed: 1.2 },
        { invaderRows: 3, invaderCols: 6, brickPattern: 'strong', speed: 1.3 },
        { invaderRows: 3, invaderCols: 6, brickPattern: 'strong', speed: 1.4, boss: true }
    ],

    // Colors
    COLORS: {
        BACKGROUND: '#0a0a1a',
        PADDLE_PLAYER: '#00ff88',
        PADDLE_CPU: '#ff4488',
        BALL: '#ffffff',
        BALL_FIRE: '#ff6600',
        NET: '#333355',
        LASER_ENEMY: '#ff0000',
        LASER_PLAYER: '#00ffff',
        TEXT: '#ffffff',
        STARS: '#ffffff'
    },

    // Particles
    PARTICLE_COUNT: 15,
    PARTICLE_LIFE: 500,

    // Screen shake
    SHAKE_INTENSITY: 5,
    SHAKE_DURATION: 100
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.SBIP_CONFIG = SBIP_CONFIG;
}

// ES6 export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SBIP_CONFIG;
}
