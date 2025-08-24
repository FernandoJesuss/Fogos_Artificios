   // Variáveis globais
        let particles = [];
        let fireworks = [];
        let gravity = 0.1;
        let speedMultiplier = 1;
        let intensityMultiplier = 1;
        let windForce = 0;
        let currentType = 'classic';

        // Controles de sistema
        let isAutoMode = false;
        let isPaused = false;
        let soundEnabled = true;
        let showInfo = false;

        // Estatísticas
        let clickCount = 0;
        let maxExplosion = 0;
        let startTime = Date.now();
        let lastFrameTime = Date.now();
        let frameCount = 0;
        let fps = 60;

        // Inicializando o som
        const sound = new Howl({
            src: [''], // Coloque um audio aqui se vc quise
            volume: 1,
            loop: false
        });

        function setup() {
            createCanvas(windowWidth, windowHeight);
            colorMode(RGB, 255);
            createStars();
            initializeControls();
        }

        function draw() {
            if (!isPaused) {
                // Fundo com desvanecimento
                fill(0, 25);
                noStroke();
                rect(0, 0, width, height);

                // Atualizar e desenhar partículas
                updateParticles();
                displayParticles();

                // Modo automático
                if (isAutoMode && frameCount % parseInt(document.getElementById('frequencySlider').value) === 0) {
                    createRandomFirework();
                }

                // Atualizar FPS
                updateFPS();
            }

            // Atualizar UI
            updateUI();
            frameCount++;
        }

        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }

        function mousePressed() {
            if (!isPaused) {
                createFirework(mouseX, mouseY);
                clickCount++;
                if (soundEnabled) sound.play(); 
            }
        }

        function keyPressed() {
            switch (key.toLowerCase()) {
                case ' ':
                    toggleAutoMode();
                    break;
                case 'r':
                    resetSimulation();
                    break;
                case 'p':
                    togglePause();
                    break;
                case 'm':
                    toggleSound();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case '1': case '2': case '3': case '4': case '5': case '6': case '7':
                    selectFireworkType(parseInt(key) - 1);
                    break;
            }

            // Controles direcionais
            if (keyCode === UP_ARROW) {
                document.getElementById('intensitySlider').value = parseFloat(document.getElementById('intensitySlider').value) + 0.1;
            } else if (keyCode === DOWN_ARROW) {
                document.getElementById('intensitySlider').value = parseFloat(document.getElementById('intensitySlider').value) - 0.1;
            } else if (keyCode === LEFT_ARROW) {
                document.getElementById('windSlider').value = parseFloat(document.getElementById('windSlider').value) - 0.01;
            } else if (keyCode === RIGHT_ARROW) {
                document.getElementById('windSlider').value = parseFloat(document.getElementById('windSlider').value) + 0.01;
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const btn = document.getElementById('toggleSound');
            btn.textContent = soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('muted', !soundEnabled);

            if (soundEnabled) {
                sound.play(); 
            } else {
                sound.stop(); 
            }
        }

        // Função para alternar o modo automático
        function toggleAutoMode() {
            isAutoMode = !isAutoMode;
            const btn = document.getElementById('autoMode');
            btn.classList.toggle('active', isAutoMode);
            btn.textContent = isAutoMode ? '⏹️' : '⚡';

            if (isAutoMode) {
                if (!sound.playing()) { 
                    sound.play(); 
                }
            } else {
                if (sound.playing()) {
                    sound.stop(); 
                }
            }
        }

        // Exemplo de uso: Chamar toggleAutoMode() quando o botão for clicado
        document.getElementById('autoMode').addEventListener('click', toggleAutoMode);
        function createFirework(x, y) {
            // Criar projétil inicial
            const projectile = new Projectile(x, height, x, y);
            fireworks.push(projectile);
        }

        function createRandomFirework() {
            const x = random(width * 0.2, width * 0.8);
            const y = random(height * 0.1, height * 0.4);
            createFirework(x, y);
        }

        function explodeFirework(x, y) {
            const particleCount = Math.floor(random(50, 150) * intensityMultiplier);
            maxExplosion = Math.max(maxExplosion, particleCount);

            for (let i = 0; i < particleCount; i++) {
                const angle = map(i, 0, particleCount, 0, TWO_PI);
                const speed = random(2, 8) * speedMultiplier;
                const color = getFireworkColor(currentType);

                particles.push(new Particle(x, y, cos(angle) * speed, sin(angle) * speed, color, currentType));
            }
        }

        function getFireworkColor(type) {
            const colors = {
                classic: [color(255, random(100, 255), random(100, 255))],
                burst: [color(255, 100, 100), color(255, 200, 100), color(255, 255, 100)],
                spiral: [color(100, 255, 255), color(200, 100, 255)],
                heart: [color(255, 100, 150), color(255, 150, 200)],
                star: [color(255, 255, 100), color(255, 200, 50)],
                ring: [color(100, 255, 100), color(150, 255, 150)],
                fountain: [color(255, 150, 50), color(255, 200, 100)]
            };

            const colorSet = colors[type] || colors.classic;
            return random(colorSet);
        }

        function updateParticles() {
            // Atualizar projéteis
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                if (fireworks[i].exploded) {
                    explodeFirework(fireworks[i].x, fireworks[i].y);
                    fireworks.splice(i, 1);
                }
            }

            // Atualizar partículas
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                if (particles[i].isDead()) {
                    particles.splice(i, 1);
                }
            }
        }

        function displayParticles() {
            // Desenhar projéteis
            for (let firework of fireworks) {
                firework.show();
            }

            // Desenhar partículas
            for (let particle of particles) {
                particle.show();
            }
        }

        function updateUI() {
            // Atualizar contadores
            document.getElementById('activeCount').textContent = particles.length;
            document.getElementById('activeFireworks').textContent = fireworks.length;
            document.getElementById('activeParticles').textContent = particles.length;
            document.getElementById('clickCount').textContent = clickCount;
            document.getElementById('maxExplosion').textContent = maxExplosion;
            document.getElementById('currentFPS').textContent = Math.floor(fps) + ' FPS';

            // Atualizar tempo de execução
            const runtime = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(runtime / 60);
            const seconds = runtime % 60;
            document.getElementById('runtime').textContent =
                String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

            // Atualizar barra de performance
            const performanceRatio = Math.min(fps / 60, 1);
            document.getElementById('performanceFill').style.width = (performanceRatio * 100) + '%';

            // Atualizar temperatura baseada na quantidade de partículas
            const temp = particles.length > 500 ? '🔥 Quente' :
                particles.length > 200 ? '🌡️ Morno' : '❄️ Normal';
            document.getElementById('temperature').textContent = temp;

            // Atualizar variáveis dos sliders
            speedMultiplier = parseFloat(document.getElementById('speedSlider').value);
            gravity = parseFloat(document.getElementById('gravitySlider').value);
            intensityMultiplier = parseFloat(document.getElementById('intensitySlider').value);
            windForce = parseFloat(document.getElementById('windSlider').value);
        }

        function updateFPS() {
            const now = Date.now();
            const delta = now - lastFrameTime;
            fps = fps * 0.9 + (1000 / delta) * 0.1; 
            lastFrameTime = now;
        }

        function initializeControls() {
            // Botões do header
            document.getElementById('toggleSound').addEventListener('click', toggleSound);
            document.getElementById('autoMode').addEventListener('click', toggleAutoMode);
            document.getElementById('resetBtn').addEventListener('click', resetSimulation);
            document.getElementById('pauseBtn').addEventListener('click', togglePause);
            document.getElementById('toggleInfo').addEventListener('click', toggleInfo);
            document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);

            // Botões de tipo de fogo
            document.querySelectorAll('.type-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => selectFireworkType(index));
            });
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const btn = document.getElementById('toggleSound');
            btn.textContent = soundEnabled ? '🔊' : '🔇';
            btn.classList.toggle('muted', !soundEnabled);

            if (soundEnabled) {
                playSound.setVolume(1);
            } else {
                stopSound.setVolume(0);
            }
        }



        function toggleAutoMode() {
            isAutoMode = !isAutoMode;
            const btn = document.getElementById('autoMode');
            btn.classList.toggle('active', isAutoMode);
            btn.textContent = isAutoMode ? '⏹️' : '⚡';
        }

        function resetSimulation() {
            particles = [];
            fireworks = [];
            clickCount = 0;
            maxExplosion = 0;
            startTime = Date.now();
            background(0);
        }

        function togglePause() {
            isPaused = !isPaused;
            const btn = document.getElementById('pauseBtn');
            btn.textContent = isPaused ? '▶️' : '⏸️';
            btn.classList.toggle('active', isPaused);
        }

        function toggleInfo() {
            showInfo = !showInfo;
            const panel = document.getElementById('infoPanel');
            const instructions = document.getElementById('instructions');
            panel.classList.toggle('hidden', !showInfo);
            instructions.classList.toggle('hidden', !showInfo);

            const btn = document.getElementById('toggleInfo');
            btn.classList.toggle('active', showInfo);
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Fullscreen não suportado:', err);
                });
            } else {
                document.exitFullscreen();
            }
        }

        function selectFireworkType(index) {
            const types = ['classic', 'burst', 'spiral', 'heart', 'star', 'ring', 'fountain'];
            currentType = types[index] || 'classic';

            // Atualizar botões visuais
            document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.type-btn')[index].classList.add('active');
        }

        function windowResized() {
            resizeCanvas(windowWidth, windowHeight);
        }

        // Classes das partículas
        class Projectile {
            constructor(startX, startY, targetX, targetY) {
                this.x = startX;
                this.y = startY;
                this.targetX = targetX;
                this.targetY = targetY;

                // Calcular velocidade para atingir o alvo
                const distance = dist(startX, startY, targetX, targetY);
                const time = distance / (5 * speedMultiplier);

                this.vx = (targetX - startX) / time;
                this.vy = (targetY - startY) / time - 0.5 * gravity * time;

                this.exploded = false;
                this.trail = [];
            }

            update() {
                if (!this.exploded) {
                    // Salvar posição para rastro
                    this.trail.push({ x: this.x, y: this.y });
                    if (this.trail.length > 10) {
                        this.trail.shift();
                    }

                    // Atualizar posição
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += gravity;

                    // Verificar se atingiu o alvo ou passou dele
                    if (this.vy > 0 && this.y >= this.targetY) {
                        this.exploded = true;
                    }
                }
            }

            show() {
                if (!this.exploded) {
                    // Desenhar rastro
                    for (let i = 0; i < this.trail.length; i++) {
                        const alpha = map(i, 0, this.trail.length, 0, 255);
                        fill(255, 200, 100, alpha);
                        noStroke();
                        ellipse(this.trail[i].x, this.trail[i].y, 3, 3);
                    }

                    // Desenhar projétil
                    fill(255, 255, 200);
                    noStroke();
                    ellipse(this.x, this.y, 6, 6);
                }
            }
        }

        class Particle {
            constructor(x, y, vx, vy, particleColor, type) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.color = particleColor;
                this.type = type;
                this.life = random(60, 120);
                this.maxLife = this.life;
                this.size = random(2, 6);
                this.angle = 0;
                this.trail = [];
            }

            update() {
                // Salvar para rastro
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 5) {
                    this.trail.shift();
                }

                // Aplicar forças
                this.x += this.vx;
                this.y += this.vy;
                this.vy += gravity;
                this.vx += windForce;

                // Resistência do ar
                this.vx *= 0.99;
                this.vy *= 0.99;

                // Efeitos especiais por tipo
                switch (this.type) {
                    case 'spiral':
                        this.angle += 0.1;
                        this.vx += cos(this.angle) * 0.1;
                        this.vy += sin(this.angle) * 0.1;
                        break;
                    case 'heart':
                        this.angle += 0.05;
                        this.vx += cos(this.angle) * 0.05;
                        break;
                }

                this.life--;
            }

            show() {
                const alpha = map(this.life, 0, this.maxLife, 0, 255);

                // Desenhar rastro
                for (let i = 0; i < this.trail.length; i++) {
                    const trailAlpha = alpha * (i / this.trail.length) * 0.5;
                    fill(red(this.color), green(this.color), blue(this.color), trailAlpha);
                    noStroke();
                    ellipse(this.trail[i].x, this.trail[i].y, this.size * 0.5, this.size * 0.5);
                }

                // Desenhar partícula principal
                fill(red(this.color), green(this.color), blue(this.color), alpha);

                // Adicionar brilho
                if (alpha > 100) {
                    stroke(255, alpha * 0.8);
                    strokeWeight(1);
                } else {
                    noStroke();
                }

                // Forma baseada no tipo
                switch (this.type) {
                    case 'star':
                        this.drawStar(this.x, this.y, this.size);
                        break;
                    case 'heart':
                        this.drawHeart(this.x, this.y, this.size);
                        break;
                    default:
                        ellipse(this.x, this.y, this.size, this.size);
                }
            }

            drawStar(x, y, size) {
                push();
                translate(x, y);
                rotate(this.angle);
                beginShape();
                for (let i = 0; i < 10; i++) {
                    const angle = map(i, 0, 10, 0, TWO_PI);
                    const r = i % 2 === 0 ? size : size * 0.5;
                    const px = cos(angle) * r;
                    const py = sin(angle) * r;
                    vertex(px, py);
                }
                endShape(CLOSE);
                pop();
            }

            drawHeart(x, y, size) {
                push();
                translate(x, y);
                scale(size / 10);
                beginShape();
                vertex(0, 3);
                bezierVertex(-3, -2, -8, 1, 0, 8);
                bezierVertex(8, 1, 3, -2, 0, 3);
                endShape();
                pop();
            }

            isDead() {
                return this.life <= 0;
            }
        }