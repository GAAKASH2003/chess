import "./App.css";
import Board from "./components/Board/Board";
import AppContext from "./contexts/Context";
import { reducer } from "./reducer/reducer";
import { useReducer } from "react";
import { initialState } from "./constant";
import PromotionModal from "./components/Modal/PromotionModal";
import { Status } from "./constant";
function App() {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const providerState = {
    appState,
    dispatch,
  };
  if (appState.status === Status.stalemate) {
    return <div>{appState.status}</div>;
  }
  if (appState.status === Status.insufficient) {
    return <div>{appState.status}</div>;
  }
  if (appState.status.includes("wins")) {
    return <div>{appState.status}</div>;
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
