/**
 * Super Block Invaders Pong - Main Game Engine
 * Core game logic and state management
 */

class SBIPGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new SBIPRenderer(canvas);
        this.W = SBIP_CONFIG.WIDTH;
        this.H = SBIP_CONFIG.HEIGHT;

        // Game state
        this.state = 'idle'; // idle, playing, paused, waveComplete, gameOver, victory
        this.time = 0;

        // Entities
        this.player = null;
        this.cpu = null;
        this.balls = [];
        this.playerBricks = [];
        this.cpuBricks = [];
        this.invaders = [];
        this.lasers = [];
        this.powerups = [];
        this.particles = [];
        this.stars = [];

        // Game stats
        this.playerLives = SBIP_CONFIG.STARTING_LIVES;
        this.cpuLives = SBIP_CONFIG.STARTING_LIVES;
        this.score = 0;
        this.wave = 1;
        this.combo = 0;
        this.comboTimer = 0;
        this.highScore = this.loadHighScore();

        // Active powerup effects
        this.activePowerups = {};

        // Invader movement
        this.invaderDirection = 1;
        this.invaderMoveTimer = 0;

        // Input state
        this.keys = {};

        // Wave announcement
        this.waveAnnounceTime = 0;
        this.showWaveAnnounce = false;

        // Initialize
        this.init();
    }

    // ===========================================
    // INITIALIZATION
    // ===========================================

    init() {
        // Create stars
        for (let i = 0; i < 100; i++) {
            this.stars.push(new SBIP_Entities.Star(this.W, this.H));
        }

        // Setup input
        this.setupInput();

        // Initial render
        this.render();
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Pause toggle
            if ((e.key === ' ' || e.key === 'p' || e.key === 'P') && this.state === 'playing') {
                e.preventDefault();
                this.togglePause();
            }

            // Shoot laser (when powerup active)
            if (e.key === ' ' && this.player && this.player.hasLaser && this.state === 'playing') {
                e.preventDefault();
                this.shootPlayerLaser();
            }

            // Prevent scrolling
            if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    // ===========================================
    // GAME CONTROL
    // ===========================================

    start() {
        if (this.state !== 'idle' && this.state !== 'gameOver' && this.state !== 'victory') return;

        this.resetGame();
        this.state = 'playing';
        this.showWaveAnnouncement();

        if (window.CFL && CFL.sounds) CFL.sounds.whoosh();
        if (window.CFL && CFL.toast) {
            CFL.toast({
                icon: '🚀',
                title: 'SUPER BLOCK INVADERS PONG!',
                message: 'Destroy the enemy wall! Watch out for invaders!',
                variant: 'info',
                iconAnim: 'bounce'
            });
        }
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
        } else if (this.state === 'paused') {
            this.state = 'playing';
        }
    }

    resetGame() {
        // Reset stats
        this.playerLives = SBIP_CONFIG.STARTING_LIVES;
        this.cpuLives = SBIP_CONFIG.STARTING_LIVES;
        this.score = 0;
        this.wave = 1;
        this.combo = 0;
        this.comboTimer = 0;
        this.activePowerups = {};

        // Reset entities
        this.setupWave();
    }

    setupWave() {
        // Create paddles
        this.player = new SBIP_Entities.Paddle(
            SBIP_CONFIG.PADDLE_MARGIN,
            this.H / 2 - SBIP_CONFIG.PADDLE_HEIGHT / 2,
            true
        );

        this.cpu = new SBIP_Entities.Paddle(
            this.W - SBIP_CONFIG.PADDLE_MARGIN - SBIP_CONFIG.PADDLE_WIDTH,
            this.H / 2 - SBIP_CONFIG.PADDLE_HEIGHT / 2,
            false
        );

        // Reset balls
        this.balls = [];
        this.spawnBall();

        // Clear other entities
        this.lasers = [];
        this.powerups = [];
        this.particles = [];

        // Setup bricks
        this.setupBricks();

        // Setup invaders
        this.setupInvaders();

        // Reset invader movement
        this.invaderDirection = 1;
        this.invaderMoveTimer = 0;
    }

    setupBricks() {
        this.playerBricks = [];
        this.cpuBricks = [];

        const waveConfig = SBIP_CONFIG.WAVES[Math.min(this.wave - 1, SBIP_CONFIG.WAVES.length - 1)];
        const pattern = waveConfig.brickPattern;

        const brickW = SBIP_CONFIG.BRICK_WIDTH;
        const brickH = SBIP_CONFIG.BRICK_HEIGHT;
        const gap = SBIP_CONFIG.BRICK_GAP;
        const rows = SBIP_CONFIG.BRICK_ROWS;
        const cols = SBIP_CONFIG.BRICK_COLS;

        // Player side bricks (right of player paddle)
        const playerStartX = SBIP_CONFIG.PADDLE_MARGIN + SBIP_CONFIG.PADDLE_WIDTH + SBIP_CONFIG.BRICK_MARGIN;
        const playerStartY = (this.H - (rows * brickH + (rows - 1) * gap)) / 2;

        // CPU side bricks (left of CPU paddle)
        const cpuStartX = this.W - SBIP_CONFIG.PADDLE_MARGIN - SBIP_CONFIG.PADDLE_WIDTH - SBIP_CONFIG.BRICK_MARGIN - (cols * brickW + (cols - 1) * gap);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const type = this.getBrickType(row, col, pattern);

                // Player side
                const px = playerStartX + col * (brickW + gap);
                const py = playerStartY + row * (brickH + gap);
                this.playerBricks.push(new SBIP_Entities.Brick(px, py, type));

                // CPU side
                const cx = cpuStartX + col * (brickW + gap);
                const cy = playerStartY + row * (brickH + gap);
                this.cpuBricks.push(new SBIP_Entities.Brick(cx, cy, type));
            }
        }
    }

    getBrickType(row, col, pattern) {
        switch (pattern) {
            case 'normal':
                return 'NORMAL';
            case 'mixed':
                if ((row + col) % 3 === 0) return 'STRONG';
                return 'NORMAL';
            case 'strong':
                if (row === 0 || row === SBIP_CONFIG.BRICK_ROWS - 1) return 'SUPER';
                if ((row + col) % 2 === 0) return 'STRONG';
                return 'NORMAL';
            default:
                return 'NORMAL';
        }
    }

    setupInvaders() {
        this.invaders = [];

        const waveConfig = SBIP_CONFIG.WAVES[Math.min(this.wave - 1, SBIP_CONFIG.WAVES.length - 1)];
        const rows = waveConfig.invaderRows;
        const cols = waveConfig.invaderCols;

        const invaderSize = SBIP_CONFIG.INVADER_SIZE;
        const gap = SBIP_CONFIG.INVADER_GAP;

        const totalW = cols * invaderSize + (cols - 1) * gap;
        const totalH = rows * invaderSize + (rows - 1) * gap;
        const startX = (this.W - totalW) / 2 + invaderSize / 2;
        const startY = 60 + invaderSize / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * (invaderSize + gap);
                const y = startY + row * (invaderSize + gap);

                // Determine invader type
                let type = 'BASIC';
                if (row === 0 && this.wave >= 3) type = 'FAST';
                if (row === rows - 1 && this.wave >= 4) type = 'TANK';

                this.invaders.push(new SBIP_Entities.Invader(x, y, type));
            }
        }

        // Add boss for boss waves
        if (waveConfig.boss) {
            const boss = new SBIP_Entities.Invader(this.W / 2, this.H / 2, 'BOSS');
            this.invaders.push(boss);
        }
    }

    spawnBall(x = null, y = null, vx = null, vy = null) {
        const ball = new SBIP_Entities.Ball(
            x || this.W / 2,
            y || this.H / 2
        );

        if (vx !== null && vy !== null) {
            ball.vx = vx;
            ball.vy = vy;
        } else {
            ball.launch(Math.random() > 0.5 ? 1 : -1);
        }

        this.balls.push(ball);
        return ball;
    }

    // ===========================================
    // GAME LOOP
    // ===========================================

    update(deltaTime) {
        this.time += deltaTime;

        // Update stars
        this.stars.forEach(s => s.update(this.time));

        // Update shake
        this.renderer.updateShake();

        if (this.state !== 'playing') return;

        // Update combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }

        // Check powerup timers
        this.updatePowerupTimers();

        // Player input
        this.handleInput();

        // Update paddles
        this.player.update(this.H);

        // CPU AI - track closest ball
        const closestBall = this.getClosestBallToCPU();
        this.cpu.update(this.H, closestBall ? closestBall.y : this.H / 2);

        // Update balls
        this.balls.forEach(ball => {
            if (!ball.active) return;
            ball.update();
            this.handleBallCollisions(ball);
        });

        // Remove inactive balls
        this.balls = this.balls.filter(b => b.active);

        // If no balls, spawn new one and lose life
        if (this.balls.length === 0) {
            // Ball was lost - but we handle life loss in collision detection
            this.spawnBall();
        }

        // Update invaders
        this.updateInvaders();

        // Update lasers
        this.lasers.forEach(laser => {
            laser.update();
            this.handleLaserCollisions(laser);
        });
        this.lasers = this.lasers.filter(l => l.active);

        // Update powerups
        this.powerups.forEach(p => {
            p.update(this.time);
            this.handlePowerupCollection(p);
        });
        this.powerups = this.powerups.filter(p => p.active && p.y < this.H + 50);

        // Update particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.isAlive());

        // Update bricks
        this.playerBricks.forEach(b => b.update());
        this.cpuBricks.forEach(b => b.update());

        // Check win conditions
        this.checkWinConditions();
    }

    handleInput() {
        this.player.dy = 0;

        if (this.keys['w'] || this.keys['W'] || this.keys['ArrowUp']) {
            this.player.dy = -this.player.speed;
        }
        if (this.keys['s'] || this.keys['S'] || this.keys['ArrowDown']) {
            this.player.dy = this.player.speed;
        }
    }

    // ===========================================
    // COLLISION DETECTION
    // ===========================================

    handleBallCollisions(ball) {
        // Wall collisions (top/bottom)
        if (ball.y - ball.radius < 40 || ball.y + ball.radius > this.H) {
            ball.bounceY();
            ball.y = ball.y < this.H / 2 ? 40 + ball.radius : this.H - ball.radius;
            if (window.CFL && CFL.sounds) CFL.sounds.pop();
        }

        // Player paddle collision
        if (this.rectCircleCollision(this.player, ball)) {
            ball.bounceOffPaddle(this.player);

            // Release magnet ball
            if (this.player.magnetBall === ball) {
                this.player.magnetBall = null;
                this.player.hasMagnet = false;
            }

            if (window.CFL && CFL.sounds) CFL.sounds.click();
        }

        // CPU paddle collision
        if (this.rectCircleCollision(this.cpu, ball)) {
            ball.bounceOffPaddle(this.cpu);
            if (window.CFL && CFL.sounds) CFL.sounds.click();
        }

        // Player bricks collision
        this.playerBricks.forEach(brick => {
            if (!brick.active) return;
            if (this.rectCircleCollision(brick, ball)) {
                const destroyed = brick.hit();

                if (!ball.isFireBall) {
                    // Bounce off brick
                    const fromLeft = ball.vx > 0;
                    const fromTop = ball.vy > 0;

                    // Simple bounce logic
                    ball.vx *= -1;
                }

                if (destroyed) {
                    this.onBrickDestroyed(brick, true);
                } else {
                    if (window.CFL && CFL.sounds) CFL.sounds.pop();
                }
            }
        });

        // CPU bricks collision
        this.cpuBricks.forEach(brick => {
            if (!brick.active) return;
            if (this.rectCircleCollision(brick, ball)) {
                const destroyed = brick.hit();

                if (!ball.isFireBall) {
                    ball.vx *= -1;
                }

                if (destroyed) {
                    this.onBrickDestroyed(brick, false);
                } else {
                    if (window.CFL && CFL.sounds) CFL.sounds.pop();
                }
            }
        });

        // Invader collision
        this.invaders.forEach(invader => {
            if (!invader.active) return;
            if (this.circleCircleCollision(ball, { x: invader.x, y: invader.y, radius: invader.size / 2 })) {
                const destroyed = invader.hit(ball.isFireBall ? 3 : 1);

                if (!ball.isFireBall) {
                    ball.vx *= -1;
                    ball.vy *= -1;
                }

                if (destroyed) {
                    this.onInvaderDestroyed(invader);
                } else {
                    if (window.CFL && CFL.sounds) CFL.sounds.pop();
                    this.spawnParticles(invader.x, invader.y, '#ff6600', 5);
                }
            }
        });

        // Ball out of bounds
        if (ball.x < 0) {
            // Ball passed player - player loses life
            ball.active = false;
            this.playerLosesLife();
        } else if (ball.x > this.W) {
            // Ball passed CPU - CPU loses life
            ball.active = false;
            this.cpuLosesLife();
        }
    }

    handleLaserCollisions(laser) {
        // Out of bounds
        if (laser.x < 0 || laser.x > this.W) {
            laser.active = false;
            return;
        }

        // Hit player paddle
        if (laser.isEnemy && laser.direction < 0) {
            if (this.rectRectCollision(laser, this.player)) {
                laser.active = false;

                if (this.player.hasShield) {
                    this.player.hasShield = false;
                    this.spawnParticles(laser.x, laser.y, '#00ffff', 10);
                    if (window.CFL && CFL.sounds) CFL.sounds.pop();
                } else {
                    this.playerLosesLife();
                }
            }
        }

        // Hit CPU paddle
        if (laser.isEnemy && laser.direction > 0) {
            if (this.rectRectCollision(laser, this.cpu)) {
                laser.active = false;
                this.cpuLosesLife();
            }
        }

        // Player laser hits invaders
        if (!laser.isEnemy) {
            this.invaders.forEach(invader => {
                if (!invader.active) return;
                const invaderRect = {
                    x: invader.x - invader.size / 2,
                    y: invader.y - invader.size / 2,
                    width: invader.size,
                    height: invader.size
                };
                if (this.rectRectCollision(laser, invaderRect)) {
                    laser.active = false;
                    const destroyed = invader.hit(1);
                    if (destroyed) {
                        this.onInvaderDestroyed(invader);
                    }
                }
            });

            // Player laser hits CPU bricks
            this.cpuBricks.forEach(brick => {
                if (!brick.active) return;
                if (this.rectRectCollision(laser, brick)) {
                    laser.active = false;
                    const destroyed = brick.hit();
                    if (destroyed) {
                        this.onBrickDestroyed(brick, false);
                    }
                }
            });
        }
    }

    handlePowerupCollection(powerup) {
        if (!powerup.active) return;

        // Check collision with player paddle
        const dist = Math.hypot(powerup.x - (this.player.x + this.player.width / 2),
                               powerup.y - (this.player.y + this.player.height / 2));

        if (dist < powerup.size / 2 + this.player.height / 2) {
            this.collectPowerup(powerup);
            powerup.active = false;
        }
    }

    // Collision helpers
    rectCircleCollision(rect, circle) {
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        const dist = Math.hypot(circle.x - closestX, circle.y - closestY);
        return dist < circle.radius;
    }

    circleCircleCollision(c1, c2) {
        const dist = Math.hypot(c1.x - c2.x, c1.y - c2.y);
        return dist < c1.radius + c2.radius;
    }

    rectRectCollision(r1, r2) {
        return r1.x < r2.x + r2.width &&
               r1.x + r1.width > r2.x &&
               r1.y < r2.y + r2.height &&
               r1.y + r1.height > r2.y;
    }

    // ===========================================
    // INVADERS
    // ===========================================

    updateInvaders() {
        const waveConfig = SBIP_CONFIG.WAVES[Math.min(this.wave - 1, SBIP_CONFIG.WAVES.length - 1)];
        const speed = SBIP_CONFIG.INVADER_SPEED * waveConfig.speed;

        // Move invaders
        this.invaderMoveTimer++;
        if (this.invaderMoveTimer >= 2) {
            this.invaderMoveTimer = 0;

            let shouldDrop = false;

            this.invaders.forEach(invader => {
                if (!invader.active) return;
                invader.update(this.time);

                invader.x += this.invaderDirection * speed;

                // Check bounds
                if (invader.x < this.W * 0.25 || invader.x > this.W * 0.75) {
                    shouldDrop = true;
                }
            });

            if (shouldDrop) {
                this.invaderDirection *= -1;
                this.invaders.forEach(invader => {
                    if (!invader.active) return;
                    invader.y += SBIP_CONFIG.INVADER_DROP;
                });
            }
        }

        // Invader shooting
        this.invaders.forEach(invader => {
            if (!invader.active) return;
            if (invader.shouldShoot()) {
                this.invaderShoot(invader);
            }
        });
    }

    invaderShoot(invader) {
        // Shoot toward player or CPU randomly
        const direction = Math.random() > 0.5 ? -1 : 1;
        const laser = new SBIP_Entities.Laser(
            invader.x,
            invader.y + invader.size / 2,
            direction,
            true
        );
        this.lasers.push(laser);
    }

    shootPlayerLaser() {
        if (!this.player.hasLaser) return;

        const laser = new SBIP_Entities.Laser(
            this.player.x + this.player.width,
            this.player.y + this.player.height / 2,
            1,
            false
        );
        this.lasers.push(laser);

        if (window.CFL && CFL.sounds) CFL.sounds.whoosh();
    }

    // ===========================================
    // EVENTS
    // ===========================================

    onBrickDestroyed(brick, isPlayerSide) {
        this.addScore(brick.points);
        this.spawnParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color, 10);
        this.renderer.shake(3);

        // Maybe spawn powerup (only for CPU side bricks)
        if (!isPlayerSide && Math.random() < SBIP_CONFIG.POWERUP_DROP_CHANCE) {
            this.spawnPowerup(brick.x + brick.width / 2, brick.y + brick.height / 2);
        }

        if (window.CFL && CFL.sounds) CFL.sounds.coin();
    }

    onInvaderDestroyed(invader) {
        this.addScore(invader.points);
        this.spawnParticles(invader.x, invader.y, '#ff00ff', 15);
        this.renderer.shake(5);

        // Maybe spawn powerup
        if (Math.random() < SBIP_CONFIG.POWERUP_DROP_CHANCE * 1.5) {
            this.spawnPowerup(invader.x, invader.y);
        }

        if (window.CFL && CFL.sounds) CFL.sounds.success();
    }

    playerLosesLife() {
        this.playerLives--;
        this.renderer.shake(10);
        this.spawnParticles(this.player.x, this.player.y + this.player.height / 2, '#ff0000', 20);

        if (window.CFL && CFL.sounds) CFL.sounds.error();

        if (this.playerLives <= 0) {
            this.gameOver(false);
        }
    }

    cpuLosesLife() {
        this.cpuLives--;
        this.renderer.shake(8);
        this.spawnParticles(this.cpu.x, this.cpu.y + this.cpu.height / 2, '#ff4488', 20);

        if (window.CFL && CFL.sounds) CFL.sounds.coin();
        this.addScore(500);

        if (this.cpuLives <= 0) {
            this.checkWaveComplete();
        }
    }

    addScore(points) {
        const multiplier = 1 + this.combo * SBIP_CONFIG.COMBO_MULTIPLIER;
        const totalPoints = Math.floor(points * multiplier);
        this.score += totalPoints;

        // Update combo
        this.combo++;
        this.comboTimer = SBIP_CONFIG.COMBO_TIMEOUT;

        // High score
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    // ===========================================
    // POWERUPS
    // ===========================================

    spawnPowerup(x, y, type = null) {
        const powerup = new SBIP_Entities.Powerup(x, y, type);
        this.powerups.push(powerup);
    }

    collectPowerup(powerup) {
        const type = powerup.type;
        const config = SBIP_CONFIG.POWERUP_TYPES[type];

        this.addScore(SBIP_CONFIG.POINTS_POWERUP);
        this.spawnParticles(powerup.x, powerup.y, '#ffff00', 10);

        if (window.CFL && CFL.sounds) CFL.sounds.powerup();
        if (window.CFL && CFL.toast) {
            CFL.toast({
                icon: config.emoji,
                title: config.description,
                message: 'Power-up collected!',
                variant: 'success',
                iconAnim: 'bounce'
            });
        }

        switch (type) {
            case 'LIFE':
                this.playerLives = Math.min(this.playerLives + 1, SBIP_CONFIG.MAX_LIVES);
                break;

            case 'EXTEND':
                this.player.extend();
                this.activePowerups.EXTEND = { active: true, endTime: this.time + config.duration };
                break;

            case 'SHIELD':
                this.player.hasShield = true;
                this.activePowerups.SHIELD = { active: true };
                break;

            case 'LASER':
                this.player.hasLaser = true;
                this.activePowerups.LASER = { active: true, endTime: this.time + config.duration };
                break;

            case 'SPEED':
                this.balls.forEach(ball => ball.speedUp());
                break;

            case 'MULTI':
                // Split existing balls
                const newBalls = [];
                this.balls.forEach(ball => {
                    if (ball.active) {
                        newBalls.push(this.spawnBall(ball.x, ball.y, ball.vx, -ball.vy));
                        newBalls.push(this.spawnBall(ball.x, ball.y, -ball.vx, ball.vy));
                    }
                });
                break;

            case 'MAGNET':
                this.player.hasMagnet = true;
                this.activePowerups.MAGNET = { active: true };
                break;

            case 'FIRE':
                this.balls.forEach(ball => ball.setFire(true));
                this.activePowerups.FIRE = { active: true, endTime: this.time + config.duration };
                break;

            case 'SLOW':
                // Slow down invaders (handled in update)
                this.activePowerups.SLOW = { active: true, endTime: this.time + config.duration };
                break;

            case 'POINTS':
                this.addScore(500);
                break;
        }
    }

    updatePowerupTimers() {
        Object.entries(this.activePowerups).forEach(([type, data]) => {
            if (!data.active) return;

            if (data.endTime && this.time >= data.endTime) {
                // Powerup expired
                this.expirePowerup(type);
            }
        });
    }

    expirePowerup(type) {
        this.activePowerups[type] = { active: false };

        switch (type) {
            case 'EXTEND':
                this.player.resetSize();
                break;
            case 'LASER':
                this.player.hasLaser = false;
                break;
            case 'FIRE':
                this.balls.forEach(ball => ball.setFire(false));
                break;
        }
    }

    // ===========================================
    // WIN/LOSE CONDITIONS
    // ===========================================

    checkWinConditions() {
        // Player wins wave if all CPU bricks destroyed or CPU has no lives
        const cpuBricksRemaining = this.cpuBricks.filter(b => b.active && b.type !== 'INDESTRUCTIBLE').length;
        const invadersRemaining = this.invaders.filter(i => i.active).length;

        if (cpuBricksRemaining === 0 && invadersRemaining === 0) {
            this.checkWaveComplete();
        }

        // Player loses if all player bricks destroyed
        const playerBricksRemaining = this.playerBricks.filter(b => b.active && b.type !== 'INDESTRUCTIBLE').length;

        if (playerBricksRemaining === 0 || this.playerLives <= 0) {
            this.gameOver(false);
        }
    }

    checkWaveComplete() {
        this.addScore(SBIP_CONFIG.POINTS_WAVE_CLEAR);

        if (this.wave >= SBIP_CONFIG.WAVES.length) {
            // Victory!
            this.gameOver(true);
        } else {
            // Next wave
            this.wave++;
            this.cpuLives = SBIP_CONFIG.STARTING_LIVES;
            this.setupWave();
            this.showWaveAnnouncement();

            if (window.CFL && CFL.toast) {
                CFL.toast({
                    icon: '🌟',
                    title: `WAVE ${this.wave}!`,
                    message: 'Enemy reinforcements incoming!',
                    variant: 'info',
                    iconAnim: 'bounce'
                });
            }
        }
    }

    gameOver(isVictory) {
        this.state = isVictory ? 'victory' : 'gameOver';
        this.saveHighScore();

        if (isVictory) {
            if (window.CFL && CFL.sounds) CFL.sounds.success();
            if (window.CFL && CFL.achievements) CFL.achievements.unlock('sbip-master');
            if (window.CFL && CFL.toast) {
                CFL.toast({
                    icon: '🏆',
                    title: 'VICTORY!',
                    message: `Final Score: ${this.score.toLocaleString()}`,
                    variant: 'party',
                    iconAnim: 'bounce'
                });
            }
        } else {
            if (window.CFL && CFL.sounds) CFL.sounds.error();
            if (window.CFL && CFL.toast) {
                CFL.toast({
                    icon: '💀',
                    title: 'GAME OVER',
                    message: `Score: ${this.score.toLocaleString()}`,
                    variant: 'error'
                });
            }
        }
    }

    showWaveAnnouncement() {
        this.showWaveAnnounce = true;
        this.waveAnnounceTime = this.time + 2000;
    }

    // ===========================================
    // RENDERING
    // ===========================================

    render() {
        this.renderer.clear();

        // Stars
        this.renderer.drawStars(this.stars, this.time);

        // Net
        this.renderer.drawNet();

        // Bricks
        this.playerBricks.forEach(b => this.renderer.drawBrick(b));
        this.cpuBricks.forEach(b => this.renderer.drawBrick(b));

        // Invaders
        this.invaders.forEach(i => this.renderer.drawInvader(i, this.time));

        // Powerups
        this.powerups.forEach(p => this.renderer.drawPowerup(p, this.time));

        // Lasers
        this.lasers.forEach(l => this.renderer.drawLaser(l));

        // Paddles
        if (this.player) this.renderer.drawPaddle(this.player);
        if (this.cpu) this.renderer.drawPaddle(this.cpu);

        // Balls
        this.balls.forEach(b => this.renderer.drawBall(b));

        // Particles
        this.renderer.drawParticles(this.particles);

        // HUD
        this.renderer.drawHUD(this.playerLives, this.cpuLives, this.score, this.wave, this.combo);

        // Active powerups
        this.renderer.drawActivePowerups(this.activePowerups, this.time);

        // State messages
        if (this.state === 'idle') {
            this.renderer.drawMessage('SUPER BLOCK INVADERS PONG', 'Press START to play');
        } else if (this.state === 'paused') {
            this.renderer.drawMessage('PAUSED', 'Press SPACE to resume');
        } else if (this.state === 'gameOver') {
            this.renderer.drawMessage('GAME OVER', `Final Score: ${this.score.toLocaleString()}`);
        } else if (this.state === 'victory') {
            this.renderer.drawMessage('🏆 VICTORY! 🏆', `Final Score: ${this.score.toLocaleString()}`);
        }

        // Wave announcement
        if (this.showWaveAnnounce && this.time < this.waveAnnounceTime) {
            const waveConfig = SBIP_CONFIG.WAVES[Math.min(this.wave - 1, SBIP_CONFIG.WAVES.length - 1)];
            this.renderer.drawWaveAnnouncement(this.wave, waveConfig.boss);
        } else {
            this.showWaveAnnounce = false;
        }

        this.renderer.restore();
    }

    // ===========================================
    // HELPERS
    // ===========================================

    spawnParticles(x, y, color, count = SBIP_CONFIG.PARTICLE_COUNT) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new SBIP_Entities.Particle(x, y, color));
        }
    }

    getClosestBallToCPU() {
        let closest = null;
        let minDist = Infinity;

        this.balls.forEach(ball => {
            if (!ball.active || ball.vx < 0) return; // Only track balls moving toward CPU
            const dist = this.cpu.x - ball.x;
            if (dist > 0 && dist < minDist) {
                minDist = dist;
                closest = ball;
            }
        });

        return closest;
    }

    // ===========================================
    // SAVE/LOAD
    // ===========================================

    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('cflSBIPHighScore') || '0');
        } catch (e) {
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('cflSBIPHighScore', this.highScore.toString());
        } catch (e) {
            console.warn('Could not save high score');
        }
    }

    getLeaderboard() {
        try {
            return JSON.parse(localStorage.getItem('cflSBIPLeaderboard') || '[]');
        } catch (e) {
            return [];
        }
    }

    saveToLeaderboard(initials) {
        const leaderboard = this.getLeaderboard();
        leaderboard.push({
            initials: initials.toUpperCase(),
            score: this.score,
            wave: this.wave,
            date: new Date().toISOString().split('T')[0]
        });

        // Sort by score, keep top 10
        leaderboard.sort((a, b) => b.score - a.score);
        const top10 = leaderboard.slice(0, 10);

        try {
            localStorage.setItem('cflSBIPLeaderboard', JSON.stringify(top10));
        } catch (e) {
            console.warn('Could not save leaderboard');
        }

        return top10;
    }

    clearLeaderboard() {
        try {
            localStorage.removeItem('cflSBIPLeaderboard');
            localStorage.removeItem('cflSBIPHighScore');
            this.highScore = 0;
        } catch (e) {
            console.warn('Could not clear leaderboard');
        }
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.SBIPGame = SBIPGame;
}
