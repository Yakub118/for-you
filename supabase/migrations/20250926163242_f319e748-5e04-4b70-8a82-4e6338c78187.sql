-- Create table for storing proposal responses
CREATE TABLE public.proposal_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_slug TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  response_type TEXT NOT NULL CHECK (response_type IN ('yes', 'no', 'not_yet')),
  message TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for proposal responses
CREATE POLICY "Anyone can create responses" 
ON public.proposal_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view responses" 
ON public.proposal_responses 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_proposal_responses_updated_at
BEFORE UPDATE ON public.proposal_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for response photos
INSERT INTO storage.buckets (id, name, public) VALUES ('response-photos', 'response-photos', true);

-- Create storage policies for response photos
CREATE POLICY "Anyone can upload response photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'response-photos');

CREATE POLICY "Anyone can view response photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'response-photos');

CREATE POLICY "Anyone can update response photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'response-photos');