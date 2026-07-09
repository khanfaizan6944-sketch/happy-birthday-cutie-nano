document.addEventListener("DOMContentLoaded", () => {
    
    // UI Layout State Trackers
    let currentSlide = 0;
    const totalSlides = 8;
    let isTransitioning = false;
    
    // Target Component Node Extractions
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

    // --- 1. INTRO ENGINE LOGIC ---
    heartTrigger.addEventListener("click", () => {
        heartTrigger.classList.add("burst-out-effect");
        
        // Unmute and safely initiate background canvas orchestration
        bgMusic.play().then(() => {
            musicIndicator.classList.remove("hidden");
        }).catch(err => console.log("Audio waiting for explicit interact flag."));
        
        setTimeout(() => {
            introOverlay.style.opacity = "0";
            setTimeout(() => {
                introOverlay.style.display = "none";
                startAmbientHearts();
                toggleSlideElements(0); // Wake first active slide processing
            }, 800);
        }, 500);
    });

    // --- 2. STEP-BY-STEP LOCK-PAGER NAVIGATION ---
    function navigateToSlide(targetIndex) {
        if (targetIndex < 0 || targetIndex >= totalSlides || isTransitioning) return;
        
        isTransitioning = true;
        currentSlide = targetIndex;
        
        // Execute structural CSS transformation shifts
        mainSlider.style.transform = `translateY(-${currentSlide * 100}vh)`;
        
        // Sync active slide states
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });
        
        // Sync layout pager dots indicators
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });

        // Trigger individual custom runtime events matching layout indices
        toggleSlideElements(currentSlide);

        setTimeout(() => {
            isTransitioning = false;
        }, 700);
    }

    // Capture Native Browser Wheel Scrolling Inputs
    window.addEventListener("wheel", (e) => {
        if (introOverlay.style.display !== "none") return;
        if (e.deltaY > 0) {
            navigateToSlide(currentSlide + 1);
        } else {
            navigateToSlide(currentSlide - 1);
        }
    }, { passive: true });

    // Mobile Swipe (Touch) Mechanics Processing Engines
    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        if (introOverlay.style.display !== "none") return;
        let touchEndY = e.changedTouches[0].clientY;
        let deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 45) { // Verify swipe intent distance limits
            if (deltaY > 0) {
                navigateToSlide(currentSlide + 1);
            } else {
                navigateToSlide(currentSlide - 1);
            }
        }
    }, { passive: true });

    // --- 3. DYNAMIC PER-SLIDE RUNTIME ENGINE ---
    function toggleSlideElements(index) {
        // Stop any playing video files running on other slides natively
        document.querySelectorAll("video").forEach(v => v.pause());

        // Slide 3 Handle (Autoplay management safely restricted to active view)
        if (index === 2) {
            const activeVideos = slides[2].querySelectorAll("video");
            activeVideos.forEach(v => { v.currentTime = 0; v.play().catch(()=> {}); });
        }

        // Slide 4 Handle: Voice Recording Page Audio Ducking Engine Flow
        if (index === 3) {
            // Retain placeholder structure. System auto handled natively or tracking end flags.
        } else {
            // If user left voice slide safely recover original background state parameters
            if (!voiceMessage.paused) {
                voiceMessage.pause();
                voiceMessage.currentTime = 0;
                cdDisc.classList.remove("spinning");
                playRecordBtn.textContent = "Listen to Me";
                
                // Ramp background volume levels back up smoothly
                bgMusic.volume = 1.0;
                musicIndicator.classList.remove("hidden");
            }
        }

        // Slide 8 Handle: Pop-out Reveal Sequencing Logic
        if (index === 7) {
            endingText.classList.add("pop-out-active");
            endingPhoto.classList.remove("visible");
            
            setTimeout(() => {
                endingPhoto.classList.add("visible");
            }, 1800); // Triggers exactly when text scale-burst achieves maximum blur/opacity drop
        } else {
            // Soft reset to allow animation replay cycles clean execution loops
            endingText.classList.remove("pop-out-active");
            endingPhoto.classList.remove("visible");
        }
    }

    // --- 4. CD PLAYER AUDIO CONTROLS ENGINE ---
    playRecordBtn.addEventListener("click", () => {
        if (voiceMessage.paused) {
            // Duck background music
            bgMusic.volume = 0.05;
            musicIndicator.classList.add("hidden");
            
            voiceMessage.play();
            cdDisc.classList.add("spinning");
            playRecordBtn.textContent = "Pause Message";
        } else {
            voiceMessage.pause();
            cdDisc.classList.remove("spinning");
            playRecordBtn.textContent = "Listen to Me";
            
            bgMusic.volume = 1.0;
            musicIndicator.classList.remove("hidden");
        }
    });

    voiceMessage.addEventListener("ended", () => {
        cdDisc.classList.remove("spinning");
        playRecordBtn.textContent = "Listen to Me";
        bgMusic.volume = 1.0;
        musicIndicator.classList.remove("hidden");
    });

    // --- 5. INTERACTIVE YES/NO QUESTION MACHINE ---
    
    // "No" Escape Positioning Mechanics Vector Calculations
    function fleeCursor() {
        // Query bounding limitations based on actual physical container allocations
        const card = document.querySelector(".question-card");
        const cardWidth = card.clientWidth;
        const cardHeight = card.clientHeight;
        
        // Restrict bounds strictly within padding elements of visual card layers
        const maxX = cardWidth - noBtn.clientWidth - 30;
        const maxY = cardHeight - noBtn.clientHeight - 30;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    }

    noBtn.addEventListener("mouseenter", fleeCursor);
    noBtn.addEventListener("click", () => {
        fleeCursor();
        noClickCount++;
        if (noClickCount >= 3) {
            noModal.classList.remove("hidden");
            noClickCount = 0; // Clear condition tracker
        }
    });

    closeNoBtn.addEventListener("click", () => {
        noModal.classList.add("hidden");
        // Reset No button back to standard location bounds
        noBtn.style.position = "absolute";
        noBtn.style.left = "170px";
        noBtn.style.top = "auto";
    });

    // "Yes" Celebration Activation Engine Sequences
    yesBtn.addEventListener("click", () => {
        yesModal.classList.remove("hidden");
        triggerGiantKissPop();
        
        // Spawn constant stream of small drifting kisses across modal landscape bounds
        miniKissesInterval = setInterval(spawnMiniKiss, 150);
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
        setTimeout(() => kiss.remove(), 1800);
    }

    function spawnMiniKiss() {
        const kiss = document.createElement("div");
        kiss.className = "mini-kiss-node";
        kiss.innerHTML = Math.random() > 0.5 ? "💋" : "❤️";
        kiss.style.left = `${Math.random() * 100}%`;
        kiss.style.bottom = "-5%";
        
        // Randomized horizontal vectors
        const driftX = (Math.random() - 0.5) * 150;
        const duration = 2000 + Math.random() * 1500;
        
        modalKissesContainer.appendChild(kiss);
        
        const animation = kiss.animate([
            { transform: 'translateY(0) scale(0.5) rotate(0deg)', opacity: 1 },
            { transform: `translate(${driftX}px, -105vh) scale(1.2) rotate(${driftX}deg)`, opacity: 0 }
        ], { duration: duration, easing: 'linear' });
        
        animation.onfinish = () => kiss.remove();
    }

    // --- 6. GLOBAL ERRATIC AMBIENT HEARTS ENGINE ---
    function startAmbientHearts() {
        const heartPool = document.getElementById("ambient-hearts");
        const spawnCount = 18; // Clean background concurrency processing limits

        for (let i = 0; i < spawnCount; i++) {
            createPersistentHeart(heartPool);
        }
    }

    function createPersistentHeart(container) {
        const heart = document.createElement("div");
        
        // Dynamic slide condition contextual variables configuration setup
        let currentPoolMix = ["❤️", "✨", "🌸", "💖"];
        
        heart.className = "ambient-heart-node beating";
        heart.innerHTML = currentPoolMix[Math.floor(Math.random() * currentPoolMix.length)];
        
        // Spread starting positions randomly across physical viewport layout matrices
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = `${Math.random() * 100}vh`;
        heart.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
        
        container.appendChild(heart);
        animateErraticHeart(heart);
    }

    function animateErraticHeart(element) {
        const speed = 6000 + Math.random() * 8000;
        
        // Calculate multi-directional vector points randomly
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;
        
        const animation = element.animate([
            { top: element.style.top, left: element.style.left },
            { top: `${targetY}px`, left: `${targetX}px` }
        ], { duration: speed, easing: 'ease-in-out' });
        
        animation.onfinish = () => {
            // Update historical markers prior to recycling thread instance operations
            element.style.top = `${targetY}px`;
            element.style.left = `${targetX}px`;
            
            // Adjust assets elements dynamically when running on final Slide contexts
            if (currentSlide === 5) {
                element.innerHTML = Math.random() > 0.5 ? "🌹" : "💋";
            } else {
                element.innerHTML = Math.random() > 0.5 ? "💖" : "✨";
            }
            
            animateErraticHeart(element);
        };
    }
});
