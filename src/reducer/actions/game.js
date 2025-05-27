export const updateCastling = (direction) => {
  return {
    type: "CAN_CASTLE",
    payload: direction,
  };
};
