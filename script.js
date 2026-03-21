// ==================== CHANNEL DATABASE ====================
const channels = [
    // Sports
    { id: '88', name: 'A SPORTS HD', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png' },
    { id: '40', name: 'EUROSPORTS HD', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png' },
    { id: '87', name: 'FAST SPORTS HD', img: 'http://103.144.89.251/assets/images/FAST SPORTS HD1745044750.png' },
    { id: '66', name: 'GOLF SPORTS', img: 'http://103.144.89.251/assets/images/GOLF SPORTS1745043338.png' },
    { id: '92', name: 'PTV SPORTS HD', img: 'http://103.144.89.251/assets/images/PTV SPORTS HD1745044993.png' },
    { id: '74', name: 'SONY SPORTS 1 HD', img: 'http://103.144.89.251/assets/images/sony sports 1 hd.png' },
    { id: '29', name: 'SONY SPORTS 2 HD', img: 'http://103.144.89.251/assets/images/sony sports 2 hd.png' },
    { id: '30', name: 'SONY SPORTS 3', img: 'http://103.144.89.251/assets/images/Sony sports 3.png' },
    { id: '72', name: 'SONY SPORTS 4', img: 'http://103.144.89.251/assets/images/sony sports 4.png' },
    { id: '101', name: 'SONY SPORTS 5 HD', img: 'http://103.144.89.251/assets/images/sony sports 5 hd.png' },
    { id: '96', name: 'SSC SPORTS', img: 'http://103.144.89.251/assets/images/ssc 1 hd.png' },
    { id: '103', name: 'SSC SPORTS 5 HD', img: 'http://103.144.89.251/assets/images/ssc 5 hd.png' },
    { id: '28', name: 'STAR SELECT 1 HD', img: 'http://103.144.89.251/assets/images/STAR SELECT 1 HD1745038777.png' },
    { id: '2', name: 'STAR SPORTS 1 HD', img: 'http://103.144.89.251/assets/images/STAR SPORTS 1 HD1744991778.png' },
    { id: '3', name: 'STAR SPORTS 2 HD', img: 'http://103.144.89.251/assets/images/STAR SPORTS 2 HD1744991842.png' },
    { id: '31', name: 'STAR SPORTS 3', img: 'http://103.144.89.251/assets/images/STAR SPORTS 31745039893.png' },
    { id: '16', name: 'STAR SPORTS SELECT 2 HD', img: 'http://103.144.89.251/assets/images/STAR SPORTS SELECT 2 HD1745033722.png' },
    { id: '1', name: 'T SPORTS', img: 'http://103.144.89.251/assets/images/T SPORTS1744972630.png' },
    
    // English
    { id: '85', name: 'ALJAZEERA HD', img: 'http://103.144.89.251/assets/images/ALJAZEETA HD1745044358.png' },
    { id: '35', name: 'AND FLIX HD', img: 'http://103.144.89.251/assets/images/AND FLIX HD1745040018.png' },
    { id: '41', name: 'AND PRIVE HD', img: 'http://103.144.89.251/assets/images/AND PRIVE HD1745040451.png' },
    { id: '61', name: 'AND XPLORE', img: 'http://103.144.89.251/assets/images/AND XPLORE1745043080.png' },
    { id: '26', name: 'ANIMAL PLANET HD', img: 'http://103.144.89.251/assets/images/ANIMAL PLANET HD1745038671.png' },
    { id: '97', name: 'AXN HD', img: 'http://103.144.89.251/assets/images/AXN HD1745045171.png' },
    { id: '102', name: 'BBC EARTH HD', img: 'http://103.144.89.251/assets/images/BBC EARTH HD1745150455.png' },
    { id: '55', name: 'BBC NEWS', img: 'http://103.144.89.251/assets/images/BBC NEWS1745042816.png' },
    { id: '22', name: 'DISCOVERY HD', img: 'http://103.144.89.251/assets/images/discovery hd.png' },
    { id: '98', name: 'HBO HD', img: 'http://103.144.89.251/assets/images/HBO HD1745045202.png' },
    { id: '15', name: 'HISTORY TV HD', img: 'http://103.144.89.251/assets/images/HISTORY TV HD1745033679.png' },
    { id: '70', name: 'HITZ MUSIC', img: 'http://103.144.89.251/assets/images/HITZ MUSIC1745043478.png' },
    { id: '91', name: 'LOTUS TV', img: 'http://103.144.89.251/assets/images/LOTUS TV1745044960.png' },
    { id: '67', name: 'LOVE NATURE', img: 'http://103.144.89.251/assets/images/LOVE NATURE1745043370.png' },
    { id: '36', name: 'MN PLUS', img: 'http://103.144.89.251/assets/images/MN PLUS1745040057.png' },
    { id: '33', name: 'MNX HD', img: 'http://103.144.89.251/assets/images/MNX HD1745039955.png' },
    { id: '39', name: 'MOVIES NOW HD', img: 'http://103.144.89.251/assets/images/MOVIES NOW HD1745040368.png' },
    { id: '25', name: 'NATGEO HD', img: 'http://103.144.89.251/assets/images/NATGEO HD1745038634.png' },
    { id: '23', name: 'NATGEO WILD HD', img: 'http://103.144.89.251/assets/images/NATGEO WILD HD1745038542.png' },
    { id: '34', name: 'ROMEDY NOW', img: 'http://103.144.89.251/assets/images/ROMEDY NOW1745039988.png' },
    { id: '6', name: 'SONY BBC EARTH HD', img: 'http://103.144.89.251/assets/images/SONY BBC EARTH HD1745031522.png' },
    { id: '32', name: 'SONY PIX HD', img: 'http://103.144.89.251/assets/images/SONY PIX HD1745039925.png' },
    { id: '38', name: 'STAR MOVIES HD', img: 'http://103.144.89.251/assets/images/STAR MOVIES HD1745040174.png' },
    { id: '27', name: 'STAR MOVIES SELECT HD', img: 'http://103.144.89.251/assets/images/STAR MOVIES SELECT HD1745038723.png' },
    { id: '9', name: 'TLC HD', img: 'http://103.144.89.251/assets/images/TLC HD1745033484.png' },
    { id: '62', name: 'TRAVEL XP', img: 'http://103.144.89.251/assets/images/TRAVEL XP1745043118.png' },
    { id: '37', name: 'ZEE CAFE HD', img: 'http://103.144.89.251/assets/images/ZEE CAFE HD1745040102.png' },
    
    // Hindi
    { id: '5', name: 'AND PICTURES HD', img: 'http://103.144.89.251/assets/images/AND PICTURS HD1745031440.png' },
    { id: '10', name: 'COLORS CINEPLEX HD', img: 'http://103.144.89.251/assets/images/COLORS CINEPLEX HD1745033519.png' },
    { id: '4', name: 'COLORS HD', img: 'http://103.144.89.251/assets/images/COLORS HD1745031404.png' },
    { id: '90', name: 'GEO NEWS HD', img: 'http://103.144.89.251/assets/images/GEO NEWS HD1745044892.png' },
    { id: '89', name: 'HUM TV', img: 'http://103.144.89.251/assets/images/HUM TV1745044837.png' },
    { id: '11', name: 'SONY ENT HD', img: 'http://103.144.89.251/assets/images/SONY ENT HD1745033553.png' },
    { id: '21', name: 'SONY MAX HD', img: 'http://103.144.89.251/assets/images/SONY MAX HD1745034069.png' },
    { id: '100', name: 'STAR BHARAT HD', img: 'http://103.144.89.251/assets/images/STAR BHARAT HD1745045255.png' },
    { id: '69', name: 'STAR GOLD 2 HD', img: 'http://103.144.89.251/assets/images/STAR GOLD 2 HD1745043441.png' },
    { id: '20', name: 'STAR GOLD HD', img: 'http://103.144.89.251/assets/images/STAR GOLD HD1745034037.png' },
    { id: '71', name: 'STAR GOLD SELECT HD', img: 'http://103.144.89.251/assets/images/STAR GOLD SELECT HD1745043508.png' },
    { id: '24', name: 'STAR PLUS HD', img: 'http://103.144.89.251/assets/images/STAR PLUS HD1745038577.png' },
    { id: '13', name: 'ZEE CINEMA HD', img: 'http://103.144.89.251/assets/images/ZEE CINEMA HD1745033602.png' },
    { id: '7', name: 'ZEE TV HD', img: 'http://103.144.89.251/assets/images/ZEE TV HD1745033383.png' },
    { id: '53', name: 'ZING', img: 'http://103.144.89.251/assets/images/ZING1745042718.png' },
    { id: '42', name: 'ZOOM', img: 'http://103.144.89.251/assets/images/ZOOM1745040961.png' },
    
    // Bangla
    { id: '80', name: 'ATN BANGLA', img: 'http://103.144.89.251/assets/images/ATN BANGLA1745044183.png' },
    { id: '95', name: 'ATN NEWS', img: 'http://103.144.89.251/assets/images/ATN NEWS1745045113.png' },
    { id: '82', name: 'CHANNEL 24', img: 'http://103.144.89.251/assets/images/CHANNEL 241745044263.png' },
    { id: '81', name: 'CHANNEL I', img: 'http://103.144.89.251/assets/images/CHANNEL I1745044237.png' },
    { id: '47', name: 'COLORS BANGLA CINEMA', img: 'http://103.144.89.251/assets/images/COLORS BANGLA CINEMA1745041486.png' },
    { id: '12', name: 'COLORS BANGLA HD', img: 'http://103.144.89.251/assets/images/COLORS BANGLA HD1745033576.png' },
    { id: '84', name: 'ENTERR 10', img: 'http://103.144.89.251/assets/images/ENTERR 101745044330.png' },
    { id: '56', name: 'GTV', img: 'http://103.144.89.251/assets/images/GTV1745042853.png' },
    { id: '77', name: 'INDEPENDENT TV', img: 'http://103.144.89.251/assets/images/INDEPENDENT TV1745044077.png' },
    { id: '19', name: 'JALSHA MOVIES HD', img: 'http://103.144.89.251/assets/images/JALSHA MOVIES HD1745034005.png' },
    { id: '76', name: 'JAMUNA TV', img: 'http://103.144.89.251/assets/images/JAMUNA TV1745044052.png' },
    { id: '78', name: 'MAASRANGA HD', img: 'http://103.144.89.251/assets/images/MAASRANGA HD1745044117.png' },
    { id: '54', name: 'NAGORIK', img: 'http://103.144.89.251/assets/images/NAGORIK1745042776.png' },
    { id: '79', name: 'SOMOY TV', img: 'http://103.144.89.251/assets/images/SOMOY TV1745044149.png' },
    { id: '44', name: 'SONY AAT', img: 'http://103.144.89.251/assets/images/SONY AAT1745041124.png' },
    { id: '18', name: 'STAR JALSHA HD', img: 'http://103.144.89.251/assets/images/STAR JALSHA HD1745033819.png' },
    { id: '17', name: 'SUN BANGLA HD', img: 'http://103.144.89.251/assets/images/SUN BANGLA HD1745033791.png' },
    { id: '43', name: 'ZEE BANGLA CINEMA', img: 'http://103.144.89.251/assets/images/ZEE BANGLA CINEMA1745040996.png' },
    { id: '14', name: 'ZEE BANGLA HD', img: 'http://103.144.89.251/assets/images/ZEE BANGLA HD1745033633.png' },
    
    // Kids
    { id: '50', name: 'BAL BHARAT', img: 'http://103.144.89.251/assets/images/BAL BHARAT1745041576.png' },
    { id: '8', name: 'CARTOON NETWORK', img: 'http://103.144.89.251/assets/images/CARTOON NETWORK1745033414.png' },
    { id: '68', name: 'DURANTA TV', img: 'http://103.144.89.251/assets/images/DURANTA TV1745043400.png' },
    { id: '49', name: 'HUNGAMA', img: 'http://103.144.89.251/assets/images/HUNGAMA1745041551.png' },
    { id: '46', name: 'NICK', img: 'http://103.144.89.251/assets/images/NICK1745041451.png' },
    { id: '51', name: 'NICK JR', img: 'http://103.144.89.251/assets/images/NICK JR1745042397.png' },
    { id: '48', name: 'POGO', img: 'http://103.144.89.251/assets/images/POGO1745041515.png' },
    { id: '45', name: 'SONIC', img: 'http://103.144.89.251/assets/images/SONIC1745041154.png' },
    { id: '93', name: 'SONY YAY', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png' },
    { id: '75', name: 'SUPER HUNGAMA', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png' },
    
    // Islamic
    { id: '83', name: 'MADANI TV HD', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png' },
    { id: '86', name: 'PEACE TV BANGLA', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png' }
];

// ==================== CONFIGURATION ====================
const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

// Optimized HLS Configuration
const hlsConfig = {
    enableWorker: true,
    lowLatencyMode: true,
    maxBufferLength: 20,
    maxMaxBufferLength: 40,
    maxBufferSize: 30 * 1000 * 1000,
    startLevel: -1,
    fragLoadingMaxRetry: 3,
    levelLoadingMaxRetry: 3,
    fragLoadingTimeOut: 8000,
    levelLoadingTimeOut: 8000,
    manifestLoadingTimeOut: 8000,
    startFragPrefetch: true,
    testBandwidth: true,
    autoStartLoad: true,
    abrEwmaDefaultEstimate: 5e5,
    abrEwmaFastLive: 3,
    abrEwmaSlowLive: 9
};

// ==================== DOM ELEMENTS ====================
const video = document.getElementById('videoPlayer');
const loader = document.getElementById('loader');
const channelListDiv = document.getElementById('channelList');
const channelsContainer = document.getElementById('channelsContainer');
const searchInput = document.getElementById('searchInput');
const toggleListBtn = document.getElementById('toggleListBtn');
const closeListBtn = document.getElementById('closeListBtn');
const currentChannelNameSpan = document.getElementById('currentChannelName');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// ==================== GLOBALS ====================
let hls = null;
let currentChannel = null;
let autoHideTimeout = null;
let isListVisible = true;
let lastVolume = 1;

// ==================== FULLSCREEN FUNCTION ====================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
});

// ==================== LOAD CHANNEL ====================
async function loadChannel(channel) {
    if (currentChannel && currentChannel.id === channel.id) return;
    
    currentChannel = channel;
    currentChannelNameSpan.innerText = channel.name;
    loader.style.display = 'block';

    try {
        const res = await fetch(`${WORKER_URL}/api/get-stream?id=${channel.id}`);
        const data = await res.json();

        if (data.success) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            
            if (Hls.isSupported()) {
                if (hls) {
                    hls.stopLoad();
                    hls.detachMedia();
                    hls.destroy();
                    hls = null;
                }

                hls = new Hls(hlsConfig);
                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(e => console.log('Auto-play:', e));
                    loader.style.display = 'none';
                    
                    // Auto hide list after 3 seconds of playback
                    if (isListVisible) {
                        autoHideTimeout = setTimeout(() => {
                            if (isListVisible && !video.paused) {
                                hideChannelList();
                            }
                        }, 3000);
                    }
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.log('Network error, retrying...');
                                setTimeout(() => hls.startLoad(), 1000);
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.log('Media error, recovering...');
                                hls.recoverMediaError();
                                break;
                            default:
                                console.log('Fatal error');
                                loader.style.display = 'none';
                                break;
                        }
                    }
                });

            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                    loader.style.display = 'none';
                    if (isListVisible) {
                        autoHideTimeout = setTimeout(() => {
                            if (isListVisible && !video.paused) hideChannelList();
                        }, 3000);
                    }
                });
            }
        } else {
            loader.style.display = 'none';
        }
    } catch (e) {
        console.error("Error:", e);
        loader.style.display = 'none';
    }
    
    renderChannels();
}

// ==================== CHANNEL LIST FUNCTIONS ====================
function showChannelList() {
    channelListDiv.classList.remove('hide');
    isListVisible = true;
    renderChannels();
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
}

function hideChannelList() {
    channelListDiv.classList.add('hide');
    isListVisible = false;
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
}

function toggleChannelList() {
    if (isListVisible) {
        hideChannelList();
    } else {
        showChannelList();
    }
}

// ==================== RENDER CHANNELS ====================
let searchQuery = '';

function renderChannels() {
    let filtered = channels;
    
    if (searchQuery) {
        filtered = filtered.filter(ch => 
            ch.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filtered.length === 0) {
        channelsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">📺 No channels found</div>';
        return;
    }
    
    channelsContainer.innerHTML = filtered.map(ch => `
        <div class="channel-item ${currentChannel?.id === ch.id ? 'active' : ''}" onclick="loadChannel(${JSON.stringify(ch).replace(/"/g, '&quot;')})">
            <img src="https://images.weserv.nl/?url=${encodeURIComponent(ch.img)}&w=50&h=50&fit=cover" class="channel-img" alt="${ch.name}" onerror="this.src='https://via.placeholder.com/50?text=TV'">
            <div class="channel-info">
                <div class="channel-name">${ch.name}</div>
                <div class="channel-status">
                    <i class="fas fa-circle"></i>
                    ${currentChannel?.id === ch.id ? 'Now Playing' : 'Click to play'}
                </div>
            </div>
            ${currentChannel?.id === ch.id ? '<i class="fas fa-play playing-indicator"></i>' : ''}
        </div>
    `).join('');
}

// ==================== SEARCH ====================
function searchChannels() {
    searchQuery = searchInput.value;
    renderChannels();
}

// ==================== VOLUME CONTROL ====================
function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (video.volume < 0.3) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function toggleMute() {
    if (video.muted) {
        video.muted = false;
        video.volume = lastVolume;
        volumeSlider.value = lastVolume;
    } else {
        lastVolume = video.volume;
        video.muted = true;
        video.volume = 0;
        volumeSlider.value = 0;
    }
    updateVolumeIcon();
}

function setVolume(value) {
    const vol = parseFloat(value);
    video.volume = vol;
    video.muted = false;
    lastVolume = vol;
    volumeSlider.value = vol;
    updateVolumeIcon();
}

// ==================== VIDEO PLAY/PAUSE ====================
function togglePlayPause() {
    if (video.paused) {
        video.play();
        if (isListVisible) {
            autoHideTimeout = setTimeout(() => {
                if (isListVisible && !video.paused) hideChannelList();
            }, 3000);
        }
    } else {
        video.pause();
        if (!isListVisible) showChannelList();
        if (autoHideTimeout) clearTimeout(autoHideTimeout);
    }
}

// ==================== LOAD RANDOM CHANNEL ====================
function loadRandomChannel() {
    const randomIndex = Math.floor(Math.random() * channels.length);
    loadChannel(channels[randomIndex]);
}

// ==================== EVENT LISTENERS ====================
video.addEventListener('click', togglePlayPause);
video.addEventListener('play', () => {
    if (isListVisible) {
        if (autoHideTimeout) clearTimeout(autoHideTimeout);
        autoHideTimeout = setTimeout(() => {
            if (isListVisible && !video.paused) hideChannelList();
        }, 3000);
    }
});
video.addEventListener('pause', () => {
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
    if (!isListVisible) showChannelList();
});

volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
volumeBtn.addEventListener('click', toggleMute);
fullscreenBtn.addEventListener('click', toggleFullscreen);

searchInput.addEventListener('input', searchChannels);
toggleListBtn.addEventListener('click', toggleChannelList);
closeListBtn.addEventListener('click', hideChannelList);

// Close list when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && isListVisible) {
        if (!channelListDiv.contains(e.target) && !toggleListBtn.contains(e.target)) {
            hideChannelList();
        }
    }
});

// ==================== INITIALIZE ====================
function init() {
    renderChannels();
    loadRandomChannel();
    
    video.volume = 1;
    volumeSlider.value = 1;
    updateVolumeIcon();
    
    // Channel list is visible initially (class="active" in HTML)
    isListVisible = true;
    
    // Auto hide after 5 seconds if video starts playing
    setTimeout(() => {
        if (!video.paused && isListVisible) {
            hideChannelList();
        }
    }, 5000);
}

// Start the app
init();

// Make functions global
window.loadChannel = loadChannel;
