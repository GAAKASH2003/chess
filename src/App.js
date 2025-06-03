import "./App.css";
import Board from "./components/Board/Board";
import AppContext from "./contexts/Context";
import { reducer } from "./reducer/reducer";
import { useReducer } from "react";
import { initialState } from "./constant";
import PromotionModal from "./components/Modal/PromotionModal";
import { Status } from "./constant";
import GameStatus from "./components/GameStatus/GameStatus";

function App() {
  const [appState, dispatch] = useReducer(reducer, initialState);
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
  return (
    <AppContext.Provider value={providerState}>
      <div className="App">
        <Board />
        <PromotionModal />
      </div>
    </AppContext.Provider>
  );
}

export default App;
