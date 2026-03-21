const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },   
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// ফাস্ট লোডিং HLS কনফিগ
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 10,
    maxMaxBufferLength: 20,
    startLevel: -1,
    testBandwidth: true,
    abrEwmaDefaultEstimate: 500000,
};

const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');

let hls = null;
let currentChanId = null;
let idleTimer = null;

// ==================== অটো হাইড ফাংশন (লোগো বাদে) ====================
function showUI() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer();
}

function hideUI() {
    if (!video.paused) {
        document.body.classList.add('ui-hidden');
    }
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(hideUI, 5000); // ৫ সেকেন্ড পর হাইড হবে
    }
}

// ইভেন্ট লিসেনারস
window.addEventListener('mousemove', showUI);
window.addEventListener('touchstart', showUI);
video.addEventListener('play', resetIdleTimer);
video.addEventListener('pause', showUI);

// ==================== ভিডিও ফাংশনস ====================
async function playChannel(id) {
    if (currentChanId === id) return;
    currentChanId = id;
    
    renderList();
    loader.classList.add('active');
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();

        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            startHls(streamUrl);
        }
    } catch (e) {
        setTimeout(() => playChannel(id), 3000);
    }
}

function startHls(url) {
    if (hls) hls.destroy();
    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
            loader.classList.remove('active');
        });
        
        // স্মুথ প্লেব্যাক এরর হ্যান্ডলিং
        hls.on(Hls.Events.ERROR, (e, data) => {
            if (data.fatal) {
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
                else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
                else startHls(url);
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
        loader.classList.remove('active');
    }
}

// ==================== UI রেন্ডারিং ====================
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=60&h=60&fit=cover" class="chan-img">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

searchInput.addEventListener('input', (e) => renderList(e.target.value));

document.getElementById('toggleListBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('channelList').classList.toggle('hide-sidebar');
    showUI();
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    video.volume = e.target.value;
});

video.addEventListener('click', () => {
    video.paused ? video.play() : video.pause();
    showUI();
});

// ভিডিও বাফার করলে লোডার আসবে
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => loader.classList.remove('active'));

window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
    resetIdleTimer();
};
