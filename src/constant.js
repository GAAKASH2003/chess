import { createPosition } from "./helper";

export const Status = {
  ongoing: "Ongoing",
  white: "White wins",
  black: "Black wins",
  stalemate: "Game draws due to stalemate",
  insufficient: "Game draws due to insufficient material",
};
export const initialState = {
  position: [createPosition()],
  turn: "w",
  candidateMoves: [],
  promotionSquare: null,
  status: Status.ongoing,
  castleDirection: {
    w: "both",
    b: "both",
  },
};
