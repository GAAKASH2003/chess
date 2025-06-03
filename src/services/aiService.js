import { copyPosition } from "../helper";

const API_URL = "YOUR_CHESS_AI_API_ENDPOINT";

export const getAIMove = async (position) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: position,
        color: "black",
      }),
    });

    // if (!response.ok) {
    //   throw new Error("Failed to get AI move");
    // }

    // const data = await response.json();
    const data = {
      move: {
        from: [6, 0],
        to: [5, 0],
      },
    };

    return data.move; // Assuming the API returns { move: { from: [x1, y1], to: [x2, y2] } }
  } catch (error) {
    console.error("Error getting AI move:", error);
    // Fallback to a random valid move if API fails
    return getRandomValidMove(position);
  }
};

// Fallback function to get a random valid move if API fails
const getRandomValidMove = (position) => {
  const blackPieces = [];

  // Find all black pieces
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (position[i][j] && position[i][j].startsWith("b")) {
        blackPieces.push({ piece: position[i][j], x: i, y: j });
      }
    }
  }

  // Get a random black piece
  const randomPiece =
    blackPieces[Math.floor(Math.random() * blackPieces.length)];

  // Get valid moves for the piece (you'll need to implement this based on your chess rules)
  const validMoves = getValidMoves(position, randomPiece);

  if (validMoves.length === 0) {
    return null;
  }

  // Return a random valid move
  return {
    from: [randomPiece.x, randomPiece.y],
    to: validMoves[Math.floor(Math.random() * validMoves.length)],
  };
};

// Helper function to get valid moves for a piece
const getValidMoves = (position, piece) => {
  // This is a simplified version - you should implement proper chess move validation
  const moves = [];
  const { x, y } = piece;

  // Simple pawn movement for example
  if (piece.piece === "bp") {
    if (x < 7 && !position[x + 1][y]) {
      moves.push([x + 1, y]);
    }
    // Add more move logic for other pieces
  }

  return moves;
};
