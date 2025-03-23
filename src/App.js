import React, { useState } from "react";
import "./App.css"; // Import the updated CSS file

function ArchaeologyDig() {
  // Define the 3x3x3 tensor with the provided structure
  const initialTensor = [
    [
      [0, 0, 0],
      [1, 0, 0],
      [1, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ],
  ];

  // Initial revealed state (all cells start at layer 0)
  const initialRevealedState = Array(3)
    .fill(null)
    .map(() =>
      Array(3)
        .fill(null)
        .map(() => 0)
    );

  // State to track the visibility of each cell in the grid
  const [revealed, setRevealed] = useState(initialRevealedState);

  // State to store logs for discovered artifacts
  const [logs, setLogs] = useState([]);
  const [dailySummary, setDailySummary] = useState(""); // Summary of the current day's activity

  // State to track action points and the day
  const [actionPoints, setActionPoints] = useState(15); // Total action points (15 points = 5 days × 3 points)
  const [day, setDay] = useState(1); // Start on day 1

  // Handle digging action
  const handleDig = (row, col) => {
    if (actionPoints > 0) {
      const currentDepth = revealed[row][col]; // How deep we've dug in this column
      if (currentDepth < 3) {
        // Update the revealed state
        const newRevealed = [...revealed];
        newRevealed[row][col] = currentDepth + 1;
        setRevealed(newRevealed);

        // Log digging results
        const isArtifact = initialTensor[currentDepth][row][col] === 1;
        const newLog = isArtifact
          ? `Congratulations, you have dug out an artifact!`
          : `You dug hard, but found nothing.`;
        setLogs((prevLogs) => [...prevLogs, newLog]);

        // Deduct action points AFTER a successful digging action
        const newActionPoints = actionPoints - 1;
        setActionPoints(newActionPoints);

        // Check if the day has ended (action points modulo 3 == 0)
        if (newActionPoints > 0 && newActionPoints % 3 === 0) {
          // Calculate and store the daily summary before clearing logs
          const artifactsFound = logs.filter((log) =>
            log.includes("Congratulations")
          ).length;
          const totalDigs = logs.length + 1;

          setDailySummary(
            `Day ${day} Summary: You found ${artifactsFound} artifacts and dug ${totalDigs} cells.`
          );

          // Advance to the next day
          setDay(day + 1);

          // Clear the current day's logs
          setLogs([]);
        }
      } else {
        // Log if the cell is already fully dug
        setLogs((prevLogs) => [
          ...prevLogs,
          `This cell at [${row}, ${col}] is already fully dug!`,
        ]);
      }
    } else {
      // Log if no action points are left
      setLogs((prevLogs) => [
        ...prevLogs,
        "No action points left! Please reset the game to start over.",
      ]);
    }
  };

  // Handle reset action
  const handleReset = () => {
    setRevealed(initialRevealedState); // Reset digging progress
    setLogs([]); // Clear the log
    setDailySummary(""); // Clear the daily summary
    setActionPoints(15); // Reset action points
    setDay(1); // Reset the day
  };

  // Calculate remaining action points for the current day
  const dailyActionPointsLeft = actionPoints % 3 || 3;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Virtual Archaeologist's Trench</h1>

      {/* Digging Area */}
      <div className="dig-area">
        {Array(3)
          .fill(null)
          .map((_, row) =>
            Array(3)
              .fill(null)
              .map((_, col) => {
                const currentDepth = revealed[row][col];
                const isBuried = currentDepth < 3;

                return (
                  <button
                    key={`${row}-${col}`} // Generate unique key for each button
                    onClick={() => handleDig(row, col)}
                    className={`dig-button ${
                      isBuried ? `layer-${currentDepth + 1}` : "dug"
                    }`}
                  >
                    {isBuried ? `Layer ${currentDepth + 1}` : "Dug"}
                  </button>
                );
              })
          )}
      </div>

      {/* Daily Status */}
      <div className="status-container my-4">
        <p className="text-lg font-semibold">
          {`This is Day ${day}, you have ${dailyActionPointsLeft} action points left today. Total ${actionPoints} points.`}
        </p>
      </div>

      {/* Log Area */}
      <div className="log-container my-6">
        <h2 className="text-lg font-semibold mb-2">Daily Digging Log</h2>
        <div>
          {logs.length === 0 ? (
            <>
              {dailySummary && <p className="daily-summary">{dailySummary}</p>}
			  <p className="no-logs">No digging activity today yet.</p>
            </>
          ) : (
            logs.map((log, index) => <p key={index}>{log}</p>)
          )}
        </div>
      </div>

      {/* Reset Button */}
      <div className="reset-container mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded"
        >
          Reset Dig
        </button>
      </div>
    </div>
  );
}

export default ArchaeologyDig;