let timer;
let milliseconds = 0, seconds = 0, minutes = 0;
let running = false;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const millisecondsDisplay = document.getElementById("milliseconds");

const startButton = document.getElementById("start");
const lapButton = document.getElementById("lap");
const resetButton = document.getElementById("reset");
const shareButton = document.getElementById("share");
const lapsList = document.getElementById("laps");
const historyLog = document.getElementById("history-log");
const themeSelector = document.getElementById("theme");
const stopwatchDisplay = document.querySelector(".stopwatch");

// Load History from Local Storage
document.addEventListener("DOMContentLoaded", loadHistory);

startButton.addEventListener("click", () => {
    if (!running) {
        running = true;
        timer = setInterval(updateTime, 10);
        startButton.innerText = "Stop";
        startButton.id = "stop";

        lapButton.classList.remove("hidden");
        resetButton.classList.remove("hidden");
        shareButton.classList.remove("hidden");
    } else {
        running = false;
        clearInterval(timer);
        startButton.innerText = "Start";
        startButton.id = "start";
    }
});

resetButton.addEventListener("click", () => {
    running = false;
    clearInterval(timer);
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    updateDisplay();
    lapsList.innerHTML = "";
});

lapButton.addEventListener("click", () => {
    if (running) {
        let lapTime = `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
        let lapItem = document.createElement("li");
        lapItem.innerText = lapTime;
        lapsList.appendChild(lapItem);

        saveToHistory(lapTime);
    }
});

// Theme Selection
themeSelector.addEventListener("change", () => {
    stopwatchDisplay.className = "stopwatch";
    if (themeSelector.value === "retro") {
        stopwatchDisplay.classList.add("retro");
    } else if (themeSelector.value === "analog") {
        stopwatchDisplay.classList.add("analog");
    }
});

// Share Lap Times
shareButton.addEventListener("click", () => {
    let lapTimes = [];
    document.querySelectorAll("#laps li").forEach(li => lapTimes.push(li.innerText));

    if (lapTimes.length > 0) {
        let encodedText = encodeURIComponent("My Lap Times:\n" + lapTimes.join("\n"));
        let shareLink = `https://wa.me/?text=${encodedText}`;
        window.open(shareLink, "_blank");
    } else {
        alert("No lap times to share!");
    }
});

function updateTime() {
    milliseconds += 1;
    if (milliseconds == 100) { milliseconds = 0; seconds += 1; }
    if (seconds == 60) { seconds = 0; minutes += 1; }
    updateDisplay();
}

function updateDisplay() {
    minutesDisplay.innerText = formatTime(minutes);
    secondsDisplay.innerText = formatTime(seconds);
    millisecondsDisplay.innerText = formatTime(milliseconds);
}

function formatTime(time) { return time < 10 ? `0${time}` : time; }

function saveToHistory(time) {
    let historyItem = document.createElement("li");
    historyItem.innerText = time;
    historyLog.appendChild(historyItem);
    localStorage.setItem("stopwatchHistory", historyLog.innerHTML);
}

function loadHistory() { historyLog.innerHTML = localStorage.getItem("stopwatchHistory") || ""; }
