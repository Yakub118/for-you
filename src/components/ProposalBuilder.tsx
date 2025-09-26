import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Sparkles, Camera, Wand2, Gift, Bell, Eye, Loader2 } from "lucide-react";
import FloatingBackground from "./FloatingBackground";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-romantic.jpg";
import PhotoUpload, { Photo } from "./PhotoUpload";
import { supabase } from "@/integrations/supabase/client";
import ThemeSelector from "./ThemeSelector";
import { ROMANTIC_THEMES } from "@/types/themes";
import ProposalSuccess from "./ProposalSuccess";
import CustomQuestionBuilder, { CustomQuestion } from "./CustomQuestionBuilder";
import { useIsMobile } from "@/hooks/use-mobile";
import PreviewModal from "./PreviewModal";
import LoveLetterDisplay from "./LoveLetterDisplay";
import ConfettiOptionsSelector, { ConfettiStyle } from "./ConfettiOptionsSelector";

interface ProposalResponse {
  id: string;
  proposal_slug: string;
  partner_name: string;
  response_type: 'yes' | 'no' | 'not_yet';
  message: string | null;
  photo_url: string | null;
  created_at: string;
}

// Photo interface moved to PhotoUpload.tsx

interface ProposalData {
  proposerName: string;
  partnerName: string;
  loveMessage: string;
  theme: string;
  photos: Photo[];
  customQuestions?: CustomQuestion[];
  // New enhanced features
  loveLetter?: string;
  timelineMemories?: Array<{
    id: string;
    title: string;
    date: string;
    photo: string;
    description: string;
  }>;
  confettiStyle?: ConfettiStyle;
  customEndingMessage?: string;
  countdownDate?: string;
}

const ProposalBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [responses, setResponses] = useState<ProposalResponse[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successSlug, setSuccessSlug] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ProposalData>({
    proposerName: "",
    partnerName: "",
    loveMessage: "",
    theme: "romantic-garden",
    photos: [],
    customQuestions: [],
    confettiStyle: "hearts"
  });

  // Check for responses on component mount
  useEffect(() => {
    checkForResponses();
  }, []);

  const checkForResponses = async () => {
    try {
      // Get all proposal responses directly from database
      const { data, error } = await supabase
        .from('proposal_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error checking responses:', error);
        return;
      }

      setResponses((data || []) as ProposalResponse[]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleViewResponse = (slug: string) => {
    navigate(`/response/${slug}`);
  };

  // Use themes from the new theme system
  const themes = ROMANTIC_THEMES;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.proposerName || !formData.partnerName || !formData.loveMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the required fields to create your romantic proposal.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Generate unique slug
    const slug = `${formData.proposerName.toLowerCase().replace(/\s+/g, "-")}-${formData.partnerName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    
    try {
      // Upload photos to Supabase storage
      const photoData = [];
      
      for (const photo of formData.photos) {
        try {
          const fileExt = photo.file.name.split('.').pop();
          const fileName = `proposals/${slug}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('response-photos')
            .upload(fileName, photo.file);
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            // Fallback to blob URL for now
            photoData.push({
              url: photo.url,
              caption: photo.caption,
              storageUrl: photo.url
            });
            continue;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('response-photos')
            .getPublicUrl(fileName);
          
          photoData.push({
            url: publicUrl,
            caption: photo.caption,
            storageUrl: publicUrl
          });
        } catch (error) {
          console.error('Error uploading photo:', error);
          // Fallback to blob URL
          photoData.push({
            url: photo.url,
            caption: photo.caption,
            storageUrl: photo.url
          });
        }
      }
      
      const proposalToStore = {
        ...formData,
        photos: photoData
      };
      
      // Store proposal data in database for permanent sharing
      const { error: dbError } = await supabase
        .from('proposals')
        .insert([{
          slug,
          proposer_name: formData.proposerName,
          partner_name: formData.partnerName,
          love_message: formData.loveMessage,
          theme: formData.theme,
          photos: JSON.parse(JSON.stringify(photoData)),
          questions: JSON.parse(JSON.stringify(formData.customQuestions || []))
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        // Fallback to localStorage if database fails
        localStorage.setItem(`proposal-${slug}`, JSON.stringify(proposalToStore));
      }
      
      toast({
        title: "Proposal Created! 💖",
        description: "Your romantic microsite is ready to share with your love.",
      });

      // Show success page instead of navigating directly
      setSuccessSlug(slug);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Something went wrong 😔",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof ProposalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreview = () => {
    if (!formData.proposerName || !formData.partnerName || !formData.loveMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields before previewing.",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
  };

  const handlePhotosChange = (photos: Photo[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleCustomQuestionsChange = (customQuestions: CustomQuestion[]) => {
    setFormData(prev => ({ ...prev, customQuestions }));
  };

  const handleConfettiStyleChange = (confettiStyle: ConfettiStyle) => {
    setFormData(prev => ({ ...prev, confettiStyle }));
  };

  // Show success page if proposal was created
  if (showSuccess && successSlug) {
    return (
      <ProposalSuccess
        slug={successSlug}
        proposalData={formData}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-dreamy opacity-80" />
      
      <FloatingBackground />
      
      <div className={`relative z-10 container mx-auto ${isMobile ? 'px-2' : 'px-4'} py-8`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-romantic rounded-full shadow-glow-romantic mb-6"
          >
            <Heart className="w-10 h-10 text-white animate-heart-pulse" />
          </motion.div>
          
          <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-7xl'} font-romantic text-primary mb-4 animate-fade-in px-4 text-center`}>
            Create Your Own Love Microsite 💌
          </h1>
          
          <p className={`${isMobile ? 'text-lg px-4' : 'text-xl max-w-2xl mx-auto'} text-muted-foreground text-center`}>
            Design a magical, personalized proposal experience that will make their heart skip a beat
          </p>
        </motion.div>

        {/* Response Notifications */}
        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8 space-y-4"
          >
            {responses.map((response) => (
              <Alert key={response.id} className="glass border-primary/30 bg-gradient-romantic/20">
                <Gift className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-medium">
                      ✨ {response.partner_name} has replied to your proposal! 
                      {response.response_type === 'yes' && ' 💖 They said YES!'}
                      {response.response_type === 'no' && ' 💙 They need time to think'}
                      {response.response_type === 'not_yet' && ' 💭 They aren\'t ready yet'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewResponse(response.proposal_slug)}
                    className="ml-4 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    View Reply
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={`max-w-2xl mx-auto ${isMobile ? 'px-2' : ''}`}
        >
          <Card className="glass border-white/20 shadow-soft">
            <CardHeader className="text-center">
              <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-romantic text-primary flex items-center justify-center gap-2 flex-wrap`}>
                <Wand2 className="w-6 h-6" />
                Proposal Builder
              </CardTitle>
              <CardDescription className={isMobile ? 'text-sm px-2' : ''}>
                Fill in the details to create your personalized romantic proposal
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposer" className="text-sm font-medium">Your Name</Label>
                    <Input
                      id="proposer"
                      placeholder="Your name"
                      value={formData.proposerName}
                      onChange={(e) => handleInputChange("proposerName", e.target.value)}
                      className="glass border-white/30"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="partner" className="text-sm font-medium">Their Name</Label>
                    <Input
                      id="partner"
                      placeholder="Their name"
                      value={formData.partnerName}
                      onChange={(e) => handleInputChange("partnerName", e.target.value)}
                      className="glass border-white/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">Your Love Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your heartfelt message here... Tell them how much they mean to you"
                    value={formData.loveMessage}
                    onChange={(e) => handleInputChange("loveMessage", e.target.value)}
                    className="glass border-white/30 min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loveLetter" className="text-sm font-medium">
                    💌 Love Letter (Optional)
                  </Label>
                  <Textarea
                    id="loveLetter"
                    placeholder="Write a personal love letter that will appear with handwriting animation..."
                    value={formData.loveLetter || ""}
                    onChange={(e) => handleInputChange("loveLetter", e.target.value)}
                    className="glass border-white/30 min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will display with beautiful handwriting animation before your main message
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endingMessage" className="text-sm font-medium">
                    💖 Custom Ending Message (Optional)
                  </Label>
                  <Input
                    id="endingMessage"
                    placeholder="I can't wait to spend every day with you 💖"
                    value={formData.customEndingMessage || ""}
                    onChange={(e) => handleInputChange("customEndingMessage", e.target.value)}
                    className="glass border-white/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    This message appears after they say "Yes Forever ✨"
                  </p>
                </div>

                <ThemeSelector
                  selectedTheme={formData.theme}
                  onThemeChange={(themeId) => handleInputChange("theme", themeId)}
                />

                <PhotoUpload
                  photos={formData.photos}
                  onPhotosChange={handlePhotosChange}
                  maxPhotos={10}
                />

                <CustomQuestionBuilder
                  questions={formData.customQuestions || []}
                  onQuestionsChange={handleCustomQuestionsChange}
                />

                <ConfettiOptionsSelector
                  selectedStyle={formData.confettiStyle || 'hearts'}
                  onStyleChange={handleConfettiStyleChange}
                />

                {/* Action Buttons - separated from form submission */}
                <div className="space-y-4 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size={isMobile ? "default" : "lg"}
                        className={`w-full ${isMobile ? 'text-base py-4' : 'text-lg py-6'} border-primary/30 text-primary hover:bg-primary/10`}
                        onClick={handlePreview}
                        disabled={isGenerating}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Preview Microsite
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="romantic"
                        size={isMobile ? "default" : "lg"}
                        className={`w-full ${isMobile ? 'text-base py-4' : 'text-lg py-6'}`}
                        onClick={() => handleSubmit()}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Your Magical Microsite...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate My Proposal Website ❤️
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    💡 Tip: Use Preview to see how your microsite will look before generating the final shareable link
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        proposalData={formData}
        onCreateProposal={() => handleSubmit()}
      />
    </div>
  );
};

export default ProposalBuilder;