// Whether to allow multiple digits for minutes (controlled by checkbox)
let allowMultiDigitMinutes = false;

function addSolveTimeBox() {
    const container = document.getElementById("solveTimesContainer");
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
    input.className = "solveTime";
    input.addEventListener("input", formatWhileTyping);

    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

function formatWhileTyping(event) {
    const input = event.target;
    input.value = formatTimeInputValue(input.value);
    checkTimeLimit();
}

function formatTimeLimitWhileTyping(event) {
    const input = event.target;
    input.value = formatTimeInputValue(input.value);
    checkTimeLimit();
}

function formatTimeInputValue(rawValue) {
    let value = rawValue.replace(/\D/g, ''); // Remove all non-digits

    if (!allowMultiDigitMinutes) {
        if (value.length > 5) value = value.slice(0, 5); // 1m 2s 2ms
    } else {
        if (value.length > 6) value = value.slice(0, 6); // 2m 2s 2ms
    }

    let formatted = '';
    if (!allowMultiDigitMinutes) {
        if (value.length > 0) formatted += value.charAt(0);
        if (value.length > 1) formatted += ':' + value.slice(1, 3);
        if (value.length > 3) formatted += '.' + value.slice(3, 5);
    } else {
        if (value.length > 0) formatted += value.slice(0, 2);
        if (value.length > 2) formatted += ':' + value.slice(2, 4);
        if (value.length > 4) formatted += '.' + value.slice(4, 6);
    }

    return formatted;
}

function timeToSeconds(timeStr) {
    const parts = timeStr.trim().split(/[:.]/).map(Number);

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
        resultDisplay.innerHTML = '';
        resultDisplay.style.color = '';
        return;
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);

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
    const timeLimitInput = document.getElementById("timeLimit");
    if (timeLimitInput) {
        timeLimitInput.placeholder = allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
        timeLimitInput.addEventListener("input", formatTimeLimitWhileTyping);
    }

    const toggleMinutesCheckbox = document.getElementById("allowMultiDigitMinutes");
    if (toggleMinutesCheckbox) {
        toggleMinutesCheckbox.addEventListener("change", (e) => {
            allowMultiDigitMinutes = e.target.checked;

            // Update placeholder and reformat values
            if (timeLimitInput) {
                timeLimitInput.placeholder = allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
                timeLimitInput.value = formatTimeInputValue(timeLimitInput.value);
            }
            const solveTimeInputs = document.querySelectorAll(".solveTime");
            solveTimeInputs.forEach(input => {
                input.placeholder = allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
                input.value = formatTimeInputValue(input.value);
            });
        });
    }

    const defaultBoxes = 3;
    for (let i = 0; i < defaultBoxes; i++) {
        addSolveTimeBox();
    }
});
