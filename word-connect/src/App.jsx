import React, { useState, useEffect } from "react";
import "./App.css";
import { connectedWords } from "./utils/data";

const generateWordPairs = (itemCount, groupSize) => {
  const wordGroups = connectedWords.get(groupSize);
  const selectedGroups = wordGroups.sort(() => Math.random() - 0.5).slice(0, itemCount / groupSize);

  const words = selectedGroups.flat(); 
  return words.sort(() => Math.random() - 0.5); 
};

function App() {
  const [settings, setSettings] = useState({
    itemCount: 8,
    columns: 4,
    groupSize: 2,
  });
  const [words, setWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matches, setMatches] = useState([]);
  const [attempts, setAttempts] = useState(0);

  // Reset the game based on current settings
  useEffect(() => {
    resetGame();
  }, [settings]);

  const resetGame = () => {
    setWords(generateWordPairs(settings.itemCount, settings.groupSize));
    setSelected([]);
    setMatches([]);
    setAttempts(0);
  };

  const handleWordClick = (index) => {
    if (selected.includes(index) || matches.includes(index)) return; 
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === settings.groupSize) {
      const selectedWords = newSelected.map((i) => words[i]);
      setAttempts((prev) => prev + 1);

      if (new Set(selectedWords).size === 1) {
        setMatches((prev) => [...prev, ...newSelected]);
      }

      setTimeout(() => {
        setSelected([]);
      }, 1000);
    }
  };

  return (
    <div className="app">
      <h1>Word Connect Game</h1>
      <div className="controls">
        <label>
          Item Count:
          <input
            type="number"
            value={settings.itemCount}
            min="4"
            max="16"
            step="4"
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                itemCount: parseInt(e.target.value),
              }))
            }
          />
        </label>
        <label>
          Columns:
          <input
            type="number"
            value={settings.columns}
            min="2"
            max="8"
            step="1"
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                columns: parseInt(e.target.value),
              }))
            }
          />
        </label>
        <label>
          Group Size:
          <input
            type="number"
            value={settings.groupSize}
            min="2"
            max="4"
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                groupSize: parseInt(e.target.value),
              }))
            }
          />
        </label>
        <button onClick={resetGame}>Reset</button>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${settings.columns}, 1fr)`,
        }}
      >
        {words
          .map((word, index) => (
            <div
              key={index}
              className={`card ${
                matches.includes(index)
                  ? "matched"
                  : selected.includes(index)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleWordClick(index)}
              style={{ display: matches.includes(index) ? "none" : "block" }}
            >
              {word}
            </div>
          ))
          .filter((_, index) => !matches.includes(index))} 
      </div>
      <div className="stats">
        <p>Attempts: {attempts}</p>
      </div>
    </div>
  );
}

export default App;
