import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Wand2, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CustomQuestion {
  id: string;
  question: string;
  yesButton: string;
  noButton: string;
}

interface CustomQuestionBuilderProps {
  questions: CustomQuestion[];
  onQuestionsChange: (questions: CustomQuestion[]) => void;
}

const DEFAULT_QUESTIONS: CustomQuestion[] = [
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

const CustomQuestionBuilder = ({ questions, onQuestionsChange }: CustomQuestionBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  // Use displayQuestions to prevent unnecessary re-renders during customization
  const displayQuestions = useMemo(() => {
    return questions.length > 0 ? questions : DEFAULT_QUESTIONS;
  }, [questions]);

  const addQuestion = () => {
    if (questions.length >= 6) return;
    
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: "",
      yesButton: "Yes! ✨",
      noButton: "No way! 😅"
    };
    
    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length <= 1) return;
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof CustomQuestion, value: string) => {
    onQuestionsChange(
      questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const resetToDefaults = () => {
    onQuestionsChange(DEFAULT_QUESTIONS);
  };

  return (
    <Card className="glass border-white/20 shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-romantic text-primary flex items-center justify-center gap-2 flex-wrap`}>
          <Wand2 className="w-5 h-5" />
          <span className={isMobile ? 'text-center' : ''}>Customize Questions & Buttons</span>
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-sm' : ''} px-2`}>
          Personalize the romantic journey with your own questions and playful button responses
        </CardDescription>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="border-white/30 text-primary hover:bg-primary/10 mt-4"
          size={isMobile ? "sm" : "default"}
        >
          {isExpanded ? "Hide Customization" : "Customize Questions"}
        </Button>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6">
                <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Create up to 6 custom questions. Leave empty to use defaults.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="border-white/30 text-primary hover:bg-primary/10"
                >
                  Reset to Defaults
                </Button>
              </div>

              <div className="space-y-4">
                {displayQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-medium text-primary flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Question {index + 1}
                      </Label>
                      {questions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Input
                          placeholder="Your romantic question..."
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                          className="glass border-white/30"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Yes Button</Label>
                          <Input
                            placeholder="Yes response..."
                            value={question.yesButton}
                            onChange={(e) => updateQuestion(question.id, "yesButton", e.target.value)}
                            className="glass border-white/30"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">No Button (will be evasive!)</Label>
                          <Input
                            placeholder="No response..."
                            value={question.noButton}
                            onChange={(e) => updateQuestion(question.id, "noButton", e.target.value)}
                            className="glass border-white/30"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {questions.length < 6 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={addQuestion}
                    className="w-full border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question ({questions.length}/6)
                  </Button>
                </motion.div>
              )}

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary">
                  💡 <strong>Tip:</strong> The "No" button will playfully move around and shrink when clicked, 
                  making it harder to refuse your love! The final question leads to your proposal.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CustomQuestionBuilder;