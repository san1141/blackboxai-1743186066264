let confettiActive = false;
let confettiParticles = [];
const confettiColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'
];

function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    createConfettiParticles();
    animateConfetti();
}

function stopConfetti() {
    confettiActive = false;
    confettiParticles = [];
}

function createConfettiParticles() {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        confettiParticles.push({
            x: Math.random() * window.innerWidth,
            y: -20,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
}

function animateConfetti() {
    if (!confettiActive) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();

            p.y += p.speed;
            p.rotation += p.rotationSpeed;

            if (p.y > canvas.height) {
                if (Math.random() > 0.1) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                } else {
                    confettiParticles.splice(i, 1);
                    i--;
                }
            }
        }

        if (confettiActive) {
            requestAnimationFrame(draw);
        } else {
            document.body.removeChild(canvas);
        }
    }

    draw();
}

// Add some new particles periodically while active
setInterval(() => {
    if (confettiActive && confettiParticles.length < 200) {
        createConfettiParticles();
    }
}, 300);