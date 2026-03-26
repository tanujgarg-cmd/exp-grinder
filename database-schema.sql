-- ========================================
-- EXP GRINDER — Supabase Database Schema
-- ========================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Players table (stores game state per user)
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  game_state JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Players can only read/write their own data
CREATE POLICY "Users can read own data" ON players
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON players
  FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard view (public, read-only)
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  id,
  email,
  COALESCE((game_state->>'level')::int, 1) AS level,
  COALESCE((game_state->>'coins')::int, 0) AS coins,
  COALESCE((game_state->>'totalPvPWins')::int, 0) AS pvp_wins,
  COALESCE((game_state->>'totalGamesWon')::int, 0) AS games_won,
  COALESCE(jsonb_array_length(game_state->'inventory'), 0) AS weapon_count,
  updated_at
FROM players
ORDER BY COALESCE((game_state->>'level')::int, 1) DESC
LIMIT 100;

-- Auto-create player row on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO players (user_id, email, game_state)
  VALUES (NEW.id, NEW.email, '{"coins":4000,"debt":0,"xp":0,"level":1,"inventory":[],"gamesLeft":{"math":4,"trivia":4,"word":4,"memory":4},"streak":1,"missedDays":0,"dailyFeePaid":false,"feeMultiplierDays":0,"achievements":{},"totalCoinsEarned":0,"totalPvPWins":0,"totalGamesWon":0,"packsOpened":0,"materials":{"plasma":0,"cryo":0,"inferno":0,"voidF":0,"star":0,"glitch":0,"dark":0},"potions":[]}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create player on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
