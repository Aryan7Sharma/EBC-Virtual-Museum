import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ArtifactImage } from "@shared/schema";

interface ImageGalleryProps {
  images: ArtifactImage[];
  title?: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images.length) {
    return null;
  }

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4" data-testid="image-gallery">
      <div
        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
        data-testid="image-gallery-main"
      >
        <img
          src={currentImage.url}
          alt={currentImage.altText || title || "Artifact image"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              data-testid="button-image-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              data-testid="button-image-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2" data-testid="image-gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              data-testid={`button-thumbnail-${index}`}
            >
              <img
                src={image.url}
                alt={image.altText || `View ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <DialogClose className="absolute right-4 top-4 z-50">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-close-lightbox">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
          
          <div className="relative flex items-center justify-center min-h-[60vh]">
            <img
              src={currentImage.url}
              alt={currentImage.altText || title || "Artifact image"}
              className="max-h-[80vh] max-w-full object-contain"
              data-testid="image-lightbox"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/10"
                  onClick={goToPrevious}
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/10"
                  onClick={goToNext}
                  data-testid="button-lightbox-next"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
          
          <div className="p-4 text-center text-white/70 text-sm">
            {selectedIndex + 1} of {images.length}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
