document.addEventListener("DOMContentLoaded", () => {
    
    let currentSlide = 0;
    const totalSlides = 8;
    let isTransitioning = false;
    
    const mainSlider = document.getElementById("main-slider");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll("#pager-dots .dot");
    
    const introOverlay = document.getElementById("intro-overlay");
    const heartTrigger = document.getElementById("heart-trigger");
    
    const bgMusic = document.getElementById("bg-music");
    const voiceMessage = document.getElementById("voice-message");
    const musicIndicator = document.getElementById("music-indicator");
    const cdDisc = document.getElementById("cd-disc");
    const playRecordBtn = document.getElementById("play-record-btn");
    
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const yesModal = document.getElementById("yes-modal");
    const noModal = document.getElementById("no-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const closeNoBtn = document.getElementById("close-no-btn");
    const modalKissesContainer = document.getElementById("modal-kisses-container");
    
    const endingText = document.getElementById("ending-pop-text");
    const endingPhoto = document.getElementById("ending-photo-wrapper");

    let noClickCount = 0;
    let miniKissesInterval = null;

    // Build the Improvised Starfield Backdrop Matrix
    buildStarfield();

    heartTrigger.addEventListener("click", () => {
        heartTrigger.classList.add("burst-out-effect");
        
        bgMusic.play().then(() => {
            musicIndicator.classList.remove("hidden");
        }).catch(() => console.log("Audio contextual lock applied."));
        
        setTimeout(() => {
            introOverlay.style.opacity = "0";
            setTimeout(() => {
                introOverlay.style.display = "none";
                startAmbientHearts();
                triggerSlideActions(0);
            }, 600);
        }, 400);
    });

    function navigateToSlide(targetIndex) {
        if (targetIndex < 0 || targetIndex >= totalSlides || isTransitioning) return;
        
        isTransitioning = true;
        currentSlide = targetIndex;
        
        // Locked absolute alignment transform matrix offset
        mainSlider.style.transform = `translateY(-${currentSlide * 100}vh)`;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === currentSlide);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });

        triggerSlideActions(currentSlide);

        setTimeout(() => {
            isTransitioning = false;
        }, 700);
    }

    // Capture Navigation Triggers cleanly without scroll leakage crashes
    window.addEventListener("wheel", (e) => {
        if (introOverlay.style.display !== "none") return;
        if (e.deltaY > 0) navigateToSlide(currentSlide + 1);
        else navigateToSlide(currentSlide - 1);
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        if (introOverlay.style.display !== "none") return;
        let deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 40) {
            if (deltaY > 0) navigateToSlide(currentSlide + 1);
            else navigateToSlide(currentSlide - 1);
        }
    }, { passive: true });

    function triggerSlideActions(index) {
        document.querySelectorAll("video").forEach(v => v.pause());

        // Video Slide Actions Autoplay
        if (index === 2) {
            slides[2].querySelectorAll("video").forEach(v => { v.currentTime = 0; v.play().catch(()=>{}); });
        }

        // Voice slide protection recovery parameters
        if (index !== 3 && !voiceMessage.paused) {
            voiceMessage.pause();
            voiceMessage.currentTime = 0;
            cdDisc.classList.remove("spinning");
            playRecordBtn.textContent = "Listen to My Voice";
            bgMusic.volume = 1.0;
            musicIndicator.classList.remove("hidden");
        }

        // Slide 8 End Animation Sequencing Frame Trigger
        if (index === 7) {
            endingText.classList.add("pop-out-active");
            endingPhoto.classList.remove("visible");
            setTimeout(() => {
                endingPhoto.classList.add("visible");
            }, 1700);
        } else {
            endingText.classList.remove("pop-out-active");
            endingPhoto.classList.remove("visible");
        }
    }

    // Voice Message Ducking System Track Configuration
    playRecordBtn.addEventListener("click", () => {
        if (voiceMessage.paused) {
            bgMusic.volume = 0.05;
            musicIndicator.classList.add("hidden");
            voiceMessage.play();
            cdDisc.classList.add("spinning");
            playRecordBtn.textContent = "Pause Message";
        } else {
            voiceMessage.pause();
            cdDisc.classList.remove("spinning");
            playRecordBtn.textContent = "Listen to My Voice";
            bgMusic.volume = 1.0;
            musicIndicator.classList.remove("hidden");
        }
    });

    voiceMessage.addEventListener("ended", () => {
        cdDisc.classList.remove("spinning");
        playRecordBtn.textContent = "Listen to My Voice";
        bgMusic.volume = 1.0;
        musicIndicator.classList.remove("hidden");
    });

    // Run Question Box Tracking Engine Modules
    function fleeCursor() {
        const context = document.getElementById("q-card-context");
        const maxX = context.clientWidth - noBtn.clientWidth - 20;
        const maxY = context.clientHeight - noBtn.clientHeight - 20;
        
        noBtn.style.left = `${Math.floor(Math.random() * maxX)}px`;
        noBtn.style.top = `${Math.floor(Math.random() * maxY)}px`;
    }

    noBtn.addEventListener("mouseenter", fleeCursor);
    noBtn.addEventListener("click", () => {
        fleeCursor();
        noClickCount++;
        if (noClickCount >= 3) {
            noModal.classList.remove("hidden");
            noClickCount = 0;
        }
    });

    closeNoBtn.addEventListener("click", () => {
        noModal.classList.add("hidden");
        noBtn.style.position = "absolute";
        noBtn.style.left = "165px";
        noBtn.style.top = "auto";
    });

    yesBtn.addEventListener("click", () => {
        yesModal.classList.remove("hidden");
        triggerGiantKissPop();
        miniKissesInterval = setInterval(spawnMiniKiss, 140);
    });

    closeModalBtn.addEventListener("click", () => {
        yesModal.classList.add("hidden");
        clearInterval(miniKissesInterval);
        modalKissesContainer.innerHTML = "";
    });

    function triggerGiantKissPop() {
        const kiss = document.createElement("div");
        kiss.className = "giant-kiss-pop";
        kiss.innerHTML = "💋";
        modalKissesContainer.appendChild(kiss);
        setTimeout(() => kiss.remove(), 1600);
    }

    function spawnMiniKiss() {
        const kiss = document.createElement("div");
        kiss.className = "mini-kiss-node";
        kiss.innerHTML = Math.random() > 0.5 ? "💋" : "🌹";
        kiss.style.left = `${Math.random() * 100}%`;
        kiss.style.bottom = "-5%";
        
        const driftX = (Math.random() - 0.5) * 160;
        const duration = 1800 + Math.random() * 1400;
        modalKissesContainer.appendChild(kiss);
        
        const anim = kiss.animate([
            { transform: 'translateY(0) scale(0.6)', opacity: 1 },
            { transform: `translate(${driftX}px, -100vh) scale(1.3)`, opacity: 0 }
        ], { duration: duration, easing: 'ease-out' });
        
        anim.onfinish = () => kiss.remove();
    }

    // Background Particle Generation Architecture
    function buildStarfield() {
        const field = document.getElementById("starfield");
        for (let i = 0; i < 45; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.width = star.style.height = `${1 + Math.random() * 2}px`;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            field.appendChild(star);
        }
    }

    function startAmbientHearts() {
        const pool = document.getElementById("ambient-hearts");
        for (let i = 0; i < 15; i++) {
            createHeart(pool);
        }
    }

    function createHeart(container) {
        const heart = document.createElement("div");
        let items = ["❤️", "✨", "🌸", "💖"];
        heart.className = "ambient-heart-node beating";
        heart.innerHTML = items[Math.floor(Math.random() * items.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = `${Math.random() * 100}vh`;
        heart.style.transform = `scale(${0.5 + Math.random() * 0.6})`;
        container.appendChild(heart);
        animateHeart(heart);
    }

    function animateHeart(el) {
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;
        const anim = el.animate([
            { top: el.style.top, left: el.style.left },
            { top: `${targetY}px`, left: `${targetX}px` }
        ], { duration: 7000 + Math.random() * 6000, easing: 'ease-in-out' });
        
        anim.onfinish = () => {
            el.style.top = `${targetY}px`;
            el.style.left = `${targetX}px`;
            el.innerHTML = (currentSlide >= 5) ? (Math.random() > 0.5 ? "🌹" : "💋") : (Math.random() > 0.5 ? "💖" : "✨");
            animateHeart(el);
        };
    }
});
