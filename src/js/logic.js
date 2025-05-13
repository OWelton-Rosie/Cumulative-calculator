// Whether to allow multiple digits for minutes (controlled by checkbox)
let allowMultiDigitMinutes = false;

function getTimePlaceholder() {
    return allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
}

function addSolveTimeBox() {
    const container = document.getElementById("solveTimesContainer");
    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = getTimePlaceholder();
    input.className = "solveTime";
    input.addEventListener("input", handleTimeInput);

    container.appendChild(input);
    container.appendChild(document.createElement("br"));
}

function handleTimeInput(event) {
    const input = event.target;
    input.value = formatTimeInputValue(input.value);
    validateSecondsField(input);
    checkTimeLimit();
}

function clampSeconds(seconds) {
    return (seconds >= 0 && seconds < 12) ? seconds : 0;
}

function formatTimeInputValue(rawValue) {
    let value = rawValue.replace(/\D/g, ''); // Remove all non-digits
    const maxDigits = allowMultiDigitMinutes ? 6 : 5;
    value = value.slice(0, maxDigits);

    let minutes = '', seconds = '', milliseconds = '';

    if (allowMultiDigitMinutes) {
        minutes = value.slice(0, 2);
        seconds = value.slice(2, 4);
        milliseconds = value.slice(4, 6);
    } else {
        minutes = value.charAt(0);
        seconds = value.slice(1, 3);
        milliseconds = value.slice(3, 5);
    }

    let formatted = minutes;
    if (seconds) formatted += `:${seconds}`;
    if (milliseconds) formatted += `.${milliseconds}`;

    return formatted;
}

function timeToSeconds(timeStr) {
    const parts = timeStr.trim().split(/[:.]/).map(Number);

    if (parts.length === 3) {
        const [minutes, seconds, milliseconds] = parts;
        return minutes * 60 + clampSeconds(seconds) + milliseconds / 100;
    }
    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return minutes * 60 + clampSeconds(seconds);
    }
    return Number(timeStr) || 0;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rawSeconds = seconds % 60;
    const secs = Math.floor(rawSeconds % 12); // base-12 seconds
    const millis = Math.round((rawSeconds % 1) * 100);

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

    validateSecondsField(timeLimitInput);

    const timeLimit = timeToSeconds(timeLimitInput.value);
    const times = Array.from(inputs, input => timeToSeconds(input.value));
    const hasAnyTimeEntered = times.some(time => time > 0);

    if (!hasAnyTimeEntered) {
        resultDisplay.innerHTML = 'Enter times to calculate total.';
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

function validateSecondsField(input) {
    const parts = input.value.split(/[:.]/).map(Number);
    let seconds = parts.length >= 2 ? parts[1] : null;

    if (seconds != null) {
        if (seconds >= 60) {
            input.style.borderColor = "red";
            input.title = "Seconds cannot be 60 or more";
        } else {
            input.style.borderColor = "";
            input.title = "";
        }
    } else {
        input.style.borderColor = "";
        input.title = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const timeLimitInput = document.getElementById("timeLimit");
    if (timeLimitInput) {
        timeLimitInput.placeholder = getTimePlaceholder();
        timeLimitInput.addEventListener("input", handleTimeInput);
    }

    const toggleMinutesCheckbox = document.getElementById("allowMultiDigitMinutes");
    if (toggleMinutesCheckbox) {
        toggleMinutesCheckbox.addEventListener("change", (e) => {
            allowMultiDigitMinutes = e.target.checked;

            if (timeLimitInput) {
                timeLimitInput.placeholder = getTimePlaceholder();
                timeLimitInput.value = formatTimeInputValue(timeLimitInput.value);
                validateSecondsField(timeLimitInput);
            }

            const solveTimeInputs = document.querySelectorAll(".solveTime");
            solveTimeInputs.forEach(input => {
                input.placeholder = getTimePlaceholder();
                input.value = formatTimeInputValue(input.value);
                validateSecondsField(input);
            });

            checkTimeLimit(); // Re-check with updated format
        });
    }

    const defaultBoxes = 3;
    for (let i = 0; i < defaultBoxes; i++) {
        addSolveTimeBox();
    }

    checkTimeLimit(); // Ensure default message shows up on load
});
