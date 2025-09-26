import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Copy, Eye, Share2, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getThemeById, getDefaultTheme } from '@/types/themes';
import { ThemeProvider } from './ThemeProvider';
import EnhancedFloatingBackground from './EnhancedFloatingBackground';

interface ProposalSuccessProps {
  slug: string;
  proposalData: {
    proposerName: string;
    partnerName: string;
    loveMessage: string;
    theme: string;
    photos: any[];
  };
}

const ProposalSuccess: React.FC<ProposalSuccessProps> = ({ slug, proposalData }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const shareableUrl = `${window.location.origin}/love/${slug}`;
  const theme = getThemeById(proposalData.theme) || getDefaultTheme();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast({
        title: "Link copied! 💕",
        description: "Your romantic proposal link is ready to share",
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy failed 😔",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    // Open in new tab so they can see exactly what their partner will see
    window.open(`/love/${slug}`, '_blank');
  };

  const handleBackToBuilder = () => {
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen relative overflow-hidden">
        <EnhancedFloatingBackground theme={theme} />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-romantic rounded-full shadow-glow-romantic mb-6"
              >
                <Sparkles className="w-10 h-10 text-white animate-heart-pulse" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-romantic text-primary mb-4">
                ✨ Your Love Microsite is Ready! 💖
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Your romantic proposal for {proposalData.partnerName} has been created with the beautiful {theme.name} theme
              </p>
            </div>

            {/* Success Card */}
            <Card className="glass border-white/20 shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl font-romantic text-primary text-center flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6" />
                  Share Your Love Story
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Sharable Link Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sharable Proposal Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareableUrl}
                      readOnly
                      className="glass border-white/30 bg-white/10"
                    />
                    <Button
                      onClick={handleCopyLink}
                      variant={copied ? "secondary" : "romantic"}
                      className="px-4"
                    >
                      {copied ? (
                        <>
                          <Heart className="w-4 h-4 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Send this link to {proposalData.partnerName} to share your romantic proposal
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handlePreview}
                      variant="dreamy"
                      size="lg"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Proposal
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `${proposalData.proposerName}'s Love Proposal for ${proposalData.partnerName}`,
                            text: "I have something special to share with you... 💕",
                            url: shareableUrl,
                          });
                        } else {
                          handleCopyLink();
                        }
                      }}
                      variant="romantic"
                      size="lg"
                      className="w-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </Button>
                  </motion.div>
                </div>

                {/* Back to Builder */}
                <div className="pt-4 border-t border-white/20">
                  <Button
                    onClick={handleBackToBuilder}
                    variant="ghost"
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Create Another Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <div className="glass rounded-lg p-6 border-white/20">
                <h3 className="text-lg font-medium text-primary mb-3">💡 Pro Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Click "Preview Proposal" to see exactly what {proposalData.partnerName} will experience</p>
                  <p>• The proposal will include interactive questions, your photos, and a magical reveal</p>
                  <p>• When they respond, you'll see their reply in your builder dashboard</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProposalSuccess;