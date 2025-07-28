import React, { useState } from "react";
import { useRoomContext } from "../contexts/RoomContext";
import "./JoinRoom.css";

const JoinRoom = () => {
  const { room, setRoom, socket } = useRoomContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = () => {
    if (!room.trim()) {
      setError("Please enter a room name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      socket.emit("join_room", { socketId: socket.id, room: room.trim() });
    } catch (err) {
      setError("Failed to join room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div className="join-room-container">
      <div className="join-room-background">
        <div className="chess-pattern"></div>
      </div>

      <div className="join-room-card">
        <div className="join-room-header">
          <div className="chess-logo">
            <span className="chess-icon">♔</span>
            <span className="chess-icon">♛</span>
          </div>
          <h1 className="join-room-title">Chess Game</h1>
          <p className="join-room-subtitle">Join a room to start playing</p>
        </div>

        <div className="join-room-form">
          <div className="input-group">
            <label htmlFor="room-input" className="input-label">
              Room Name
            </label>
            <input
              id="room-input"
              type="text"
              placeholder="Enter room name..."
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={`room-input ${error ? "input-error" : ""}`}
              disabled={isLoading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button
            onClick={handleJoinRoom}
            className={`join-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Joining...
              </>
            ) : (
              <>
                <span className="button-icon">🎮</span>
                Join Room
              </>
            )}
          </button>

          <div className="join-room-info">
            <div className="info-item">
              <span className="info-icon">👥</span>
              <span>2 players per room</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <span>Real-time gameplay</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>Private rooms</span>
            </div>
          </div>
        </div>

        <div className="join-room-footer">
          <p>Share the room name with your friend to play together!</p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
