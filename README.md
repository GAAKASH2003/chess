# ♔ Chess Game ♛

A modern, real-time multiplayer chess game built with React and Socket.IO. Play chess with friends online in private rooms with beautiful animations and intuitive gameplay.

## 🎮 Features

### ✨ Core Gameplay

- **Real-time Multiplayer**: Play chess with friends in real-time
- **Private Rooms**: Create or join private game rooms
- **Turn-based Gameplay**: Proper turn management and validation
- **Move Validation**: Complete chess rules implementation
- **Game State Management**: Track game progress and piece positions

### 🛡️ Game Features

- **Complete Chess Rules**: All standard chess moves and rules
- **Special Moves**: Castling, en passant, and pawn promotion
- **Game End Detection**: Checkmate, stalemate, and insufficient material
- **Move History**: Track all moves made during the game
- **Piece Highlighting**: Visual indicators for valid moves

### 🔧 Technical Features

- **Real-time Synchronization**: Instant move updates across all players
- **Room Management**: Join/leave rooms with proper state handling
- **Error Handling**: Comprehensive error management and user feedback
- **Performance Optimized**: Efficient rendering and state updates
- **Cross-platform**: Works on all modern browsers

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- A modern web browser

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chess-game.git
cd chess-game
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Start the Server

```bash
# Navigate to server directory
cd server

# Start the server
npm start
# or if you have nodemon installed
nodemon index.js
```

The server will start on `http://localhost:3001`

### 5. Start the Frontend

```bash
# In a new terminal, from the root directory
npm start
```

The React app will start on `http://localhost:3000`

### 6. Open Your Browser

Navigate to `http://localhost:3000` to start playing!

## 🔧 Server Configuration

### Server Dependencies

The server uses the following main dependencies:

- **Express.js**: Web server framework
- **Socket.IO**: Real-time communication
- **Nodemon**: Development server with auto-reload
- **UUID**: Unique identifier generation

### Server Structure

```
server/
├── index.js          # Main server entry point
├── socket.js         # Socket.IO event handlers
├── package.json      # Server dependencies
└── node_modules/     # Installed packages
```

### Server Features

- **Real-time Communication**: Handles all game events via Socket.IO
- **Room Management**: Creates and manages game rooms
- **Player Management**: Tracks connected players and their states
- **Game State Sync**: Synchronizes game state across all players
- **CORS Support**: Configured for cross-origin requests

### Running Both Servers

You can run both the frontend and backend servers simultaneously:

#### Option 1: Separate Terminals

```bash
# Terminal 1 - Start the server
cd server
nodemon  index.js

# Terminal 2 - Start the frontend
npm run start
```

#### Option 2: Using Concurrently (Recommended)

Add this to your root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm start\" \"cd server && npm start\"",
    "server": "cd server && npm start"
  }
}
```

Then run:

```bash
npm run dev
```

```

## 🎯 How to Play

### Starting a Game

1. **Enter Room Name**: Type a unique room name in the input field
2. **Join Room**: Click "Join Room" to enter the game
3. **Wait for Opponent**: The first player waits for the second player to join
4. **Start Playing**: Once both players join, the game begins automatically

### Game Rules

- **White goes first**: White pieces always move first
- **Standard chess rules**: All traditional chess rules apply
- **Turn-based**: Players can only move on their turn
- **Move validation**: Invalid moves are automatically prevented
- **Game end conditions**: Checkmate, stalemate, or insufficient material

### Controls

- **Drag and Drop**: Click and drag pieces to move them
- **Visual Feedback**: Valid moves are highlighted on the board
- **Turn Indicator**: See whose turn it is at the top of the screen

## 🏗️ Project Structure

```

chess/
├── public/ # Static assets
├── src/
│ ├── components/ # React components
│ │ ├── Board/ # Chess board components
│ │ ├── GameStatus/ # Game status displays
│ │ ├── Modal/ # Promotion and other modals
│ │ └── Pieces/ # Chess piece components
│ ├── contexts/ # React contexts
│ │ ├── Context.js # App state context
│ │ └── RoomContext.js # Room management context
│ ├── reducer/ # State management
│ │ ├── actions/ # Redux-style actions
│ │ └── reducer.js # Main reducer
│ ├── arbiter/ # Game logic
│ │ ├── arbiter.js # Main game rules
│ │ ├── getMoves.js # Move generation
│ │ └── move.js # Move execution
│ ├── services/ # External services
│ ├── assets/ # Images and icons
│ └── App.js # Main application component
├── package.json # Dependencies and scripts
└── README.md # This file

```

## 🛠️ Technology Stack

### Frontend

- **React 18**: Modern React with hooks and functional components
- **CSS3**: Custom styling with animations and responsive design
- **Socket.IO Client**: Real-time communication with the server

### State Management

- **useReducer**: Built-in React state management
- **Context API**: Global state sharing across components

### Game Logic

- **Custom Arbiter**: Complete chess rules implementation
- **Move Validation**: Real-time move checking and validation

### Development Tools

- **Create React App**: Development environment and build tools
- **ESLint**: Code quality and consistency
- **Git**: Version control

---

**Happy Playing! ♔♛**

_Built with ❤️ using React and Socket.IO_
```
