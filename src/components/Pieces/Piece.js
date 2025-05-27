import React from "react";
import "./Pieces.css";
import { useAppContext } from "../../contexts/Context";
import arbiter from "../../arbiter/arbiter";
import { generateMoves } from "../../reducer/actions/move";

const Piece = ({ piece, rank, file }) => {
  const { appState, dispatch } = useAppContext();
  const { position, turn, castleDirection } = appState;
  const currentPosition = position[position.length - 1];
  let previousPosition;
  if (position.length > 1) {
    previousPosition = position[position.length - 2];
  }
  const isPieceTurn = turn === piece[0];

  const getMoves = (
    piece,
    rank,
    file,
    currentPosition,
    previousPosition,
    castleDirection
  ) => {
    return arbiter.getValidMoves({
      piece,
      rank,
      file,
      currentPosition,
      previousPosition,
      castleDirection,
    });
  };

  const onDragStart = (e) => {
    if (!isPieceTurn) {
      e.preventDefault();
      return;
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    setTimeout(() => {
      e.target.style.display = "none";
    }, 0);
    if (turn === piece[0]) {
      let castleDir = castleDirection[piece[0]];
      const candidateMoves = getMoves(
        piece,
        rank,
        file,
        currentPosition,
        previousPosition,
        castleDir
      );
      console.log("candidateMoves:", candidateMoves);
      dispatch(generateMoves({ candidateMoves }));
      console.log("candidateMoves:", candidateMoves);
    }
    e.target.style.display = "block";
  };
  const onDrop = (e) => {
    console.log(e.dataTransfer.getData("text"));
  };
  const onDragEnd = (e) => {
    e.target.style.display = "block";
  };
  return (
    <div
      className={`piece ${piece} p-${file}${rank} ${
        !isPieceTurn ? "piece--disabled" : ""
      }`}
      draggable={isPieceTurn}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    ></div>
  );
};

export default Piece;
