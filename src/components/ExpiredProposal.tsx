import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingBackground from "./FloatingBackground";

const ExpiredProposal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dreamy opacity-80" />
      <FloatingBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto text-center"
        >
          <Card className="glass border-white/20 shadow-soft">
            <CardContent className="p-8 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-romantic rounded-full shadow-glow-romantic mx-auto"
              >
                <Heart className="w-10 h-10 text-white animate-heart-pulse" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-romantic text-primary">
                  💔 This magical proposal has faded...
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  But love never fades. This story may have expired, but yours can begin again.
                </p>
                <div className="flex items-center justify-center gap-2 text-primary/60">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Create a new love story today</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-4"
              >
                <Button
                  variant="heart"
                  size="lg"
                  onClick={() => navigate('/')}
                  className="w-full text-xl py-6 shadow-glow-romantic"
                >
                  Create Your Own Proposal 💖
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground/60">
                  Free proposals last 24 hours • Premium proposals are permanent
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpiredProposal;