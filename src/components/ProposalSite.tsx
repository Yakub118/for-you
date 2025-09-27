import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles, Share2, Volume2, VolumeX, Camera, Upload, Play, Pause } from "lucide-react";
import { getThemeById, getDefaultTheme } from "@/types/themes";
import { ThemeProvider } from "./ThemeProvider";
import EnhancedFloatingBackground from "./EnhancedFloatingBackground";
import MemoryCarousel from "./MemoryCarousel";
import EnhancedConfetti from "./EnhancedConfetti";
import EnhancedBalloons from "./EnhancedBalloons";
import LoveLetterDisplay from "./LoveLetterDisplay";
import TimelineDisplay from "./TimelineDisplay";
import CountdownTimer from "./CountdownTimer";
import QRCodeGenerator from "./QRCodeGenerator";
import { useToast } from "@/hooks/use-toast";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { supabase } from "@/integrations/supabase/client";
import { CustomQuestion } from "./CustomQuestionBuilder";
import { useIsMobile } from "@/hooks/use-mobile";

interface Photo {
  url: string;
  caption: string;
}

interface ProposalData {
  proposerName: string;
  partnerName: string;
  loveMessage: string;
  theme: string;
  photos: Photo[];
  customQuestions?: CustomQuestion[];
  loveLetter?: string;
  timelineMemories?: Array<{
    id: string;
    title: string;
    date: string;
    photo: string;
    description: string;
  }>;
  confettiStyle?: string;
  customEndingMessage?: string;
  countdownDate?: string;
  voiceNoteUrl?: string;
  videoUrl?: string;
  arEnabled?: boolean;
}

type ProposalStep = "countdown" | "love-letter" | "timeline" | "intro" | "question" | "balloons" | "transition" | "final" | "response-collection" | "response-submitted" | "celebration" | "custom-ending" | "qr-code";

const ProposalSite = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { isPlaying: musicPlaying, toggleMusic } = useBackgroundMusic();
  const isMobile = useIsMobile();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [currentStep, setCurrentStep] = useState<ProposalStep>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonScale, setNoButtonScale] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responsePhoto, setResponsePhoto] = useState<File | null>(null);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentUrl] = useState(typeof window !== 'undefined' ? window.location.href : '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load proposal data from database
  useEffect(() => {
    if (slug) {
      loadProposalData();
    }
  }, [slug]);

  const loadProposalData = async () => {
    if (!slug) return;
    
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error loading proposal:', error);
        // Fallback to localStorage for backward compatibility
        const localData = localStorage.getItem(`proposal-${slug}`);
        if (localData) {
          setProposalData(JSON.parse(localData));
        }
        return;
      }

      if (data) {
        // Convert database format to expected format
        const proposalData: ProposalData = {
          proposerName: data.proposer_name,
          partnerName: data.partner_name,
          loveMessage: data.love_message,
          theme: data.theme,
          photos: (Array.isArray(data.photos) ? data.photos : []) as unknown as Photo[],
          customQuestions: (Array.isArray(data.questions) ? data.questions : []) as unknown as CustomQuestion[],
          loveLetter: data.love_letter || undefined,
          timelineMemories: (Array.isArray(data.timeline_memories) ? data.timeline_memories : []) as unknown as Array<{
            id: string;
            title: string;
            date: string;
            photo: string;
            description: string;
          }>,
          confettiStyle: data.confetti_style || 'hearts',
          customEndingMessage: data.custom_ending_message || undefined,
          countdownDate: data.countdown_date || undefined,
          voiceNoteUrl: data.voice_note_url || undefined,
          videoUrl: data.video_url || undefined,
          arEnabled: data.ar_enabled || false
        };
        setProposalData(proposalData);
        
        // Check if countdown is needed
        if (data.countdown_date) {
          const countdownTime = new Date(data.countdown_date).getTime();
          const now = new Date().getTime();
          if (now < countdownTime) {
            setCurrentStep("countdown");
            return;
          }
        }
        
        // Start with love letter if available, otherwise intro
        if (data.love_letter) {
          setCurrentStep("love-letter");
        } else if (data.timeline_memories && Array.isArray(data.timeline_memories) && data.timeline_memories.length > 0) {
          setCurrentStep("timeline");
        } else {
          setCurrentStep("intro");
        }
      } else {
        // Fallback to localStorage for backward compatibility
        const localData = localStorage.getItem(`proposal-${slug}`);
        if (localData) {
          setProposalData(JSON.parse(localData));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to localStorage
      const localData = localStorage.getItem(`proposal-${slug}`);
      if (localData) {
        setProposalData(JSON.parse(localData));
      }
    }
  };

  // Typing animation effect
  const typeText = (text: string, callback?: () => void) => {
    setIsTyping(true);
    setCurrentText("");
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setCurrentText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) setTimeout(callback, 1000);
      }
    }, 50);
  };


  // Get default questions if custom ones are not provided
  const getQuestions = (): CustomQuestion[] => {
    if (proposalData?.customQuestions && proposalData.customQuestions.length > 0) {
      return proposalData.customQuestions.filter(q => q.question.trim() !== "");
    }
    
    // Default questions
    return [
      {
        id: "1",
        question: "Do you like surprises?",
        yesButton: "Yes! ✨",
        noButton: "Not really... 😅"
      },
      {
        id: "2", 
        question: "Do you like how I always think about you?",
        yesButton: "Yes, always! 💕",
        noButton: "Maybe too much? 🙈"
      },
      {
        id: "3",
        question: "Do you love me?",
        yesButton: "Yes, with all my heart! 💖",
        noButton: "I'm not sure... 🤔"
      }
    ];
  };

  const questions = getQuestions();

  const handleYesClick = () => {
    if (currentStep === "question") {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        // Reset no button position for next question
        setNoButtonPosition({ x: 0, y: 0 });
        setNoButtonScale(1);
      } else {
        setCurrentStep("balloons");
      }
    } else if (currentStep === "final") {
      setShowConfetti(true);
      // Show custom ending message if available, otherwise go to response collection
      if (proposalData?.customEndingMessage) {
        setCurrentStep("custom-ending");
      } else {
        setCurrentStep("response-collection");
      }
    }
  };

  const handleNoClick = () => {
    const newX = (Math.random() - 0.5) * 200;
    const newY = (Math.random() - 0.5) * 200;
    setNoButtonPosition({ x: newX, y: newY });
    setNoButtonScale(prev => Math.max(0.3, prev - 0.1));
    
    // Show playful message
    const playfulMessages = [
      "Come on, try again! 😊",
      "That's not the right answer! 💕",
      "I know you don't mean that! 😉",
      "The button is getting shy! 🙈"
    ];
    toast({
      title: playfulMessages[Math.floor(Math.random() * playfulMessages.length)],
      duration: 2000,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setResponsePhoto(file);
    }
  };

  const handleResponseSubmit = async (responseType: 'yes' | 'no' | 'not_yet') => {
    if (!proposalData || !slug) return;
    
    setIsSubmittingResponse(true);
    
    try {
      let photoUrl = null;
      
      // Upload photo if provided
      if (responsePhoto) {
        const fileExt = responsePhoto.name.split('.').pop();
        const fileName = `${slug}-response-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('response-photos')
          .upload(fileName, responsePhoto);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('response-photos')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }
      
      // Save response to database
      const { error } = await supabase
        .from('proposal_responses')
        .insert({
          proposal_slug: slug,
          partner_name: proposalData.partnerName,
          response_type: responseType,
          message: responseMessage.trim() || null,
          photo_url: photoUrl
        });
      
      if (error) throw error;
      
      setCurrentStep("response-submitted");
      
      toast({
        title: responseType === 'yes' ? "Response sent! 💕" : "Thank you for your honesty 💭",
        description: "Your heartfelt reply has been delivered.",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Something went wrong 😔",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const toggleAudioMusic = () => {
    setAudioEnabled(!audioEnabled);
    toggleMusic();
    
    toast({
      title: audioEnabled ? "Music paused 🎵" : "Music playing 🎶",
      description: "Romantic background music " + (audioEnabled ? "paused" : "started"),
      duration: 2000,
    });
  };

  const toggleAudio = () => {
      if (audioRef.current) {
        if (isAudioPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsAudioPlaying(!isAudioPlaying);
      }
    };

    const handleCountdownComplete = () => {
      if (proposalData?.loveLetter) {
        setCurrentStep("love-letter");
      } else if (proposalData?.timelineMemories && proposalData.timelineMemories.length > 0) {
        setCurrentStep("timeline");
      } else {
        setCurrentStep("intro");
      }
    };

    const handleLoveLetterComplete = () => {
      if (proposalData?.timelineMemories && proposalData.timelineMemories.length > 0) {
        setCurrentStep("timeline");
      } else {
        setCurrentStep("intro");
      }
    };

    const handleTimelineComplete = () => {
      setCurrentStep("intro");
    };

  const theme = proposalData ? (getThemeById(proposalData.theme) || getDefaultTheme()) : getDefaultTheme();

  if (!proposalData) {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen relative overflow-hidden">
          <EnhancedFloatingBackground theme={theme} />
          <div className="relative z-10 min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-romantic text-primary mb-4">Proposal not found 💔</h1>
              <p className="text-muted-foreground">This romantic link might be broken or expired.</p>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "countdown":
        return proposalData?.countdownDate ? (
          <CountdownTimer
            targetDate={new Date(proposalData.countdownDate)}
            partnerName={proposalData.partnerName}
            onCountdownComplete={handleCountdownComplete}
          />
        ) : null;

      case "love-letter":
        return proposalData?.loveLetter ? (
          <LoveLetterDisplay
            letter={proposalData.loveLetter}
            authorName={proposalData.proposerName}
            onComplete={handleLoveLetterComplete}
          />
        ) : null;

      case "timeline":
        return proposalData?.timelineMemories && proposalData.timelineMemories.length > 0 ? (
          <TimelineDisplay
            memories={proposalData.timelineMemories.map(memory => ({
              id: memory.id,
              title: memory.title,
              date: memory.date,
              photo: memory.photo,
              description: memory.description
            }))}
            onComplete={handleTimelineComplete}
          />
        ) : null;
      case "intro":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-romantic text-primary mb-6 px-4 text-center`}>
                {proposalData.partnerName}, I have something important for you...
              </h1>
              <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-muted-foreground mb-8 max-w-2xl mx-auto px-4 text-center`}>
                This is a special moment just for us 💖
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="heart"
                size="lg"
                onClick={() => {
                  setCurrentStep("question");
                  setCurrentQuestionIndex(0);
                }}
                className="text-2xl px-12 py-6 shadow-glow-romantic"
              >
                Start 💖
              </Button>
            </motion.div>
          </motion.div>
        );

      case "question":
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <motion.div
            key={currentQuestionIndex} // Force re-render for smooth transitions
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h2 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-5xl'} font-romantic text-primary mb-8 px-4 text-center`}>
              {currentQuestion.question}
            </h2>
            
            <div className="flex flex-col gap-4 justify-center items-center px-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="romantic"
                  size={isMobile ? "default" : "lg"}
                  onClick={handleYesClick}
                  className={`${isMobile ? 'text-lg px-6 py-3' : 'text-xl px-8 py-4'} shadow-glow-romantic w-full max-w-xs`}
                >
                  {currentQuestion.yesButton}
                </Button>
              </motion.div>
              
              <motion.div
                animate={{ x: noButtonPosition.x, y: noButtonPosition.y, scale: noButtonScale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Button
                  variant="playful"
                  size={isMobile ? "default" : "lg"}
                  onClick={handleNoClick}
                  className={`${isMobile ? 'text-lg px-6 py-3' : 'text-xl px-8 py-4'} w-full max-w-xs`}
                  style={{ fontSize: `${noButtonScale * (isMobile ? 0.875 : 1)}rem` }}
                >
                  {noButtonScale > 0.5 ? currentQuestion.noButton : "..."}
                </Button>
              </motion.div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex 
                      ? 'bg-primary scale-125' 
                      : index < currentQuestionIndex 
                        ? 'bg-primary/60' 
                        : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        );

      case "balloons":
        return (
          <EnhancedBalloons
            message={`I LOVE YOU ${proposalData.partnerName.toUpperCase()}! 💕`}
            onComplete={() => {
              setTimeout(() => setCurrentStep("transition"), 1000);
            }}
          />
        );

      case "transition":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8"
          >
            {/* Falling petals animation */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
                  animate={{ 
                    y: window.innerHeight + 100, 
                    rotate: 360,
                    x: Math.random() * window.innerWidth 
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute text-2xl opacity-80"
                >
                  🌹
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-5xl'} font-romantic text-primary mb-8 relative z-10 px-4 text-center`}>
                This is what I wanted to say for so long...
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Button
                variant="romantic"
                size="lg"
                onClick={() => setCurrentStep("final")}
                className="text-xl px-8 py-4 relative z-10"
              >
                Tell me... 💖
              </Button>
            </motion.div>
          </motion.div>
        );

      case "final":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <Card className="glass border-white/30 shadow-glow-romantic p-8">
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-romantic text-primary mb-6 px-4 text-center`}>
                    Will you be mine forever, {proposalData.partnerName}? 💍
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="prose prose-lg mx-auto text-center"
                >
                  <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground leading-relaxed italic px-4`}>
                    "{proposalData.loveMessage}"
                  </p>
                  <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mt-4`}>
                    - {proposalData.proposerName} 💕
                  </p>
                </motion.div>

                {/* Voice Note Player */}
                {proposalData.voiceNoteUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex justify-center mb-6"
                  >
                    <audio ref={audioRef} src={proposalData.voiceNoteUrl} />
                    <Button
                      variant="outline"
                      onClick={toggleAudio}
                      className="glass border-primary/30 text-primary hover:bg-primary/10"
                    >
                      {isAudioPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isAudioPlaying ? 'Pause Voice Note' : 'Play Voice Note 🎵'}
                    </Button>
                  </motion.div>
                )}

                {/* Video Player */}
                {proposalData.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    className="mb-6 flex justify-center"
                  >
                    <div className="max-w-md w-full glass border-primary/30 rounded-lg overflow-hidden">
                      <video 
                        src={proposalData.videoUrl}
                        width="100%"
                        height="200px"
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Memory Photos Section */}
                {proposalData.photos && proposalData.photos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="pt-8"
                  >
                    <h3 className="text-2xl font-romantic text-primary mb-6 text-center">
                      Our Beautiful Memories Together ✨
                    </h3>
                    <MemoryCarousel photos={proposalData.photos} />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="pt-6 flex justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="heart"
                      size={isMobile ? "default" : "lg"}
                      onClick={handleYesClick}
                      className={`${isMobile ? 'text-lg px-8 py-4' : 'text-2xl px-12 py-6'} shadow-glow-romantic`}
                    >
                      Yes Forever ✨
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "custom-ending":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <Card className="glass border-white/30 shadow-glow-romantic p-8">
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-romantic text-primary mb-6 px-4 text-center`}>
                    💖 She said YES! 💖
                  </h2>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="prose prose-lg mx-auto text-center"
                  >
                    <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-foreground leading-relaxed italic px-4`}>
                      "{proposalData?.customEndingMessage}"
                    </p>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mt-4`}>
                      - {proposalData?.proposerName} 💕
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex justify-center"
                >
                  <Button
                    variant="romantic"
                    size="lg"
                    onClick={() => setCurrentStep("qr-code")}
                    className="text-xl px-8 py-4"
                  >
                    Share Our Love Story 💖
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "qr-code":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-romantic text-primary mb-8 px-4 text-center`}>
              Share Your Love Story 💌
            </h2>
            
            <QRCodeGenerator 
              url={currentUrl} 
              proposalData={{
                proposerName: proposalData?.proposerName || '',
                partnerName: proposalData?.partnerName || ''
              }}
            />

            {/* AR Mode Notice */}
            {proposalData?.arEnabled && (
              <Card className="glass border-primary/30 p-4">
                <CardContent className="text-center">
                  <h3 className="text-lg font-romantic text-primary mb-2">✨ AR Magic Enabled</h3>
                  <p className="text-sm text-muted-foreground">
                    When others scan this QR code with their phone camera, they'll see magical 3D hearts floating around! 
                    Try it yourself - point your phone camera at the QR code!
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        );

      case "response-collection":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 max-w-2xl mx-auto"
          >
            <Card className="glass border-white/30 shadow-glow-romantic p-8">
              <CardContent className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className={`${isMobile ? 'text-xl' : 'text-3xl md:text-5xl'} font-romantic text-primary mb-6 px-4 text-center`}>
                    Make it official 💌
                  </h2>
                  <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-8 px-4 text-center`}>
                    Leave a sweet reply so they'll know how you feel.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write your heartfelt message here... 💕"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      maxLength={200}
                      className="min-h-24 resize-none border-white/20 bg-white/10 text-foreground placeholder:text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground text-right">
                      {responseMessage.length}/200 characters
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Optional: Add a photo or selfie 📸</p>
                    <div className="flex justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-white/20 bg-white/10 text-foreground hover:bg-white/20"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {responsePhoto ? "Change Photo" : "Upload Photo"}
                      </Button>
                    </div>
                    {responsePhoto && (
                      <div className="flex justify-center">
                        <img
                          src={URL.createObjectURL(responsePhoto)}
                          alt="Selected photo"
                          className="w-24 h-24 object-cover rounded-full border-2 border-white/30 shadow-soft"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 pt-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="heart"
                        size={isMobile ? "default" : "lg"}
                        onClick={() => handleResponseSubmit('yes')}
                        disabled={isSubmittingResponse}
                        className={`w-full ${isMobile ? 'text-lg py-4' : 'text-xl py-6'} shadow-glow-romantic`}
                      >
                        {isSubmittingResponse ? "Sending..." : "Send My Love ❤️"}
                      </Button>
                    </motion.div>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleResponseSubmit('not_yet')}
                      disabled={isSubmittingResponse}
                      className="border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20"
                    >
                      I need more time 💭
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "response-submitted":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-6xl'} font-romantic text-primary mb-6 relative z-10 px-4 text-center`}>
                Your heart has been delivered 💌
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="space-y-6 relative z-10 px-4"
            >
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {proposalData.proposerName} will be notified of your response. Your love story continues... ✨
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="dreamy"
                  size="lg"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Love is in the air! 💖",
                        text: `${proposalData.partnerName} just responded to ${proposalData.proposerName}'s proposal!`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied! 💕",
                        description: "Share this magical moment!",
                      });
                    }
                  }}
                  className="text-lg md:text-xl px-8 py-4 shadow-glow-romantic"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share This Moment 💌
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case "celebration":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-8"
          >
            {/* Confetti animation */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
                  animate={{ 
                    y: window.innerHeight + 100, 
                    rotate: Math.random() * 720,
                    x: Math.random() * window.innerWidth 
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute text-2xl"
                >
                  {['🎉', '💖', '✨', '🌟', '💕', '🎊'][Math.floor(Math.random() * 6)]}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-romantic text-primary mb-6 relative z-10">
                This is just the beginning of our forever story, {proposalData.partnerName}! 💖
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="space-y-4 relative z-10"
            >
              <p className="text-xl text-muted-foreground mb-8">
                Share this magical moment with the world! 🌟
              </p>
              
              <Button
                variant="dreamy"
                size="lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "I said YES! 💖",
                      text: `${proposalData.partnerName} and ${proposalData.proposerName} are starting their forever journey!`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link copied! 💕",
                      description: "Share your happiness with everyone!",
                    });
                  }
                }}
                className="text-xl px-8 py-4"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share My Happiness
              </Button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen relative overflow-hidden">
        <EnhancedFloatingBackground theme={theme} />
        
        {/* Audio control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-20"
        >
          <Button
            variant="dreamy"
            size="icon"
            onClick={toggleAudio}
            className="rounded-full shadow-soft"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </motion.div>

        <EnhancedConfetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        
        <div className={`relative z-10 container mx-auto ${isMobile ? 'px-2' : 'px-4'} py-8 min-h-screen flex items-center justify-center`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProposalSite;