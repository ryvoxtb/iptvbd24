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

// ==================== সুপার ফাস্ট HLS কনফিগ ====================
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 8,             // বাফার ৮ সেকেন্ডে সীমাবদ্ধ (দ্রুত স্টার্ট হবে)
    maxMaxBufferLength: 12,
    maxBufferSize: 20 * 1000 * 1000, // ২০ মেগাবাইট বাফার
    manifestLoadingTimeOut: 10000,
    levelLoadingTimeOut: 10000,
    fragLoadingTimeOut: 15000,
    startLevel: -1,                 // অটো কোয়ালিটি
    testBandwidth: true,
    abrEwmaDefaultEstimate: 500000, // ৫০০ কেবিপিএস থেকে শুরু করবে
    backBufferLength: 60            // মেমরি পরিষ্কার রাখবে
};

// DOM এলিমেন্টস
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const loaderTxt = document.getElementById('loadingText');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');

let hls = null;
let currentChanId = null;

// ==================== কোর ফাংশনস ====================

// চ্যানেল লোড করা
async function playChannel(id) {
    if (currentChanId === id) return;
    
    currentChanId = id;
    const channel = channels.find(c => c.id === id);
    
    // UI আপডেট
    updateUI();
    loader.classList.add('active');
    loaderTxt.innerText = `${channel.name} লোড হচ্ছে...`;

    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();

        if (data.success && data.url) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            startHls(streamUrl);
        } else {
            throw new Error("Link error");
        }
    } catch (e) {
        loaderTxt.innerText = "সংযোগ বিচ্ছিন্ন! পুনরায় চেষ্টা করুন।";
        setTimeout(() => { currentChanId = null; playChannel(id); }, 3000);
    }
}

// HLS ইঞ্জিন শুরু করা
function startHls(url) {
    if (hls) hls.destroy();

    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => { loaderTxt.innerText = "প্লে বাটনে চাপুন"; });
            loader.classList.remove('active');
        });

        // স্মার্ট এরর রিকভারি
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
                    case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
                    default: startHls(url); break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            loader.classList.remove('active');
        });
    }
}

// চ্যানেল লিস্ট রেন্ডার করা
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=50&h=50&fit=cover" class="chan-img">
            <div class="chan-details">
                <div class="chan-name">${c.name}</div>
                <div class="live-tag"><i class="fas fa-circle"></i> লাইভ</div>
            </div>
        </div>
    `).join('');
}

function updateUI() {
    renderList(searchInput.value);
}

// ==================== ইভেন্টস ====================

searchInput.addEventListener('input', (e) => renderList(e.target.value));

document.getElementById('toggleListBtn').addEventListener('click', () => {
    document.getElementById('channelList').classList.toggle('hide');
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

// ভিডিও চলাকালে কোনো সমস্যা হলে অটো লোডিং দেখাবে
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => loader.classList.remove('active'));

// শুরু করা
window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
};
