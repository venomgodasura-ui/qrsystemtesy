// ==========================
// 🔐 LOGIN SYSTEM
// ==========================
function login() {
    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    if (username === "Abhishek1" && password === "Abhishek2") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Credentials");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ==========================
// 📦 LOAD ATTENDANCE DATA
// ==========================
let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

// ==========================
// 📡 QR SCAN HANDLER
// ==========================
function onScanSuccess(qrData) {

    // Prevent duplicate scan
    if (attendance[qrData]) {
        alert("⚠️ Already Marked!");
        return;
    }

    // Split QR data
    let parts = qrData.split("|");

    if (parts.length !== 4) {
        alert("Invalid QR Code");
        return;
    }

    let id = parts[0];
    let name = parts[1];
    let sem = parts[2];
    let course = parts[3];

    let time = new Date().toLocaleTimeString();

    // Save attendance
    attendance[qrData] = {
        id,
        name,
        sem,
        course,
        time
    };

    localStorage.setItem("attendance", JSON.stringify(attendance));

    // Play sound
    playBeep();

    // Show popup
    showPopup(name);

    // Update UI
    updateUI();
}

// ==========================
// 🔊 SOUND FUNCTION
// ==========================
function playBeep() {
    let beep = document.getElementById("beep");
    if (beep) beep.play();
}

// ==========================
// 🎉 POPUP FUNCTION
// ==========================
function showPopup(name) {
    let popup = document.createElement("div");
    popup.className = "popup";
    popup.innerText = `✅ ${name} marked present`;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// ==========================
// 📊 UPDATE UI
// ==========================
function updateUI() {
    let list = document.getElementById("list");
    let summary = document.getElementById("summary");

    if (!list || !summary) return;

    list.innerHTML = "";

    let presentCount = Object.keys(attendance).length;

    for (let key in attendance) {
        let s = attendance[key];

        let li = document.createElement("li");
        li.innerText =
            `${s.name} (${s.id}) - ${s.course} ${s.sem} - ${s.time}`;

        list.appendChild(li);
    }

    summary.innerText = `Present: ${presentCount}`;
}

// ==========================
// 📷 START QR SCANNER
// ==========================
function startScanner() {
    if (!document.getElementById("reader")) return;

    let scanner = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length > 0) {
            scanner.start(
                devices[0].id,
                { fps: 10, qrbox: 250 },
                onScanSuccess
            );
        }
    }).catch(err => {
        console.error("Camera Error:", err);
    });
}

// ==========================
// ⏰ LIVE CLOCK
// ==========================
function startClock() {
    setInterval(() => {
        let clock = document.getElementById("clock");
        if (clock) {
            clock.innerText = new Date().toLocaleTimeString();
        }
    }, 1000);
}

// ==========================
// 🔄 RESET ATTENDANCE
// ==========================
function resetAttendance() {
    localStorage.removeItem("attendance");
    attendance = {};
    updateUI();
}

// ==========================
// 📁 DOWNLOAD CSV
// ==========================
function downloadCSV() {
    let data = "ID,Name,Course,Semester,Time\n";

    for (let key in attendance) {
        let s = attendance[key];
        data += `${s.id},${s.name},${s.course},${s.sem},${s.time}\n`;
    }

    let blob = new Blob([data], { type: "text/csv" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "attendance.csv";
    link.click();
}

// ==========================
// 🚀 INIT (AUTO RUN)
// ==========================
window.onload = function () {
    startScanner();
    startClock();
    updateUI();
};