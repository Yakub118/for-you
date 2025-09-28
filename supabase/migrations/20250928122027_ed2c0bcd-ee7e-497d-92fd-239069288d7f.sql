-- Add expiry functionality to proposals table
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone DEFAULT (now() + interval '24 hours'),
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- Update trigger to set proper expiry based on plan type
CREATE OR REPLACE FUNCTION public.set_proposal_expiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Set expiry based on plan type
  IF NEW.plan_type = 'freemium' THEN
    NEW.expires_at = now() + interval '24 hours';
    NEW.view_limit = 50;
    NEW.is_premium = false;
  ELSIF NEW.plan_type = 'weekly' THEN
    NEW.expires_at = now() + interval '7 days';
    NEW.view_limit = NULL; -- No view limit for premium plans
    NEW.is_premium = true;
  ELSIF NEW.plan_type = 'deploy' THEN
    NEW.expires_at = NULL; -- No expiry for deploy plan
    NEW.view_limit = NULL; -- No view limit for deploy plan
    NEW.is_premium = true;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create cleanup function for expired proposals
CREATE OR REPLACE FUNCTION public.cleanup_expired_proposals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete expired free proposals
  DELETE FROM public.proposals 
  WHERE expires_at < now() 
  AND is_premium = false;
  
  -- Also delete associated responses
  DELETE FROM public.proposal_responses 
  WHERE proposal_slug NOT IN (
    SELECT slug FROM public.proposals
  );
END;
$function$;