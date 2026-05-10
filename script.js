document.addEventListener('DOMContentLoaded', () => {
    // --- BACKGROUND ANIMATIONS (Époustouflant) ---
    const bgContainer = document.getElementById('background-animations');
    const elements = ['🌸', '🌷', '🌹', '🌺', '🌻', '💖', '💝', '💕', '✨', '🎀', '👩‍👧', '💐', '🦋', '🥰', '🥂', '🎉'];

    function createBackgroundElement() {
        if (!bgContainer) return;

        const el = document.createElement('div');
        el.classList.add('bg-element');

        const emoji = elements[Math.floor(Math.random() * elements.length)];
        el.innerText = emoji;

        // Add special glow for sparkles or stars
        if (emoji === '✨' || emoji === '💖') {
            el.style.filter = 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.8))';
        }

        bgContainer.appendChild(el);

        const startX = Math.random() * window.innerWidth;
        const endX = startX + (Math.random() - 0.5) * 400; // Drift left or right by up to 200px
        const size = Math.random() * 35 + 25; // 25px to 60px

        el.style.left = `0px`;
        el.style.bottom = `0px`;
        el.style.fontSize = `${size}px`;

        const duration = Math.random() * 12000 + 8000; // 8s to 20s
        const rotations = (Math.random() - 0.5) * 720; // Rotate up to 2 times

        const animation = el.animate([
            { transform: `translate(${startX}px, 100px) rotate(0deg) scale(0)`, opacity: 0 },
            { transform: `translate(${startX + (endX - startX) * 0.1}px, 0px) rotate(${rotations * 0.2}deg) scale(1)`, opacity: 0.9, offset: 0.1 },
            { transform: `translate(${startX + (endX - startX) * 0.8}px, -${window.innerHeight * 0.8}px) rotate(${rotations * 0.8}deg) scale(1.1)`, opacity: 0.9, offset: 0.8 },
            { transform: `translate(${endX}px, -${window.innerHeight + 150}px) rotate(${rotations}deg) scale(1.2)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        });

        // Cleanup after animation
        animation.onfinish = () => {
            if (el.parentNode) el.remove();
        };
    }

    // Spawn background elements periodically
    setInterval(createBackgroundElement, 400); // 1 element every 0.4s

    // Initial burst for immediate "wow" effect
    for (let i = 0; i < 25; i++) {
        setTimeout(createBackgroundElement, i * 150);
    }

    // --- CARD LOGIC ---
    const card = document.getElementById('card');
    const heartsContainer = document.getElementById('hearts-container');
    const messageContent = document.querySelector('.message-content');
    const bgMusic = document.getElementById('bg-music');
    const voiceMessage = document.getElementById('voice-message');
    let heartsActive = false;
    let spawnTimeout;

    // Prevent closing card when clicking/scrolling the text
    if (messageContent) {
        messageContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Handle card flip
    if (card) {
        card.addEventListener('click', () => {
            card.classList.toggle('open');

            // Only start spawning hearts when opened for the first time or if it's currently open
            if (card.classList.contains('open') && !heartsActive) {
                heartsActive = true;
                createHearts();

                // Play audio
                if (bgMusic) {
                    bgMusic.volume = 0.3; // Musique de fond plus douce
                    bgMusic.play().catch(e => console.log("Audio play prevented:", e));
                }
                if (voiceMessage) {
                    voiceMessage.play().catch(e => console.log("Voice play prevented:", e));
                }

                // Also trigger a burst of background elements!
                for (let i = 0; i < 30; i++) {
                    setTimeout(createBackgroundElement, i * 50);
                }
            } else if (!card.classList.contains('open')) {
                heartsContainer.innerHTML = '';
                heartsActive = false;
                clearTimeout(spawnTimeout);

                // Pause audio
                if (bgMusic) bgMusic.pause();
                if (voiceMessage) {
                    voiceMessage.pause();
                    voiceMessage.currentTime = 0; // Reset voice to start
                }
            }
        });
    }

    // Function to create continuous floating hearts inside the card
    function createHearts() {
        if (!heartsActive) return;

        const heart = document.createElement('div');
        heart.classList.add('heart');

        // Random position, size, and duration
        const leftPos = Math.random() * 90 + 5; // Keep away from extreme edges
        const size = Math.random() * 0.8 + 0.4; // 0.4 to 1.2
        const duration = Math.random() * 3 + 4; // 4s to 7s

        // Randomize the pink color slightly
        const colors = ['#ff9a9e', '#ff758c', '#ff8da1', '#fecfef'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        heart.style.left = `${leftPos}%`;
        heart.style.transform = `scale(${size}) rotate(-45deg)`;
        heart.style.animationDuration = `${duration}s`;

        // Set custom color via CSS variable
        heart.style.setProperty('--heart-color', randomColor);

        heartsContainer.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, duration * 1000);

        // Schedule next heart
        if (heartsActive) {
            const nextSpawnDelay = Math.random() * 400 + 200; // 200ms to 600ms
            spawnTimeout = setTimeout(createHearts, nextSpawnDelay);
        }
    }
});
