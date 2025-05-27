export const makeNewMove = (newPosition) => {
  return {
    type: "NEW_MOVE",
    payload: newPosition,
  };
};

export const generateMoves = ({ candidateMoves }) => {
  return {
    type: "GENERATE_MOVES",
    payload: { candidateMoves },
  };
};

export const clearCandidateMoves = () => {
  return {
    type: "CLEAR_CANDIDATE_MOVES",
  };
};

export const showPromotion = (square) => {
  return {
    type: "SHOW_PROMOTION",
    payload: square,
  };
};

export const hidePromotion = () => {
  return {
    type: "HIDE_PROMOTION",
  };
};
export const detectStalemate = () => {
  return {
    type: "DETECT_STALEMATE",
  };
};
export const detectInsufficientMaterial = () => {
  return {
    type: "DETECT_INSUFFICIENT_MATERIAL",
  };
};
export const detectCheckmate = (opponent) => {
  return {
    type: "DETECT_CHECKMATE",
    payload: opponent,
  };
};
