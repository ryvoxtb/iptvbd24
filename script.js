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

// ==================== HIGH-PERFORMANCE HLS CONFIG ====================
const hlsConfig = {
    enableWorker: true,
    autoStartLoad: true,
    startFragPrefetch: true,         // প্রথম থেকেই ডাটা টানা শুরু করবে
    progressive: true,               // দ্রুত প্লেব্যাক শুরু করবে
    lowLatencyMode: false,           // স্ট্যাবিলিটির জন্য এবং অডিও সিঙ্কের জন্য false রাখা ভালো
    
    // বাফার সেটিংস (লোডিং কমাতে মাঝারি মানের বাফার)
    maxBufferLength: 15,             
    maxMaxBufferLength: 30,
    maxBufferSize: 50 * 1000 * 1000, 
    
    // অডিও/ভিডিও সিঙ্ক অপ্টিমাইজেশন
    enableAudioTrackSwitching: true,
    forceKeyFrameOnDiscontinuity: true,
    
    // কানেকশন রিট্রাই পলিসি
    manifestLoadingMaxRetry: 8,
    manifestLoadingRetryDelay: 1000,
    fragLoadingMaxRetry: 10
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

// ==================== STREAMING ENGINE ====================
async function playChannel(id) {
    if (currentChanId === id && hls) return;
    currentChanId = id;
    renderList(searchInput.value);
    
    // সাউন্ড এনাবল নিশ্চিত করা
    video.muted = false; 
    video.volume = volumeSlider.value;
    
    loader.classList.add('active'); 
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
            // প্রক্সি ইউআরএল তৈরি
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            initPlayer(streamUrl);
        } else {
            throw new Error("API stream url not found");
        }
    } catch (error) {
        console.error("Playback Error:", error);
        loader.classList.remove('active');
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
            // ইউজার ইন্টারঅ্যাকশনের পর প্লে করলে অডিও সমস্যা হবে না
            video.play().catch(err => {
                console.log("Autoplay blocked. User must click to hear sound.");
                // যদি ব্রাউজার ব্লক করে তবেই কেবল মিউট করে প্লে করবে
                video.muted = true;
                video.play();
            });
        });

        // এরর হ্যান্ডলিং ও অটো রিকভারি
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
                        initPlayer(url);
                        break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari বা iOS এর জন্য
        video.src = url;
        video.addEventListener('loadedmetadata', () => video.play());
    }
}

// লোডার কন্ট্রোল
video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => loader.classList.remove('active'));
video.addEventListener('canplay', () => loader.classList.remove('active'));

// ==================== UI RENDERING ====================
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=70&h=70&fit=cover" class="chan-img" loading="lazy">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

// ভলিউম কন্ট্রোল
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = (video.volume === 0);
    updateVolumeIcon();
});

volumeBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

// ফুলস্ক্রিন কন্ট্রোল
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// সার্চ লজিক
searchInput.addEventListener('input', (e) => renderList(e.target.value));

// অ্যাপ শুরু
window.onload = () => {
    renderList();
    // প্রথমবার প্লে করার সময় ইউজারকে স্ক্রিনে একবার ক্লিক করতে উৎসাহিত করা হয়
    // যাতে সাউন্ড ব্লক না হয়
    console.log("Ready to play with sound.");
};
