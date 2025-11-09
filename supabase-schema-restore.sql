-- =====================================================
-- SUPABASE DATABASE SCHEMA RESTORATION SCRIPT
-- =====================================================
-- This script recreates the database schema for your application
-- Run this in your Supabase SQL Editor to restore your database
-- =====================================================

-- Enable UUID extension (required for Supabase auth)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: user
-- =====================================================
-- Stores user profile information linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.user (
    id BIGSERIAL PRIMARY KEY,
    userid UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "phoneNumber" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by userid
CREATE INDEX IF NOT EXISTS idx_user_userid ON public.user(userid);
CREATE INDEX IF NOT EXISTS idx_user_email ON public.user(email);

-- =====================================================
-- TABLE: assistants
-- =====================================================
-- Stores AI assistant configurations
CREATE TABLE IF NOT EXISTS public.assistants (
    id BIGSERIAL PRIMARY KEY,
    assistant_id UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'groq',
    model TEXT NOT NULL DEFAULT 'llama-3.1-8b-instant',
    voice_provider TEXT DEFAULT 'groq',
    voice_model TEXT DEFAULT 'whisper-large-v3-turbo',
    first_message TEXT,
    system_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_assistants_user_id ON public.assistants(user_id);
CREATE INDEX IF NOT EXISTS idx_assistants_assistant_id ON public.assistants(assistant_id);

-- =====================================================
-- TABLE: chat_history
-- =====================================================
-- Stores conversation history for assistants
CREATE TABLE IF NOT EXISTS public.chat_history (
    id BIGSERIAL PRIMARY KEY,
    assistant_id UUID NOT NULL REFERENCES public.assistants(assistant_id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_query TEXT,
    bot_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_history_assistant_id ON public.chat_history(assistant_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON public.chat_history(created_at DESC);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_chat_history_assistant_session 
    ON public.chat_history(assistant_id, session_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: user table
-- =====================================================
-- Users can only read their own profile
CREATE POLICY "Users can view own profile" 
    ON public.user FOR SELECT 
    USING (auth.uid() = userid);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
    ON public.user FOR INSERT 
    WITH CHECK (auth.uid() = userid);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON public.user FOR UPDATE 
    USING (auth.uid() = userid);

-- =====================================================
-- RLS POLICIES: assistants table
-- =====================================================
-- Users can view their own assistants
CREATE POLICY "Users can view own assistants" 
    ON public.assistants FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can create their own assistants
CREATE POLICY "Users can create own assistants" 
    ON public.assistants FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own assistants
CREATE POLICY "Users can update own assistants" 
    ON public.assistants FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can delete their own assistants
CREATE POLICY "Users can delete own assistants" 
    ON public.assistants FOR DELETE 
    USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES: chat_history table
-- =====================================================
-- Users can view chat history for their assistants
CREATE POLICY "Users can view own chat history" 
    ON public.chat_history FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.assistants 
            WHERE assistants.assistant_id = chat_history.assistant_id 
            AND assistants.user_id = auth.uid()
        )
    );

-- Users can insert chat history for their assistants
CREATE POLICY "Users can insert own chat history" 
    ON public.chat_history FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.assistants 
            WHERE assistants.assistant_id = chat_history.assistant_id 
            AND assistants.user_id = auth.uid()
        )
    );

-- Users can delete chat history for their assistants
CREATE POLICY "Users can delete own chat history" 
    ON public.chat_history FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.assistants 
            WHERE assistants.assistant_id = chat_history.assistant_id 
            AND assistants.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user table
DROP TRIGGER IF EXISTS update_user_updated_at ON public.user;
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON public.user
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for assistants table
DROP TRIGGER IF EXISTS update_assistants_updated_at ON public.assistants;
CREATE TRIGGER update_assistants_updated_at
    BEFORE UPDATE ON public.assistants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user TO authenticated;
GRANT ALL ON public.assistants TO authenticated;
GRANT ALL ON public.chat_history TO authenticated;

-- Grant sequence permissions for auto-increment IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- OPTIONAL: Sample Data (Comment out if not needed)
-- =====================================================
-- Uncomment below to insert sample data for testing

/*
-- Sample user (replace with actual auth user ID)
INSERT INTO public.user (userid, name, email, "phoneNumber") 
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com', '1234567890')
ON CONFLICT (userid) DO NOTHING;

-- Sample assistant
INSERT INTO public.assistants (user_id, name, provider, model, first_message, system_prompt)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 
     'Customer Support Bot', 
     'groq', 
     'llama-3.1-8b-instant',
     'Hello! How can I help you today?',
     'You are a helpful customer support assistant.')
ON CONFLICT (assistant_id) DO NOTHING;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the schema was created correctly

-- Check tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check indexes
-- SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Make sure Supabase Auth is properly configured
-- 2. Update your .env file with correct SUPABASE_URL and SUPABASE_ANON_KEY
-- 3. The auth.users table is managed by Supabase automatically
-- 4. RLS policies ensure users can only access their own data
-- 5. All timestamps are in UTC (TIMESTAMPTZ)
-- =====================================================
