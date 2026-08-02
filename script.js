/**
 * ULTRA-PREMIUM INTERACTIVE FRIENDSHIP PROPOSAL ENGINE
 * Asset-Free Implementation (Web Audio API Synthesizer + Native Canvas Particle Physics)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION & STATE ---
    const state = {
        noAttempts: 0,
        audioMuted: false,
        puppyClickCount: 0,
        userName: 'Bestie',
        mouse: { x: 0, y: 0 }
    };

    // Parse URL parameter if custom name is provided
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('name')) {
        state.userName = urlParams.get('name');
    }

    // --- DOM ELEMENTS ---
    const friendNameElem = document.getElementById('friend-name');
    const certUserNameElem = document.getElementById('cert-user-name');
    const certDateElem = document.getElementById('cert-date');
    const certIdElem = document.getElementById('cert-id');
    
    friendNameElem.textContent = state.userName;
    certUserNameElem.textContent = state.userName;
    certDateElem.textContent = new Date().toLocaleDateString();
    certIdElem.textContent = 'BFF-' + Math.floor(1000 + Math.random() * 9000);

    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const noCounterHint = document.getElementById('no-counter-hint');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    // Screens
    const screens = {
        landing: document.getElementById('screen-landing'),
        puppy: document.getElementById('screen-puppy'),
        promise: document.getElementById('screen-promise'),
        certificate: document.getElementById('screen-certificate'),
        countdown: document.getElementById('screen-countdown')
    };

    // --- WEB AUDIO API SYNTHESIZER (COMPLETE ASSET REPLACEMENT) ---
    let audioCtx = null;
    let bgInterval = null;

    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSyntheticSound(type) {
        if (state.audioMuted) return;
        initAudioContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'pop') {
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'kiss') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'bark') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    }

    // Programmatic Ambient Music Synthesizer
    function startAmbientSynth() {
        if (bgInterval || state.audioMuted) return;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C Major Chord Notes
        let idx = 0;

        bgInterval = setInterval(() => {
            if (state.audioMuted) return;
            initAudioContext();
            if (!audioCtx) return;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(notes[idx % notes.length], audioCtx.currentTime);
            gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.2);
            idx++;
        }, 800);
    }

    function stopAmbientSynth() {
        if (bgInterval) {
            clearInterval(bgInterval);
            bgInterval = null;
        }
    }

    // Audio Toggle
    audioToggle.addEventListener('click', () => {
        state.audioMuted = !state.audioMuted;
        audioIcon.textContent = state.audioMuted ? '🔇' : '🎵';
        if (!state.audioMuted) {
            startAmbientSynth();
        } else {
            stopAmbientSynth();
        }
    });

    // --- CANVAS PARTICLE ENGINE ---
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type || 'heart';
            this.size = Math.random() * 12 + 8;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6 - (type === 'confetti' ? 4 : 0);
            this.rotation = Math.random() * Math.PI * 2;
            this.vRot = (Math.random() - 0.5) * 0.1;
            this.alpha = 1;
            this.color = `hsl(${Math.random() * 60 + 320}, 100%, 65%)`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.vRot;
            this.alpha -= 0.015;
            if (this.type === 'confetti') this.vy += 0.15;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            if (this.type === 'heart') {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(-this.size/4, -this.size/4, this.size/4, 0, Math.PI, true);
                ctx.arc(this.size/4, -this.size/4, this.size/4, 0, Math.PI, true);
                ctx.lineTo(0, this.size/2);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            }
            ctx.restore();
        }
    }

    function spawnExplosion(x, y, count = 30, type = 'heart') {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, type));
        }
    }

    function animateFX() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.05) {
            particles.push(new Particle(Math.random() * canvas.width, canvas.height + 20, 'heart'));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animateFX);
    }
    animateFX();

    // Mouse Trail Hearts
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        if (Math.random() < 0.2) {
            particles.push(new Particle(e.clientX, e.clientY, 'heart'));
        }
    });

    // --- NO BUTTON EVASION ---
    const noPhrases = [
        "No", "Really?", "Think Again 😏", "Wrong Button 😂", 
        "Catch Me", "Oops", "Still No?", "Impossible", 
        "Nice Try", "Almost", "HAHA 😂", "Nope"
    ];

    function evadeNoButton() {
        state.noAttempts++;
        playSyntheticSound('pop');

        noCounterHint.textContent = `You tried pressing NO ${state.noAttempts} times 😂`;

        if (state.noAttempts >= 20) {
            const rect = btnNo.getBoundingClientRect();
            spawnExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 80, 'heart');
            btnNo.style.display = 'none';
            noCounterHint.textContent = "The NO button couldn't take it anymore and exploded! 💥";
            return;
        }

        const randomPhrase = noPhrases[Math.floor(Math.random() * noPhrases.length)];
        btnNo.textContent = randomPhrase;

        const windowWidth = window.innerWidth - 120;
        const windowHeight = window.innerHeight - 60;
        
        const randomX = Math.max(20, Math.floor(Math.random() * windowWidth));
        const randomY = Math.max(20, Math.floor(Math.random() * windowHeight));
        const randomScale = (Math.random() * 0.4 + 0.7).toFixed(2);
        const randomRot = Math.floor((Math.random() - 0.5) * 90);

        btnNo.style.position = 'fixed';
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        btnNo.style.transform = `scale(${randomScale}) rotate(${randomRot}deg)`;
        btnNo.style.opacity = Math.random() < 0.3 ? '0.2' : '1';

        if (state.noAttempts === 10) {
            unlockAchievement('PERSISTENT ONE 🙈', 'Tried clicking NO 10 times!');
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (btnNo.style.display === 'none') return;
        
        const rect = btnNo.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (distance < 100) {
            evadeNoButton();
        }
    });

    btnNo.addEventListener('click', evadeNoButton);

    // --- YES BUTTON & TRANSITIONS ---
    btnYes.addEventListener('click', () => {
        startAmbientSynth();
        playSyntheticSound('bark');
        spawnExplosion(window.innerWidth / 2, window.innerHeight / 2, 150, 'confetti');
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 500);

        switchScreen(screens.landing, screens.puppy);

        setTimeout(() => {
            switchScreen(screens.puppy, screens.promise);
        }, 4000);
    });

    // --- PROMISE & CERTIFICATE ---
    const handlePromise = () => {
        playSyntheticSound('pop');
        spawnExplosion(window.innerWidth / 2, window.innerHeight / 2, 60, 'heart');
        switchScreen(screens.promise, screens.certificate);
    };

    document.getElementById('btn-promise-1').addEventListener('click', handlePromise);
    document.getElementById('btn-promise-2').addEventListener('click', handlePromise);

    // Download Canvas Certificate
    document.getElementById('btn-download-cert').addEventListener('click', () => {
        playSyntheticSound('pop');
        
        const certCanvas = document.createElement('canvas');
        certCanvas.width = 800;
        certCanvas.height = 500;
        const c = certCanvas.getContext('2d');

        c.fillStyle = '#fffdf9';
        c.fillRect(0, 0, 800, 500);

        c.strokeStyle = '#d4af37';
        c.lineWidth = 8;
        c.strokeRect(20, 20, 760, 460);

        c.fillStyle = '#ff2a75';
        c.font = 'bold 32px sans-serif';
        c.textAlign = 'center';
        c.fillText('OFFICIAL FRIENDSHIP CERTIFICATE', 400, 80);

        c.fillStyle = '#333';
        c.font = '20px sans-serif';
        c.fillText('This certifies that', 400, 140);

        c.fillStyle = '#ff2a75';
        c.font = 'bold 42px sans-serif';
        c.fillText(state.userName, 400, 220);

        c.fillStyle = '#555';
        c.font = '20px sans-serif';
        c.fillText('is officially registered as an Eternal Best Friend! ❤️', 400, 300);

        c.font = '16px sans-serif';
        c.textAlign = 'left';
        c.fillText(`Date: ${new Date().toLocaleDateString()}`, 60, 420);
        c.fillText(`ID: BFF-${Math.floor(1000 + Math.random() * 9000)}`, 60, 445);

        const link = document.createElement('a');
        link.download = `Friendship_Certificate_${state.userName}.png`;
        link.href = certCanvas.toDataURL();
        link.click();

        setTimeout(() => {
            switchScreen(screens.certificate, screens.countdown);
            runCountdown();
        }, 1000);
    });

    // --- COUNTDOWN & GRAND EXPLOSION ---
    function runCountdown() {
        let count = 3;
        const timerElem = document.getElementById('countdown-timer');
        
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                timerElem.textContent = count;
                playSyntheticSound('pop');
            } else {
                clearInterval(interval);
                timerElem.textContent = '🥳';
                playSyntheticSound('bark');
                
                const explosionInterval = setInterval(() => {
                    spawnExplosion(
                        Math.random() * window.innerWidth, 
                        Math.random() * window.innerHeight, 
                        50, 
                        Math.random() < 0.5 ? 'heart' : 'confetti'
                    );
                }, 200);

                setTimeout(() => clearInterval(explosionInterval), 10000);
            }
        }, 1000);
    }

    // --- UTILITIES ---
    function switchScreen(fromScreen, toScreen) {
        fromScreen.classList.remove('active');
        fromScreen.classList.add('hidden');
        
        setTimeout(() => {
            toScreen.classList.remove('hidden');
            toScreen.classList.add('active');
        }, 300);
    }

    function unlockAchievement(title, desc) {
        const toast = document.getElementById('achievement-toast');
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-desc').textContent = desc;

        toast.classList.remove('hidden');
        playSyntheticSound('pop');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // Interactive Puppy Clicker Mini-Game
    const puppyBox = document.getElementById('puppy-box');
    if (puppyBox) {
        puppyBox.addEventListener('click', (e) => {
            state.puppyClickCount++;
            playSyntheticSound('kiss');
            spawnExplosion(e.clientX, e.clientY, 20, 'heart');

            if (state.puppyClickCount === 10) {
                unlockAchievement('DOG LOVER 🐶', 'You clicked the cute puppy 10 times!');
            }
        });
    }
});
                                 
