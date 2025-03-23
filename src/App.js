import React, { useState } from "react";
import "./App.css"; // Import the updated CSS file

function ArchaeologyDig() {
  // Adjustable game variables
  const TOTAL_DAYS = 5; // Total number of digging days
  const TOTAL_ACTION_POINTS = 15; // Total action points for the entire game
  const ACTION_POINTS_PER_DAY = TOTAL_ACTION_POINTS / TOTAL_DAYS; // Action points available each day

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
  const [actionPoints, setActionPoints] = useState(TOTAL_ACTION_POINTS); // Start with the total pool of action points
  const [dailyActionPointsLeft, setDailyActionPointsLeft] = useState(
    ACTION_POINTS_PER_DAY
  ); // Start with the daily points for the first day
  const [day, setDay] = useState(1); // Start on day 1

  // Handle digging action
  const handleDig = (row, col) => {
    if (dailyActionPointsLeft > 0) {
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

        // Deduct one action point from both daily and total pools
        setDailyActionPointsLeft((prevPoints) => prevPoints - 1);
        setActionPoints((prevPoints) => prevPoints - 1);
      } else {
        // Log if the cell is already fully dug
        setLogs((prevLogs) => [
          ...prevLogs,
          `This cell at [${row}, ${col}] is already fully dug!`,
        ]);
      }
    } 
  };

  // Handle "End Today" button click
  const handleEndToday = () => {
    // Calculate and store the daily summary
    const artifactsFound = logs.filter((log) =>
      log.includes("Congratulations")
    ).length;
    const totalDigs = logs.length;

    setDailySummary(
      `Day ${day} Summary: You found ${artifactsFound} artifacts and dug ${totalDigs} cells.`
    );

    // Reset logs for the new day
    setLogs([]);

    // Recalculate total action points for the next day
    const remainingPoints = (TOTAL_DAYS - day) * ACTION_POINTS_PER_DAY;
    setActionPoints(remainingPoints > 0 ? remainingPoints : 0);

    // Reset daily action points for the new day
    if (day < TOTAL_DAYS) {
      setDailyActionPointsLeft(ACTION_POINTS_PER_DAY);
	  // Advance to the next day
	  const nextDay = day + 1;
      setDay(nextDay);
	}
  };

  // Handle reset action
  const handleReset = () => {
    setRevealed(initialRevealedState); // Reset digging progress
    setLogs([]); // Clear the log
    setDailySummary(""); // Clear the daily summary
    setActionPoints(TOTAL_ACTION_POINTS); // Reset total action points
    setDailyActionPointsLeft(ACTION_POINTS_PER_DAY); // Reset daily points
    setDay(1); // Reset the day
  };

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
                    disabled={dailyActionPointsLeft <= 0} // Disable digging when daily action points are zero
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
          {`This is Day ${day}. You have ${Math.max(
            dailyActionPointsLeft,
            0
          )} action points left today. Total action points remaining: ${actionPoints}.`}
        </p>
      </div>
	  {/* End Today Button */}
	  <div className="end-today-container mt-6">
		<button
		  onClick={handleEndToday}
		  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded"
		  disabled={day >= TOTAL_DAYS} // Disable when the final day is reached
		>
		  End Today
		</button>
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
		  {/* Conditional message displayed below the logs */}
		  {dailyActionPointsLeft === 0 && (
			<p className="mt-4 text-red-600 font-bold">
			{day === TOTAL_DAYS
				  ? "The excavation is complete! Time to pack up and reset for a new adventure!"
				  : "It's getting late! Please end today's dig!"}
			</p>
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