import { v4 as uuidv4 } from "uuid";
const turn = {};

export function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (data) => {
      const { socketId, room } = data;
      const clients = io.sockets.adapter.rooms.get(room);
      const size = clients ? clients.size : 0;

      console.log("Joining room:", room, "Current size:", size);

      if (size >= 2) {
        socket.emit("join_room", {
          room,
          success: "false",
        });
        return;
      }

      // Assign turn color
      turn[socketId] = size === 0 ? "w" : "b";

      socket.join(room);
      socket.data.room = room;

      const roomSockets = io.sockets.adapter.rooms.get(room);
      const members = [];

      if (roomSockets) {
        for (const socketId of roomSockets) {
          const socketObj = io.sockets.sockets.get(socketId);
          if (socketObj) {
            members.push({
              id: socketObj.id,
              turn: turn[socketObj.id],
            });
          }
        }
      }

      const status = members.length === 2 ? "full" : "waiting";

      io.to(room).emit("join_room", {
        room,
        members,
        status,
        success: "true",
        currentTurn: members[0].id,
        currentTurnColor: members[0].turn,
        turn: turn[socket.id],
      });
    });

    socket.on("move", (data) => {
      const members = io.sockets.adapter.rooms.get(data.room);
      const membersArray = [...members];
      const nextTurn =
        membersArray[0] === data.currentTurn
          ? membersArray[1]
          : membersArray[0];
      const nextColor = turn[nextTurn];

      io.to(data.room).emit("move", {
        room: data.room,
        move: data.move,
        currentTurn: nextTurn,
        currentTurnColor: nextColor,
      });
    });

    socket.on("onmove", (data) => {
      const members = io.sockets.adapter.rooms.get(data.room);
      const membersArray = [...members];
      const nextTurn =
        membersArray[0] === data.currentTurn
          ? membersArray[1]
          : membersArray[0];

      io.to(data.room).emit("onmove", {
        ...data,
        currentTurn: nextTurn,
        currentTurnColor: turn[nextTurn],
      });
    });

    socket.on("leave_room", () => {
      const room = socket.data.room;

      if (room) {
        const roomSockets = io.sockets.adapter.rooms.get(room);
        const membersToRemove = [];

        if (roomSockets) {
          for (const socketId of roomSockets) {
            const socketObj = io.sockets.sockets.get(socketId);
            if (socketObj) {
              membersToRemove.push(socketObj.id);
              delete turn[socketObj.id];
            }
          }
        }

        delete turn[socket.id];

        io.to(room).emit("leave_room", {
          room,
          members: [],
          success: "true",
          status: "game_over",
          message: "Room cleared - all members removed",
        });
        socket.leave(room);

        console.log(`Room ${room} cleared. Removed members:`, membersToRemove);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      const room = socket.data.room;

      if (room) {
        const roomSockets = io.sockets.adapter.rooms.get(room);
        const membersToRemove = [];

        if (roomSockets) {
          for (const socketId of roomSockets) {
            const socketObj = io.sockets.sockets.get(socketId);
            if (socketObj) {
              membersToRemove.push(socketObj.id);
              delete turn[socketObj.id];
            }
          }
        }

        delete turn[socket.id];

        io.to(room).emit("leave_room", {
          room,
          members: [],
          success: "true",
          message: "Room cleared - user disconnected",
        });

        console.log(
          `Room ${room} cleared due to disconnect. Removed members:`,
          membersToRemove
        );
      } else {
        delete turn[socket.id];
      }
    });
  });
}

// import { v4 as uuidv4 } from "uuid";

// const turn = {}; // Stores: turn[room] = socketId whose turn it is
// const socketToId = {}; // Maps socket.id => custom UUID

// export function setupSocketHandlers(io) {
//   io.on("connection", (socket) => {
//     const id = uuidv4();
//     socket.data.id = id;
//     console.log("User connected:", socket.id);

//     // JOIN ROOM
//     socket.on("join_room", (data) => {
//       const { socketId, room } = data;
//       const clients = io.sockets.adapter.rooms.get(room);
//       const size = clients ? clients.size : 0;

//       if (size >= 2) {
//         socket.emit("join_room", {
//           room,
//           success: "false",
//           status: "full",
//         });
//         return;
//       }

//       socketToId[socketId] = id;
//       socket.join(room);
//       socket.data.room = room;

//       const roomSockets = io.sockets.adapter.rooms.get(room);
//       const members = [];

//       if (roomSockets) {
//         for (const sId of roomSockets) {
//           const s = io.sockets.sockets.get(sId);
//           if (s?.data?.id) {
//             members.push({
//               id: s.data.id,
//             });
//           }
//         }
//       }

//       // Assign first turn if room becomes full
//       if (members.length === 2 && !turn[room]) {
//         turn[room] = [...roomSockets][0]; // First player gets first turn
//       }

//       const status = members.length === 2 ? "full" : "waiting";

//       io.to(room).emit("join_room", {
//         room,
//         members,
//         status,
//         success: "true",
//         currentTurn: turn[room], // socket.id of player whose turn it is
//       });
//     });

//     // HANDLE MOVE
//     socket.on("onmove", (data) => {
//       const room = data.room;
//       const members = io.sockets.adapter.rooms.get(room);
//       if (!members) return;

//       const membersArray = [...members];

//       // Flip the turn
//       const nextTurn =
//         membersArray[0] === turn[room] ? membersArray[1] : membersArray[0];
//       turn[room] = nextTurn;

//       io.to(room).emit("onmove", {
//         ...data,
//         currentTurn: nextTurn,
//       });
//     });

//     // LEAVE ROOM
//     socket.on("leave_room", () => {
//       const room = socket.data.room;
//       if (!room) return;

//       const roomSockets = io.sockets.adapter.rooms.get(room);
//       const membersToRemove = [];

//       if (roomSockets) {
//         for (const sId of roomSockets) {
//           const s = io.sockets.sockets.get(sId);
//           if (s?.data?.id) {
//             membersToRemove.push(s.data.id);
//             delete socketToId[sId];
//           }
//         }
//       }

//       delete turn[room];

//       io.to(room).emit("leave_room", {
//         room,
//         members: [],
//         success: "true",
//         status: "game_over",
//         message: "Room cleared - all members removed",
//       });

//       socket.leave(room);
//       console.log(`Room ${room} cleared. Removed:`, membersToRemove);
//     });

//     // HANDLE DISCONNECT
//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//       const room = socket.data.room;

//       if (room) {
//         const roomSockets = io.sockets.adapter.rooms.get(room);
//         const membersToRemove = [];

//         if (roomSockets) {
//           for (const sId of roomSockets) {
//             const s = io.sockets.sockets.get(sId);
//             if (s?.data?.id) {
//               membersToRemove.push(s.data.id);
//               delete socketToId[sId];
//             }
//           }
//         }

//         delete turn[room];

//         io.to(room).emit("leave_room", {
//           room,
//           members: [],
//           success: "true",
//           status: "game_over",
//           message: "Room cleared - user disconnected",
//         });

//         console.log(
//           `Room ${room} cleared due to disconnect. Removed:`,
//           membersToRemove
//         );
//       }
//     });
//   });
// }
