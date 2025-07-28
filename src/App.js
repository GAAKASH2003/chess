import "./App.css";
import Board from "./components/Board/Board";
import AppContext from "./contexts/Context";
import { reducer } from "./reducer/reducer";
import { useReducer, useState, useEffect } from "react";
import { initialState } from "./constant";
import PromotionModal from "./components/Modal/PromotionModal";
import { Status } from "./constant";
import GameStatus from "./components/GameStatus/GameStatus";
import {
  makeNewMove,
  showPromotion,
  clearCandidateMoves,
  syncTurn,
} from "./reducer/actions/move";
// import { updateCastling } from "./reducer/actions/game";
import {
  detectStalemate,
  detectCheckmate,
  detectInsufficientMaterial,
} from "./reducer/actions/move";
import arbiter from "./arbiter/arbiter";
import { useRoomContext, socket } from "./contexts/RoomContext";
import JoinRoom from "./components/JoinRoom";

function App() {
  const {
    room,
    setRoom,
    currentTurn,
    setCurrentTurn,
    members,
    setMembers,
    status,
    setStatus,
    isConnected,
    setIsConnected,
    currentTurnColor,
    setCurrentTurnColor,
  } = useRoomContext();
  const [appState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (currentTurnColor && appState.turn !== currentTurnColor) {
      console.log("Syncing turn from", appState.turn, "to", currentTurnColor);
      dispatch(syncTurn(currentTurnColor));
    }
  }, [currentTurnColor, appState.turn]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
      setIsConnected(true);
    });
    socket.on("join_room", (data) => {
      if (data.success === "true") {
        if (data.status === "waiting") {
          setStatus("waiting");
        } else if (data.status === "full") {
          setStatus("full");
          console.log("join room", data);
          setCurrentTurnColor(data.currentTurnColor);
          setCurrentTurn(data.currentTurn);
          setMembers(data.members);
        }
      }
    });
    socket.on("onmove", (data) => {
      dispatchNewPosition(
        data.newPosition,
        data.opponent,
        data.castleDirection,
        data.piece,
        data.rank,
        data.file,
        data.x,
        data.y
      );
      console.log("currentTurn", data.currentTurn);
      console.log("currentTurnColor", data.currentTurnColor);
      console.log("socket.id", socket.id);
      setCurrentTurn(data.currentTurn);
      setCurrentTurnColor(data.currentTurnColor);
    });
    socket.on("leave_room", (data) => {
      console.log("leave room", data);
      if (data.success === "true") {
        setStatus("game_over");
        setMembers([]);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
      setIsConnected(false);
      setStatus("game_over");
      setMembers([]);
    });
    return () => {
      socket.off("connect");
      socket.off("onmove");
      socket.off("join_room");
      socket.off("leave_room");
      socket.off("disconnect");
    };
  }, []); // Remove currentTurn dependency to avoid infinite loops

  const dispatchNewPosition = (
    newPosition,
    opponent,
    castleDirection,
    piece,
    rank,
    file,
    x,
    y
  ) => {
    if (piece.endsWith("p") && (x === 0 || x === 7)) {
      dispatch(makeNewMove(newPosition));
      dispatch(showPromotion([x, y]));
    } else if (piece.endsWith("k") || piece.endsWith("r")) {
      dispatch(makeNewMove(newPosition));
    } else {
      dispatch(makeNewMove(newPosition));
    }
    if (arbiter.insufficientMaterial(newPosition)) {
      dispatch(detectInsufficientMaterial());
    }
    if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
      dispatch(detectStalemate());
    }
    if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
      const winner = opponent === "w" ? "Black" : "White";
      dispatch(detectCheckmate(winner));
    }
    dispatch(clearCandidateMoves());
  };

  const providerState = {
    appState,
    dispatch,
  };
  if (appState.status === Status.stalemate) {
    return <GameStatus status={appState.status} />;
  }
  if (appState.status === Status.insufficient) {
    return <GameStatus status={appState.status} />;
  }
  if (appState.status.includes("wins")) {
    return <GameStatus status={appState.status} />;
  }

  const handleLeaveRoom = () => {
    socket.emit("leave_room", room);
  };
  if (!isConnected) {
    return <div>Connecting to server...</div>;
  }
  if (status === "waiting") {
    return <div>Waiting for other player to join...</div>;
  }
  if (status === "game_over") {
    return <div>Game over</div>;
  }
  return (
    <AppContext.Provider value={providerState}>
      <>
        <div>
          {status === "" && (
            <>
              <JoinRoom />
            </>
          )}
        </div>
        {status === "full" && (
          <div className="chess-app-container">
            <header className="chess-header">
              <div className="chess-title">
                <h1>♔ Chess Game ♛</h1>
                <div
                  className="chess-title"
                  style={{ fontSize: "16px", color: "white", margin: "10px" }}
                >
                  Room: {room}
                </div>
                <div className="chess-subtitle">
                  Now the turn is{" "}
                  {currentTurn == socket.id ? "Yours" : "Opponents"}
                </div>
              </div>
              <div className="turn-indicator">
                <div
                  className={`turn-status ${
                    appState.turn === "w" ? "white-turn" : "black-turn"
                  }`}
                >
                  <span className="turn-label">Current Turn:</span>
                  <span
                    className={`turn-player ${
                      appState.turn === "w" ? "white" : "black"
                    }`}
                  >
                    {appState.turn === "w" ? "♔ White" : "♛ Black"}
                  </span>
                </div>
              </div>
              <div>
                <button
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                    backgroundColor: "red",
                  }}
                  onClick={handleLeaveRoom}
                >
                  Leave Room
                </button>
              </div>
            </header>
            <main className="chess-main">
              <div className="board-container">
                <Board />

                <PromotionModal />
              </div>
            </main>
          </div>
        )}
      </>
    </AppContext.Provider>
  );
}

export default App;
