/**
 * Super Block Invaders Pong - Renderer
 * All drawing and visual effect functions
 */

class SBIPRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.W = canvas.width;
        this.H = canvas.height;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeTime = 0;
    }

    // ===========================================
    // SCREEN EFFECTS
    // ===========================================

    shake(intensity = SBIP_CONFIG.SHAKE_INTENSITY) {
        this.shakeTime = SBIP_CONFIG.SHAKE_DURATION;
        this.shakeIntensity = intensity;
    }

    updateShake() {
        if (this.shakeTime > 0) {
            this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeTime -= 16; // ~60fps
        } else {
            this.shakeX = 0;
            this.shakeY = 0;
        }
    }

    // ===========================================
    // BASIC SHAPES
    // ===========================================

    clear() {
        this.ctx.save();
        this.ctx.translate(this.shakeX, this.shakeY);
        this.ctx.fillStyle = SBIP_CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.W, this.H);
    }

    restore() {
        this.ctx.restore();
    }

    drawRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawRectGlow(x, y, w, h, color, glowColor, glowSize = 10) {
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = glowSize;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.shadowBlur = 0;
    }

    drawCircle(x, y, r, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawCircleGlow(x, y, r, color, glowColor, glowSize = 15) {
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = glowSize;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    drawText(text, x, y, size = 20, color = '#fff', align = 'center') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px "JetBrains Mono", "Courier New", monospace`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    drawEmoji(emoji, x, y, size = 24) {
        this.ctx.font = `${size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, x, y);
    }

    // ===========================================
    // GAME ELEMENTS
    // ===========================================

    drawStars(stars, time) {
        stars.forEach(star => {
            const alpha = 0.3 + star.brightness * 0.7;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawNet() {
        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeStyle = SBIP_CONFIG.COLORS.NET;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.W / 2, 0);
        this.ctx.lineTo(this.W / 2, this.H);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawPaddle(paddle) {
        const color = paddle.isPlayer
            ? SBIP_CONFIG.COLORS.PADDLE_PLAYER
            : SBIP_CONFIG.COLORS.PADDLE_CPU;
        const glowColor = paddle.isPlayer ? '#00ff88' : '#ff4488';

        // Shield indicator
        if (paddle.hasShield) {
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(paddle.x - 3, paddle.y - 3, paddle.width + 6, paddle.height + 6);
        }

        // Laser indicator
        if (paddle.hasLaser) {
            this.drawRectGlow(paddle.x, paddle.y, paddle.width, paddle.height, '#ff00ff', '#ff00ff', 15);
        } else {
            this.drawRectGlow(paddle.x, paddle.y, paddle.width, paddle.height, color, glowColor, 10);
        }

        // Extended paddle glow
        if (paddle.extended) {
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4);
        }
    }

    drawBall(ball) {
        // Trail
        ball.trail.forEach((pos, i) => {
            const alpha = i / ball.trail.length * 0.3;
            const size = ball.radius * (i / ball.trail.length);
            const color = ball.isFireBall
                ? `rgba(255, 102, 0, ${alpha})`
                : `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Ball
        const ballColor = ball.isFireBall
            ? SBIP_CONFIG.COLORS.BALL_FIRE
            : SBIP_CONFIG.COLORS.BALL;
        const glowColor = ball.isFireBall ? '#ff3300' : '#ffffff';

        this.drawCircleGlow(ball.x, ball.y, ball.radius, ballColor, glowColor, ball.isFireBall ? 20 : 10);

        // Fire effect
        if (ball.isFireBall) {
            this.drawEmoji('🔥', ball.x, ball.y - ball.radius - 5, 12);
        }
    }

    drawBrick(brick) {
        if (!brick.active) return;

        const color = brick.getColor();

        // Draw brick with rounded corners
        this.ctx.fillStyle = color;
        this.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
        this.ctx.fill();

        // Health indicator for multi-hit bricks
        if (brick.maxHealth > 1 && brick.health < brick.maxHealth) {
            const healthRatio = brick.health / brick.maxHealth;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${0.5 - healthRatio * 0.3})`;
            this.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
            this.ctx.fill();
        }

        // Hit flash
        if (brick.hitFlash > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${brick.hitFlash})`;
            this.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
            this.ctx.fill();
        }
    }

    drawInvader(invader, time) {
        if (!invader.active) return;

        const y = invader.y + (invader.bobY || 0);

        // Glow for damaged invaders
        if (invader.health < invader.maxHealth) {
            const damage = 1 - invader.health / invader.maxHealth;
            this.ctx.shadowColor = '#ff0000';
            this.ctx.shadowBlur = 10 * damage;
        }

        // Draw emoji
        this.drawEmoji(invader.emoji, invader.x, y, invader.size);

        this.ctx.shadowBlur = 0;

        // Hit flash
        if (invader.hitFlash > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${invader.hitFlash * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(invader.x, y, invader.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Health bar for bosses
        if (invader.type === 'BOSS' || invader.type === 'TANK') {
            const barWidth = invader.size;
            const barHeight = 4;
            const barX = invader.x - barWidth / 2;
            const barY = y + invader.size / 2 + 5;
            const healthRatio = invader.health / invader.maxHealth;

            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            this.ctx.fillStyle = healthRatio > 0.3 ? '#00ff00' : '#ff0000';
            this.ctx.fillRect(barX, barY, barWidth * healthRatio, barHeight);
        }
    }

    drawLaser(laser) {
        const color = laser.isEnemy
            ? SBIP_CONFIG.COLORS.LASER_ENEMY
            : SBIP_CONFIG.COLORS.LASER_PLAYER;

        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 8;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(laser.x - laser.width / 2, laser.y - laser.height / 2, laser.width, laser.height);
        this.ctx.shadowBlur = 0;
    }

    drawPowerup(powerup, time) {
        if (!powerup.active) return;

        // Glow effect
        const glowSize = 15 + powerup.glow * 10;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = glowSize;

        // Background circle
        this.ctx.fillStyle = `rgba(255, 255, 0, ${0.3 + powerup.glow * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(powerup.x, powerup.y, powerup.size / 2 + 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowBlur = 0;

        // Emoji
        this.drawEmoji(powerup.emoji, powerup.x, powerup.y, powerup.size);
    }

    drawParticle(particle) {
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.life;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawParticles(particles) {
        particles.forEach(p => this.drawParticle(p));
    }

    // ===========================================
    // UI ELEMENTS
    // ===========================================

    drawHUD(playerLives, cpuLives, score, wave, combo) {
        // Semi-transparent HUD background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.W, 35);

        // Player lives (left)
        let livesStr = '';
        for (let i = 0; i < playerLives; i++) livesStr += '❤️';
        for (let i = playerLives; i < SBIP_CONFIG.MAX_LIVES; i++) livesStr += '🖤';
        this.drawText(livesStr, 80, 18, 16, '#fff', 'left');
        this.drawText('YOU', 10, 18, 12, '#00ff88', 'left');

        // CPU lives (right)
        let cpuLivesStr = '';
        for (let i = 0; i < cpuLives; i++) cpuLivesStr += '❤️';
        for (let i = cpuLives; i < SBIP_CONFIG.MAX_LIVES; i++) cpuLivesStr += '🖤';
        this.drawText(cpuLivesStr, this.W - 80, 18, 16, '#fff', 'right');
        this.drawText('CPU', this.W - 10, 18, 12, '#ff4488', 'right');

        // Score (center-left)
        this.drawText(`SCORE: ${score.toLocaleString()}`, this.W / 2 - 80, 18, 14, '#ffff00', 'center');

        // Wave (center-right)
        this.drawText(`WAVE ${wave}`, this.W / 2 + 80, 18, 14, '#00ffff', 'center');

        // Combo indicator
        if (combo > 1) {
            this.ctx.shadowColor = '#ff00ff';
            this.ctx.shadowBlur = 10;
            this.drawText(`${combo}x COMBO!`, this.W / 2, this.H - 30, 18, '#ff00ff', 'center');
            this.ctx.shadowBlur = 0;
        }
    }

    drawActivePowerups(powerups, time) {
        const activeList = Object.entries(powerups).filter(([_, data]) => data.active);

        activeList.forEach(([type, data], index) => {
            const x = 10 + index * 40;
            const y = 50;
            const config = SBIP_CONFIG.POWERUP_TYPES[type];

            // Timer bar
            if (data.endTime) {
                const remaining = (data.endTime - time) / config.duration;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.fillRect(x, y + 25, 30, 4);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(x, y + 25, 30 * remaining, 4);
            }

            this.drawEmoji(config.emoji, x + 15, y + 10, 20);
        });
    }

    drawMessage(text, subtext = '') {
        // Darken background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.H / 2 - 60, this.W, 120);

        // Main text
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 20;
        this.drawText(text, this.W / 2, this.H / 2 - 10, 36, '#ffffff', 'center');
        this.ctx.shadowBlur = 0;

        // Subtext
        if (subtext) {
            this.drawText(subtext, this.W / 2, this.H / 2 + 25, 16, '#aaaaaa', 'center');
        }
    }

    drawWaveAnnouncement(wave, isBoss = false) {
        const text = isBoss ? `⚠️ BOSS WAVE ${wave} ⚠️` : `WAVE ${wave}`;
        const color = isBoss ? '#ff0000' : '#00ffff';

        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 30;
        this.drawText(text, this.W / 2, this.H / 2, 48, color, 'center');
        this.ctx.shadowBlur = 0;

        this.drawText('Get Ready!', this.W / 2, this.H / 2 + 40, 20, '#ffffff', 'center');
    }

    // ===========================================
    // HELPERS
    // ===========================================

    roundRect(x, y, w, h, r) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.SBIPRenderer = SBIPRenderer;
}
