
import { useEffect, useState } from 'react';
import './App.css'
import { colorMapping, initialState, MAX_COLOR_LENGTH } from './constants';
import { motion, AnimatePresence } from "framer-motion";
import ConfettiExplosion from "react-confetti-explosion";

function App() {
  const initialGameState = { ...initialState };
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameState, setGameState] = useState(initialGameState);
  const [containerFrom, setContainerFrom] = useState('')
  const [containerTo, setContainerTo] = useState('')
  const [currentColor, setCurrentColor] = useState("");
  const [showBar, setShowBar] = useState(false);
  const [numberOfColorsInTargetContainer, setNumberOfColorsInTargetContainer] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  const setGameStateIfColorMatch = (
    container: string,
    containerFromColors: string[],
    gameStateCopy: Record<string, any>
  ) => {
    const tempColors: string[] = [];
    for (let i = containerFromColors.length - 1; i >= 0; i--) {
      if (!tempColors.length) {
        tempColors.push(containerFromColors[i]);
      } else if (tempColors.includes(containerFromColors[i])) {
        if (gameStateCopy[container].colors.length + tempColors.length === MAX_COLOR_LENGTH) {
          break;
        }
        tempColors.push(containerFromColors[i]);
      } else {
        break;
      }
      gameStateCopy[containerFrom].colors.splice(i, 1);
    }
    gameStateCopy[container].colors.push(...tempColors);
  };

  const checkGameOver = () => {
    return Object.keys(gameState).reduce((isGameOver, key) => {
      const funnelColors = gameState[key].colors as string[];
      const colorsSet = new Set(funnelColors);
      if (
        !funnelColors.length ||
        (funnelColors.length === MAX_COLOR_LENGTH && colorsSet.size === 1)
      ) {
        return true;
      }
      return false;
    }, true);
  };

  const handleContainerClick = (container: string) => {
    if (containerFrom) {
      if (containerFrom === container) {
        setContainerFrom("");
        return;
      }
      const gameStateCopy = Object.assign({}, gameState);
      if (gameStateCopy[container].colors.length === MAX_COLOR_LENGTH) {
        setContainerFrom("");
        return;
      }
      const containerFromColors = [...gameStateCopy[containerFrom].colors];
      const containerToColors = [...gameStateCopy[container].colors];
      const containerFromLength = containerFromColors.length;
      const containerToLength = containerToColors.length;
      if (!containerFromLength) {
        setContainerFrom("");
        setContainerTo("");
        return;
      }
      const fromColor = containerFromColors[containerFromLength - 1];
      const toColor = containerToColors[containerToLength - 1];
      if (fromColor !== toColor && containerToLength) {
        setContainerFrom("");
        setContainerTo("");
        return;
      }
      setContainerTo(container);
      setCurrentColor(fromColor);
      setTimeout(() => { 
        if (!containerToLength) {
          const containerFromColorsUnique = new Set(containerFromColors);
          if (containerFromColorsUnique.size === 1) {
            gameStateCopy[container].colors = containerFromColors;
            gameStateCopy[containerFrom].colors = [];
          } else {
            setGameStateIfColorMatch(
              container,
              containerFromColors,
              gameStateCopy
            );
          }
        } else if (fromColor === toColor) {
          setGameStateIfColorMatch(
            container,
            containerFromColors,
            gameStateCopy
          );
        }
        setGameState((val) => ({ ... val, ...gameStateCopy }));
        setShowBar(true);
        setNumberOfColorsInTargetContainer(containerToLength);
      }, 500);
      setTimeout(() => {
        setCurrentColor("");
        setContainerFrom("");
        setContainerTo("");
        setShowBar(false);
        setNumberOfColorsInTargetContainer(0);
      }, 1000);
      setTimeout(() => {
        setIsGameWon(checkGameOver());
      }, 1500);
      return;
    }
    setContainerFrom(container);
  };

  const startGame = (restart = false) => {
    if (restart) {
      window.location.reload();
      return;
    }
    setIsGameStarted(true);
    setIsGameWon(false);
  };

  const renderGame = () => {
    return (
      <div className="m-12 relative">
        {Object.keys(gameState).map((containerKey) => {
          const { key: uniqueKey, position, colors } = gameState[containerKey];
          let finalPos = position;
          if (containerTo && containerFrom === containerKey) {
            const newPosition = { ...gameState[containerTo].position };
            finalPos = {
              ...newPosition,
              top: newPosition.top - 90,
              left: newPosition.left - 80,
            };
          }
          const styleOfContainer = {
            ...finalPos,
          };
          let styleOfBar = {};
          if (containerTo && containerFrom === containerKey) {
            styleOfContainer.transitionDuration = "500ms";
            styleOfContainer.transform = "rotate(75deg)";
            styleOfBar = {
              ...finalPos,
              top: finalPos.top + 70,
              left: finalPos.left + 90,
            };
          }
          return (
            <>
              <div
                key={containerKey + uniqueKey}
                className={`funnel absolute h-[150px] w-[30px] rounded-lg rounded-b-[50px] overflow-hidden border flex flex-col-reverse cursor-pointer transition-all ${
                  containerFrom === containerKey ? "-translate-y-4" : ""
                } `}
                style={styleOfContainer}
                onClick={() => handleContainerClick(containerKey)}
              >
                <AnimatePresence>
                  {colors.map((color: string, index: number) => {
                    return (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: 30,
                          transition: {
                            duration: 0.5,
                          },
                        }}
                        exit={{
                          height: 0,
                          transition: {
                            duration: 0.5,
                          },
                        }}
                        key={uniqueKey + color + index}
                        className={`relative w-full h-[30px] ${colorMapping[color]}`}
                      ></motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              {containerFrom === containerKey && currentColor && showBar && (
                <div
                  key={containerKey + uniqueKey + 'pouring_bar'}
                  className={`absolute w-1 ${colorMapping[currentColor]}`}
                  style={{
                    ...styleOfBar,
                    height: 170 - 30 * numberOfColorsInTargetContainer,
                  }}
                ></div>
              )}
            </>
          );
        })}
      </div>
    );
  };

  const renderStartButton = (text = 'Start game', restart = false) => {
    return (
      <button className="start-game-button mt-12" onClick={() => startGame(restart)}>
        {text}
      </button>
    );
  };

  return (
    <div className="flex mt-32 items-center flex-col">
      <h1 className="text-5xl mb-16 font-bold">Water Sorter</h1>
      {isGameWon ? (
        <>
          <div className="text-3xl">Congratulations! You won 🎉</div>
          {renderStartButton("restart game", true)}
          <ConfettiExplosion duration={7000} force={0.7} particleCount={200} />
        </>
      ) : isGameStarted ? (
        renderGame()
      ) : (
        renderStartButton()
      )}
    </div>
  );
}

export default App
