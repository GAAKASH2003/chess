import React from "react";
import "./PromotionModal.css";
import { useAppContext } from "../../contexts/Context";
import { hidePromotion } from "../../reducer/actions/move";
import PromotionBox from "./PromotionBox";

const PromotionModal = () => {
  const { appState, dispatch } = useAppContext();
  const { promotionSquare } = appState;

  if (!promotionSquare) return null;

  const onSelectPiece = (piece) => {
    const newPosition = [...appState.position];
    const currentPosition = newPosition[newPosition.length - 1];
    const [rank, file] = promotionSquare;
    currentPosition[rank][file] = piece;
    dispatch(hidePromotion());
    dispatch({ type: "NEW_MOVE", payload: currentPosition });
  };

  return (
    <div className="popup">
      <PromotionBox onSelectPiece={onSelectPiece} />
    </div>
  );
};

export default PromotionModal;
