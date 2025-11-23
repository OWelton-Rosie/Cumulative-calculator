export function getTimePlaceholder(allowMultiDigitMinutes) {
    return allowMultiDigitMinutes ? "mm:ss.ms" : "m:ss.ms";
  }
  
  export function formatTimeInputValue(rawValue, allowMultiDigitMinutes) {
    let value = rawValue.replace(/\D/g, "");
    const maxDigits = allowMultiDigitMinutes ? 6 : 5;
    value = value.slice(0, maxDigits);
  
    let minutes = "",
      seconds = "",
      ms = "";
  
    if (allowMultiDigitMinutes) {
      minutes = value.slice(0, 2);
      seconds = value.slice(2, 4);
      ms = value.slice(4, 6);
    } else {
      minutes = value.charAt(0);
      seconds = value.slice(1, 3);
      ms = value.slice(3, 5);
    }
  
    let out = minutes;
    if (seconds) out += `:${seconds}`;
    if (ms) out += `.${ms}`;
    return out;
  }
  
  export function timeToSeconds(str) {
    const parts = str.trim().split(/[:.]/).map(Number);
    if (parts.length === 3) {
      const [m, s, ms] = parts;
      return m * 60 + s + ms / 100;
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    return Number(str) || 0;
  }
  
  export function padZero(num, len = 1) {
    return String(num).padStart(len, "0");
  }
  
  export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const raw = seconds % 60;
    const s = Math.floor(raw);
    const ms = Math.round((raw % 1) * 100);
    return `${padZero(minutes)}:${padZero(s)}.${padZero(ms, 2)}`;
  }
  
  export function validateSecondsField(str) {
    const parts = str.split(/[:.]/).map(Number);
    if (parts.length >= 2 && parts[1] >= 60) return false;
    return true;
  }
  
  // ------------------------------------
  // Main calculation based on React state
  // ------------------------------------
  export function calculateResult(timeLimit, attempts, hasUserInteracted) {
    if (!hasUserInteracted) return "";
  
    const limit = timeToSeconds(timeLimit);
    const seconds = attempts.map((t) => timeToSeconds(t));
    const hasAny = seconds.some((t) => t > 0);
  
    if (!hasAny) return "";
  
    const total = seconds.reduce((a, b) => a + b, 0);
  
    if (total > limit) {
      const excess = total - limit;
      return (
        `Cumulative time limit exceeded by ${formatTime(excess)}\n` +
        `Total elapsed time: ${formatTime(total)}`
      );
    } else {
      const remaining = limit - total;
      return (
        `Time remaining: ${formatTime(remaining)}\n` +
        `Total elapsed time: ${formatTime(total)}`
      );
    }
  }
  