import { useState, useMemo, useEffect } from "react";
import { generateMaze, solve } from "./util";
import "./styles.css";
import Modal from "./modal";


export default function App() {
  const [gameId, setGameId] = useState(1);
  const [status, setStatus] = useState("title");
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [size, setSize] = useState(8);
  const [userPosition, setUserPosition] = useState([0, 0]);

  const maze = useMemo(() => generateMaze(size, size), [size, gameId]);

  useEffect(() => {
    const lastRowIndex = maze.length - 1;
    const lastColIndex = maze[0].length - 1;

    if (userPosition[0] === lastRowIndex && userPosition[1] === lastColIndex) {
      if (size === 8) {
        setSize(16);
        setUserPosition([0, 0]);
        setStatus("playing");
        setGameId(gameId + 1);
      } else if (size === 16) {
        setSize(32);
        setUserPosition([0, 0]);
        setStatus("playing");
        setGameId(gameId + 1);
      } else {
        setStatus("won");
      }
    }
  }, [userPosition[0], userPosition[1], size, gameId, maze]);

  const handleMove = (e) => {
    e.preventDefault();
    if (status !== "playing") {
      return;
    }
    const key = e.code;

    const [i, j] = userPosition;
    if ((key === "ArrowUp" || key === "KeyW") && maze[i][j][0] === 1) {
      setUserPosition([i - 1, j]);
    }
    if ((key === "ArrowRight" || key === "KeyD") && maze[i][j][1] === 1) {
      setUserPosition([i, j + 1]);
    }
    if ((key === "ArrowDown" || key === "KeyS") && maze[i][j][2] === 1) {
      setUserPosition([i + 1, j]);
    }
    if ((key === "ArrowLeft" || key === "KeyA") && maze[i][j][3] === 1) {
      setUserPosition([i, j - 1]);
    }
  };

  const handleNavigate = (direction) => {
    if (status === "playing") {
      const [i, j] = userPosition;

      switch (direction) {
        case "up":
          if (maze[i][j][0] === 1) setUserPosition([i - 1, j]);
          break;
        case "right":
          if (maze[i][j][1] === 1) setUserPosition([i, j + 1]);
          break;
        case "down":
          if (maze[i][j][2] === 1) setUserPosition([i + 1, j]);
          break;
        case "left":
          if (maze[i][j][3] === 1) setUserPosition([i, j - 1]);
          break;
        default:
          break;
      }
    }
  };

  const makeClassName = (i, j) => {
    const rows = maze.length;
    const cols = maze[0].length;
    let arr = [];
    if (maze[i][j][0] === 0) {
      arr.push("topWall");
    }
    if (maze[i][j][1] === 0) {
      arr.push("rightWall");
    }
    if (maze[i][j][2] === 0) {
      arr.push("bottomWall");
    }
    if (maze[i][j][3] === 0) {
      arr.push("leftWall");
    }
    if (i === rows - 1 && j === cols - 1) {
      arr.push("destination");
    }
    if (i === userPosition[0] && j === userPosition[1]) {
      arr.push("currentPosition");
    }

    return arr.join(" ");
  };

  const handleShowInstructions = () => {
    console.log("Showing instructions");
    setShowInstructionsModal(true);
    
  };

  const handleHideInstructions = () => {
    setShowInstructionsModal(false);
  };

  const handleShowAboutUs = () => {
    console.log("Showing About Us");
    setShowAboutUsModal(true);
  };

  const handleHideAboutUs = () => {
    setShowAboutUsModal(false);
  };
  const handleUpdateSettings = () => {
    setSize(8);
    setUserPosition([0, 0]);
    setStatus("playing");
    setGameId(gameId + 1);
  };
   
  const handleStartGame = () => {
    setStatus("playing");
  };

  const handleGoHome = () => {
    setStatus("title");
    setSize(8); // Reset the size to 8x8 when going back to the title screen
    setUserPosition([0, 0]);
  };

  const levelIndicatorText = size === 8 ? 'Level 1' : size === 16 ? 'Level 2' : 'Level 3';

  if (status === "title") {
    return (
      <div className="TitleScreen">
        <h1>Maze Game</h1>
        <button tabIndex="-1" onClick={handleStartGame}>
        Start Game
        </button>
        <button onClick={handleShowInstructions}>Instructions</button>
      <button onClick={handleShowAboutUs}>About Us</button>

      {/* Modals */}
      <Modal
        isOpen={showInstructionsModal}
        onClose={handleHideInstructions}
        title="Instructions:"
        content={<p>Use WSAD or Arrow Keys to navigate through the maze. There are 3 levels and the maze will get harder every time you finish a stage. </p>}
      />
      <Modal
        isOpen={showAboutUsModal}
        onClose={handleHideAboutUs}
        title="About Us:"
        content={<p>
          This Maze was created by:<br />
          Warren I. Albino<br />
          Emmanuelle Ian Papa<br />
          Jose Manuel Peñaflor.<br />
          in partial fulfillment of the requirements for the subject:<br />
          APPLICATION DEVELOPMENT AND EMERGING TECHNOLOGIES
        </p>}
      />
      </div>
    );
  }

  return (
    <div className="App" onKeyDown={handleMove} tabIndex={-1}>
      <div className="level-indicator">{levelIndicatorText}</div>
      <div className="home-button" onClick={handleGoHome}>
        Home
      </div>

      <table id="maze">
        <tbody>
          {maze.map((row, i) => (
            <tr key={`row-${i}`}>
              {row.map((cell, j) => (
                <td key={`cell-${i}-${j}`} className={makeClassName(i, j)}>
                  <div />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating buttons for mobile devices */}
      {status === "playing" && (
        <div className="floating-buttons">
          <button onClick={() => handleNavigate("up")}>↑</button>
          <button onClick={() => handleNavigate("down")}>↓</button>
          <button onClick={() => handleNavigate("left")}>←</button>
          <button onClick={() => handleNavigate("right")}>→</button>
        </div>
      )}

      <Modal
        isOpen={showInstructionsModal}
        onClose={handleHideInstructions}
        title="Instructions"
        content={<p>Use WSAD or Arrow Keys to navigate through the maze.</p>}
      />
      <Modal
        isOpen={showAboutUsModal}
        onClose={handleHideAboutUs}
        title="About Us"
        content={<p>Your custom about us content goes here.</p>}
      />

      {status !== "playing" && (
        <div className="info" onClick={handleUpdateSettings}>
          <p>
            {size < 32
              ? `Click here to play the next level (Size: ${size * 2}x${size * 2})`
              : "You won! Play again?"}
          </p>
        </div>
      )}
    </div>
  );
}
