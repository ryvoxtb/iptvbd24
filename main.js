// ==================== CONFIGURATION ====================
// এখানে আপনার GitHub Raw JSON লিঙ্কটি দিন
const GITHUB_JSON_URL = "https://raw.githubusercontent.com/mdabdullahsk/channels-list/refs/heads/main/channels.json"; 
const WORKER_URL = "https://ryvox-server.hf.space";

let channels = []; // এটি খালি থাকবে, ডাটা আসবে GitHub থেকে
let hls = null;
let currentChanId = null;
let idleTimer = null;

// ==================== DOM ELEMENTS ====================
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const toggleBtn = document.getElementById('toggleListBtn');

// ==================== HIGH-PERFORMANCE HLS CONFIG (FASTEST) ====================
const hlsConfig = {
    enableWorker: true,
    autoStartLoad: true,
    startFragPrefetch: true,
    progressive: true,
    lowLatencyMode: false,
    maxBufferLength: 15,             // বাফার ব্যালেন্সড ১৫-৩০ সেকেন্ড (আপনার পছন্দমতো)
    maxMaxBufferLength: 30,
    maxBufferSize: 50 * 1000 * 1000, 
    enableAudioTrackSwitching: true,
    forceKeyFrameOnDiscontinuity: true,
    manifestLoadingMaxRetry: 10,
    manifestLoadingRetryDelay: 1000,
    fragLoadingMaxRetry: 10
};

// ==================== DATA FETCHING (GITHUB) ====================
async function loadChannels() {
    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        channels = await response.json();
        
        renderList(); // ডাটা পাওয়ার পর লিস্ট তৈরি করবে
        
        // অটোমেটিক প্রথম চ্যানেল প্লে করবে
        if (channels.length > 0) {
            playChannel(channels[0].id);
        }
    } catch (error) {
        console.error("Error loading channels from GitHub:", error);
        container.innerHTML = `<p style="color:white; padding:20px; text-align:center;">Failed to load channel list. Please check your GitHub link.</p>`;
    }
}

// ==================== STREAMING ENGINE ====================
async function playChannel(id) {
    if (currentChanId === id && hls) return;
    currentChanId = id;
    renderList(searchInput.value);
    
    // অডিও নিশ্চিত করা
    video.muted = false; 
    video.volume = volumeSlider.value;
    loader.classList.add('active'); 
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            initPlayer(streamUrl);
        } else {
            throw new Error("Stream URL not found");
        }
    } catch (error) {
        console.error("Playback Error:", error);
        loader.classList.remove('active');
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
                video.muted = true;
                video.play();
            });
        });

        // স্মার্ট এরর রিকভারি
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
        video.src = url;
    }
}

// লোডার কন্ট্রোল
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => {
    loader.classList.remove('active');
    resetIdleTimer();
});

// ==================== UI FEATURES ====================

// ১. Spacebar Support (Play/Pause)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        if (document.activeElement !== searchInput) {
            e.preventDefault();
            if (video.paused) video.play();
            else video.pause();
            showUI();
        }
    }
});

// ২. UI Auto-hide (4 Seconds)
function showUI() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer();
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(() => {
            // মাউস সাইডবারের ওপর থাকলে হাইড হবে না
            if (!document.querySelector('.channel-sidebar:hover')) {
                document.body.classList.add('ui-hidden');
            }
        }, 4000); 
    }
}

['mousemove', 'touchstart', 'keydown', 'click'].forEach(evt => 
    window.addEventListener(evt, showUI)
);

// ৩. Sidebar Toggle (Mobile)
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.body.classList.toggle('ui-hidden');
});

// ৪. Render Channel List
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=80&h=80&fit=cover" class="chan-img">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

// ৫. Controls Logic
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    volumeBtn.innerHTML = video.volume === 0 ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

searchInput.addEventListener('input', (e) => renderList(e.target.value));

// ভিডিওতে ক্লিক করলে প্লে/পজ
video.addEventListener('click', () => {
    if (video.paused) video.play();
    else video.pause();
    showUI();
});

// ==================== APP START ====================
window.onload = () => {
    loadChannels(); // GitHub থেকে ডাটা লোড করা শুরু করবে
};
