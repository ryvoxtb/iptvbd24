const { app, BrowserWindow } = require('electron');
const path = require('path');

/**
 * RYVOX TV - Desktop App Main Process
 * Optimized for High-Speed Video Streaming
 */

function createWindow() {
    // ১. উইন্ডো কনফিগারেশন
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 900,
        minHeight: 600,
        title: "RYVOX TV - Premium IPTV",
        backgroundColor: '#000000', // লোডিং এর সময় সাদা স্ক্রিন আসবে না
        
        // যদি আপনার আইকন থাকে তবে নিচের লাইনটি আনকমেন্ট করুন
        // icon: path.join(__dirname, 'icon.ico'), 

        webPreferences: {
            nodeIntegration: false,      // সিকিউরিটির জন্য false
            contextIsolation: true,     // সিকিউরিটির জন্য true
            backgroundThrottling: false, // ব্যাকগ্রাউন্ডে অ্যাপ চললে ভিডিও স্পিড কমবে না
            spellcheck: false            // অপ্রয়োজনীয় স্পেলচেক বন্ধ
        }
    });

    // ২. মেনুবার সম্পূর্ণ হাইড করা (যাতে শুধু আপনার ডিজাইন দেখা যায়)
    win.setMenuBarVisibility(false);

    // ৩. আপনার index.html ফাইল লোড করা
    win.loadFile('index.html');

    // ৪. উইন্ডো যখন ফুলস্ক্রিন হবে
    win.on('enter-full-screen', () => {
        win.setMenuBarVisibility(false);
    });

    // ৫. অ্যাপটি ক্লোজ করার সিস্টেম
    win.on('closed', () => {
        app.quit();
    });
}

// ==================== PERFORMANCE BOOST ====================
// ভিডিও এবং গ্রাফিক্স পারফরম্যান্স বাড়ানোর জন্য Chromium ইঞ্জিন সেটআপ
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-accelerated-video-decode');
app.commandLine.appendSwitch('enable-hardware-overlays');

// ==================== APP LIFECYCLE ====================

// অ্যাপ রেডি হলে উইন্ডো ওপেন হবে
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// সব উইন্ডো বন্ধ হলে অ্যাপ পুরোপুরি বন্ধ হবে (Windows/Linux এর জন্য)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
