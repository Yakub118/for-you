import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  url: string;
  proposalData: {
    proposerName: string;
    partnerName: string;
  };
}

const QRCodeGenerator = ({ url, proposalData }: QRCodeGeneratorProps) => {
  const { toast } = useToast();

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `proposal-qr-${proposalData.proposerName}-${proposalData.partnerName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "QR Code Downloaded! 📱",
        description: "You can now print or share your romantic QR code.",
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied! 💖",
        description: "The proposal link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Couldn't copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto"
    >
      <Card className="glass border-white/30 shadow-glow-romantic">
        <CardHeader className="text-center">
          <CardTitle className="font-romantic text-2xl text-primary flex items-center justify-center gap-2">
            <QrCode className="w-6 h-6" />
            Your Romantic QR Code
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div 
              id="qr-code"
              className="p-4 bg-white rounded-xl shadow-soft"
            >
              <QRCodeSVG
                value={url}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#e91e63"
                bgColor="#ffffff"
              />
            </div>
          </motion.div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Share this QR code for instant access to your proposal
            </p>
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 break-all">
              {url}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="romantic"
                onClick={handleDownloadQR}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-2"
          >
            <div className="text-sm font-medium text-primary">💡 Pro Tips:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Print and place in a special location</li>
              <li>• Include in a romantic card or gift</li>
              <li>• Perfect for scavenger hunts! 🗝️</li>
            </ul>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QRCodeGenerator;