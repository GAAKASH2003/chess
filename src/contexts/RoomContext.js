import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";
const RoomContext = createContext();

export const socket = io("http://localhost:3001");

export const RoomProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("");
  const [currentTurnColor, setCurrentTurnColor] = useState(null);
  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        currentTurn,
        setCurrentTurn,
        members,
        setMembers,
        status,
        setStatus,
        isConnected,
        setIsConnected,
        socket,
        currentTurnColor,
        setCurrentTurnColor,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  return useContext(RoomContext);
};
export default RoomContext;
