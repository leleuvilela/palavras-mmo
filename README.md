# Palavras MMO - Massive Multiplayer Word Search

<!--toc:start-->

- [Palavras MMO - Massive Multiplayer Word Search](#palavras-mmo-massive-multiplayer-word-search)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Infrastructure](#infrastructure)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Development Setup](#development-setup)
    - [Production Setup](#production-setup)
  - [Project Structure](#project-structure)
  - [Architecture](#architecture)
  - [Game Flow](#game-flow)
  - [API & Events](#api-events)
    - [Socket.IO Events](#socketio-events)
  - [Development Commands](#development-commands)
  - [Contributing](#contributing)
  - [License](#license)
  <!--toc:end-->

A real-time web game that allows dozens or hundreds of players to participate simultaneously on a large-scale word search board.

## Features

- 🎮 Real-time multiplayer gameplay with 100+ concurrent players per room
- 🎯 Large-scale word search board (300x1000 grid)
- 🏆 Live player rankings and scoring system
- 🌐 Multiple independent game rooms
- 📱 Responsive design for desktop and mobile
- ⚡ Efficient DOM virtualization for smooth rendering
- 🔄 Real-time board updates via WebSockets

## Tech Stack

### Frontend

- React 18 with TypeScript
- TailwindCSS for styling
- TanStack Virtual for DOM virtualization
- Zustand for state management
- Socket.IO client for real-time communication
- Vite for development and building

### Backend

- Node.js with Express
- Socket.IO for WebSocket communication
- TypeScript for type safety

### Database

- PostgreSQL for persistent data
- Redis for real-time caching and session management

### Infrastructure

- Docker & Docker Compose for containerization
- Nginx for load balancing (production)

## Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd palavras-mmo
```

2. Install dependencies:

```bash
npm install
```

3. Start the development environment with Docker:

```bash
docker-compose up -d postgres redis
```

4. Copy environment variables:

```bash
cp server/.env.example server/.env
```

5. Run the database migrations:

```bash
# Connect to PostgreSQL and run migrations manually, or they will run automatically via docker-compose
```

6. Start the development servers:

```bash
npm run dev
```

This will start:

- Client development server at <http://localhost:3000>
- Server at <http://localhost:3001>
- PostgreSQL at localhost:5432
- Redis at localhost:6379

### Production Setup

Build and run with Docker:

```bash
docker-compose up --build
```

## Project Structure

```
palavras-mmo/
├── client/          # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Node.js backend server
│   ├── src/
│   └── package.json
├── shared/          # Shared TypeScript types and utilities
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── package.json     # Root workspace configuration
```

## Architecture

The system follows a client-server architecture with real-time communication:

1. **Client**: React application with virtualized rendering for large boards
2. **Server**: Express server with Socket.IO for real-time events
3. **Database**: PostgreSQL for persistence, Redis for caching and sessions
4. **Communication**: WebSocket events for real-time gameplay updates

## Game Flow

1. Players join a game room with a nickname
2. Server generates a large word search board with hidden words
3. Players search for words by selecting letter sequences
4. Server validates word attempts and updates game state
5. Found words are marked and broadcast to all players
6. Real-time ranking updates show player scores

## API & Events

### Socket.IO Events

- `join-room`: Join a game room
- `word-attempt`: Submit a word selection attempt
- `word-found`: Broadcast when a valid word is found
- `ranking-updated`: Live ranking updates
- `player-joined`: New player notification
- `player-left`: Player disconnect notification

## Development Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

