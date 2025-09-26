-- Create proposals table for persistent microsite storage
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  proposer_name TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  love_message TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'romantic',
  photos JSONB DEFAULT '[]'::jsonb,
  questions JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Create policies - proposals should be publicly readable via slug
CREATE POLICY "Anyone can view proposals by slug" 
ON public.proposals 
FOR SELECT 
USING (true);

-- Only allow inserts (no updates/deletes for now)
CREATE POLICY "Anyone can create proposals" 
ON public.proposals 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on slug for fast lookups
CREATE INDEX idx_proposals_slug ON public.proposals(slug);

-- Create index on expires_at for cleanup queries
CREATE INDEX idx_proposals_expires_at ON public.proposals(expires_at) WHERE expires_at IS NOT NULL;