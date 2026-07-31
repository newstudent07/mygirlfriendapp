/**
 * National Girlfriend's Day Interactive Script
 * Provides canvas animations, audio effects, mini-games, card deck, and interactive letter.
 */

// Global Audio Synthesizer (Web Audio API for zero external dependencies)
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playPop() {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

function playChime() {
  if (!soundEnabled) return;
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  } catch (e) {}
}

function playSadBuzzer() {
  if (!soundEnabled) return;
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Descending sad synth tone
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
    
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {}
}

function spawnSadEmojis(targetEl) {
  const sadEmojis = ['😢', '🥺', '💔', '😿', '🌧️', '😭'];
  const rect = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.className = 'floating-kiss';
      emoji.innerText = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
      
      const offsetX = (Math.random() - 0.5) * (rect.width || 120);
      emoji.style.left = `${rect.left + (rect.width || 100) / 2 + offsetX}px`;
      emoji.style.top = `${rect.top}px`;

      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 1200);
    }, i * 80);
  }
}

// -------------------------------------------------------------
// 1. Floating Canvas Heart Particles
// -------------------------------------------------------------
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = -100, mouseY = -100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || canvas.height + Math.random() * 50;
    this.size = Math.random() * 14 + 8;
    this.speedY = Math.random() * 1.2 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.color = ['#ffccd5', '#ff758f', '#ff4d6d', '#ffb3c1', '#e8a598'][Math.floor(Math.random() * 5)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    
    // Draw heart shape
    ctx.beginPath();
    const topCurveHeight = this.size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
    ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
    ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
    ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
    this.rotation += this.rotSpeed;

    // Reset particle if it goes off top screen
    if (this.y < -30) {
      this.y = canvas.height + 20;
      this.x = Math.random() * canvas.width;
    }
  }
}

// Populate particles
for (let i = 0; i < 35; i++) {
  particles.push(new HeartParticle());
}

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (Math.random() < 0.15) {
    particles.push(new HeartParticle(mouseX, mouseY));
    if (particles.length > 50) particles.shift();
  }
});

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// -------------------------------------------------------------
// 2. Reasons Why I Love You Card Deck
// -------------------------------------------------------------
const defaultReasons = [
  { title: "Reason #1", text: "The way your eyes light up whenever you laugh from the bottom of your heart. 💖", icon: "✨" },
  { title: "Reason #2", text: "How cozy and safe it feels just holding your hand on a quiet walk. 🤝", icon: "🌸" },
  { title: "Reason #3", text: "Your incredible kindness and how deeply you care for everyone around you. 💌", icon: "🎀" },
  { title: "Reason #4", text: "The sweet random texts you send me that instantly brighten my busiest days. 📱💕", icon: "💬" },
  { title: "Reason #5", text: "Your adorable forehead kisses and warm bear hugs. 🧸", icon: "🤗" },
  { title: "Reason #6", text: "How we can talk for hours about everything or sit in comfortable silence together. ☕", icon: "🌙" },
  { title: "Reason #7", text: "Your contagious smile that makes all my worries melt away in seconds. 😊", icon: "☀️" },
  { title: "Reason #8", text: "How you always know how to make me laugh even on tough days. 🎨", icon: "🎈" },
  { title: "Reason #9", text: "Our late-night cozy chats and shared dream itineraries for the future. ✈️", icon: "🌌" },
  { title: "Reason #10", text: "Simply put: You are my absolute best friend and favorite person in the whole universe. 🪐💖", icon: "👑" }
];

let currentCardIndex = 0;
let isFlipped = false;

const reasonCardInner = document.getElementById('reasonCardInner');
const cardTitleFront = document.getElementById('cardTitleFront');
const cardIconFront = document.getElementById('cardIconFront');
const cardTextBack = document.getElementById('cardTextBack');
const cardCounter = document.getElementById('cardCounter');

function updateCardContent() {
  const current = defaultReasons[currentCardIndex];
  cardTitleFront.innerText = current.title;
  cardIconFront.innerText = current.icon;
  cardTextBack.innerText = current.text;
  cardCounter.innerText = `${currentCardIndex + 1} of ${defaultReasons.length}`;
}

function flipCard() {
  isFlipped = !isFlipped;
  playPop();
  if (isFlipped) {
    reasonCardInner.classList.add('is-flipped');
  } else {
    reasonCardInner.classList.remove('is-flipped');
  }
}

function nextReason() {
  if (isFlipped) {
    reasonCardInner.classList.remove('is-flipped');
    isFlipped = false;
    setTimeout(() => {
      currentCardIndex = (currentCardIndex + 1) % defaultReasons.length;
      updateCardContent();
      playPop();
    }, 300);
  } else {
    currentCardIndex = (currentCardIndex + 1) % defaultReasons.length;
    updateCardContent();
    playPop();
  }
}

function prevReason() {
  if (isFlipped) {
    reasonCardInner.classList.remove('is-flipped');
    isFlipped = false;
    setTimeout(() => {
      currentCardIndex = (currentCardIndex - 1 + defaultReasons.length) % defaultReasons.length;
      updateCardContent();
      playPop();
    }, 300);
  } else {
    currentCardIndex = (currentCardIndex - 1 + defaultReasons.length) % defaultReasons.length;
    updateCardContent();
    playPop();
  }
}

function shuffleReasons() {
  currentCardIndex = Math.floor(Math.random() * defaultReasons.length);
  if (isFlipped) {
    reasonCardInner.classList.remove('is-flipped');
    isFlipped = false;
    setTimeout(updateCardContent, 300);
  } else {
    updateCardContent();
  }
  playChime();
}

// Modal for adding custom reason
function openAddReasonModal() {
  document.getElementById('addReasonModal').classList.remove('hidden');
  document.getElementById('addReasonModal').classList.add('flex');
}
function closeAddReasonModal() {
  document.getElementById('addReasonModal').classList.add('hidden');
  document.getElementById('addReasonModal').classList.remove('flex');
}
function saveCustomReason() {
  const input = document.getElementById('customReasonInput').value.trim();
  if (input) {
    defaultReasons.push({
      title: `Reason #${defaultReasons.length + 1}`,
      text: input,
      icon: "💌"
    });
    currentCardIndex = defaultReasons.length - 1;
    updateCardContent();
    closeAddReasonModal();
    document.getElementById('customReasonInput').value = '';
    playChime();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  }
}

// -------------------------------------------------------------
// 3. Love Quiz Mini-Game
// -------------------------------------------------------------
const quizQuestions = [
  {
    question: "1. Where was our very first memorable date?",
    options: [
      { text: "Movie Date 🎬🍿", correct: true },
      { text: "Cozy Little Cafe ☕", correct: false },
      { text: "Romantic Dinner Under Lights 🍷", correct: false },
      { text: "Spontaneous Ice Cream Trip 🍦", correct: false }
    ],
    hint: "Think about popcorn, dark theater, and holding hands!"
  },
  {
    question: "2. What is my favorite food?",
    options: [
      { text: "Kebab Platter 🍢", correct: false },
      { text: "Chowmein 🍜", correct: false },
      { text: "Biryani 🍲", correct: false },
      { text: "SANCHITA! (The sweetest treat of all) 💖👑", correct: true }
    ],
    hint: "Because no food in the world is as sweet as YOU!"
  },
  {
    question: "3. What is my absolute favorite thing about you?",
    options: [
      { text: "Your gorgeous, contagious smile 😊", correct: false },
      { text: "Your warm & compassionate heart ❤️", correct: false },
      { text: "The adorable way you laugh at silly jokes 🤭", correct: false },
      { text: "ALL OF THE ABOVE & INFINITELY MORE! 🏆👑", correct: true }
    ],
    hint: "Think BIG! You are the complete package!"
  }
];

let currentQuizIdx = 0;
let quizScore = 0;

function renderQuiz() {
  const qContainer = document.getElementById('quizContainer');
  const q = quizQuestions[currentQuizIdx];

  let optionsHTML = q.options.map((opt, idx) => `
    <button id="quizOptBtn_${idx}" onclick="handleQuizAnswer(${idx}, ${opt.correct})" class="quiz-btn w-full text-left p-4 rounded-2xl border-2 border-pink-200 bg-white/70 hover:bg-pink-50 hover:border-pink-400 transition-all font-semibold text-rose-900 flex items-center justify-between group cursor-pointer">
      <span>${opt.text}</span>
      <span class="opt-icon w-6 h-6 rounded-full border border-pink-300 group-hover:bg-rose-400 transition-colors flex items-center justify-center text-white text-xs font-bold">?</span>
    </button>
  `).join('');

  qContainer.innerHTML = `
    <div class="mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">Question ${currentQuizIdx + 1} of ${quizQuestions.length}</span>
      <h3 class="text-xl font-bold font-serif text-rose-950 mt-2">${q.question}</h3>
    </div>
    <div class="space-y-3">${optionsHTML}</div>
    <div id="quizFeedbackBox" class="mt-4 hidden"></div>
  `;
}

function handleQuizAnswer(idx, isCorrect) {
  // Disable all quiz buttons immediately to prevent duplicate clicks
  const allBtns = document.querySelectorAll('.quiz-btn');
  allBtns.forEach(b => b.disabled = true);

  const btn = document.getElementById(`quizOptBtn_${idx}`);
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const currentQ = quizQuestions[currentQuizIdx];

  if (isCorrect) {
    quizScore++;
    playChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    
    if (btn) {
      btn.classList.remove('bg-white/70', 'border-pink-200');
      btn.classList.add('bg-emerald-100', 'border-emerald-400', 'text-emerald-900', 'scale-[1.02]');
      const icon = btn.querySelector('.opt-icon');
      if (icon) icon.innerText = '✓';
    }

    if (feedbackBox) {
      feedbackBox.className = "mt-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-center text-xs font-bold font-serif flex items-center justify-center gap-2 animate-bounce";
      feedbackBox.innerHTML = `<span>✨ Correct! You know us so well! 💖</span>`;
    }
  } else {
    playSadBuzzer();
    spawnSadEmojis(btn);

    if (btn) {
      btn.classList.remove('bg-white/70', 'border-pink-200');
      btn.classList.add('bg-rose-100', 'border-rose-400', 'text-rose-900', 'animate-shake');
      const icon = btn.querySelector('.opt-icon');
      if (icon) icon.innerText = '❌';
    }

    // Highlight the correct answer option
    currentQ.options.forEach((opt, oIdx) => {
      if (opt.correct) {
        const correctBtn = document.getElementById(`quizOptBtn_${oIdx}`);
        if (correctBtn) {
          correctBtn.classList.remove('bg-white/70', 'border-pink-200');
          correctBtn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-900');
          const cIcon = correctBtn.querySelector('.opt-icon');
          if (cIcon) cIcon.innerText = '✓';
        }
      }
    });

    if (feedbackBox) {
      const correctOpt = currentQ.options.find(o => o.correct);
      feedbackBox.className = "mt-4 p-3.5 bg-rose-100/90 border border-rose-300 text-rose-800 rounded-2xl text-center text-xs font-bold font-serif flex items-center justify-center gap-2";
      feedbackBox.innerHTML = `<span>😭 Oops! Wrong Answer 💔 (Correct: ${correctOpt ? correctOpt.text : ''})</span>`;
    }
  }

  currentQuizIdx++;

  const delay = isCorrect ? 900 : 1800;

  if (currentQuizIdx < quizQuestions.length) {
    setTimeout(renderQuiz, delay);
  } else {
    setTimeout(showQuizVictory, delay);
  }
}

function showQuizVictory() {
  const qContainer = document.getElementById('quizContainer');
  playChime();
  confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });

  const scoreText = quizScore === 3 
    ? "You scored 3/3! You know our love story by heart! 🏆💖"
    : `You scored ${quizScore}/3! No matter what, every moment with you is my favorite memory! 💕`;

  qContainer.innerHTML = `
    <div class="text-center py-6 space-y-4 animate-fadeIn">
      <div class="text-6xl animate-bounce">🏆💖</div>
      <h3 class="text-2xl font-bold font-serif text-rose-900">100% Soulmate Match Confirmed!</h3>
      <p class="text-rose-700 font-medium">${scoreText}</p>
      <button onclick="resetQuiz()" class="px-6 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-pink-300 hover:scale-105 transition-all cursor-pointer">Play Again 🔄</button>
    </div>
  `;
}

function resetQuiz() {
  currentQuizIdx = 0;
  quizScore = 0;
  renderQuiz();
}

// -------------------------------------------------------------
// 4. Love Meter & Kiss Counter
// -------------------------------------------------------------
const loveSlider = document.getElementById('loveSlider');
const lovePercentVal = document.getElementById('lovePercentVal');
const loveStatusMsg = document.getElementById('loveStatusMsg');

const statusMessages = [
  { max: 100, text: "I love you to the moon and back! 🌙" },
  { max: 300, text: "My love is overflowing beyond capacity! 🌊💖" },
  { max: 600, text: "Affection levels off the charts! 🚀✨" },
  { max: 999, text: "Out of this galaxy love! You hold my whole heart! 🪐👑" },
  { max: 1000, text: "ERROR 404: CAPACITY EXCEEDED! Infinite love unlocked forever! ♾️❤️🔥" }
];

function updateLoveMeter(val) {
  lovePercentVal.innerText = `${val}%`;
  const matched = statusMessages.find(m => val <= m.max) || statusMessages[statusMessages.length - 1];
  loveStatusMsg.innerText = matched.text;
  playPop();

  if (val >= 1000) {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
  }
}

if (loveSlider) {
  loveSlider.addEventListener('input', (e) => updateLoveMeter(e.target.value));
}

// Kiss Counter
let kissCount = parseInt(localStorage.getItem('gf_day_kisses') || '0');
const kissCountEl = document.getElementById('kissCountEl');

if (kissCountEl) {
  kissCountEl.innerText = kissCount;
}

function sendKiss(e) {
  kissCount++;
  localStorage.setItem('gf_day_kisses', kissCount);
  if (kissCountEl) kissCountEl.innerText = kissCount;
  playPop();

  // Create floating emoji at click location
  const emoji = document.createElement('div');
  emoji.className = 'floating-kiss';
  const emojis = ['💋', '💖', '😘', '💕', '✨'];
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  
  const rect = e.target.getBoundingClientRect();
  emoji.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
  emoji.style.top = `${rect.top}px`;

  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 1200);
}

function resetKissCounter() {
  kissCount = 0;
  localStorage.setItem('gf_day_kisses', '0');
  if (kissCountEl) kissCountEl.innerText = '0';
  playPop();
}

// -------------------------------------------------------------
// 5. Polaroid Lightbox & Custom Memories Management
// -------------------------------------------------------------
function openLightbox(imgSrc, title, caption) {
  document.getElementById('lightboxImg').src = imgSrc;
  document.getElementById('lightboxTitle').innerText = title;
  document.getElementById('lightboxCaption').innerText = caption;
  document.getElementById('lightboxModal').classList.remove('hidden');
  document.getElementById('lightboxModal').classList.add('flex');
  playPop();
}

function closeLightbox() {
  document.getElementById('lightboxModal').classList.add('hidden');
  document.getElementById('lightboxModal').classList.remove('flex');
}

// Add Custom Memory Modal Handlers
function openAddMemoryModal() {
  document.getElementById('addMemoryModal').classList.remove('hidden');
  document.getElementById('addMemoryModal').classList.add('flex');
  playPop();
}

function closeAddMemoryModal() {
  document.getElementById('addMemoryModal').classList.add('hidden');
  document.getElementById('addMemoryModal').classList.remove('flex');
}

function saveCustomMemory() {
  const urlInput = document.getElementById('memoryImgInput').value.trim();
  const fileInput = document.getElementById('memoryFileInput');
  const title = document.getElementById('memoryTitleInput').value.trim() || 'New Memory 💖';
  const tag = document.getElementById('memoryTagInput').value.trim() || 'Special Day';
  const caption = document.getElementById('memoryCaptionInput').value.trim() || 'A sweet moment together!';

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgSrc = e.target.result;
      addMemoryToStoreAndDOM({ imgSrc, title, tag, caption });
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else if (urlInput) {
    addMemoryToStoreAndDOM({ imgSrc: urlInput, title, tag, caption });
  } else {
    alert('Please enter an image URL or choose a local photo!');
    return;
  }
}

function addMemoryToStoreAndDOM(mem) {
  const stored = JSON.parse(localStorage.getItem('gf_day_custom_memories') || '[]');
  stored.push(mem);
  localStorage.setItem('gf_day_custom_memories', JSON.stringify(stored));

  renderCustomMemories();
  closeAddMemoryModal();

  // Clear inputs
  document.getElementById('memoryImgInput').value = '';
  document.getElementById('memoryFileInput').value = '';
  document.getElementById('memoryTitleInput').value = '';
  document.getElementById('memoryTagInput').value = '';
  document.getElementById('memoryCaptionInput').value = '';

  playChime();
  confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
}

function renderCustomMemories() {
  const container = document.getElementById('customMemoriesContainer');
  if (!container) return;

  const stored = JSON.parse(localStorage.getItem('gf_day_custom_memories') || '[]');
  const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

  container.innerHTML = stored.map((mem, idx) => {
    const tilt = tilts[idx % tilts.length];
    const safeTitle = mem.title.replace(/'/g, "\\'");
    const safeCaption = mem.caption.replace(/'/g, "\\'");
    return `
      <div class="polaroid-card cursor-pointer ${tilt}" onclick="openLightbox('${mem.imgSrc}', '${safeTitle}', '${safeCaption}')">
        <div class="polaroid-tape"></div>
        <div class="overflow-hidden rounded bg-rose-50 aspect-square">
          <img src="${mem.imgSrc}" alt="${mem.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
        </div>
        <div class="pt-3 text-center">
          <p class="font-serif font-bold text-rose-900 text-base">${mem.title}</p>
          <p class="text-xs text-rose-500 font-medium">${mem.tag}</p>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 5.5. Video Carousel Controller & Management
// -------------------------------------------------------------
const defaultVideoList = [];

let currentVideoIdx = 0;

window.runtimeVideos = window.runtimeVideos || [];

function getVideoList() {
  const custom = JSON.parse(localStorage.getItem('gf_day_custom_videos') || '[]');
  const runtime = window.runtimeVideos || [];
  
  const merged = [...defaultVideoList];
  
  custom.forEach(cv => {
    if (!merged.some(m => m.src === cv.src && m.title === cv.title)) {
      merged.push(cv);
    }
  });

  runtime.forEach(rv => {
    if (!merged.some(m => m.src === rv.src && m.title === rv.title)) {
      merged.push(rv);
    }
  });

  return merged;
}

function updateVideoCarousel() {
  const list = getVideoList();

  const player = document.getElementById('carouselVideoPlayer');
  const source = document.getElementById('videoSource');
  const titleEl = document.getElementById('videoTitleText');
  const tagEl = document.getElementById('videoCategoryTag');
  const dateEl = document.getElementById('videoDateTag');
  const captionEl = document.getElementById('videoCaptionText');
  const numEl = document.getElementById('currentVideoIndexNum');
  const dotsEl = document.getElementById('videoDotsContainer');
  const stripEl = document.getElementById('videoThumbnailsStrip');

  if (list.length === 0) {
    if (titleEl) titleEl.innerText = "Your Cinema Reel 🎞️";
    if (tagEl) tagEl.innerText = "Add Your Clip 💖";
    if (dateEl) dateEl.innerText = "Ready For Your Memories";
    if (captionEl) captionEl.innerText = "Click '+ Add Video Clip 🎥' above to upload your favorite video snippet!";
    if (numEl) numEl.innerText = "0/0";
    if (dotsEl) dotsEl.innerHTML = "";
    if (stripEl) stripEl.innerHTML = `<div class="text-xs text-rose-400 font-medium italic py-2">Click "+ Add Video Clip 🎥" above to build your private video reel!</div>`;
    return;
  }

  if (currentVideoIdx >= list.length) currentVideoIdx = 0;
  if (currentVideoIdx < 0) currentVideoIdx = list.length - 1;

  const current = list[currentVideoIdx];

  if (source && player && source.src !== current.src) {
    source.src = current.src;
    player.load();
    player.play().catch(() => {}); // Attempt autoplay upon slide change
  }

  if (titleEl) titleEl.innerText = current.title;
  if (tagEl) tagEl.innerText = current.tag;
  if (dateEl) dateEl.innerText = current.date;
  if (captionEl) captionEl.innerText = current.caption;
  if (numEl) numEl.innerText = `${currentVideoIdx + 1}/${list.length}`;

  if (dotsEl) {
    dotsEl.innerHTML = list.map((_, idx) => `
      <button onclick="goToVideoSlide(${idx})" class="w-3 h-3 rounded-full transition-all cursor-pointer ${idx === currentVideoIdx ? 'bg-rose-500 scale-125' : 'bg-rose-200 hover:bg-rose-300'}"></button>
    `).join('');
  }

  if (stripEl) {
    stripEl.innerHTML = list.map((item, idx) => {
      const isActive = idx === currentVideoIdx;
      return `
        <button onclick="goToVideoSlide(${idx})" class="film-thumb group flex-shrink-0 w-36 p-2 rounded-2xl border-2 transition-all cursor-pointer text-left ${isActive ? 'active-thumb bg-rose-100/90 border-rose-500 shadow-md' : 'bg-white/90 border-rose-200 hover:border-rose-400 hover:scale-[1.02]'}">
          <div class="relative w-full h-20 rounded-xl bg-black overflow-hidden flex items-center justify-center border border-rose-100">
            <video src="${item.src}" class="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" preload="metadata"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
              <span class="w-7 h-7 rounded-full bg-rose-500/90 text-white flex items-center justify-center text-xs shadow-md font-bold group-hover:scale-110 transition-transform">▶</span>
            </div>
          </div>
          <p class="text-xs font-bold font-serif text-rose-950 truncate mt-1.5 px-0.5">${item.title}</p>
        </button>
      `;
    }).join('');
  }
}

function nextVideoSlide() {
  const list = getVideoList();
  currentVideoIdx = (currentVideoIdx + 1) % list.length;
  updateVideoCarousel();
  playPop();
}

function prevVideoSlide() {
  const list = getVideoList();
  currentVideoIdx = (currentVideoIdx - 1 + list.length) % list.length;
  updateVideoCarousel();
  playPop();
}

function goToVideoSlide(idx) {
  currentVideoIdx = idx;
  updateVideoCarousel();
  playPop();
}

function openAddVideoModal() {
  document.getElementById('addVideoModal').classList.remove('hidden');
  document.getElementById('addVideoModal').classList.add('flex');
  playPop();
}

function closeAddVideoModal() {
  document.getElementById('addVideoModal').classList.add('hidden');
  document.getElementById('addVideoModal').classList.remove('flex');
}

function saveCustomVideo() {
  const urlInput = document.getElementById('videoUrlInput').value.trim();
  const fileInput = document.getElementById('videoFileInput');
  const title = document.getElementById('videoTitleInput').value.trim() || 'Our Video Clip 🎥';
  const tag = document.getElementById('videoTagInput').value.trim() || 'Memories';
  const date = 'Special Clip';
  const caption = document.getElementById('videoCaptionInput').value.trim() || 'A sweet moment saved in motion!';

  if (fileInput && fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const src = URL.createObjectURL(file);
    addVideoToStore({ src, title, tag, date, caption });
  } else if (urlInput) {
    addVideoToStore({ src: urlInput, title, tag, date, caption });
  } else {
    alert('Please pick a video file or enter a video URL/path!');
    return;
  }
}

function addVideoToStore(v) {
  if (!window.runtimeVideos) window.runtimeVideos = [];
  window.runtimeVideos.push(v);

  // Try saving to localStorage for non-blob URLs
  if (!v.src.startsWith('blob:')) {
    try {
      const custom = JSON.parse(localStorage.getItem('gf_day_custom_videos') || '[]');
      custom.push(v);
      localStorage.setItem('gf_day_custom_videos', JSON.stringify(custom));
    } catch(e) {
      console.warn('LocalStorage quota limit reached for video URL, active in current session.', e);
    }
  }

  const list = getVideoList();
  currentVideoIdx = list.length - 1;
  updateVideoCarousel();
  closeAddVideoModal();

  document.getElementById('videoUrlInput').value = '';
  document.getElementById('videoFileInput').value = '';
  document.getElementById('videoTitleInput').value = '';
  document.getElementById('videoTagInput').value = '';
  document.getElementById('videoCaptionInput').value = '';

  playChime();
  confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
}

// -------------------------------------------------------------
// 6. Secret Love Letter Envelope
// -------------------------------------------------------------
function toggleEnvelope() {
  const env = document.getElementById('loveEnvelope');
  env.classList.toggle('open');
  playChime();
  if (env.classList.contains('open')) {
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
  }
}

// -------------------------------------------------------------
// 7. Full Love Explosion CTA
// -------------------------------------------------------------
function triggerLoveExplosion() {
  playChime();
  
  // Launch multiple confetti bursts
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4d6d', '#ffccd5'] });
  fire(0.2, { spread: 60, colors: ['#c9184a', '#ffffff'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#ff758f', '#e8a598'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffccd5'] });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#ff4d6d'] });

  // Show Toast
  const toast = document.getElementById('loveToast');
  if (toast) {
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 4000);
  }
}

// -------------------------------------------------------------
// 8. Subtle Romantic Background Music System
// -------------------------------------------------------------
let musicPlaying = false;
let synthMusicInterval = null;
let synthMelodyIndex = 0;
let synthFilterNode = null;
let userHasInteracted = false;

// Cozy Music Box Melody Notes (Cmaj7 - Am7 - Fmaj7 - G6 progression in Hz)
const subtleMelody = [
  { note: 261.63, dur: 0.8 }, { note: 329.63, dur: 0.8 }, { note: 392.00, dur: 0.8 }, { note: 493.88, dur: 1.2 },
  { note: 392.00, dur: 0.8 }, { note: 329.63, dur: 0.8 },
  { note: 220.00, dur: 0.8 }, { note: 261.63, dur: 0.8 }, { note: 329.63, dur: 0.8 }, { note: 392.00, dur: 1.2 },
  { note: 329.63, dur: 0.8 }, { note: 261.63, dur: 0.8 },
  { note: 174.61, dur: 0.8 }, { note: 220.00, dur: 0.8 }, { note: 261.63, dur: 0.8 }, { note: 329.63, dur: 1.2 },
  { note: 261.63, dur: 0.8 }, { note: 220.00, dur: 0.8 },
  { note: 196.00, dur: 0.8 }, { note: 246.94, dur: 0.8 }, { note: 293.66, dur: 0.8 }, { note: 329.63, dur: 1.2 },
  { note: 293.66, dur: 0.8 }, { note: 246.94, dur: 0.8 }
];

function playSynthNote(freq, dur) {
  if (!audioCtx || !musicPlaying || !soundEnabled) return;
  try {
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    const now = audioCtx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.035, now + 0.12);
    noteGain.gain.exponentialRampToValueAtTime(0.0005, now + dur + 0.4);

    if (!synthFilterNode) {
      synthFilterNode = audioCtx.createBiquadFilter();
      synthFilterNode.type = 'lowpass';
      synthFilterNode.frequency.setValueAtTime(900, audioCtx.currentTime);
      synthFilterNode.connect(audioCtx.destination);
    }

    osc.connect(noteGain);
    noteGain.connect(synthFilterNode);
    
    osc.start(now);
    osc.stop(now + dur + 0.5);
  } catch(e) {}
}

function startSubtleMusic() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const bgAudio = document.getElementById('bgAudio');
  if (bgAudio) {
    bgAudio.volume = 0.3;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicPlaying = true;
        updateMusicUI();
      }).catch(() => {
        // Fallback to built-in ambient synth melody if external audio stream is blocked or unavailable
        startSynthMelody();
      });
      return;
    }
  }

  startSynthMelody();
}

function startSynthMelody() {
  musicPlaying = true;
  updateMusicUI();
  if (synthMusicInterval) clearInterval(synthMusicInterval);
  
  playNextSynthNote();
  synthMusicInterval = setInterval(playNextSynthNote, 480);
}

function playNextSynthNote() {
  if (!musicPlaying) return;
  const curr = subtleMelody[synthMelodyIndex];
  playSynthNote(curr.note, curr.dur);
  synthMelodyIndex = (synthMelodyIndex + 1) % subtleMelody.length;
}

function stopSubtleMusic() {
  musicPlaying = false;
  if (synthMusicInterval) {
    clearInterval(synthMusicInterval);
    synthMusicInterval = null;
  }
  const bgAudio = document.getElementById('bgAudio');
  if (bgAudio) {
    bgAudio.pause();
  }
  updateMusicUI();
}

function toggleMusic() {
  if (musicPlaying) {
    stopSubtleMusic();
  } else {
    startSubtleMusic();
  }
}

function updateMusicUI() {
  const btn = document.getElementById('musicToggleBtn');
  const badge = document.getElementById('musicStatusBadge');
  
  if (btn) {
    if (musicPlaying) {
      btn.innerHTML = '⏸ Pause Music';
      btn.classList.remove('bg-rose-100', 'text-rose-700');
      btn.classList.add('bg-rose-500', 'text-white', 'shadow-md');
    } else {
      btn.innerHTML = '🎵 Play Music';
      btn.classList.remove('bg-rose-500', 'text-white', 'shadow-md');
      btn.classList.add('bg-rose-100', 'text-rose-700');
    }
  }

  if (badge) {
    if (musicPlaying) {
      badge.innerHTML = '🎶 Playing Lofi Music ✨';
      badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 animate-pulse border border-pink-200 hidden sm:flex items-center gap-1.5';
    } else {
      badge.innerHTML = '🎵 Subtle Music Off';
      badge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 hidden sm:flex items-center gap-1.5';
    }
  }
}

// Toggle Sound Effects
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔊 SFX On' : '🔇 Muted';
  }
}

// Auto-start music on first user click/touch if desired
function setupAutoStartMusic() {
  const handleFirstInteraction = () => {
    if (!userHasInteracted) {
      userHasInteracted = true;
      startSubtleMusic();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    }
  };
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
}

// Init on Load
document.addEventListener('DOMContentLoaded', () => {
  updateCardContent();
  renderQuiz();
  updateLoveMeter(500);
  renderCustomMemories();
  updateVideoCarousel();
  setupAutoStartMusic();
});

