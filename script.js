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

// ==================== OPTIMIZED HLS CONFIG FOR FAST LOADING ====================
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 8,
    maxMaxBufferLength: 16,
    startLevel: -1,              // Auto-select best quality
    testBandwidth: true,
    abrEwmaDefaultEstimate: 500000,
    abrEwmaFastLive: 3,
    abrEwmaSlowLive: 9,
    manifestLoadingTimeOut: 10000,
    levelLoadingTimeOut: 8000,
    fragLoadingTimeOut: 10000,
    startFragPrefetch: true,     // Prefetch fragments for faster start
    progressive: true
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

// ==================== VIDEO PLAY/PAUSE TOGGLE (CLICK ON VIDEO) ====================
function togglePlayPause() {
    if (video.paused) {
        video.play().catch(e => console.log("Playback prevented:", e));
    } else {
        video.pause();
    }
    showUIAndReset();
}

// Attach video click event
video.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlayPause();
});

// ==================== AUTO-HIDE UI SYSTEM (Only Sidebar & Controls, Logo Always Visible) ====================
function showUIAndReset() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer();
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(() => {
            document.body.classList.add('ui-hidden');
        }, 4800);
    }
}

// User activity triggers UI show
window.addEventListener('mousemove', showUIAndReset);
window.addEventListener('touchstart', showUIAndReset);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== searchInput) {
        e.preventDefault();
        togglePlayPause();
        showUIAndReset();
    } else {
        showUIAndReset();
    }
});

video.addEventListener('play', () => {
    resetIdleTimer();
});

video.addEventListener('pause', () => {
    if (idleTimer) clearTimeout(idleTimer);
    document.body.classList.remove('ui-hidden');
});

// ==================== VOLUME CONTROL ====================
function updateVolumeIcon() {
    if (video.volume === 0 || isMuted) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (video.volume < 0.5) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    video.volume = val;
    isMuted = false;
    if (val === 0) isMuted = true;
    updateVolumeIcon();
    showUIAndReset();
});

volumeBtn.addEventListener('click', () => {
    if (video.volume > 0 && !isMuted) {
        video.volume = 0;
        isMuted = true;
        volumeSlider.value = 0;
    } else {
        video.volume = 0.8;
        isMuted = false;
        volumeSlider.value = 0.8;
    }
    updateVolumeIcon();
    showUIAndReset();
});

// ==================== FULLSCREEN TOGGLE ====================
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
        document.exitFullscreen();
    }
    showUIAndReset();
});

// ==================== MOBILE SIDEBAR TOGGLE ====================
toggleListBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
        if (sidebarMobileVisible) {
            channelSidebar.style.transform = 'translateX(-100%)';
            sidebarMobileVisible = false;
        } else {
            channelSidebar.style.transform = 'translateX(0%)';
            sidebarMobileVisible = true;
        }
        showUIAndReset();
    } else {
        document.body.classList.remove('ui-hidden');
        resetIdleTimer();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        channelSidebar.style.transform = '';
        sidebarMobileVisible = true;
    } else {
        if (!sidebarMobileVisible) channelSidebar.style.transform = 'translateX(-100%)';
        else channelSidebar.style.transform = '';
    }
});

// ==================== HLS STREAMING WITH FAST LOADING & RETRY ====================
async function playChannel(id) {
    if (currentChanId === id && hls && !hls?.destroyed) return;
    currentChanId = id;
    renderList(searchInput.value);
    loader.classList.add('active');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            startHls(streamUrl);
        } else {
            throw new Error("Invalid stream response");
        }
    } catch (error) {
        console.warn("Stream fetch error, retrying in 2s:", error);
        setTimeout(() => {
            if (currentChanId === id) playChannel(id);
        }, 2000);
    }
}

function startHls(url) {
    // Clean up existing HLS instance
    if (hls) {
        try {
            hls.destroy();
        } catch (e) {}
        hls = null;
    }
    
    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().then(() => {
                loader.classList.remove('active');
                resetIdleTimer();
            }).catch(err => {
                console.log("Autoplay blocked:", err);
                loader.classList.remove('active');
            });
        });
        
        // Fast start: load first fragment immediately
        hls.on(Hls.Events.FRAG_LOADED, () => {
            if (loader.classList.contains('active')) {
                setTimeout(() => loader.classList.remove('active'), 500);
            }
        });
        
        // Error handling with recovery
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("Network error, trying to recover...");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("Media error, recovering...");
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error("Fatal error, restarting stream");
                        if (currentChanId) playChannel(currentChanId);
                        break;
                }
            }
        });
        
        // Buffer/Loader visibility handling
        video.addEventListener('waiting', () => {
            if (!video.paused) loader.classList.add('active');
        });
        video.addEventListener('playing', () => loader.classList.remove('active'));
        video.addEventListener('canplay', () => loader.classList.remove('active'));
        
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(e => console.log(e));
            loader.classList.remove('active');
        });
        video.addEventListener('stalled', () => loader.classList.add('active'));
        video.addEventListener('playing', () => loader.classList.remove('active'));
    } else {
        console.error("HLS not supported in this browser");
        loader.classList.remove('active');
    }
}

// ==================== RENDER CHANNEL LIST ====================
function renderList(filter = "") {
    const filtered = channels.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    container.innerHTML = filtered.map(c => {
        const isActive = (currentChanId === c.id);
        const imgProxy = `https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=70&h=70&fit=cover&a=attention`;
        return `
            <div class="channel-card ${isActive ? 'active' : ''}" data-id="${c.id}">
                <img src="${imgProxy}" alt="${c.name}" class="chan-img" loading="lazy" onerror="this.src='https://placehold.co/70x70/111/00a2ff?text=TV'">
                <div class="chan-name">${c.name}</div>
            </div>
        `;
    }).join('');
    
    // Attach click handlers to cards
    document.querySelectorAll('.channel-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = card.getAttribute('data-id');
            if (id) {
                playChannel(id);
                showUIAndReset();
                // Auto-close sidebar on mobile after channel selection
                if (window.innerWidth <= 768) {
                    channelSidebar.style.transform = 'translateX(-100%)';
                    sidebarMobileVisible = false;
                }
            }
        });
    });
}

// ==================== SEARCH FUNCTIONALITY ====================
searchInput.addEventListener('input', (e) => {
    renderList(e.target.value);
    showUIAndReset();
});

// Prevent spacebar from triggering search input
searchInput.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.stopPropagation();
    }
});

// ==================== INITIALIZATION ====================
video.volume = 0.8;
volumeSlider.value = 0.8;
updateVolumeIcon();

// Buffer/Loader handlers for smooth experience
video.addEventListener('waiting', () => {
    if (!video.paused) loader.classList.add('active');
});
video.addEventListener('playing', () => loader.classList.remove('active'));
video.addEventListener('canplaythrough', () => loader.classList.remove('active'));

// Start the app
window.onload = () => {
    renderList();
    if (channels.length > 0) {
        playChannel(channels[0].id);
    }
    resetIdleTimer();
};

// Ensure logo stays below sidebar (z-index already set in CSS)
// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (hls) {
        hls.destroy();
    }
});
