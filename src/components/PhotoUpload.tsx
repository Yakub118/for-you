import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Edit2, Check, Camera, Plus, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Photo {
  url: string;
  caption: string;
  file: File;
  storageUrl?: string; // Supabase storage URL after upload
}

interface PhotoUploadProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onPhotosChange, maxPhotos = 10 }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Validate file types
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image file.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (photos.length + validFiles.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${maxPhotos} photos total.`,
        variant: "destructive"
      });
      return;
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const newPhotos = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        caption: "",
        file
      }));

      onPhotosChange([...photos, ...newPhotos]);
      
      toast({
        title: "Photos added!",
        description: `${validFiles.length} photo(s) added successfully.`
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Upload failed",
        description: "Failed to process photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [photos, onPhotosChange, maxPhotos, toast]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    processFiles(files);
    
    // Reset input
    event.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    
    toast({
      title: "Photo removed",
      description: "Memory has been removed from your collection.",
    });
  };

  const startEditCaption = (index: number, currentCaption: string) => {
    setEditingIndex(index);
    setEditCaption(currentCaption);
  };

  const saveCaption = (index: number) => {
    if (editingIndex === index) {
      const newPhotos = [...photos];
      newPhotos[index].caption = editCaption.trim();
      onPhotosChange(newPhotos);
      setEditingIndex(null);
      setEditCaption("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditCaption("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Photo Memories (Optional)
        </Label>
        <span className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos} photos
        </span>
      </div>

      {photos.length === 0 ? (
        // Enhanced empty state with drag and drop
        <Card 
          className={`glass border-white/30 border-dashed hover:border-white/50 transition-all duration-300 ${
            isDragOver ? 'border-primary/50 bg-primary/5' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                {isDragOver ? (
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <Image className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-2">Add Your Special Memories</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isDragOver 
                    ? "Drop your photos here!" 
                    : "Drag & drop photos here or click to browse"
                  }
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, GIF • Up to {maxPhotos} photos
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-white/30 bg-white/10 text-foreground hover:bg-white/20"
              >
                <Camera className="w-4 h-4 mr-2" />
                {isUploading ? "Processing..." : "Choose Photos"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        // Enhanced photo grid with drag and drop zone
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <Card className="glass border-white/30 overflow-hidden hover:shadow-glow-romantic transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img
                          src={photo.url}
                          alt={photo.caption || "Memory photo"}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay with controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => startEditCaption(index, photo.caption)}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 border-white/30"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removePhoto(index)}
                            className="w-8 h-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Caption section */}
                      <div className="p-3">
                        {editingIndex === index ? (
                          <div className="flex gap-2">
                            <Input
                              value={editCaption}
                              onChange={(e) => setEditCaption(e.target.value)}
                              placeholder="Add a caption..."
                              className="text-xs border-white/30 bg-white/10"
                              maxLength={100}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveCaption(index);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => saveCaption(index)}
                              className="w-6 h-6"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <p 
                            className="text-xs text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => startEditCaption(index, photo.caption)}
                          >
                            {photo.caption || "Click to add caption"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Add more button */}
            {photos.length < maxPhotos && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card 
                  className={`glass border-white/30 border-dashed hover:border-white/50 transition-all duration-300 cursor-pointer h-full ${
                    isDragOver ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CardContent className="p-0 h-full flex items-center justify-center aspect-square">
                    <div className="text-center">
                      {isDragOver ? (
                        <Upload className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                      ) : (
                        <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                      )}
                      <p className="text-xs text-muted-foreground px-2">
                        {isDragOver ? "Drop photos here" : "Add More Photos"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;