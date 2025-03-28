const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const fortuneText = document.getElementById('fortuneText');
const closeResult = document.getElementById('closeResult');
const ctx = wheel.getContext('2d');

// Sample fortunes - these will later be loaded from the backend
let fortunes = [
    { text: "You will find unexpected joy", color: "#F87171" },
    { text: "A new opportunity is coming", color: "#60A5FA" },
    { text: "Trust your intuition", color: "#34D399" },
    { text: "Good fortune favors you", color: "#FBBF24" },
    { text: "Adventure awaits", color: "#A78BFA" },
    { text: "Success is in your future", color: "#F472B6" }
];

let currentRotation = 0;
let isSpinning = false;

// Draw the wheel
function drawWheel() {
    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;
    const radius = wheel.width / 2;
    const segmentAngle = (2 * Math.PI) / fortunes.length;

    fortunes.forEach((fortune, i) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, 
                i * segmentAngle, 
                (i + 1) * segmentAngle);
        ctx.closePath();
        ctx.fillStyle = fortune.color;
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * segmentAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#1F2937";
        ctx.font = "bold 14px Poppins";
        ctx.fillText(fortune.text, radius - 20, 5);
        ctx.restore();
    });
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    const spinDuration = 5000; // 5 seconds
    const spinRounds = 5 + Math.random() * 3; // 5-8 full rotations
    const targetAngle = currentRotation + (spinRounds * 2 * Math.PI);
    const segmentAngle = (2 * Math.PI) / fortunes.length;

    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Easing function
        
        currentRotation = easeProgress * targetAngle;
        wheel.style.transform = `rotate(${currentRotation}rad)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin();
        }
    }

    function finishSpin() {
        const normalizedRotation = currentRotation % (2 * Math.PI);
        const winningIndex = Math.floor(fortunes.length - (normalizedRotation / segmentAngle)) % fortunes.length;
        
        setTimeout(() => {
            showResult(winningIndex);
            isSpinning = false;
            spinBtn.disabled = false;
        }, 500);
    }

    animate();
}

function showResult(index) {
    fortuneText.textContent = fortunes[index].text;
    fortuneText.style.color = fortunes[index].color;
    result.classList.remove('hidden');
    startConfetti();
}

closeResult.addEventListener('click', () => {
    result.classList.add('hidden');
    stopConfetti();
});

spinBtn.addEventListener('click', spinWheel);

// Initialize
drawWheel();

// Later we'll add code to fetch fortunes from the backend
// fetch('/api/fortunes')
//   .then(response => response.json())
//   .then(data => {
//     fortunes = data;
//     drawWheel();
//   });