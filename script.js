--- START OF FILE script.js ---

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

// ==================== OPTIMIZED HLS CONFIGURATION ====================
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 30,             // Memory management
    maxBufferLength: 8,               // Optimized: not too small, not too large
    maxMaxBufferLength: 15,
    maxBufferSize: 30 * 1000 * 1000,  // 30MB
    maxBufferHole: 0.5,               // Automatically jump over small gaps
    
    // Fast Start settings
    manifestLoadingTimeOut: 10000,
    manifestLoadingMaxRetry: 3,
    levelLoadingTimeOut: 10000,
    fragLoadingTimeOut: 20000,
    startLevel: -1,                   // Auto selection based on bandwidth
    
    // ABR (Adaptive Bitrate) Fast Switch
    abrEwmaDefaultEstimate: 500000,
    testBandwidth: true,
    initialLiveManifestSize: 1,       // Load only 1 segment to start faster
};

// ==================== DOM ELEMENTS ====================
const video = document.getElementById('videoPlayer');
const loadingMessage = document.getElementById('loadingMessage');
const loadingText = document.getElementById('loadingText');
const channelListDiv = document.getElementById('channelList');
const channelsContainer = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const toggleListBtn = document.getElementById('toggleListBtn');
const closeListBtn = document.getElementById('closeListBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let hls = null;
let currentChannel = null;
let autoHideTimeout = null;
let isListVisible = true;
let lastVolume = 1;
let isFetching = false;

// ==================== LOADING HELPER ====================
function showLoading(msg = 'Buffering...') {
    loadingText.innerText = msg;
    loadingMessage.classList.add('active');
}

function hideLoading() {
    loadingMessage.classList.remove('active');
}

// ==================== LOAD CHANNEL ====================
async function loadChannel(channel) {
    if (isFetching || (currentChannel && currentChannel.id === channel.id)) return;
    
    isFetching = true;
    currentChannel = channel;
    
    // UI Update immediately for responsiveness
    updateActiveChannelUI();
    showLoading(`Starting ${channel.name}...`);
    
    try {
        const res = await fetch(`${WORKER_URL}/api/get-stream?id=${channel.id}`);
        const data = await res.json();

        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            playStream(streamUrl);
        } else {
            throw new Error("Invalid Stream Data");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        showLoading("Connection Error. Retrying...");
        setTimeout(() => { isFetching = false; loadChannel(channel); }, 2000);
    }
}

function playStream(url) {
    if (Hls.isSupported()) {
        if (hls) {
            hls.destroy();
        }
        
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {
                // Auto-play might be blocked by browser
                showLoading("Click to Play");
            });
            hideLoading();
            isFetching = false;
        });

        // Smart Error Recovery
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        playStream(url); // Fatal restart
                        break;
                }
            }
        });
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            hideLoading();
            isFetching = false;
        });
    }
}

// ==================== CHANNEL LIST UI ====================

// Optimized: Render once, update active class later
function renderChannels() {
    let filtered = channels;
    if (searchInput.value) {
        filtered = channels.filter(ch => 
            ch.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );
    }
    
    channelsContainer.innerHTML = filtered.map(ch => `
        <div class="channel-item ${currentChannel?.id === ch.id ? 'active' : ''}" 
             id="chan-${ch.id}"
             onclick='handleChannelClick(${JSON.stringify(ch)})'>
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(ch.img)}&w=50&h=50&fit=cover" class="channel-img" alt="TV">
            <div class="channel-info">
                <div class="channel-name">${ch.name}</div>
                <div class="channel-status"><i class="fas fa-circle"></i> ${currentChannel?.id === ch.id ? 'Now Playing' : 'Live'}</div>
            </div>
        </div>
    `).join('');
}

window.handleChannelClick = (ch) => {
    loadChannel(ch);
};

function updateActiveChannelUI() {
    // Remove active class from all
    document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
    // Add to current
    const activeEl = document.getElementById(`chan-${currentChannel?.id}`);
    if (activeEl) activeEl.classList.add('active');
}

// ==================== CONTROLS ====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function togglePlayPause() {
    video.paused ? video.play() : video.pause();
}

// ==================== EVENT LISTENERS ====================
searchInput.addEventListener('input', renderChannels);
video.addEventListener('waiting', () => showLoading("Buffering..."));
video.addEventListener('playing', () => hideLoading());
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = false;
});

toggleListBtn.addEventListener('click', () => {
    channelListDiv.classList.toggle('hide');
});

// ==================== INITIALIZE ====================
function init() {
    renderChannels();
    // Load first channel automatically
    if (channels.length > 0) loadChannel(channels[0]);
    
    video.volume = 1;
}

init();
