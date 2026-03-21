// ==================== CHANNEL DATABASE ====================
const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// ==================== ULTRA-FAST HLS CONFIG ====================
// লোডিং সমস্যা দূর করতে বাফার এবং রিট্রাই পলিসি অপ্টিমাইজ করা হয়েছে
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,            // ল্যাটেন্সি কমানোর জন্য
    maxBufferLength: 5,              // বাফার ৫ সেকেন্ডে নামিয়ে আনা হয়েছে যাতে দ্রুত স্টার্ট হয়
    maxMaxBufferLength: 10,
    maxBufferSize: 30 * 1000 * 1000, // মেমোরি লোড কমাতে ৩০ এমবি বাফার লিমিট
    startLevel: -1,                  // অটো বেস্ট কোয়ালিটি
    testBandwidth: true,
    progressive: true,               // প্রোগ্রেসিভ ডাউনলোডিং
    startFragPrefetch: true,         // প্রথম ফ্র্যাগমেন্ট আগেভাগেই লোড করবে
    
    // রিট্রাই পলিসি: নেটওয়ার্ক দুর্বল হলেও কানেকশন ধরে রাখবে
    manifestLoadingMaxRetry: 10,
    manifestLoadingRetryDelay: 500,
    levelLoadingMaxRetry: 10,
    fragLoadingMaxRetry: 10
};

// ==================== DOM ELEMENTS ====================
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleListBtn = document.getElementById('toggleListBtn');
const channelSidebar = document.getElementById('channelList');

// ==================== GLOBAL VARIABLES ====================
let hls = null;
let currentChanId = null;
let idleTimer = null;
let isMuted = false;
let sidebarMobileVisible = true;

// ==================== PLAYBACK & UI CONTROLS ====================
function togglePlayPause() {
    if (video.paused) {
        video.play().catch(e => console.log("Play failed:", e));
    } else {
        video.pause();
    }
    showUIAndReset();
}

video.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });

function showUIAndReset() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer();
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(() => {
            document.body.classList.add('ui-hidden');
        }, 4000); // ৪ সেকেন্ড পর UI হাইড হবে
    }
}

// Activity events
['mousemove', 'touchstart', 'keydown'].forEach(evt => 
    window.addEventListener(evt, showUIAndReset)
);

// Volume logic
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    isMuted = (video.volume === 0);
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (video.volume === 0 || isMuted) volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    else if (video.volume < 0.5) volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    else volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
}

// Fullscreen logic
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

// ==================== STREAMING ENGINE (CRITICAL) ====================
async function playChannel(id) {
    if (currentChanId === id && hls) return;
    currentChanId = id;
    renderList(searchInput.value);
    
    loader.classList.add('active'); // লোডার দেখানো
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
            // প্রক্সি ইউআরএল ব্যবহার করে CORS সমস্যা এড়ানো
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            initPlayer(streamUrl);
        } else {
            throw new Error("API Error");
        }
    } catch (error) {
        console.error("Retrying channel...", error);
        setTimeout(() => playChannel(id), 2000);
    }
}

function initPlayer(url) {
    if (hls) hls.destroy();
    
    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
                // ব্রাউজার অটো-প্লে ব্লক করলে মিউট করে ট্রাই করবে
                video.muted = true;
                video.play();
            });
        });

        // এরর হ্যান্ডলিং যাতে ভিডিও আটকে না যায়
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
                    case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
                    default: initPlayer(url); break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari/iOS
        video.src = url;
    }
}

// লোডার কন্ট্রোল
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => loader.classList.remove('active'));
video.addEventListener('canplay', () => loader.classList.remove('active'));

// ==================== UI RENDERING ====================
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=70&h=70&fit=cover" class="chan-img" loading="lazy">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

// Search Logic
searchInput.addEventListener('input', (e) => renderList(e.target.value));

// App start
window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
};
