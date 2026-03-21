const video = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const miniLoader = document.getElementById('miniLoader');
const volumeSlider = document.getElementById('volumeSlider');
const WORKER_URL = "https://shiny-cherry-3e9e.mdabdullahsheikh017.workers.dev";

let hls = null;
let currentChannelId = null;

// HLS কনফিগারেশন: বাফারিং কমানোর জন্য অপ্টিমাইজড
const hlsConfig = {
    enableWorker: true, // ব্রাউজারের আলাদা থ্রেড ব্যবহার করবে, ফলে মেইন সাইট স্লো হবে না
    lowLatencyMode: true, // লাইভ ভিডিওর জন্য ল্যাটেন্সি কমাবে
    backBufferLength: 90, // পিছনে ৯০ সেকেন্ডের ভিডিও সেভ রাখবে যাতে রিওয়াইন্ড করলে বাফার না হয়
    maxBufferLength: 30, // সামনে ৩০ সেকেন্ডের ভিডিও সবসময় লোড করে রাখবে
    maxMaxBufferLength: 60,
    maxBufferSize: 50 * 1000 * 1000, // ৫০ মেগাবাইট পর্যন্ত ডেটা বাফার করবে
    startLevel: -1, // ইন্টারনেটের স্পিড অনুযায়ী অটো কোয়ালিটি সিলেক্ট করবে
    abandonFragmentOnPause: false,
    fragLoadingMaxRetry: 10, // নেট চলে গেলে ১০ বার অটো ট্রাই করবে
    levelLoadingMaxRetry: 10
};

async function loadChannel(id, name) {
    if (id === currentChannelId) return;

    miniLoader.classList.remove('hidden');
    document.getElementById('videoTitle').innerText = `সংযুক্ত হচ্ছে: ${name}...`;

    try {
        const res = await fetch(`${WORKER_URL}/api/get-stream?id=${id}`);
        const data = await res.json();

        if (data.success) {
            const streamUrl = `${WORKER_URL}/api/proxy?url=${encodeURIComponent(data.url)}`;
            
            if (Hls.isSupported()) {
                if (hls) {
                    hls.stopLoad(); // আগের লোডিং বন্ধ করবে
                    hls.detachMedia();
                    hls.destroy();
                }

                hls = new Hls(hlsConfig);
                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        // অটো প্লে ব্লক হলে প্লে বাটন দেখাবে
                        playBtn.innerHTML = '<i class="fa fa-play"></i>';
                    });
                    miniLoader.classList.add('hidden');
                    document.getElementById('videoTitle').innerText = name;
                    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
                    currentChannelId = id;
                });

                // ভিডিও আটকে গেলে অটোমেটিক রিকভার করার লজিক
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
                                loadChannel(id, name);
                                break;
                        }
                    }
                });

            } else {
                // সাফারি বা আইফোনের জন্য
                video.src = streamUrl;
                video.addEventListener('canplay', () => {
                    video.play();
                    miniLoader.classList.add('hidden');
                    document.getElementById('videoTitle').innerText = name;
                });
            }
        }
    } catch (e) {
        console.error("Stream Error:", e);
        miniLoader.classList.add('hidden');
    }
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    } else {
        video.pause();
        playBtn.innerHTML = '<i class="fa fa-play"></i>';
    }
}

// ভলিউম কন্ট্রোল
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
});

// চ্যানেল লিস্ট রেন্ডার
const channels = [
    // Sports Category
    { id: '88', name: 'A SPORTS HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/A SPORTS HD1745044782.png', icon: 'fa-trophy' },
    { id: '40', name: 'EUROSPORTS HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/EUROSPORTS HD1745040406.png', icon: 'fa-trophy' },
    { id: '87', name: 'FAST SPORTS HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/FAST SPORTS HD1745044750.png', icon: 'fa-trophy' },
    { id: '66', name: 'GOLF SPORTS', cat: 'Sports', img: 'http://103.144.89.251/assets/images/GOLF SPORTS1745043338.png', icon: 'fa-trophy' },
    { id: '92', name: 'PTV SPORTS HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/PTV SPORTS HD1745044993.png', icon: 'fa-trophy' },
    { id: '74', name: 'SONY SPORTS 1 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/sony sports 1 hd.png', icon: 'fa-trophy' },
    { id: '29', name: 'SONY SPORTS 2 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/sony sports 2 hd.png', icon: 'fa-trophy' },
    { id: '30', name: 'SONY SPORTS 3', cat: 'Sports', img: 'http://103.144.89.251/assets/images/Sony sports 3.png', icon: 'fa-trophy' },
    { id: '72', name: 'SONY SPORTS 4', cat: 'Sports', img: 'http://103.144.89.251/assets/images/sony sports 4.png', icon: 'fa-trophy' },
    { id: '101', name: 'SONY SPORTS 5 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/sony sports 5 hd.png', icon: 'fa-trophy' },
    { id: '96', name: 'SSC SPORTS', cat: 'Sports', img: 'http://103.144.89.251/assets/images/ssc 1 hd.png', icon: 'fa-trophy' },
    { id: '103', name: 'SSC SPORTS 5 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/ssc 5 hd.png', icon: 'fa-trophy' },
    { id: '28', name: 'STAR SELECT 1 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/STAR SELECT 1 HD1745038777.png', icon: 'fa-trophy' },
    { id: '2', name: 'STAR SPORTS 1 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/STAR SPORTS 1 HD1744991778.png', icon: 'fa-trophy' },
    { id: '3', name: 'STAR SPORTS 2 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/STAR SPORTS 2 HD1744991842.png', icon: 'fa-trophy' },
    { id: '31', name: 'STAR SPORTS 3', cat: 'Sports', img: 'http://103.144.89.251/assets/images/STAR SPORTS 31745039893.png', icon: 'fa-trophy' },
    { id: '16', name: 'STAR SPORTS SELECT 2 HD', cat: 'Sports', img: 'http://103.144.89.251/assets/images/STAR SPORTS SELECT 2 HD1745033722.png', icon: 'fa-trophy' },
    { id: '1', name: 'T SPORTS', cat: 'Sports', img: 'http://103.144.89.251/assets/images/T SPORTS1744972630.png', icon: 'fa-trophy' },

    // English Category
    { id: '85', name: 'ALJAZEETA HD', cat: 'English', img: 'http://103.144.89.251/assets/images/ALJAZEETA HD1745044358.png', icon: 'fa-globe' },
    { id: '35', name: 'AND FLIX HD', cat: 'English', img: 'http://103.144.89.251/assets/images/AND FLIX HD1745040018.png', icon: 'fa-globe' },
    { id: '41', name: 'AND PRIVE HD', cat: 'English', img: 'http://103.144.89.251/assets/images/AND PRIVE HD1745040451.png', icon: 'fa-globe' },
    { id: '61', name: 'AND XPLORE', cat: 'English', img: 'http://103.144.89.251/assets/images/AND XPLORE1745043080.png', icon: 'fa-globe' },
    { id: '26', name: 'ANIMAL PLANET HD', cat: 'English', img: 'http://103.144.89.251/assets/images/ANIMAL PLANET HD1745038671.png', icon: 'fa-globe' },
    { id: '97', name: 'AXN HD', cat: 'English', img: 'http://103.144.89.251/assets/images/AXN HD1745045171.png', icon: 'fa-globe' },
    { id: '102', name: 'BBC EARTH HD', cat: 'English', img: 'http://103.144.89.251/assets/images/BBC EARTH HD1745150455.png', icon: 'fa-globe' },
    { id: '55', name: 'BBC NEWS', cat: 'English', img: 'http://103.144.89.251/assets/images/BBC NEWS1745042816.png', icon: 'fa-globe' },
    { id: '22', name: 'DISCOVERY HD', cat: 'English', img: 'http://103.144.89.251/assets/images/discovery hd.png', icon: 'fa-globe' },
    { id: '98', name: 'HBO HD', cat: 'English', img: 'http://103.144.89.251/assets/images/HBO HD1745045202.png', icon: 'fa-globe' },
    { id: '15', name: 'HISTORY TV HD', cat: 'English', img: 'http://103.144.89.251/assets/images/HISTORY TV HD1745033679.png', icon: 'fa-globe' },
    { id: '70', name: 'HITZ MUSIC', cat: 'English', img: 'http://103.144.89.251/assets/images/HITZ MUSIC1745043478.png', icon: 'fa-globe' },
    { id: '91', name: 'LOTUS TV', cat: 'English', img: 'http://103.144.89.251/assets/images/LOTUS TV1745044960.png', icon: 'fa-globe' },
    { id: '67', name: 'LOVE NATURE', cat: 'English', img: 'http://103.144.89.251/assets/images/LOVE NATURE1745043370.png', icon: 'fa-globe' },
    { id: '36', name: 'MN PLUS', cat: 'English', img: 'http://103.144.89.251/assets/images/MN PLUS1745040057.png', icon: 'fa-globe' },
    { id: '33', name: 'MNX HD', cat: 'English', img: 'http://103.144.89.251/assets/images/MNX HD1745039955.png', icon: 'fa-globe' },
    { id: '39', name: 'MOVIES NOW HD', cat: 'English', img: 'http://103.144.89.251/assets/images/MOVIES NOW HD1745040368.png', icon: 'fa-globe' },
    { id: '25', name: 'NATGEO HD', cat: 'English', img: 'http://103.144.89.251/assets/images/NATGEO HD1745038634.png', icon: 'fa-globe' },
    { id: '23', name: 'NATGEO WILD HD', cat: 'English', img: 'http://103.144.89.251/assets/images/NATGEO WILD HD1745038542.png', icon: 'fa-globe' },
    { id: '34', name: 'ROMEDY NOW', cat: 'English', img: 'http://103.144.89.251/assets/images/ROMEDY NOW1745039988.png', icon: 'fa-globe' },
    { id: '6', name: 'SONY BBC EARTH HD', cat: 'English', img: 'http://103.144.89.251/assets/images/SONY BBC EARTH HD1745031522.png', icon: 'fa-globe' },
    { id: '32', name: 'SONY PIX HD', cat: 'English', img: 'http://103.144.89.251/assets/images/SONY PIX HD1745039925.png', icon: 'fa-globe' },
    { id: '38', name: 'STAR MOVIES HD', cat: 'English', img: 'http://103.144.89.251/assets/images/STAR MOVIES HD1745040174.png', icon: 'fa-globe' },
    { id: '27', name: 'STAR MOVIES SELECT HD', cat: 'English', img: 'http://103.144.89.251/assets/images/STAR MOVIES SELECT HD1745038723.png', icon: 'fa-globe' },
    { id: '9', name: 'TLC HD', cat: 'English', img: 'http://103.144.89.251/assets/images/TLC HD1745033484.png', icon: 'fa-globe' },
    { id: '62', name: 'TRAVEL XP', cat: 'English', img: 'http://103.144.89.251/assets/images/TRAVEL XP1745043118.png', icon: 'fa-globe' },
    { id: '37', name: 'ZEE CAFE HD', cat: 'English', img: 'http://103.144.89.251/assets/images/ZEE CAFE HD1745040102.png', icon: 'fa-globe' },

    // Hindi Category
    { id: '5', name: 'AND PICTURS HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/AND PICTURS HD1745031440.png', icon: 'fa-film' },
    { id: '10', name: 'COLORS CINEPLEX HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/COLORS CINEPLEX HD1745033519.png', icon: 'fa-film' },
    { id: '4', name: 'COLORS HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/COLORS HD1745031404.png', icon: 'fa-film' },
    { id: '90', name: 'GEO NEWS HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/GEO NEWS HD1745044892.png', icon: 'fa-film' },
    { id: '89', name: 'HUM TV', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/HUM TV1745044837.png', icon: 'fa-film' },
    { id: '11', name: 'SONY ENT HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/SONY ENT HD1745033553.png', icon: 'fa-film' },
    { id: '21', name: 'SONY MAX HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/SONY MAX HD1745034069.png', icon: 'fa-film' },
    { id: '100', name: 'STAR BHARAT HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/STAR BHARAT HD1745045255.png', icon: 'fa-film' },
    { id: '69', name: 'STAR GOLD 2 HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/STAR GOLD 2 HD1745043441.png', icon: 'fa-film' },
    { id: '20', name: 'STAR GOLD HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/STAR GOLD HD1745034037.png', icon: 'fa-film' },
    { id: '71', name: 'STAR GOLD SELECT HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/STAR GOLD SELECT HD1745043508.png', icon: 'fa-film' },
    { id: '24', name: 'STAR PLUS HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/STAR PLUS HD1745038577.png', icon: 'fa-film' },
    { id: '13', name: 'ZEE CINEMA HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/ZEE CINEMA HD1745033602.png', icon: 'fa-film' },
    { id: '7', name: 'ZEE TV HD', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/ZEE TV HD1745033383.png', icon: 'fa-film' },
    { id: '53', name: 'ZING', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/ZING1745042718.png', icon: 'fa-film' },
    { id: '42', name: 'ZOOM', cat: 'Hindi', img: 'http://103.144.89.251/assets/images/ZOOM1745040961.png', icon: 'fa-film' },

    // Bangla Category
    { id: '80', name: 'ATN BANGLA', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/ATN BANGLA1745044183.png', icon: 'fa-tv' },
    { id: '95', name: 'ATN NEWS', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/ATN NEWS1745045113.png', icon: 'fa-tv' },
    { id: '82', name: 'CHANNEL 24', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/CHANNEL 241745044263.png', icon: 'fa-tv' },
    { id: '81', name: 'CHANNEL I', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/CHANNEL I1745044237.png', icon: 'fa-tv' },
    { id: '47', name: 'COLORS BANGLA CINEMA', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/COLORS BANGLA CINEMA1745041486.png', icon: 'fa-tv' },
    { id: '12', name: 'COLORS BANGLA HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/COLORS BANGLA HD1745033576.png', icon: 'fa-tv' },
    { id: '84', name: 'ENTERR 10', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/ENTERR 101745044330.png', icon: 'fa-tv' },
    { id: '56', name: 'GTV', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/GTV1745042853.png', icon: 'fa-tv' },
    { id: '77', name: 'INDEPENDENT TV', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/INDEPENDENT TV1745044077.png', icon: 'fa-tv' },
    { id: '19', name: 'JALSHA MOVIES HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/JALSHA MOVIES HD1745034005.png', icon: 'fa-tv' },
    { id: '76', name: 'JAMUNA TV', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/JAMUNA TV1745044052.png', icon: 'fa-tv' },
    { id: '78', name: 'MAASRANGA HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/MAASRANGA HD1745044117.png', icon: 'fa-tv' },
    { id: '54', name: 'NAGORIK', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/NAGORIK1745042776.png', icon: 'fa-tv' },
    { id: '79', name: 'SOMOY TV', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/SOMOY TV1745044149.png', icon: 'fa-tv' },
    { id: '44', name: 'SONY AAT', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/SONY AAT1745041124.png', icon: 'fa-tv' },
    { id: '18', name: 'STAR JALSHA HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/STAR JALSHA HD1745033819.png', icon: 'fa-tv' },
    { id: '17', name: 'SUN BANGLA HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/SUN BANGLA HD1745033791.png', icon: 'fa-tv' },
    { id: '43', name: 'ZEE BANGLA CINEMA', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/ZEE BANGLA CINEMA1745040996.png', icon: 'fa-tv' },
    { id: '14', name: 'ZEE BANGLA HD', cat: 'Bangla', img: 'http://103.144.89.251/assets/images/ZEE BANGLA HD1745033633.png', icon: 'fa-tv' },

    // Kids Category
    { id: '50', name: 'BAL BHARAT', cat: 'Kids', img: 'http://103.144.89.251/assets/images/BAL BHARAT1745041576.png', icon: 'fa-child' },
    { id: '8', name: 'CARTOON NETWORK', cat: 'Kids', img: 'http://103.144.89.251/assets/images/CARTOON NETWORK1745033414.png', icon: 'fa-child' },
    { id: '68', name: 'DURANTA TV', cat: 'Kids', img: 'http://103.144.89.251/assets/images/DURANTA TV1745043400.png', icon: 'fa-child' },
    { id: '49', name: 'HUNGAMA', cat: 'Kids', img: 'http://103.144.89.251/assets/images/HUNGAMA1745041551.png', icon: 'fa-child' },
    { id: '46', name: 'NICK', cat: 'Kids', img: 'http://103.144.89.251/assets/images/NICK1745041451.png', icon: 'fa-child' },
    { id: '51', name: 'NICK JR', cat: 'Kids', img: 'http://103.144.89.251/assets/images/NICK JR1745042397.png', icon: 'fa-child' },
    { id: '48', name: 'POGO', cat: 'Kids', img: 'http://103.144.89.251/assets/images/POGO1745041515.png', icon: 'fa-child' },
    { id: '45', name: 'SONIC', cat: 'Kids', img: 'http://103.144.89.251/assets/images/SONIC1745041154.png', icon: 'fa-child' },
    { id: '93', name: 'SONY YAY', cat: 'Kids', img: 'http://103.144.89.251/assets/images/SONY YAY1745045046.png', icon: 'fa-child' },
    { id: '75', name: 'SUPER HUNGAMA', cat: 'Kids', img: 'http://103.144.89.251/assets/images/SUPER HUNGAMA1745044022.png', icon: 'fa-child' },

    // Islamic Category
    { id: '83', name: 'MADANI TV HD', cat: 'Islamic', img: 'http://103.144.89.251/assets/images/MADANI TV HD1745044303.png', icon: 'fa-mosque' },
    { id: '86', name: 'PEACE TV BANGLA', cat: 'Islamic', img: 'http://103.144.89.251/assets/images/PEACE TV BANGLA1745044480.png', icon: 'fa-mosque' }
];

function renderChannels(f = 'all', q = '') {
    const grid = document.getElementById('channelGrid');
    grid.innerHTML = '';
    channels.forEach(ch => {
        if (f !== 'all' && ch.cat !== f) return;
        if (q && !ch.name.toLowerCase().includes(q.toLowerCase())) return;
        const div = document.createElement('div');
        div.className = 'ch-card';
        div.onclick = () => {
            loadChannel(ch.id, ch.name);
            if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        div.innerHTML = `<img src="https://wsrv.nl/?url=${encodeURIComponent(ch.img)}&w=120" class="h-10 mx-auto mb-2"><span class="text-[10px] font-bold uppercase">${ch.name}</span>`;
        grid.appendChild(div);
    });
}

const allCategories = ['all', 'Bangla', 'Sports', 'English', 'Hindi', 'Islamic', 'Kids'];

function setup() {
    const pc = document.getElementById('pc-nav');
    const mob = document.getElementById('mobile-nav');
    allCategories.forEach(c => {
        const icon = c === 'all' ? 'fa-border-all' : (channels.find(ch => ch.cat === c)?.icon || 'fa-tv');
        const btn = `<button onclick="filterCat('${c}', this)" class="nav-link ${c === 'all' ? 'active' : ''}"><i class="fa-solid ${icon}"></i><span>${c}</span></button>`;
        pc.innerHTML += btn; mob.innerHTML += btn;
    });
    renderChannels();
    loadChannel(channels[0].id, channels[0].name);
}

function filterCat(c, btn) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
    renderChannels(c);
}

function fullScreen() {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
}

function search() { renderChannels('all', document.getElementById('searchInput').value); }

window.onload = setup;
