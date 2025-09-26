import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import FloatingBackground from "@/components/FloatingBackground";
import EnhancedConfetti from "@/components/EnhancedConfetti";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProposalResponse {
  id: string;
  proposal_slug: string;
  partner_name: string;
  response_type: 'yes' | 'no' | 'not_yet';
  message: string | null;
  photo_url: string | null;
  created_at: string;
}

interface ProposalData {
  proposerName: string;
  partnerName: string;
  loveMessage: string;
  theme: string;
  photos: Array<{ url: string; caption: string }>;
}

const ResponsePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [response, setResponse] = useState<ProposalResponse | null>(null);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (slug) {
      loadResponseData();
      loadProposalData();
    }
  }, [slug]);

  const loadResponseData = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from('proposal_responses')
        .select('*')
        .eq('proposal_slug', slug)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading response:', error);
        toast({
          title: "Error loading response",
          description: "Could not load the proposal response.",
          variant: "destructive",
        });
        return;
      }

      setResponse(data as ProposalResponse);
      
      if (data?.response_type === 'yes') {
        setTimeout(() => setShowConfetti(true), 1000);
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProposalData = () => {
    if (!slug) return;
    
    const data = localStorage.getItem(`proposal-${slug}`);
    if (data) {
      setProposalData(JSON.parse(data));
    }
  };

  const getResponseIcon = () => {
    switch (response?.response_type) {
      case 'yes':
        return '💖';
      case 'no':
        return '💙';
      case 'not_yet':
        return '💭';
      default:
        return '💌';
    }
  };

  const getResponseTitle = () => {
    switch (response?.response_type) {
      case 'yes':
        return `${response.partner_name} said YES!`;
      case 'no':
        return `${response.partner_name} needs time to think`;
      case 'not_yet':
        return `${response.partner_name} isn't ready yet`;
      default:
        return 'Response';
    }
  };

  const getResponseSubtitle = () => {
    switch (response?.response_type) {
      case 'yes':
        return "Love has won! 🌟";
      case 'no':
        return "Sometimes love takes time 💙";
      case 'not_yet':
        return "Patience makes love stronger 💭";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading response...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-romantic text-primary mb-4">No response yet 💕</h1>
          <p className="text-muted-foreground mb-6">
            {proposalData ? `${proposalData.partnerName} hasn't responded yet.` : "This proposal hasn't been answered yet."}
          </p>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-white/20 bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingBackground />
      
      <EnhancedConfetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Floating hearts animation for yes responses */}
      {response.response_type === 'yes' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: window.innerHeight + 100, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 0.8
              }}
              animate={{ 
                y: -100, 
                rotate: 360,
                x: Math.random() * window.innerWidth 
              }}
              transition={{ 
                duration: 4 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute text-2xl"
            >
              {['💖', '✨', '🌟', '💕', '💗'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl"
        >
          <Card className="glass border-white/30 shadow-glow-romantic p-8 text-center">
            <CardContent className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-6xl mb-4">{getResponseIcon()}</div>
                <h1 className="text-3xl md:text-4xl font-romantic text-primary mb-2">
                  {getResponseTitle()}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {getResponseSubtitle()}
                </p>
              </motion.div>

              {response.message && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 rounded-lg p-6 border border-white/20"
                >
                  <h3 className="text-lg font-romantic text-primary mb-3">
                    {response.partner_name}'s Message:
                  </h3>
                  <p className="text-foreground italic leading-relaxed">
                    "{response.message}"
                  </p>
                </motion.div>
              )}

              {response.photo_url && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <img
                      src={response.photo_url}
                      alt={`Photo from ${response.partner_name}`}
                      className="w-48 h-48 object-cover rounded-full border-4 border-white/30 shadow-glow-romantic"
                    />
                    <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                      💕
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-sm text-muted-foreground"
              >
                Responded on {new Date(response.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="pt-4"
              >
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-white/20 bg-white/10 hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Proposal
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResponsePage;