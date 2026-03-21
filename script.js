/**
 * ULTRA FAST LIVE TV PLAYER ENGINE
 * Optimized for Speed, Stability and Low Latency
 */

// ==================== ১. চ্যানেল ডাটাবেস ====================
const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },   
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// ==================== ২. কনফিগারেশন (অত্যধিক দ্রুত লোডিংয়ের জন্য) ====================
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 30,             // মেমরি ক্লিন রাখার জন্য
    maxBufferLength: 10,              // ১০ সেকেন্ডের বাফার (খুব ছোট হলে আটকে যায়, খুব বড় হলে স্লো হয়)
    maxMaxBufferLength: 15,
    maxBufferSize: 30 * 1000 * 1000,  // ৩০ মেগাবাইট বাফার লিমিট
    maxBufferHole: 0.5,               // ছোট গ্যাপ থাকলে অটো স্কিপ করবে
    
    // দ্রুত স্টার্ট করার জন্য সেটিংস
    manifestLoadingTimeOut: 10000,
    levelLoadingTimeOut: 10000,
    fragLoadingTimeOut: 15000,
    startLevel: -1,                   // অটো কোয়ালিটি চয়েস
    testBandwidth: true,              
    abrEwmaDefaultEstimate: 500000,   // ৫০০ কেবিপিএস থেকে শুরু করবে (দ্রুত স্টার্টের জন্য)
};

// ==================== ৩. ডোম এলিমেন্টস ====================
const video = document.getElementById('videoPlayer');
const loadingMessage = document.getElementById('loadingMessage');
const loadingText = document.getElementById('loadingText');
const channelListDiv = document.getElementById('channelList');
const channelsContainer = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const toggleListBtn = document.getElementById('toggleListBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');

// গ্লোবাল ভ্যারিয়েবল
let hls = null;
let currentChannel = null;
let autoHideTimeout = null;
let abortController = null; // আগের রিকোয়েস্ট ক্যানসেল করার জন্য

// ==================== ৪. লোডিং কন্ট্রোল ====================
function showLoading(msg = 'প্লে করা হচ্ছে...') {
    loadingText.innerText = msg;
    loadingMessage.classList.add('active');
}

function hideLoading() {
    loadingMessage.classList.remove('active');
}

// ==================== ৫. চ্যানেল প্লেয়ার কোর ফাংশন ====================
async function loadChannel(channel) {
    // যদি একই চ্যানেল আবার ক্লিক করা হয় তবে কিছু করার দরকার নেই
    if (currentChannel && currentChannel.id === channel.id && !video.paused) return;

    // আগের কোনো পেন্ডিং রিকোয়েস্ট থাকলে ক্যানসেল করে দেবে
    if (abortController) abortController.abort();
    abortController = new AbortController();

    currentChannel = channel;
    showLoading(`${channel.name} লোড হচ্ছে...`);
    
    // UI আপডেট (একটিভ চ্যানেল হাইলাইট করা)
    updateChannelUI();

    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${channel.id}`, {
            signal: abortController.signal
        });
        const data = await response.json();

        if (data.success && data.url) {
            const finalUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            initializeHls(finalUrl);
        } else {
            throw new Error("Stream URL not found");
        }
    } catch (err) {
        if (err.name === 'AbortError') return; // ইউজার অন্য চ্যানেলে ক্লিক করেছে
        console.error("প্লে করতে সমস্যা হয়েছে:", err);
        showLoading("সার্ভার সমস্যা! পুনরায় চেষ্টা করা হচ্ছে...");
        setTimeout(() => loadChannel(channel), 3000);
    }
}

function initializeHls(url) {
    // আগের ভিডিও ইনস্ট্যান্স ডিলিট করা
    if (hls) {
        hls.destroy();
    }

    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => showLoading("প্লে বাটনে ক্লিক করুন"));
        });

        // এরর হ্যান্ডলিং (স্মার্ট রিকভারি)
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
                        initializeHls(url); // সব ফেইল করলে নতুন করে শুরু
                        break;
                }
            }
        });
    } 
    // সাফারী বা আইফোনের জন্য সরাসরি সাপোর্ট
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => video.play(), { once: true });
    }
}

// ==================== ৬. ইউজার ইন্টারফেস (UI) ফাংশনস ====================

// চ্যানেল লিস্ট রেন্ডার করা (একবারই করা হয়)
function renderChannels(filter = "") {
    const filtered = channels.filter(ch => ch.name.toLowerCase().includes(filter.toLowerCase()));
    
    channelsContainer.innerHTML = filtered.map(ch => `
        <div class="channel-item ${currentChannel?.id === ch.id ? 'active' : ''}" 
             id="channel-${ch.id}" 
             onclick="loadChannel(${JSON.stringify(ch).replace(/"/g, '&quot;')})">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(ch.img)}&w=50&h=50&fit=cover" 
                 class="channel-img" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/50?text=TV'">
            <div class="channel-info">
                <div class="channel-name">${ch.name}</div>
                <div class="channel-status"><i class="fas fa-circle"></i> লাইভ</div>
            </div>
        </div>
    `).join('');
}

// শুধু একটিভ চ্যানেলের স্টাইল চেঞ্জ করা (পুরো লিস্ট রেন্ডার না করে)
function updateChannelUI() {
    document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(`channel-${currentChannel?.id}`);
    if (activeEl) activeEl.classList.add('active');
}

// ফুলস্ক্রিন কন্ট্রোল
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

// অটো-হাইড চ্যানেল লিস্ট (ভিডিও প্লে হওয়ার সময়)
function setAutoHideList() {
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
    autoHideTimeout = setTimeout(() => {
        if (!video.paused && window.innerWidth > 768) {
            channelListDiv.classList.add('hide');
        }
    }, 5000);
}

// ==================== ৭. ইভেন্ট লিসেনারস ====================

// সার্চ ইনপুট
searchInput.addEventListener('input', (e) => renderChannels(e.target.value));

// ভিডিও ইভেন্টস
video.addEventListener('waiting', () => showLoading("বাফারিং হচ্ছে..."));
video.addEventListener('playing', () => {
    hideLoading();
    setAutoHideList();
});
video.addEventListener('click', () => {
    video.paused ? video.play() : video.pause();
});

// সাউন্ড কন্ট্রোল
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value == 0;
});

// বাটন ক্লিকস
toggleListBtn.addEventListener('click', () => channelListDiv.classList.toggle('hide'));
fullscreenBtn.addEventListener('click', toggleFullscreen);

// ==================== ৮. অ্যাপ শুরু করা ====================
function init() {
    renderChannels();
    
    // প্রথম চ্যানেলটি অটো লোড করা
    if (channels.length > 0) {
        loadChannel(channels[0]);
    }
    
    // ডিফল্ট ভলিউম
    video.volume = 1;
}

// উইন্ডো লোড হলে শুরু হবে
window.onload = init;
