import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting cleanup of expired proposals...');

    // Get expired proposals first to also clean up their files
    const { data: expiredProposals, error: fetchError } = await supabase
      .from('proposals')
      .select('slug, photos')
      .lt('expires_at', new Date().toISOString())
      .eq('is_premium', false);

    if (fetchError) {
      console.error('Error fetching expired proposals:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiredProposals?.length || 0} expired proposals`);

    // Delete files from storage for expired proposals
    if (expiredProposals && expiredProposals.length > 0) {
      for (const proposal of expiredProposals) {
        try {
          // Delete proposal photos
          if (proposal.photos && Array.isArray(proposal.photos)) {
            const filesToDelete = proposal.photos
              .map((photo: any) => photo.storageUrl)
              .filter((url: string) => url && url.includes('response-photos'))
              .map((url: string) => {
                const parts = url.split('/');
                return parts.slice(-2).join('/'); // Get folder/filename
              });

            if (filesToDelete.length > 0) {
              await supabase.storage
                .from('response-photos')
                .remove(filesToDelete);
              console.log(`Deleted ${filesToDelete.length} files for proposal ${proposal.slug}`);
            }
          }
        } catch (error) {
          console.error(`Error deleting files for proposal ${proposal.slug}:`, error);
        }
      }
    }

    // Call the cleanup function
    const { error: cleanupError } = await supabase.rpc('cleanup_expired_proposals');

    if (cleanupError) {
      console.error('Cleanup function error:', cleanupError);
      throw cleanupError;
    }

    console.log('Cleanup completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        cleaned: expiredProposals?.length || 0,
        message: 'Expired proposals cleaned up successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});