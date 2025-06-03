import React from "react";
import "./GameStatus.css";

const GameStatus = ({ status }) => {
  const getStatusColor = () => {
    if (status.includes("wins")) return "#4CAF50"; // Green for wins
    if (status.includes("stalemate")) return "#FFA726"; // Orange for stalemate
    if (status.includes("insufficient")) return "#9E9E9E"; // Grey for insufficient material
    return "#2196F3"; // Blue for other statuses
  };

  const getStatusIcon = () => {
    if (status.includes("wins")) return "🏆";
    if (status.includes("stalemate")) return "🤝";
    if (status.includes("insufficient")) return "⚖️";
    return "🎮";
  };

  return (
    <div className="game-status" style={{ backgroundColor: getStatusColor() }}>
      <div className="status-content">
        <span className="status-icon">{getStatusIcon()}</span>
        <h2 className="status-text">{status}</h2>
      </div>
    </div>
  );
};

export default GameStatus;
