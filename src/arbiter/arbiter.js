import { useAppContext } from "../contexts/Context";
import { movePiece, movePawn } from "./move";
import { findPieceCoords, areSameColorTiles } from "../helper";
import {
  getQueenMoves,
  getRookMoves,
  getBishopMoves,
  getKnightMoves,
  getPawnMoves,
  getKingMoves,
  getPawnCaptures,
  getCastleMoves,
  getKingPos,
  getPlayerPieces,
} from "./getMoves";
const arbiter = {
  getRegularMoves: function ({
    piece,
    rank,
    file,
    currentPosition,
    previousPosition,
  }) {
    if (piece[1] === "q") {
      return getQueenMoves(piece, rank, file, currentPosition);
    } else if (piece[1] === "r") {
      return getRookMoves(piece, rank, file, currentPosition);
    } else if (piece[1] === "b") {
      return getBishopMoves(piece, rank, file, currentPosition);
    } else if (piece[1] === "n") {
      return getKnightMoves(piece, rank, file, currentPosition);
    } else if (piece[1] === "p") {
      return getPawnMoves(currentPosition, piece, rank, file);
    } else if (piece[1] === "k") {
      return getKingMoves(piece, rank, file, currentPosition);
    }
  },

  getValidMoves: function ({
    piece,
    rank,
    file,
    currentPosition,
    previousPosition,
    castleDirection,
  }) {
    let moves = this.getRegularMoves({
      piece,
      rank,
      file,
      currentPosition,
      previousPosition,
    });
    const notInCheckMoves = [];
    if (piece.endsWith("p")) {
      moves = [
        ...moves,
        ...getPawnCaptures({
          position: currentPosition,
          prevPosition: previousPosition,
          piece,
          rank,
          file,
        }),
      ];
    }
    if (piece.endsWith("k")) {
      moves = [
        ...moves,
        ...getCastleMoves({
          position: currentPosition,
          castleDirection,
          piece,
          rank,
          file,
        }),
      ];
    }
    moves.forEach(([x, y]) => {
      const positionAfterMove = this.performMove({
        currentPosition,
        piece,
        rank,
        file,
        x,
        y,
      });

      if (
        !this.isPlayerInCheck({
          positionAfterMove,
          position: currentPosition,
          player: piece[0],
        })
      ) {
        notInCheckMoves.push([x, y]);
      }
    });
    return notInCheckMoves;
  },
  performMove: function ({ piece, rank, file, currentPosition, x, y }) {
    if (piece.endsWith("p"))
      return movePawn({ position: currentPosition, piece, rank, file, x, y });
    else
      return movePiece({ position: currentPosition, piece, rank, file, x, y });
  },

  isPlayerInCheck: function ({ positionAfterMove, position, player }) {
    const enemy = player.startsWith("w") ? "b" : "w";
    const kingPos = getKingPos({ position: positionAfterMove, player });
    const enemyPieces = getPlayerPieces({
      position: positionAfterMove,
      player: enemy,
    });
    console.log(enemyPieces);
    const enemyMoves = enemyPieces.reduce(
      (acc, p) =>
        (acc = [
          ...acc,
          ...(p.piece.endsWith("p")
            ? getPawnCaptures({
                position: positionAfterMove,
                prevPosition: position,
                ...p,
              })
            : this.getRegularMoves({
                currentPosition: positionAfterMove,
                ...p,
              })),
        ]),
      []
    );

    if (enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y))
      return true;
    else return false;
  },
  isStalemate: function (position, player, castleDirection) {
    const isInCheck = this.isPlayerInCheck({
      positionAfterMove: position,
      player,
    });
    if (isInCheck) return false;
    const pieces = getPlayerPieces({ position, player });
    const moves = pieces.reduce((acc, p) => {
      return [
        ...acc,
        ...this.getValidMoves({
          ...p,
          currentPosition: position,
          previousPosition: position,
          castleDirection,
        }),
      ];
    }, []);
    console.log("moves", moves);
    if (moves.length === 0) return true;
    else return false;
  },

  isCheckMate: function (position, player, castleDirection) {
    const isInCheck = this.isPlayerInCheck({
      positionAfterMove: position,
      player,
    });

    if (!isInCheck) return false;

    const pieces = getPlayerPieces({ position, player });
    const moves = pieces.reduce((acc, p) => {
      return [
        ...acc,
        ...this.getValidMoves({
          ...p,
          currentPosition: position,
          previousPosition: position,
          castleDirection,
        }),
      ];
    }, []);

    return isInCheck && moves.length === 0;
  },
  insufficientMaterial: function (position) {
    const pieces = position.reduce(
      (acc, rank) => (acc = [...acc, ...rank.filter((spot) => spot)]),
      []
    );

    // King vs. king
    if (pieces.length === 2) return true;

    // King and bishop vs. king
    // King and knight vs. king
    if (
      pieces.length === 3 &&
      pieces.some((p) => p.endsWith("b") || p.endsWith("n"))
    )
      return true;

    // King and bishop vs. king and bishop of the same color as the opponent's bishop
    console.log("pieces", pieces);
    if (
      pieces.length === 4 &&
      pieces.every((p) => p.endsWith("b") || p.endsWith("k")) &&
      new Set(pieces).size === 4 &&
      areSameColorTiles(
        findPieceCoords(position, "wb")[0],
        findPieceCoords(position, "bb")[0]
      )
    )
      return true;

    return false;
  },
};

export default arbiter;
