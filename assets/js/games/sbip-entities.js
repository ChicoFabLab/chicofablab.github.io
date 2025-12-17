/**
 * Super Block Invaders Pong - Entities
 * Game object classes
 */

// ===========================================
// PADDLE
// ===========================================
class Paddle {
    constructor(x, y, isPlayer = true) {
        this.x = x;
        this.y = y;
        this.width = SBIP_CONFIG.PADDLE_WIDTH;
        this.height = SBIP_CONFIG.PADDLE_HEIGHT;
        this.baseHeight = SBIP_CONFIG.PADDLE_HEIGHT;
        this.speed = SBIP_CONFIG.PADDLE_SPEED;
        this.dy = 0;
        this.isPlayer = isPlayer;
        this.hasShield = false;
        this.hasLaser = false;
        this.hasMagnet = false;
        this.magnetBall = null;
        this.extended = false;
    }

    extend() {
        this.extended = true;
        this.height = this.baseHeight * 1.5;
        this.y -= (this.height - this.baseHeight) / 2;
    }

    resetSize() {
        this.extended = false;
        this.y += (this.height - this.baseHeight) / 2;
        this.height = this.baseHeight;
    }

    update(canvasHeight, targetY = null) {
        if (this.isPlayer) {
            // Player controlled
            this.y += this.dy;
        } else if (targetY !== null) {
            // AI controlled
            const center = this.y + this.height / 2;
            const diff = targetY - center;
            const aiSpeed = this.speed * 0.7; // Slightly slower than player

            if (Math.abs(diff) > 20) {
                this.y += Math.sign(diff) * aiSpeed;
            }
        }

        // Keep in bounds
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
    }

    getCenter() {
        return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    }
}

// ===========================================
// BALL
// ===========================================
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = SBIP_CONFIG.BALL_RADIUS;
        this.speed = SBIP_CONFIG.BALL_BASE_SPEED;
        this.vx = 0;
        this.vy = 0;
        this.isFireBall = false;
        this.trail = []; // For visual trail effect
        this.active = true;
    }

    launch(direction = 1) {
        const angle = (Math.random() - 0.5) * Math.PI / 3;
        this.vx = direction * this.speed * Math.cos(angle);
        this.vy = this.speed * Math.sin(angle);
    }

    update() {
        if (!this.active) return;

        // Store trail position
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;
    }

    bounceY() {
        this.vy *= -1;
    }

    bounceOffPaddle(paddle) {
        const hitPos = (this.y - paddle.y) / paddle.height;
        const angle = (hitPos - 0.5) * Math.PI / 3;
        const direction = paddle.isPlayer ? 1 : -1;

        this.speed = Math.min(this.speed + 0.15, SBIP_CONFIG.BALL_MAX_SPEED);
        this.vx = direction * Math.abs(this.speed * Math.cos(angle));
        this.vy = this.speed * Math.sin(angle);

        // Move ball outside paddle
        this.x = paddle.isPlayer
            ? paddle.x + paddle.width + this.radius
            : paddle.x - this.radius;
    }

    setFire(enabled) {
        this.isFireBall = enabled;
    }

    speedUp() {
        this.speed = Math.min(this.speed + 2, SBIP_CONFIG.BALL_MAX_SPEED);
        const ratio = this.speed / Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.vx *= ratio;
        this.vy *= ratio;
    }
}

// ===========================================
// BRICK
// ===========================================
class Brick {
    constructor(x, y, type = 'NORMAL') {
        this.x = x;
        this.y = y;
        this.width = SBIP_CONFIG.BRICK_WIDTH;
        this.height = SBIP_CONFIG.BRICK_HEIGHT;
        this.type = type;
        this.health = SBIP_CONFIG.BRICK_TYPES[type].health;
        this.maxHealth = this.health;
        this.color = SBIP_CONFIG.BRICK_TYPES[type].color;
        this.points = SBIP_CONFIG.BRICK_TYPES[type].points;
        this.active = true;
        this.hitFlash = 0;
    }

    hit() {
        if (this.type === 'INDESTRUCTIBLE') {
            this.hitFlash = 1;
            return false;
        }

        this.health--;
        this.hitFlash = 1;

        if (this.health <= 0) {
            this.active = false;
            return true; // Destroyed
        }
        return false;
    }

    update() {
        if (this.hitFlash > 0) {
            this.hitFlash -= 0.1;
        }
    }

    getColor() {
        if (this.hitFlash > 0) {
            return '#ffffff';
        }
        // Darken based on damage
        const healthRatio = this.health / this.maxHealth;
        return this.color;
    }
}

// ===========================================
// INVADER
// ===========================================
class Invader {
    constructor(x, y, type = 'BASIC') {
        this.x = x;
        this.y = y;
        this.type = type;
        const config = SBIP_CONFIG.INVADER_TYPES[type];
        this.emoji = config.emoji;
        this.health = config.health;
        this.maxHealth = config.health;
        this.points = config.points;
        this.shootChance = config.shootChance;
        this.size = config.size || SBIP_CONFIG.INVADER_SIZE;
        this.active = true;
        this.hitFlash = 0;
        this.bobOffset = Math.random() * Math.PI * 2;
    }

    hit(damage = 1) {
        this.health -= damage;
        this.hitFlash = 1;

        if (this.health <= 0) {
            this.active = false;
            return true;
        }
        return false;
    }

    update(time) {
        if (this.hitFlash > 0) {
            this.hitFlash -= 0.1;
        }
        // Bob up and down
        this.bobY = Math.sin(time * 0.003 + this.bobOffset) * 3;
    }

    shouldShoot() {
        return Math.random() < this.shootChance;
    }
}

// ===========================================
// LASER
// ===========================================
class Laser {
    constructor(x, y, direction, isEnemy = true) {
        this.x = x;
        this.y = y;
        this.width = SBIP_CONFIG.LASER_WIDTH;
        this.height = SBIP_CONFIG.LASER_HEIGHT;
        this.speed = SBIP_CONFIG.LASER_SPEED;
        this.direction = direction; // -1 = left, 1 = right
        this.isEnemy = isEnemy;
        this.active = true;
    }

    update() {
        this.x += this.speed * this.direction;
    }
}

// ===========================================
// POWERUP
// ===========================================
class Powerup {
    constructor(x, y, type = null) {
        this.x = x;
        this.y = y;
        this.size = SBIP_CONFIG.POWERUP_SIZE;
        this.speed = SBIP_CONFIG.POWERUP_SPEED;

        // Random type if not specified
        if (!type) {
            const types = Object.keys(SBIP_CONFIG.POWERUP_TYPES);
            type = types[Math.floor(Math.random() * types.length)];
        }

        this.type = type;
        const config = SBIP_CONFIG.POWERUP_TYPES[type];
        this.emoji = config.emoji;
        this.duration = config.duration;
        this.description = config.description;
        this.active = true;
        this.direction = Math.random() > 0.5 ? 1 : -1; // Random horizontal movement
        this.vy = this.speed;
        this.vx = (Math.random() - 0.5) * 2;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.glow = 0;
    }

    update(time) {
        this.y += this.vy;
        this.x += this.vx;

        // Bounce off top/bottom
        // Bob effect
        this.glow = (Math.sin(time * 0.01 + this.bobOffset) + 1) / 2;
    }
}

// ===========================================
// PARTICLE
// ===========================================
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.color = color;
        this.life = 1;
        this.decay = 0.02 + Math.random() * 0.02;
        this.size = 2 + Math.random() * 4;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
    }

    isAlive() {
        return this.life > 0;
    }
}

// ===========================================
// STAR (background)
// ===========================================
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2;
        this.speed = 0.1 + Math.random() * 0.3;
        this.brightness = Math.random();
        this.twinkleSpeed = 0.02 + Math.random() * 0.03;
    }

    update(time) {
        this.brightness = (Math.sin(time * this.twinkleSpeed) + 1) / 2;
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.SBIP_Entities = {
        Paddle,
        Ball,
        Brick,
        Invader,
        Laser,
        Powerup,
        Particle,
        Star
    };
}
