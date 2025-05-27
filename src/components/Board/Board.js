import React from "react";
import "./Board.css";
// import Files from "./Bits/Files";
// Files
// import Ranks from "./Bits/Ranks";
import Pieces from "../Pieces/Pieces";
import Files from "./Bits/Files";
import Ranks from "./Bits/Ranks";
import { useAppContext } from "../../contexts/Context";
import PromotionModal from "../Modal/PromotionModal";
// arbiter
import { getKingPos } from "../../arbiter/getMoves";
import arbiter from "../../arbiter/arbiter";

const Board = () => {
  const { appState } = useAppContext();
  const position = appState.position[appState.position.length - 1];
  const turn = appState.turn;
  // console.log("appState.candidateMoves:", appState.candidateMoves);
  const isChecked = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position,
      player: turn,
    });
    if (isInCheck) {
      return getKingPos({ position: position, player: turn });
    }
    return null;
  })();
  const getClassName = (rank, file) => {
    let c = "tile";
    const isEven = (rank + file.charCodeAt(0) - 97) % 2 === 0;
    c += isEven ? " tile--light" : " tile--dark";
    // console.log("appState.candidateMoves:", appState.candidateMoves);
    let fileIndex = file.charCodeAt(0) - 97;
    let rankIndex = rank;
    if (
      appState.candidateMoves?.find(
        (m) => m[0] == rankIndex - 1 && m[1] == fileIndex
      )
    ) {
      const targetPiece = position[rankIndex - 1][fileIndex];
      if (targetPiece && targetPiece.charAt(0) !== turn) {
        c += " attacking";
      } else {
        c += " highlight";
      }
    }
    if (
      isChecked &&
      isChecked[0] == rankIndex - 1 &&
      isChecked[1] == fileIndex
    ) {
      c += " checked";
    }
    return c;
  };
  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((x, i) => String.fromCharCode(97 + i));
  return (
    <div className="board">
      <Ranks ranks={ranks} />
      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div className={getClassName(rank, file)} key={`${file}-${rank}`}>
              <span className="tile-index">{`${file}${rank}`}</span>
            </div>
          ))
        )}
      </div>
      <Pieces />

      <Files files={files} />
    </div>
  );
};

export default Board;
