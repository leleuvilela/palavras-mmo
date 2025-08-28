-- Create database schema for Palavras MMO

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for persistent player data
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    board_width INTEGER NOT NULL DEFAULT 300,
    board_height INTEGER NOT NULL DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Game sessions tracking individual games
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES game_rooms(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    total_words INTEGER DEFAULT 0,
    words_found INTEGER DEFAULT 0
);

-- Player sessions in games
CREATE TABLE IF NOT EXISTS player_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    socket_id VARCHAR(100),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    final_score INTEGER DEFAULT 0,
    words_found INTEGER DEFAULT 0
);

-- Words found by players
CREATE TABLE IF NOT EXISTS found_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
    player_session_id UUID REFERENCES player_sessions(id) ON DELETE CASCADE,
    word VARCHAR(50) NOT NULL,
    start_x INTEGER NOT NULL,
    start_y INTEGER NOT NULL,
    end_x INTEGER NOT NULL,
    end_y INTEGER NOT NULL,
    points INTEGER DEFAULT 0,
    found_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Global player statistics
CREATE TABLE IF NOT EXISTS player_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_games INTEGER DEFAULT 0,
    total_words_found INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    best_game_score INTEGER DEFAULT 0,
    average_words_per_game DECIMAL(10,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_sessions_game_session ON player_sessions(game_session_id);
CREATE INDEX IF NOT EXISTS idx_player_sessions_user ON player_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_found_words_game_session ON found_words(game_session_id);
CREATE INDEX IF NOT EXISTS idx_found_words_player_session ON found_words(player_session_id);
CREATE INDEX IF NOT EXISTS idx_game_rooms_active ON game_rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);