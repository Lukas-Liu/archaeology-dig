import React, { useState } from "react";
import './App.css';

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

  // Handle digging action
  const handleDig = (row, col) => {
    const currentDepth = revealed[row][col]; // How deep we've dug in this column
    if (currentDepth < 3) {
      // Update the revealed state
      const newRevealed = [...revealed];
      newRevealed[row][col] = currentDepth + 1;
      setRevealed(newRevealed);

      // Log digging results
      const isArtifact = initialTensor[currentDepth][row][col] === 1;
      const newLog = isArtifact
        ? `Congratulations, you have dug out an artifact at [${row}, ${col}]!`
        : `You dug at [${row}, ${col}], but found nothing.`;
      setLogs((prevLogs) => [...prevLogs, newLog]);
    }
  };

  // Handle reset action
  const handleReset = () => {
    setRevealed(initialRevealedState); // Reset digging progress
    setLogs([]); // Clear the log
  };

  // Helper function to get background color based on the layer
  const getBackgroundColor = (layer) => {
    switch (layer) {
      case 1:
        return "bg-yellow-500 hover:bg-yellow-400";
      case 2:
        return "bg-orange-500 hover:bg-orange-400";
      case 3:
        return "bg-red-500 hover:bg-red-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Archaeology Dig Simulator</h1>
      <div className="grid grid-cols-3 gap-2 mb-6">
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
                    key={`${row}-${col}`}
                    onClick={() => handleDig(row, col)}
                    className={`w-16 h-16 border-2 rounded ${
                      isBuried
                        ? getBackgroundColor(currentDepth + 1)
                        : "bg-gray-300"
                    }`}
                  >
                    {isBuried ? `Layer ${currentDepth + 1}` : "Dug"}
                  </button>
                );
              })
          )}
      </div>

      <button
        onClick={handleReset}
        className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded"
      >
        Reset Dig
      </button>

      <div className="w-full max-w-md bg-white border rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Digging Log</h2>
        <div className="h-48 overflow-y-auto border-t pt-2">
          {logs.length === 0 ? (
            <p className="text-gray-500">No digging activity yet.</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className="text-sm text-gray-700 mb-1">
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArchaeologyDig;