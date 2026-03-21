// ==================== চ্যানেল ডাটা ====================
const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },   
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// HLS অপ্টিমাইজড কনফিগ (ভিডিও ফাস্ট লোড করার জন্য)
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 6,      // ছোট বাফার = দ্রুত স্টার্ট
    maxMaxBufferLength: 10,
    startLevel: -1,
    testBandwidth: true
};

// DOM এলিমেন্টস
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');

let hls = null;
let currentChanId = null;
let idleTimer = null; // অটো-হাইড টাইমার

// ==================== অটো হাইড লজিক (মূল অংশ) ====================

// UI দেখানোর ফাংশন
function showUI() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer(); // ইউজার একটিভ হলে টাইমার রিসেট হবে
}

// UI লুকানোর ফাংশন
function hideUI() {
    // ভিডিও যদি প্লে হয় তবেই হাইড হবে, পজ থাকলে হবে না
    if (!video.paused) {
        document.body.classList.add('ui-hidden');
    }
}

// টাইমার রিসেট করা (৩ সেকেন্ড ইন-এক্টিভ থাকলে হাইড হবে)
function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(hideUI, 4000); // ৪ সেকেন্ড পর হাইড হবে
    }
}

// ইভেন্ট লিসেনার: মাউস নাড়ালে বা স্ক্রিনে টাচ করলে UI ফিরে আসবে
window.addEventListener('mousemove', showUI);
window.addEventListener('mousedown', showUI);
window.addEventListener('touchstart', showUI);
window.addEventListener('keypress', showUI);

// ভিডিও প্লে/পজ হলেও UI কন্ট্রোল হবে
video.addEventListener('play', resetIdleTimer);
video.addEventListener('pause', showUI);

// ==================== ভিডিও প্লেয়ার ফাংশনস ====================

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
        setTimeout(() => playChannel(id), 2000);
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
        
        // এরর রিকভারি
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
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=50&h=50&fit=cover" class="chan-img">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

searchInput.addEventListener('input', (e) => renderList(e.target.value));

document.getElementById('toggleListBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('channelList').classList.toggle('hide-sidebar'); // মোবাইলের জন্য আলাদা টগল চাইলে
    showUI();
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    video.volume = e.target.value;
});

// ভিডিও স্ক্রিনে ক্লিক করলে প্লে/পজ
video.addEventListener('click', () => {
    if (video.paused) video.play();
    else video.pause();
    showUI();
});

// শুরু করা
window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
    resetIdleTimer();
};
