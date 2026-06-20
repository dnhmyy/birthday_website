/* script.js */

(function () {
    "use strict";

    // Lock scroll saat amplop belum dibuka
    document.documentElement.classList.add("locked");

    /* --- INITIALIZATION & GLOBAL VARIABLES --- */
    var envelopeScreen = document.getElementById("envelope-screen");
    var envelopeBtn = document.getElementById("envelope-btn");
    var envelope = envelopeBtn.querySelector(".envelope");
    var audio = document.getElementById("bg-audio");
    var musicBtn = document.getElementById("music-toggle");
    var playing = false;
    var envelopeOpened = false;

    /* --- MUSIC CONTROLLER --- */
    musicBtn.addEventListener("click", function () {
        if (!playing) {
            audio.play().then(function () {
                musicBtn.classList.add("playing");
                playing = true;
            }).catch(function (err) {
                console.warn("Audio playback failed:", err);
            });
        } else {
            audio.pause();
            musicBtn.classList.remove("playing");
            playing = false;
        }
    });

    /* --- ENVELOPE HANDLER --- */
    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;
        envelope.classList.add("open");

        // Autoplay musik setelah user klik amplop
        if (!playing) {
            audio.play().then(function () {
                playing = true;
                musicBtn.classList.add("playing");
            }).catch(function (err) {
                console.warn("Autoplay blocked:", err);
            });
        }

        // Transisi hilangkan amplop & tampilkan chat screen
        setTimeout(function () {
            envelopeScreen.classList.add("fade-out");
            document.documentElement.classList.remove("locked");

            // Efek berhamburan saat pertama buka
            burstPetals(15);
            burstHearts(10);
            startAmbientPetals();

            // Jalankan chat otomatis
            setTimeout(startChatSimulation, 500);
        }, 850);

        // Hapus elemen amplop dari DOM setelah fade out selesai
        setTimeout(function () {
            if (envelopeScreen && envelopeScreen.parentNode) {
                envelopeScreen.parentNode.removeChild(envelopeScreen);
            }
        }, 1800);
    }

    envelopeBtn.addEventListener("click", openEnvelope);
    envelopeBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEnvelope();
        }
    });

    /* --- PARTICLE & EFFECTS ENGINE --- */
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var petalField = document.getElementById("petal-field");
    var flowerEmojis = ["🌸", "🌹", "🌷", "🌺", "🌼", "💐"];

    // Fungsi spawn kelopak bunga jatuh
    function spawnPetal() {
        if (reducedMotion) return;

        var p = document.createElement("div");
        p.className = "petal";
        p.innerHTML = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];

        p.style.left = (Math.random() * 100) + "vw";
        p.style.setProperty("--petal-size", (12 + Math.random() * 12) + "px");
        p.style.setProperty("--drift", (Math.random() * 150 - 75) + "px");
        p.style.setProperty("--spin", (Math.random() * 360) + "deg");

        var duration = 6 + Math.random() * 6;
        p.style.animationDuration = duration + "s";

        petalField.appendChild(p);
        setTimeout(function () {
            if (p.parentNode) p.parentNode.removeChild(p);
        }, duration * 1000 + 200);
    }

    function burstPetals(n) {
        for (var i = 0; i < n; i++) {
            setTimeout(spawnPetal, i * 40);
        }
    }

    var ambientInterval;
    function startAmbientPetals() {
        if (reducedMotion) return;
        ambientInterval = setInterval(spawnPetal, 700);
    }

    // Fungsi spawn balon hati melayang dari bawah
    var heartsContainer = document.getElementById("hearts-container");

    function spawnHeart() {
        if (reducedMotion) return;

        var heart = document.createElement("div");
        heart.className = "heart-pop";
        heart.innerHTML = "💖";

        heart.style.left = (Math.random() * 90 + 5) + "vw";
        heart.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
        heart.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
        heart.style.setProperty("--size", (15 + Math.random() * 20) + "px");

        var duration = 3 + Math.random() * 2;
        heart.style.animationDuration = duration + "s";

        heartsContainer.appendChild(heart);

        setTimeout(function () {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, duration * 1000 + 100);
    }

    function burstHearts(n) {
        for (var i = 0; i < n; i++) {
            setTimeout(spawnHeart, i * 80);
        }
    }

    /* --- CHAT CONFIGURATION (FITUR CHATTAN) --- */
    var chatBox = document.getElementById("chat-box");
    var chatReplyBtn = document.getElementById("chat-reply-btn");
    var chatReplyPlaceholder = document.getElementById("chat-reply-placeholder");
    var cakeSurprise = document.getElementById("cake-surprise");
    var candleFlame = document.getElementById("candle-flame");
    var mainContent = document.getElementById("main-content");
    var birthdayMainPage = document.getElementById("birthday-main-page");

    /**
     * PANDUAN EDIT PESAN CHAT:
     * - type: "incoming" -> Pesan dari kamu untuk dia (kiri, warna cream)
     * - type: "outgoing" -> Tombol balasan dari dia untuk kamu (kanan, warna wine)
     * Silakan edit teks di bawah sesuai keinginan Anda.
     */
    var chatSteps = [
        { type: "incoming", text: "aloo sayang! selamat ulang tahun yaaaa... 🎂✨" },
        { type: "incoming", text: "makasii udah lahir ke dunia ini, dan timakasii jugaa udah selalu jadi bagian terbaik di hari-hari aku." },
        { type: "outgoing", text: "aaa makasih banyak yaaa sayangg! ❤️🥺" },
        { type: "incoming", text: "sama-sama cintakuu. Oh iya, aku punya kado kecil buat kamu di sini..." },
        { type: "outgoing", text: "kado apa emangnyaa? penasaran bgt! 😍" },
        { type: "incoming", text: "hehe sebentar sayangkuu..." },
        { type: "incoming", text: "sebelum kado aslinya, ada kue virtual kecil dulu di sebelah kanan (atau bawah kalau di HP)." },
        { type: "incoming", text: "sekarang coba tutup mata kamu sebentar, ucapin doa terbaik kamu di dalam hatii yaaa..." },
        { type: "incoming", text: "kalau udah, kamu tiup lilinnya yaa! 🕯️❤️" }
    ];

    var currentStep = 0;
    var isChatting = false;
    var typingTimeout = null;
    var nextBubbleTimeout = null;

    /* --- CHAT ENGINE FUNCTIONALITY --- */
    function startChatSimulation() {
        if (isChatting) return;
        isChatting = true;
        chatBox.innerHTML = "";
        cakeSurprise.classList.add("cake-hidden");
        currentStep = 0;
        sendNextBubble();
    }

    function sendNextBubble() {
        clearTimeout(typingTimeout);
        clearTimeout(nextBubbleTimeout);

        if (currentStep >= chatSteps.length) {
            // Sembunyikan bar input saat chat selesai
            chatReplyBtn.style.display = "none";
            chatReplyPlaceholder.style.display = "none";
            // Tampilkan section lilin setelah alur chat selesai
            cakeSurprise.classList.remove("cake-hidden");
            cakeSurprise.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        var step = chatSteps[currentStep];

        if (step.type === "incoming") {
            // Saat incoming: tampilkan placeholder, sembunyikan tombol
            chatReplyPlaceholder.style.display = "block";
            chatReplyBtn.style.display = "none";

            var typingIndicator = document.querySelector(".chat-status");
            typingIndicator.textContent = "sedang mengetik...";
            typingIndicator.style.color = "var(--brand-rose)";

            typingTimeout = setTimeout(function () {
                typingIndicator.textContent = "online";
                typingIndicator.style.color = "var(--brand-sage)";

                appendBubble(step.text, "incoming");
                currentStep++;

                nextBubbleTimeout = setTimeout(sendNextBubble, 450);
            }, 800);
        } else {
            // Saat outgoing: sembunyikan placeholder, tampilkan tombol
            chatReplyPlaceholder.style.display = "none";
            chatReplyBtn.style.display = "block";
            chatReplyBtn.textContent = step.text;
        }
    }

    if (chatReplyBtn) {
        chatReplyBtn.addEventListener("click", function () {
            clearTimeout(typingTimeout);
            clearTimeout(nextBubbleTimeout);

            var step = chatSteps[currentStep];
            appendBubble(step.text, "outgoing");
            chatReplyBtn.style.display = "none";
            chatReplyPlaceholder.style.display = "block";

            currentStep++;
            nextBubbleTimeout = setTimeout(sendNextBubble, 500);
        });
    }

    function appendBubble(text, sender) {
        var bubble = document.createElement("div");
        bubble.className = "chat-bubble " + sender;
        bubble.textContent = text;
        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /* --- INTERACTIVE CANDLE SURPRISE (Meniup Lilin) --- */
    if (candleFlame) {
        candleFlame.addEventListener("click", function () {
            candleFlame.classList.add("blown");
            document.getElementById("cake-instruction").textContent = "✨ Lilin padam! Permohonanmu terkabul! ✨";
            burstHearts(25);

            // Transisi masuk ke website utama ucapan ultah
            setTimeout(function () {
                mainContent.classList.add("fade-out-chat");

                setTimeout(function () {
                    if (mainContent && mainContent.parentNode) {
                        mainContent.parentNode.removeChild(mainContent);
                    }
                    birthdayMainPage.classList.remove("main-page-hidden");

                    var mainRevealEls = birthdayMainPage.querySelectorAll('.reveal');
                    if (observer) {
                        mainRevealEls.forEach(function (el) { observer.observe(el); });
                    } else {
                        mainRevealEls.forEach(function (el) { el.classList.add("in-view"); });
                    }
                }, 800);
            }, 2500);
        });
    }

    /* --- SCROLL REVEAL MANAGER --- */
    var revealEls = document.querySelectorAll(".reveal");
    var observer;

    if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) { observer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }

})();
