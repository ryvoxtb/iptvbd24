// ==================== CHANNEL DATABASE ====================
const channels = [
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

const WORKER_URL = "https://abdullah965-iptv.hf.space";

// ==================== OPTIMIZED HLS CONFIG ====================
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: false,           // বাফারিং কমাতে এটা false রাখা ভালো
    backBufferLength: 60,            // পিছনে ৬০ সেকেন্ড বাফার ধরে রাখবে
    maxBufferLength: 30,             // বাফার ৩০ সেকেন্ড করা হলো যাতে নেট স্লো হলেও ভিডিও না আটকায়
    maxMaxBufferLength: 60,
    maxBufferSize: 60 * 1000 * 1000, // ৬০ এমবি বাফার
    startLevel: -1,                  // অটো কোয়ালিটি
    abandonFragmentOnMetadataError: true,
    fragLoadingTimeOut: 20000,       // ২০ সেকেন্ড টাইমআউট
    manifestLoadingTimeOut: 20000,
    levelLoadingTimeOut: 20000,
    // রিট্রাই পলিসি
    manifestLoadingMaxRetry: 5,
    levelLoadingMaxRetry: 5,
    fragLoadingMaxRetry: 5
};

// ==================== DOM ELEMENTS ====================
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loadingMessage');
const container = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let hls = null;
let currentChanId = null;
let idleTimer = null;

// ==================== STREAMING ENGINE ====================
async function playChannel(id) {
    if (currentChanId === id && hls) return;
    currentChanId = id;
    renderList(searchInput.value);
    
    loader.classList.add('active'); 
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
            // প্রক্সি ছাড়া সরাসরি ট্রাই করুন যদি সম্ভব হয়, প্রক্সি ভিডিও স্লো করে দেয়
            // যদি CORS এরর দেয় তবেই প্রক্সি ব্যবহার করবেন
            const streamUrl = data.url.includes('m3u8') 
                ? `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}` 
                : data.url;
                
            initPlayer(streamUrl);
        } else {
            throw new Error("API Error");
        }
    } catch (error) {
        console.error("Stream Error:", error);
        // ২ সেকেন্ড পর আবার চেষ্টা না করে ইউজারকে মেসেজ দেখানো ভালো
        // setTimeout(() => playChannel(id), 2000); 
    }
}

function initPlayer(url) {
    if (hls) {
        hls.destroy();
    }
    
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
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("Network error, retrying...");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("Media error, recovering...");
                        hls.recoverMediaError();
                        break;
                    default:
                        console.log("Unrecoverable error, reloading source...");
                        initPlayer(url);
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => video.play());
    }
}

// UI & Logic
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => loader.classList.remove('active'));

function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=70&h=70&fit=cover" class="chan-img" loading="lazy">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

// Volume & UI Controls (বাকি আগের কোড ঠিক আছে)
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (video.volume === 0) volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    else volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
}

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

searchInput.addEventListener('input', (e) => renderList(e.target.value));

window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
};
