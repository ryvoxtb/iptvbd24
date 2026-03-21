// ==================== চ্যানেল ডাটাবেস ====================
const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },   
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// HLS কনফিগারেশন (দ্রুত লোড হওয়ার জন্য)
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 8,
    maxMaxBufferLength: 12,
    startLevel: -1,
    testBandwidth: true
};

// DOM এলিমেন্টস
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const loaderTxt = document.getElementById('loadingText');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');

let hls = null;
let currentChanId = null;
let uiTimer = null;

// ==================== অটো হাইড ফাংশন (প্রধান অংশ) ====================

function showUI() {
    document.body.classList.remove('ui-hidden');
    document.body.classList.add('ui-visible');
    resetUITimer();
}

function hideUI() {
    // ভিডিও যদি প্লে অবস্থায় থাকে তবেই হাইড হবে
    if (!video.paused) {
        document.body.classList.remove('ui-visible');
        document.body.classList.add('ui-hidden');
    }
}

function resetUITimer() {
    if (uiTimer) clearTimeout(uiTimer);
    if (!video.paused) {
        uiTimer = setTimeout(hideUI, 5000); // ৫ সেকেন্ড পর হাইড হবে
    }
}

// স্ক্রিনে মাউস নাড়ালে বা টাচ করলে UI শো করবে
window.addEventListener('mousemove', showUI);
window.addEventListener('touchstart', showUI);
video.addEventListener('play', resetUITimer);
video.addEventListener('pause', showUI); // ভিডিও থামলে UI সব সময় দেখা যাবে

// ==================== ভিডিও প্লেয়ার ফাংশনস ====================

async function playChannel(id) {
    if (currentChanId === id) return;
    currentChanId = id;
    
    renderList(); // UI আপডেট
    loader.classList.add('active');
    
    const channel = channels.find(c => c.id === id);
    loaderTxt.innerText = `${channel.name} লোড হচ্ছে...`;

    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();

        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            startHls(streamUrl);
        }
    } catch (e) {
        loaderTxt.innerText = "Error! Retrying...";
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
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
        loader.classList.remove('active');
    }
}

// ==================== UI কন্ট্রোল ফাংশনস ====================

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
    document.getElementById('channelList').classList.toggle('hide');
    showUI();
});

document.getElementById('closeListBtn').addEventListener('click', () => {
    document.getElementById('channelList').classList.add('hide');
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

document.getElementById('volumeSlider').addEventListener('input', (e) => {
    video.volume = e.target.value;
});

// ভিডিও স্ক্রিনে ক্লিক করলে প্লে/পজ হবে
video.addEventListener('click', () => {
    if (video.paused) video.play();
    else video.pause();
    showUI();
});

// শুরুতে অ্যাপ চালু করা
window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
    resetUITimer();
};
