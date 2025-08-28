# Palavras MMO - Architecture Documentation

## Project Structure

The project follows a monorepo structure with separate packages for client, server, and shared code.

```
palavras-mmo/
├── client/                 # React frontend application
├── server/                 # Node.js backend server  
├── shared/                 # Shared TypeScript types and utilities
├── docker-compose.yml      # Development environment setup
├── package.json            # Root workspace configuration
└── README.md              # Project documentation
```

## Client Architecture (Frontend)

```
client/src/
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── game/              # Game-specific components
│   └── layout/            # Layout components
├── pages/                 # Top-level page components
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state management
├── services/              # External service integrations
│   ├── socket/            # Socket.IO client service
│   └── api/               # HTTP API services
├── utils/                 # Utility functions
├── constants/             # Application constants
├── types/                 # TypeScript type definitions
├── App.tsx                # Root application component
└── main.tsx              # Application entry point
```

### Key Architectural Principles:

- **Component Organization**: UI components are separated from game logic
- **State Management**: Zustand for global state with TypeScript support
- **Service Layer**: Abstracted socket and API communications
- **Custom Hooks**: Reusable logic abstraction
- **Type Safety**: Full TypeScript implementation with shared types

## Server Architecture (Backend)

```
server/src/
├── controllers/           # Request handlers and Socket.IO event handlers
├── services/             # Business logic layer
├── models/               # Data models and entities
├── game/                 # Game-specific logic
│   ├── board/            # Board generation and management
│   ├── words/            # Word validation and scoring
│   └── rooms/            # Room management logic
├── routes/               # Express route definitions
├── middleware/           # Express middleware functions
├── config/               # Configuration and database setup
├── utils/                # Server utility functions
├── validators/           # Input validation schemas
├── app.ts                # Express application setup
└── server.ts             # Server entry point
```

### Key Architectural Principles:

- **Layered Architecture**: Controllers → Services → Models
- **Separation of Concerns**: Game logic separated from infrastructure
- **Dependency Injection**: Services injected into controllers
- **Error Handling**: Centralized error handling middleware
- **Validation**: Input validation at controller level

## Shared Package

```
shared/src/
├── types.ts              # Shared TypeScript interfaces
└── index.ts              # Package exports
```

Contains shared TypeScript types and interfaces used by both client and server.

## Data Flow

### Real-time Game Flow:

1. **Client Connection**: Player connects via Socket.IO
2. **Room Management**: Player joins/creates game room
3. **Game State**: Server maintains authoritative game state
4. **Word Submission**: Client submits word attempts
5. **Validation**: Server validates and scores attempts
6. **State Broadcast**: Updates broadcast to all room participants

### State Management:

- **Server**: Redis for session data, PostgreSQL for persistence
- **Client**: Zustand stores for UI state, Socket.IO for real-time updates

## Scalability Considerations

### Client Scalability:
- **DOM Virtualization**: TanStack Virtual for large grid rendering
- **Component Lazy Loading**: Code splitting for optimal loading
- **State Optimization**: Minimal re-renders with Zustand selectors

### Server Scalability:
- **Horizontal Scaling**: Stateless server design with Redis sessions
- **Room Isolation**: Independent game rooms for load distribution
- **Database Optimization**: Indexed queries and connection pooling
- **Caching Strategy**: Redis for frequently accessed data

## Technology Stack

### Frontend:
- React 18 with TypeScript
- TailwindCSS for styling
- TanStack Virtual for virtualization
- Zustand for state management
- Socket.IO client for real-time communication

### Backend:
- Node.js with Express
- Socket.IO for WebSocket communication
- PostgreSQL for data persistence
- Redis for caching and sessions
- TypeScript for type safety

### Development:
- Vite for frontend bundling
- ESLint for code linting
- Docker for containerization
- Workspace management with npm workspaces

## Design Patterns

### Client Patterns:
- **Custom Hooks**: For reusable stateful logic
- **Service Layer**: Abstracted external communications
- **Component Composition**: Reusable UI building blocks

### Server Patterns:
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Observer Pattern**: Real-time event broadcasting
- **Factory Pattern**: Game room and player creation

## Security Considerations

- **Input Validation**: All client inputs validated on server
- **Rate Limiting**: Socket event rate limiting
- **CORS Configuration**: Proper cross-origin setup
- **Connection Security**: WebSocket connection validation