import React, { useState, useEffect } from "react";
import "./index.css";

import Footer from "./Footer";
import {
  getTimePlaceholder,
  formatTimeInputValue,
  calculateResult,
} from "./logic";

function App() {
  const [allowMultiDigitMinutes, setAllowMultiDigitMinutes] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [attempts, setAttempts] = useState(["", "", ""]);
  const [result, setResult] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  function handleTimeLimitChange(value) {
    setHasUserInteracted(true);
    setTimeLimit(formatTimeInputValue(value, allowMultiDigitMinutes));
  }

  function handleAttemptChange(i, value) {
    setHasUserInteracted(true);
    const updated = [...attempts];
    updated[i] = formatTimeInputValue(value, allowMultiDigitMinutes);
    setAttempts(updated);
  }

  function addSolveTimeBox() {
    setAttempts([...attempts, ""]);
  }

  useEffect(() => {
    const out = calculateResult(timeLimit, attempts, hasUserInteracted);
    setResult(out);
  }, [timeLimit, attempts, hasUserInteracted]);

  return (
    <div className="container">
      <h1>Cumulative Time Limit Calculator</h1>

      <label>
        Allow multi-digit minutes?
        <br />
        <input type="checkbox" checked={allowMultiDigitMinutes} onChange={(e) => setAllowMultiDigitMinutes(e.target.checked)} />
      </label>

      <h2>Enter cumulative time limit</h2>
      <input type="text" placeholder={getTimePlaceholder(allowMultiDigitMinutes)} value={timeLimit} onChange={(e) => handleTimeLimitChange(e.target.value)} />

      <h2>Attempts</h2>
      {attempts.map((value, i) => (
        <input key={i} type="text" placeholder={getTimePlaceholder(allowMultiDigitMinutes)} value={value} onChange={(e) => handleAttemptChange(i, e.target.value)} />
      ))}

      <br></br>

      <button onClick={addSolveTimeBox}>Add attempt</button>

      <p style={{ whiteSpace: "pre-line" }}>{result}</p>

      <br></br>

      <Footer />
    </div>
  );
}

export default App;
