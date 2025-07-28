import { Status } from "../constant";

export const reducer = (state, action) => {
  switch (action.type) {
    case "NEW_MOVE":
      const turn = state.turn === "w" ? "b" : "w";
      const position = [...state.position, action.payload];
      return {
        ...state,
        turn,
        position,
        promotionSquare: null,
      };
    case "SYNC_TURN":
      return {
        ...state,
        turn: action.payload,
      };
    case "GENERATE_MOVES":
      return {
        ...state,
        candidateMoves: action.payload.candidateMoves,
      };
    case "CLEAR_CANDIDATE_MOVES":
      return {
        ...state,
        candidateMoves: [],
      };
    case "SHOW_PROMOTION":
      return {
        ...state,
        promotionSquare: action.payload,
      };
    case "HIDE_PROMOTION":
      return {
        ...state,
        promotionSquare: null,
      };
    case "CAN_CASTLE": {
      let { turn, castleDirection } = state;

      castleDirection[turn] = action.payload;

      return {
        ...state,
        castleDirection,
      };
    }
    case "DETECT_STALEMATE": {
      return {
        ...state,
        status: Status.stalemate,
      };
    }
    case "DETECT_CHECKMATE": {
      return {
        ...state,
        status: `${action.payload} wins`,
      };
    }
    case "DETECT_INSUFFICIENT_MATERIAL": {
      return {
        ...state,
        status: Status.insufficient,
      };
    }
    default:
      return state;
  }
};
