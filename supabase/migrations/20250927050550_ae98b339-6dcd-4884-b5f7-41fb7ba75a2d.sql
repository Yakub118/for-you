-- Add missing fields to proposals table for all planned features
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS love_letter TEXT,
ADD COLUMN IF NOT EXISTS timeline_memories JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS confetti_style TEXT DEFAULT 'hearts',
ADD COLUMN IF NOT EXISTS custom_ending_message TEXT,
ADD COLUMN IF NOT EXISTS countdown_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS voice_note_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS ar_enabled BOOLEAN DEFAULT false;