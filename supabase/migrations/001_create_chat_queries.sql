-- Run this in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- This creates the chat_queries table for logging AI chatbot interactions

CREATE TABLE IF NOT EXISTS chat_queries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Anonymous',
  city text DEFAULT NULL,
  topic text NOT NULL DEFAULT 'General',
  user_query text NOT NULL,
  ai_response text DEFAULT NULL,
  sentiment text NOT NULL DEFAULT 'neutral',
  response_time_ms integer DEFAULT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Index on session_id for grouping conversations
CREATE INDEX idx_chat_queries_session ON chat_queries (session_id);

-- Index on city for market-level analytics
CREATE INDEX idx_chat_queries_city ON chat_queries (city);

-- Index on topic for category breakdowns
CREATE INDEX idx_chat_queries_topic ON chat_queries (topic);

-- Index on timestamp for time-range queries
CREATE INDEX idx_chat_queries_timestamp ON chat_queries (timestamp DESC);

ALTER TABLE chat_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON chat_queries
  FOR ALL USING (true) WITH CHECK (true);
