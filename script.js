const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },   
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');

let hls = null;
let currentId = null;
let idleTimer = null;

// ==================== অটো হাইড লজিক ====================
function showUI() {
    document.body.classList.remove('ui-hidden');
    resetTimer();
}

function hideUI() {
    if (!video.paused) {
        document.body.classList.add('ui-hidden');
    }
}

function resetTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(hideUI, 4000); // ৪ সেকেন্ড ইন-এক্টিভ থাকলে হাইড হবে
    }
}

// মাউস এবং টাচ ইভেন্ট
window.addEventListener('mousemove', showUI);
window.addEventListener('touchstart', showUI);

// ==================== প্লে/পজ কন্ট্রোল (ক্লিক ও স্পেস) ====================
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    showUI();
}

video.addEventListener('click', togglePlay);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // পেজ স্ক্রল হওয়া বন্ধ করবে
        togglePlay();
    }
});

// ==================== ভিডিও ইঞ্জিন ====================
async function playChan(id) {
    if (currentId === id) return;
    currentId = id;
    
    renderList();
    loader.classList.add('active');
    
    try {
        const res = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await res.json();
        if (data.success) {
            const finalUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            loadVideo(finalUrl);
        }
    } catch (e) {
        console.error("Link Error");
        loader.classList.remove('active');
    }
}

function loadVideo(url) {
    if (hls) hls.destroy();
    if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
            loader.classList.remove('active');
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    }
}

// ==================== UI আপডেট ====================
function renderList(f = "") {
    const list = channels.filter(c => c.name.toLowerCase().includes(f.toLo
