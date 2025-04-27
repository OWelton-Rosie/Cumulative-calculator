function addSolveTimeBox() {
    const container = document.getElementById("solveTimesContainer");
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = "mm:ss.ms"; // Notice dot instead of colon for ms
    input.className = "solveTime";
    input.addEventListener("input", formatWhileTyping);

    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

function formatWhileTyping(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits

    if (value.length > 6) value = value.slice(0, 6); // Limit to 6 digits max

    let formatted = '';
    if (value.length > 0) formatted += value.slice(0, 2); // minutes
    if (value.length > 2) formatted += ':' + value.slice(2, 4); // seconds
    if (value.length > 4) formatted += '.' + value.slice(4, 6); // milliseconds

    input.value = formatted;
    checkTimeLimit();
}

// This function now formats the time limit input too
function formatTimeLimitWhileTyping(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits

    if (value.length > 6) value = value.slice(0, 6); // Limit to 6 digits max

    let formatted = '';
    if (value.length > 0) formatted += value.slice(0, 2); // minutes
    if (value.length > 2) formatted += ':' + value.slice(2, 4); // seconds
    if (value.length > 4) formatted += '.' + value.slice(4, 6); // milliseconds

    input.value = formatted;
    checkTimeLimit();
}

function timeToSeconds(timeStr) {
    const parts = timeStr.trim().split(/[:.]/).map(Number); // split by colon and dot

    if (parts.length === 3) {
        const [minutes, seconds, milliseconds] = parts;
        return minutes * 60 + seconds + milliseconds / 100;
    }
    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
    }
    return Number(timeStr) || 0;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.round((seconds % 1) * 100);

    return `${padZero(minutes)}:${padZero(secs)}.${padZero(millis, 2)}`;
}

function padZero(number, length = 1) {
    return String(number).padStart(length, '0');
}

function checkTimeLimit() {
    const timeLimitInput = document.getElementById("timeLimit");
    const resultDisplay = document.getElementById("result");
    const inputs = document.querySelectorAll(".solveTime");

    if (!timeLimitInput || !resultDisplay) return;

    const timeLimit = timeToSeconds(timeLimitInput.value);
    const times = Array.from(inputs, input => timeToSeconds(input.value));
    const hasAnyTimeEntered = times.some(time => time > 0);

    if (!hasAnyTimeEntered) {
        resultDisplay.innerHTML = ''; // If no time is entered
        resultDisplay.style.color = '';
        return;
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);

    // Format the total time as mm:ss.ms and update the result box
    resultDisplay.innerHTML = `Total elapsed time: ${formatTime(totalTime)}`;

    if (totalTime > timeLimit) {
        const excessTime = totalTime - timeLimit;
        resultDisplay.innerHTML = `
            Cumulative time limit exceeded by ${formatTime(excessTime)}<br>
            ${resultDisplay.innerHTML}
        `;
        resultDisplay.style.color = "red";
    } else {
        const timeLeft = timeLimit - totalTime;
        resultDisplay.innerHTML = `
            Time remaining: ${formatTime(timeLeft)}<br>
            ${resultDisplay.innerHTML}
        `;
        resultDisplay.style.color = "green";
    }
}

window.addEventListener("load", () => {
    // Format the time limit input as soon as the page loads
    const timeLimitInput = document.getElementById("timeLimit");
    if (timeLimitInput) {
        timeLimitInput.addEventListener("input", formatTimeLimitWhileTyping);
    }

    const defaultBoxes = 3;
    for (let i = 0; i < defaultBoxes; i++) {
        addSolveTimeBox();
    }
});
