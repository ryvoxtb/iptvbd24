// ==================== CHANNEL DATABASE ====================
const channels = [
        { 'id': '88', 'name': 'A SPORTS HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { 'id': '40', 'name': 'EUROSPORTS HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },
    { 'id': '87', 'name': 'FAST SPORTS HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/FAST SPORTS HD1745044750.png' },
    { 'id': '66', 'name': 'GOLF SPORTS', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/GOLF SPORTS1745043338.png' },
    { 'id': '92', 'name': 'PTV SPORTS HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/PTV SPORTS HD1745044993.png' },
    { 'id': '74', 'name': 'SONY SPORTS 1 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/sony sports 1 hd.png' },
    { 'id': '29', 'name': 'SONY SPORTS 2 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/sony sports 2 hd.png' },
    { 'id': '30', 'name': 'SONY SPORTS 3', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/Sony sports 3.png' },
    { 'id': '72', 'name': 'SONY SPORTS 4', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/sony sports 4.png' },
    { 'id': '101', 'name': 'SONY SPORTS 5 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/sony sports 5 hd.png' },
    { 'id': '96', 'name': 'SSC SPORTS', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/ssc 1 hd.png' },
    { 'id': '103', 'name': 'SSC SPORTS 5 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/ssc 5 hd.png' },
    { 'id': '28', 'name': 'STAR SELECT 1 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/STAR SELECT 1 HD1745038777.png' },
    { 'id': '2', 'name': 'STAR SPORTS 1 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/STAR SPORTS 1 HD1744991778.png' },
    { 'id': '3', 'name': 'STAR SPORTS 2 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/STAR SPORTS 2 HD1744991842.png' },
    { 'id': '31', 'name': 'STAR SPORTS 3', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/STAR SPORTS 31745039893.png' },
    { 'id': '16', 'name': 'STAR SPORTS SELECT 2 HD', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/STAR SPORTS SELECT 2 HD1745033722.png' },
    { 'id': '1', 'name': 'T SPORTS', 'cat': 'Sports', 'img': 'http://103.144.89.251/assets/images/T SPORTS1744972630.png' },

    // English Category
    { 'id': '85', 'name': 'ALJAZEETA HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/ALJAZEETA HD1745044358.png' },
    { 'id': '35', 'name': 'AND FLIX HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/AND FLIX HD1745040018.png' },
    { 'id': '41', 'name': 'AND PRIVE HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/AND PRIVE HD1745040451.png' },
    { 'id': '61', 'name': 'AND XPLORE', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/AND XPLORE1745043080.png' },
    { 'id': '26', 'name': 'ANIMAL PLANET HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/ANIMAL PLANET HD1745038671.png' },
    { 'id': '97', 'name': 'AXN HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/AXN HD1745045171.png' },
    { 'id': '102', 'name': 'BBC EARTH HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/BBC EARTH HD1745150455.png' },
    { 'id': '55', 'name': 'BBC NEWS', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/BBC NEWS1745042816.png' },
    { 'id': '22', 'name': 'DISCOVERY HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/discovery hd.png' },
    { 'id': '98', 'name': 'HBO HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/HBO HD1745045202.png' },
    { 'id': '15', 'name': 'HISTORY TV HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/HISTORY TV HD1745033679.png' },
    { 'id': '70', 'name': 'HITZ MUSIC', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/HITZ MUSIC1745043478.png' },
    { 'id': '91', 'name': 'LOTUS TV', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/LOTUS TV1745044960.png' },
    { 'id': '67', 'name': 'LOVE NATURE', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/LOVE NATURE1745043370.png' },
    { 'id': '36', 'name': 'MN PLUS', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/MN PLUS1745040057.png' },
    { 'id': '33', 'name': 'MNX HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/MNX HD1745039955.png' },
    { 'id': '39', 'name': 'MOVIES NOW HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/MOVIES NOW HD1745040368.png' },
    { 'id': '25', 'name': 'NATGEO HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/NATGEO HD1745038634.png' },
    { 'id': '23', 'name': 'NATGEO WILD HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/NATGEO WILD HD1745038542.png' },
    { 'id': '34', 'name': 'ROMEDY NOW', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/ROMEDY NOW1745039988.png' },
    { 'id': '6', 'name': 'SONY BBC EARTH HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/SONY BBC EARTH HD1745031522.png' },
    { 'id': '32', 'name': 'SONY PIX HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/SONY PIX HD1745039925.png' },
    { 'id': '38', 'name': 'STAR MOVIES HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/STAR MOVIES HD1745040174.png' },
    { 'id': '27', 'name': 'STAR MOVIES SELECT HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/STAR MOVIES SELECT HD1745038723.png' },
    { 'id': '9', 'name': 'TLC HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/TLC HD1745033484.png' },
    { 'id': '62', 'name': 'TRAVEL XP', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/TRAVEL XP1745043118.png' },
    { 'id': '37', 'name': 'ZEE CAFE HD', 'cat': 'English', 'img': 'http://103.144.89.251/assets/images/ZEE CAFE HD1745040102.png' },

    // Hindi Category
    { 'id': '5', 'name': 'AND PICTURS HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/AND PICTURS HD1745031440.png' },
    { 'id': '10', 'name': 'COLORS CINEPLEX HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/COLORS CINEPLEX HD1745033519.png' },
    { 'id': '4', 'name': 'COLORS HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/COLORS HD1745031404.png' },
    { 'id': '90', 'name': 'GEO NEWS HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/GEO NEWS HD1745044892.png' },
    { 'id': '89', 'name': 'HUM TV', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/HUM TV1745044837.png' },
    { 'id': '11', 'name': 'SONY ENT HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/SONY ENT HD1745033553.png' },
    { 'id': '21', 'name': 'SONY MAX HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/SONY MAX HD1745034069.png' },
    { 'id': '100', 'name': 'STAR BHARAT HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/STAR BHARAT HD1745045255.png' },
    { 'id': '69', 'name': 'STAR GOLD 2 HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/STAR GOLD 2 HD1745043441.png' },
    { 'id': '20', 'name': 'STAR GOLD HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/STAR GOLD HD1745034037.png' },
    { 'id': '71', 'name': 'STAR GOLD SELECT HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/STAR GOLD SELECT HD1745043508.png' },
    { 'id': '24', 'name': 'STAR PLUS HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/STAR PLUS HD1745038577.png' },
    { 'id': '13', 'name': 'ZEE CINEMA HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/ZEE CINEMA HD1745033602.png' },
    { 'id': '7', 'name': 'ZEE TV HD', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/ZEE TV HD1745033383.png' },
    { 'id': '53', 'name': 'ZING', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/ZING1745042718.png' },
    { 'id': '42', 'name': 'ZOOM', 'cat': 'Hindi', 'img': 'http://103.144.89.251/assets/images/ZOOM1745040961.png' },

    // Bangla Category
    { 'id': '80', 'name': 'ATN BANGLA', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/ATN BANGLA1745044183.png' },
    { 'id': '95', 'name': 'ATN NEWS', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/ATN NEWS1745045113.png' },
    { 'id': '82', 'name': 'CHANNEL 24', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/CHANNEL 241745044263.png' },
    { 'id': '81', 'name': 'CHANNEL I', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/CHANNEL I1745044237.png' },
    { 'id': '47', 'name': 'COLORS BANGLA CINEMA', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/COLORS BANGLA CINEMA1745041486.png' },
    { 'id': '12', 'name': 'COLORS BANGLA HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/COLORS BANGLA HD1745033576.png' },
    { 'id': '68', 'name': 'DURANTA TV', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/DURANTA TV1745043400.png' },
    { 'id': '84', 'name': 'ENTERR 10', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/ENTERR 101745044330.png' },
    { 'id': '56', 'name': 'GTV', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/GTV1745042853.png' },
    { 'id': '77', 'name': 'INDEPENDENT TV', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/INDEPENDENT TV1745044077.png' },
    { 'id': '19', 'name': 'JALSHA MOVIES HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/JALSHA MOVIES HD1745034005.png' },
    { 'id': '76', 'name': 'JAMUNA TV', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/JAMUNA TV1745044052.png' },
    { 'id': '78', 'name': 'MAASRANGA HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/MAASRANGA HD1745044117.png' },
    { 'id': '54', 'name': 'NAGORIK', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/NAGORIK1745042776.png' },
    { 'id': '79', 'name': 'SOMOY TV', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/SOMOY TV1745044149.png' },
    { 'id': '44', 'name': 'SONY AAT', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/SONY AAT1745041124.png' },
    { 'id': '18', 'name': 'STAR JALSHA HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/STAR JALSHA HD1745033819.png' },
    { 'id': '17', 'name': 'SUN BANGLA HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/SUN BANGLA HD1745033791.png' },
    { 'id': '43', 'name': 'ZEE BANGLA CINEMA', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/ZEE BANGLA CINEMA1745040996.png' },
    { 'id': '14', 'name': 'ZEE BANGLA HD', 'cat': 'Bangla', 'img': 'http://103.144.89.251/assets/images/ZEE BANGLA HD1745033633.png' },

    // Kids Category
    { 'id': '50', 'name': 'BAL BHARAT', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/BAL BHARAT1745041576.png' },
    { 'id': '8', 'name': 'CARTOON NETWORK', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/CARTOON NETWORK1745033414.png' },
    { 'id': '49', 'name': 'HUNGAMA', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/HUNGAMA1745041551.png' },
    { 'id': '46', 'name': 'NICK', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/NICK1745041451.png' },
    { 'id': '51', 'name': 'NICK JR', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/NICK JR1745042397.png' },
    { 'id': '48', 'name': 'POGO', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/POGO1745041515.png' },
    { 'id': '45', 'name': 'SONIC', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/SONIC1745041154.png' },
    { 'id': '93', 'name': 'SONY YAY', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { 'id': '75', 'name': 'SUPER HUNGAMA', 'cat': 'Kids', 'img': 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },

    // Islamic Category
    { 'id': '83', 'name': 'MADANI TV HD', 'cat': 'Islamic', 'img': 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { 'id': '86', 'name': 'PEACE TV BANGLA', 'cat': 'Islamic', 'img': 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' },
];

const WORKER_URL = "https://abdullah965-iptv.hf.space";

// ==================== HIGH-PERFORMANCE HLS CONFIG (REVERTED) ====================
const hlsConfig = {
    enableWorker: true,
    autoStartLoad: true,
    startFragPrefetch: true,         
    progressive: true,               
    lowLatencyMode: false,           
    maxBufferLength: 15,             
    maxMaxBufferLength: 30,
    maxBufferSize: 50 * 1000 * 1000, 
    enableAudioTrackSwitching: true,
    forceKeyFrameOnDiscontinuity: true,
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
const toggleBtn = document.getElementById('toggleListBtn');

let hls = null;
let currentChanId = null;
let idleTimer = null;

// ==================== UI AUTO-HIDE (4S) ====================
function showUI() {
    document.body.classList.remove('ui-hidden');
    resetIdleTimer();
}

function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (!video.paused) {
        idleTimer = setTimeout(() => {
            if (!document.querySelector('.channel-sidebar:hover')) {
                document.body.classList.add('ui-hidden');
            }
        }, 4000); 
    }
}

['mousemove', 'touchstart', 'keydown', 'click'].forEach(e => window.addEventListener(e, showUI));

// ==================== KEYBOARD SPACEBAR SUPPORT ====================
function togglePlayPause() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    showUI();
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        // ইনপুট বক্সে টাইপ করার সময় স্পেস দিলে যেন ভিডিও পজ না হয়
        if (document.activeElement !== searchInput) {
            e.preventDefault(); // পেজ স্ক্রলিং বন্ধ করবে
            togglePlayPause();
        }
    }
});

toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.body.classList.toggle('ui-hidden');
});

// ==================== PLAYER ENGINE ====================
async function playChannel(id) {
    if (currentChanId === id && hls) return;
    currentChanId = id;
    renderList(searchInput.value);
    
    video.muted = false; 
    video.volume = volumeSlider.value;
    loader.classList.add('active'); 
    
    try {
        const response = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await response.json();
        
        if (data.success && data.url) {
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
    if (hls) hls.destroy();
    
    if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(err => {
                video.muted = true;
                video.play();
            });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR: hls.startLoad(); break;
                    case Hls.ErrorTypes.MEDIA_ERROR: hls.recoverMediaError(); break;
                    default: initPlayer(url); break;
                }
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    }
}

video.addEventListener('waiting', () => loader.classList.add('active'));
video.addEventListener('playing', () => {
    loader.classList.remove('active');
    resetIdleTimer();
});

// ==================== UI RENDERING ====================
function renderList(filter = "") {
    const filtered = channels.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(c => `
        <div class="channel-card ${currentChanId === c.id ? 'active' : ''}" onclick="playChannel('${c.id}')">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(c.img)}&w=80&h=80&fit=cover" class="chan-img">
            <div class="chan-name">${c.name}</div>
        </div>
    `).join('');
}

// Controls Logic
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    volumeBtn.innerHTML = video.volume === 0 ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
});

searchInput.addEventListener('input', (e) => renderList(e.target.value));

window.onload = () => {
    renderList();
    if (channels.length > 0) playChannel(channels[0].id);
};
