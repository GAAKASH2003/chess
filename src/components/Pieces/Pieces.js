import React from "react";
import Piece from "./Piece";
import { useRef } from "react";
// import "Pieces.css";
import { createPosition, copyPosition } from "../../helper";
import { useAppContext } from "../../contexts/Context";
import { updateCastling } from "../../reducer/actions/game";
import { getCastlingDirection } from "../../arbiter/getMoves";
import {
  detectStalemate,
  detectCheckmate,
  detectInsufficientMaterial,
} from "../../reducer/actions/move";
import { getAIMove } from "../../services/aiService";
// import { useState } from "react";
import {
  makeNewMove,
  clearCandidateMoves,
  showPromotion,
} from "../../reducer/actions/move";
import arbiter from "../../arbiter/arbiter";

const Pieces = () => {
  const ref = useRef();
  const { appState, dispatch } = useAppContext();

  const currentState = appState.position[appState.position.length - 1];

  const calculateCoordinates = (e) => {
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const size = width / 8;
    const x = 7 - Math.floor((e.clientY - top) / size);
    const y = Math.floor((e.clientX - left) / size);
    return { x, y };
  };

  const updateCastlingState = (piece, rank, file) => {
    const direction = getCastlingDirection({
      castleDirection: appState.castleDirection,
      piece,
      rank,
      file,
    });
    if (direction) {
      dispatch(updateCastling(direction));
    }
  };

  const getAiMove = async (currentState) => {
    const aiMove = await getAIMove(currentState);

    if (aiMove) {
      const { from, to } = aiMove;
      const piece = currentState[from[0]][from[1]];
      const castleDirection =
        appState.castleDirection[`${piece.startsWith("w") ? "b" : "w"}`];
      const opponent = piece.startsWith("w") ? "b" : "w";

      const newPosition = arbiter.performMove({
        piece,
        rank: from[0],
        file: from[1],
        currentPosition: currentState,
        x: to[0],
        y: to[1],
      });
      console.log("newPosition", newPosition);
      if (piece.endsWith("k") || piece.endsWith("r")) {
        updateCastlingState(piece, from[0], from[1]);
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
      dispatch(makeNewMove(newPosition));
      dispatch(clearCandidateMoves());
      return newPosition;
    }
  };

  // Handle AI moves for black's turn
  // React.useEffect(() => {
  //   if (appState.turn === "b") {
  //     getAiMove(currentState);
  //   }
  // }, [appState.turn, currentState]);

  const move = async (e) => {
    const { x, y } = calculateCoordinates(e);
    const [piece, rank, file] = e.dataTransfer.getData("text").split(",");
    console.log("piece", piece);
    console.log("rank", rank);
    console.log("mfile", file);
    console.log("x", x);
    console.log("y", y);
    const castleDirection =
      appState.castleDirection[`${piece.startsWith("w") ? "b" : "w"}`];
    const opponent = piece.startsWith("w") ? "b" : "w";
    console.log("appState.turn", appState.turn);
    // if (appState.turn === "b") {
    //   const newPosition = await getAiMove(currentState);
    //   console.log("newPosition", newPosition);
    //   return;
    // }
    if (
      appState.candidateMoves.find((move) => move[0] === x && move[1] === y)
    ) {
      const newPosition = arbiter.performMove({
        piece,
        rank,
        file,
        currentPosition: currentState,
        x,
        y,
      });
      // const newPosition = arbiter.performMove({
      //   piece: "bk",
      //   rank: 7,
      //   file: 4,
      //   currentPosition: currentState,
      //   x: 4,
      //   y: 4,
      // });
      // Check for pawn promotion
      if (piece.endsWith("p") && (x === 0 || x === 7)) {
        dispatch(makeNewMove(newPosition));
        dispatch(showPromotion([x, y]));
      } else if (piece.endsWith("k") || piece.endsWith("r")) {
        updateCastlingState(piece, rank, file);
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
    }
    dispatch(clearCandidateMoves());
  };

  const ondrop = (e) => {
    const { x, y } = calculateCoordinates(e);
    // const newPosition = copyPosition(currentState);
    // const [piece, rank, file] = e.dataTransfer.getData("text").split(",");
    // console.log(piece, rank, file, x, y);
    // newPosition[x][y] = piece;
    // newPosition[rank][file] = "";
    // console.log(newPosition);
    // dispatch(makeNewMove(newPosition));
    // dispatch(clearCandidateMoves());
    move(e);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    // console.log("drag over");
  };

  return (
    <div ref={ref} onDrop={ondrop} onDragOver={onDragOver} className="pieces">
      {currentState.map((r, rank) =>
        r.map((p, file) =>
          currentState[rank][file] ? (
            <Piece
              key={`${rank}-${file}`}
              piece={currentState[rank][file]}
              rank={rank}
              file={file}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default Pieces;
