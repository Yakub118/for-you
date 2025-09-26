import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, X, Smartphone, Monitor, ExternalLink } from "lucide-react";
import { getThemeById, getDefaultTheme } from "@/types/themes";
import { ThemeProvider } from "./ThemeProvider";
import EnhancedFloatingBackground from "./EnhancedFloatingBackground";
import { Card, CardContent } from "@/components/ui/card";

interface ProposalData {
  proposerName: string;
  partnerName: string;
  loveMessage: string;
  theme: string;
  photos: any[];
  loveLetter?: string;
  timelineMemories?: any[];
  confettiStyle?: string;
  customEndingMessage?: string;
  countdownDate?: string;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalData: ProposalData;
  onCreateProposal: () => void;
}

const PreviewModal = ({ isOpen, onClose, proposalData, onCreateProposal }: PreviewModalProps) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const theme = getThemeById(proposalData.theme) || getDefaultTheme();

  const mockSteps = [
    {
      title: "Welcome Screen",
      description: "Romantic greeting with partner's name",
      preview: `${proposalData.partnerName}, I have something important for you... 💖`
    },
    ...(proposalData.loveLetter ? [
      {
        title: "Love Letter",
        description: "Handwritten-style love letter animation",
        preview: `${proposalData.loveLetter.substring(0, 80)}...`
      }
    ] : []),
    ...(proposalData.timelineMemories && proposalData.timelineMemories.length > 0 ? [
      {
        title: "Memory Timeline",
        description: `${proposalData.timelineMemories.length} special moments together`,
        preview: "Our beautiful journey together ✨"
      }
    ] : []),
    {
      title: "Interactive Questions",
      description: "Playful yes/no questions building anticipation",
      preview: "Do you love me? Yes, with all my heart! 💖"
    },
    {
      title: "Love Message",
      description: "Your heartfelt proposal message",
      preview: `"${proposalData.loveMessage.substring(0, 100)}..."`
    },
    ...(proposalData.photos && proposalData.photos.length > 0 ? [
      {
        title: "Memory Photos",
        description: `${proposalData.photos.length} beautiful memories displayed`,
        preview: "Photo carousel with captions"
      }
    ] : []),
    {
      title: "The Big Question",
      description: "The magical proposal moment",
      preview: `Will you be mine forever, ${proposalData.partnerName}? 💍`
    },
    {
      title: "Celebration",
      description: `${proposalData.confettiStyle || 'Hearts'} confetti animation`,
      preview: "Romantic confetti celebration 🎉"
    },
    ...(proposalData.customEndingMessage ? [
      {
        title: "Personal Message",
        description: "Your custom ending message",
        preview: proposalData.customEndingMessage
      }
    ] : [])
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <ThemeProvider theme={theme}>
          <div className="relative h-full">
            <EnhancedFloatingBackground theme={theme} />
            
            <div className="relative z-10 h-full flex flex-col">
              <DialogHeader className="glass border-b border-white/20 p-6 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <DialogTitle className="text-2xl font-romantic text-primary flex items-center gap-2">
                      <Eye className="w-6 h-6" />
                      Preview Your Romantic Microsite
                    </DialogTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {theme.name}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('desktop')}
                      className="text-xs"
                    >
                      <Monitor className="w-4 h-4 mr-1" />
                      Desktop
                    </Button>
                    <Button
                      variant={viewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('mobile')}
                      className="text-xs"
                    >
                      <Smartphone className="w-4 h-4 mr-1" />
                      Mobile
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Preview Flow */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-romantic text-primary mb-4">
                      Experience Flow Preview
                    </h3>
                    
                    <div className="space-y-3 max-h-[600px] overflow-auto">
                      {mockSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="glass border-white/20 hover:border-primary/30 transition-all duration-300">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-primary mb-1">
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {step.description}
                                  </p>
                                  <div className="text-sm text-foreground bg-background/30 rounded p-2 italic">
                                    {step.preview.length > 100 
                                      ? `${step.preview.substring(0, 100)}...` 
                                      : step.preview
                                    }
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Mobile/Desktop Preview */}
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className={`relative ${
                        viewMode === 'mobile' 
                          ? 'w-80 h-[600px]' 
                          : 'w-full max-w-2xl h-[500px]'
                      }`}
                    >
                      <div className={`glass border-white/30 shadow-glow-romantic h-full ${
                        viewMode === 'mobile' 
                          ? 'rounded-3xl p-2' 
                          : 'rounded-lg p-4'
                      }`}>
                        <div className="h-full bg-gradient-dreamy rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                          {/* Background decoration */}
                          <div className="absolute inset-0 opacity-10">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ 
                                  y: [0, -20, 0],
                                  x: [0, 10, 0],
                                  rotate: [0, 10, 0]
                                }}
                                transition={{ 
                                  duration: 3,
                                  delay: i * 0.5,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="absolute text-4xl"
                                style={{
                                  left: `${Math.random() * 80 + 10}%`,
                                  top: `${Math.random() * 80 + 10}%`
                                }}
                              >
                                {['💖', '✨', '🌹', '💍', '💕', '🎉', '⭐', '🌸'][i]}
                              </motion.div>
                            ))}
                          </div>

                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-6xl mb-4 relative z-10"
                          >
                            💖
                          </motion.div>
                          
                          <h2 className={`font-romantic text-primary mb-4 relative z-10 ${
                            viewMode === 'mobile' ? 'text-xl' : 'text-3xl'
                          }`}>
                            {proposalData.partnerName}, I have something important for you...
                          </h2>
                          
                          <p className={`text-muted-foreground mb-6 relative z-10 ${
                            viewMode === 'mobile' ? 'text-sm' : 'text-base'
                          }`}>
                            This is a special moment just for us 💖
                          </p>
                          
                          <Button
                            variant="heart"
                            className={`relative z-10 ${
                              viewMode === 'mobile' ? 'text-lg px-6 py-3' : 'text-xl px-8 py-4'
                            }`}
                          >
                            Start 💖
                          </Button>
                        </div>
                      </div>
                    </motion.div>

                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      This is how your proposal will look on {viewMode} devices
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass border-t border-white/20 p-6 shrink-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Ready to create your romantic masterpiece?
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onClose}>
                      <X className="w-4 h-4 mr-2" />
                      Close Preview
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="romantic"
                        onClick={() => {
                          onCreateProposal();
                          onClose();
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Create This Proposal! 💖
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;