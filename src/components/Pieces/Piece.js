import React from "react";
import "./Pieces.css";
import { useAppContext } from "../../contexts/Context";
import { useRoomContext } from "../../contexts/RoomContext";
import arbiter from "../../arbiter/arbiter";
import { generateMoves } from "../../reducer/actions/move";

const Piece = ({ piece, rank, file }) => {
  const { appState, dispatch } = useAppContext();
  const { currentTurn, currentTurnColor, socket } = useRoomContext();
  const { position, turn, castleDirection } = appState;
  const currentPosition = position[position.length - 1];

  let previousPosition;
  if (position.length > 1) {
    previousPosition = position[position.length - 2];
  }

  // Enhanced turn validation
  const isPieceTurn = turn === piece[0];
  const isMyTurn = currentTurn === socket.id;
  const isMyPiece = piece.startsWith(currentTurnColor);
  const canMove = isPieceTurn && isMyTurn && isMyPiece;

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
    // Comprehensive turn validation
    if (!isMyTurn) {
      console.log("❌ Drag prevented - not your turn");
      e.preventDefault();
      return;
    }

    if (!isMyPiece) {
      console.log("❌ Drag prevented - not your piece");
      e.preventDefault();
      return;
    }

    if (!isPieceTurn) {
      console.log("❌ Drag prevented - wrong piece turn");
      e.preventDefault();
      return;
    }

    console.log(
      "✅ Drag allowed - piece:",
      piece,
      "turn:",
      turn,
      "myTurn:",
      isMyTurn
    );

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
        !canMove ? "piece--disabled" : ""
      }`}
      draggable={canMove}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      style={{
        cursor: canMove ? "grab" : "not-allowed",
        opacity: canMove ? 1 : 0.5,
      }}
      title={canMove ? `Move ${piece}` : "Not your turn"}
    ></div>
  );
};

export default Piece;
