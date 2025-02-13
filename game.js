class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.treasures = [];
        this.player = {
            x: 50,
            y: 50,
            size: 20,
            speed: 5
        };
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Initialize sound
        this.synth = new Tone.Synth().toDestination();
        
        // Generate treasures
        this.generateTreasures();
        
        // Setup input handlers
        this.setupControls();
        
        // Start game loop
        this.gameLoop();
    }

    generateTreasures() {
        for (let i = 0; i < 10; i++) {
            this.treasures.push({
                x: Math.random() * (this.canvas.width - 30) + 15,
                y: Math.random() * (this.canvas.height - 30) + 15,
                size: 15
            });
        }
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                    this.player.y = Math.max(this.player.y - this.player.speed, 0);
                    break;
                case 'ArrowDown':
                case 's':
                    this.player.y = Math.min(this.player.y + this.player.speed, this.canvas.height - this.player.size);
                    break;
                case 'ArrowLeft':
                case 'a':
                    this.player.x = Math.max(this.player.x - this.player.speed, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                    this.player.x = Math.min(this.player.x + this.player.speed, this.canvas.width - this.player.size);
                    break;
            }
        });
    }

    checkCollisions() {
        this.treasures = this.treasures.filter(treasure => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - treasure.x, 2) + 
                Math.pow(this.player.y - treasure.y, 2)
            );
            
            if (distance < this.player.size + treasure.size) {
                this.score += 10;
                document.getElementById('score').textContent = this.score;
                this.playCollectSound();
                return false;
            }
            return true;
        });

        if (this.treasures.length === 0) {
            this.gameOver();
        }
    }

    playCollectSound() {
        this.synth.triggerAttackRelease('C5', '8n');
    }

    gameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw player
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw treasures
        this.ctx.fillStyle = '#FFD700';
        this.treasures.forEach(treasure => {
            this.ctx.beginPath();
            this.ctx.arc(treasure.x, treasure.y, treasure.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    gameLoop() {
        this.checkCollisions();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when window loads
window.onload = () => {
    new Game();
};
