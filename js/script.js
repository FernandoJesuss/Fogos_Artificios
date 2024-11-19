function createFirework(x, y) {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    document.body.appendChild(firework);

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD'];
    const size = Math.random() * 50 + 20;

    firework.style.width = `${size}px`;
    firework.style.height = `${size}px`;
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    firework.style.opacity = 1;

    const animationDuration = Math.random() * 1 + 0.5;

    firework.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-100px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 0 }
    ], {
        duration: animationDuration * 1000,
        easing: 'ease-out',
        fill: 'forwards'
    });

    setTimeout(() => {
        firework.remove();
    }, animationDuration * 1000);
}

function randomPosition() {
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    createFirework(x, y);
}

setInterval(randomPosition, 500);