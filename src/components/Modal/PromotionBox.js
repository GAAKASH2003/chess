import React from "react";
import { useAppContext } from "../../contexts/Context";
import "./PromotionBox.css";
const PromotionBox = ({ onSelectPiece }) => {
  const { appState } = useAppContext();
  const options = ["q", "r", "b", "n"];
  const color = appState.turn === "w" ? "b" : "w";

  return (
    <div className="popup--inner promotion-choices">
      {options.map((option) => (
        <div
          className={`gap piece ${color}${option} `}
          key={option}
          onClick={() => onSelectPiece(`${color}${option}`)}
        />
      ))}
    </div>
  );
};

export default PromotionBox;
