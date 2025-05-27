import { useState } from "react";

export const createPosition = () => {
  const position = new Array(8).fill("").map(() => {
    return new Array(8).fill("");
  });
  for (let i = 0; i < 8; i++) {
    position[6][i] = "bp";
    position[1][i] = "wp";
  }

  position[0][0] = "wr";
  position[6][0] = "bp";
  position[0][1] = "wn";
  position[0][2] = "wb";
  position[0][3] = "wq";
  position[0][4] = "wk";
  position[0][5] = "wb";
  position[0][6] = "wn";
  position[0][7] = "wr";

  position[7][0] = "br";
  position[7][1] = "bn";
  position[7][2] = "bb";
  position[7][3] = "bq";
  position[7][4] = "bk";
  position[7][5] = "bb";
  position[7][6] = "bn";
  position[7][7] = "br";

  return position;
};

export const copyPosition = (position) => {
  const newPosition = new Array(8).fill("").map(() => {
    return new Array(8).fill("");
  });
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      newPosition[i][j] = position[i][j];
    }
  }
  return newPosition;
};
export const areSameColorTiles = (coords1, coords2) =>
  (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2;

export const findPieceCoords = (position, type) => {
  let results = [];
  position.forEach((rank, i) => {
    rank.forEach((pos, j) => {
      if (pos === type) results.push({ x: i, y: j });
    });
  });
  console.log("results", results);
  return results;
};
