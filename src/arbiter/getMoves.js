import arbiter from "./arbiter";

export const getQueenMoves = (piece, rank, file, currentPosition) => {
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  const direction = [
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1],
  ];

  direction.forEach((dir) => {
    for (let i = 1; i < 8; i++) {
      let newRank = rank + dir[0] * i;
      let newFile = file + dir[1] * i;
      if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
        if (currentPosition[newRank][newFile].startsWith(enemy)) {
          moves.push([newRank, newFile]);
          break;
        } else if (currentPosition[newRank][newFile].startsWith(user)) {
          break;
        } else {
          moves.push([newRank, newFile]);
        }
      }
    }
  });
  console.log("piece:", piece);
  console.log("rank:", rank);
  console.log("file:", file);
  console.log("moves:", moves);
  return moves;
};
export const getRookMoves = (piece, rank, file, currentPosition) => {
  console.log("piece:", piece);
  console.log("rank:", rank);
  console.log("file:", file);
  console.log("currentPosition:", currentPosition);
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  const direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  direction.forEach((dir) => {
    for (let i = 1; i < 8; i++) {
      let newRank = rank + dir[0] * i;
      let newFile = file + dir[1] * i;
      if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
        if (currentPosition[newRank][newFile].startsWith(enemy)) {
          moves.push([newRank, newFile]);
          break;
        } else if (currentPosition[newRank][newFile].startsWith(user)) {
          break;
        } else {
          moves.push([newRank, newFile]);
        }
      }
    }
  });
  return moves;
};
export const getBishopMoves = (piece, rank, file, currentPosition) => {
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  const direction = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  direction.forEach((dir) => {
    for (let i = 1; i < 8; i++) {
      let newRank = rank + dir[0] * i;
      let newFile = file + dir[1] * i;
      if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
        if (currentPosition[newRank][newFile].startsWith(enemy)) {
          moves.push([newRank, newFile]);
          break;
        } else if (currentPosition[newRank][newFile].startsWith(user)) {
          break;
        } else {
          moves.push([newRank, newFile]);
        }
      }
    }
  });
  return moves;
};
export const getKnightMoves = (piece, rank, file, currentPosition) => {
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  const direction = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];
  direction.forEach((dir) => {
    let newRank = rank + dir[0];
    let newFile = file + dir[1];
    if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
      if (currentPosition[newRank][newFile].startsWith(enemy)) {
        moves.push([newRank, newFile]);
      } else if (!currentPosition[newRank][newFile].startsWith(user)) {
        moves.push([newRank, newFile]);
      }
    }
  });
  return moves;
};

export const getPawnMoves = (position, piece, rank, file) => {
  console.log("position:", position);
  console.log("piece:", piece);
  console.log("rank:", rank);
  console.log("file:", file);
  const moves = [];
  const dir = piece === "wp" ? 1 : -1;

  // Move two tiles on first move
  if (rank % 5 === 1) {
    if (
      position?.[rank + dir]?.[file] === "" &&
      position?.[rank + dir + dir]?.[file] === ""
    ) {
      moves.push([rank + dir + dir, file]);
    }
  }

  // Move one tile
  if (!position?.[rank + dir]?.[file]) {
    moves.push([rank + dir, file]);
  }

  return moves;
};

export const getPawnCaptures = ({
  position,
  prevPosition,
  piece,
  rank,
  file,
}) => {
  const moves = [];
  const dir = piece === "wp" ? 1 : -1;
  const enemy = piece[0] === "w" ? "b" : "w";

  if (
    position?.[rank + dir]?.[file - 1] &&
    position[rank + dir][file - 1].startsWith(enemy)
  ) {
    moves.push([rank + dir, file - 1]);
  }

  if (
    position?.[rank + dir]?.[file + 1] &&
    position[rank + dir][file + 1].startsWith(enemy)
  ) {
    moves.push([rank + dir, file + 1]);
  }

  // EnPassant
  // Check if enemy moved twice in last round
  const enemyPawn = dir === 1 ? "bp" : "wp";
  const adjacentFiles = [file - 1, file + 1];
  if (prevPosition) {
    if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)) {
      adjacentFiles.forEach((f) => {
        if (
          position?.[rank]?.[f] === enemyPawn &&
          position?.[rank + dir + dir]?.[f] === "" &&
          prevPosition?.[rank]?.[f] === "" &&
          prevPosition?.[rank + dir + dir]?.[f] === enemyPawn
        ) {
          moves.push([rank + dir, f]);
        }
      });
    }
  }

  return moves;
};
export const getKingMoves = (piece, rank, file, currentPosition) => {
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  const direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  direction.forEach((dir) => {
    let newRank = rank + dir[0];
    let newFile = file + dir[1];
    if (newRank >= 0 && newRank <= 7 && newFile >= 0 && newFile <= 7) {
      if (currentPosition[newRank][newFile].startsWith(enemy)) {
        moves.push([newRank, newFile]);
      } else if (!currentPosition[newRank][newFile].startsWith(user)) {
        moves.push([newRank, newFile]);
      }
    }
  });
  return moves;
};

export const getCastleMoves = ({
  position,
  castleDirection,
  piece,
  rank,
  file,
}) => {
  const moves = [];
  const user = piece[0];
  const enemy = user === "w" ? "b" : "w";
  if (file !== 4 || rank % 7 != 0 || castleDirection === "none") {
    return moves;
  }
  if (piece.startsWith("w")) {
    if (
      arbiter.isPlayerInCheck({
        positionAfterMove: position,
        player: "w",
      })
    ) {
      return moves;
    }
    if (
      ["left", "both"].includes(castleDirection) &&
      !position[0][3] &&
      !position[0][2] &&
      !position[0][1] &&
      position[0][0] == "wr" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 0,
          y: 2,
        }),
        player: "w",
        position: position,
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 0,
          y: 3,
        }),
        player: "w",
        position: position,
      })
    ) {
      moves.push([0, 2]);
    }
    if (
      ["right", "both"].includes(castleDirection) &&
      !position[0][5] &&
      !position[0][6] &&
      position[0][7] == "wr" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 0,
          y: 5,
        }),
        player: "w",
        position: position,
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 0,
          y: 6,
        }),
        player: "w",
        position: position,
      })
    ) {
      moves.push([0, 6]);
    }
  } else {
    if (
      arbiter.isPlayerInCheck({
        positionAfterMove: position,
        player: "b",
      })
    ) {
      return moves;
    }
    if (
      ["left", "both"].includes(castleDirection) &&
      !position[7][3] &&
      !position[7][2] &&
      !position[7][1] &&
      position[7][0] == "br" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 7,
          y: 2,
        }),
        player: "b",
        position: position,
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 7,
          y: 3,
        }),
        player: "b",
        position: position,
      })
    ) {
      moves.push([7, 2]);
    }
    if (
      ["right", "both"].includes(castleDirection) &&
      !position[7][5] &&
      !position[7][6] &&
      position[7][7] == "br" &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 7,
          y: 5,
        }),
        player: "b",
        position: position,
      }) &&
      !arbiter.isPlayerInCheck({
        positionAfterMove: arbiter.performMove({
          currentPosition: position,
          piece,
          rank,
          file,
          x: 7,
          y: 6,
        }),
        player: "b",
        position: position,
      })
    ) {
      moves.push([7, 6]);
    }
  }
  return moves;
};

export const getCastlingDirection = ({
  castleDirection,
  piece,
  rank,
  file,
}) => {
  file = Number(file);
  rank = Number(rank);
  const direction = castleDirection[piece[0]];
  if (piece.endsWith("k")) return "none";
  if (file === 0 && rank === 0) {
    if (direction === "both") return "right";
    if (direction === "left") return "none";
  }
  if (file === 7 && rank === 0) {
    if (direction === "both") return "left";
    if (direction === "right") return "none";
  }
  if (file === 0 && rank === 7) {
    if (direction === "both") return "right";
    if (direction === "left") return "none";
  }
  if (file === 7 && rank === 7) {
    if (direction === "both") return "left";
    if (direction === "right") return "none";
  }
  return direction;
};

export const getKingPos = ({ position, player }) => {
  let kingPos = [];
  position.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.startsWith(player) && cell.endsWith("k")) {
        kingPos = [i, j];
      }
    });
  });
  return kingPos;
};

export const getPlayerPieces = ({ position, player }) => {
  const enemy = player;
  const enemyPieces = [];
  position.forEach((rank, x) => {
    rank.forEach((file, y) => {
      if (position[x][y].startsWith(enemy))
        enemyPieces.push({
          piece: position[x][y],
          rank: x,
          file: y,
        });
    });
  });
  return enemyPieces;
};
