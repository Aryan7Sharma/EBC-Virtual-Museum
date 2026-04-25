import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerSlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface BannerSliderProps {
  slides: BannerSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function BannerSlider({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 3000 
}: BannerSliderProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const itemCount = slides.length;
  const theta = 360 / itemCount; // Angle between items
  const radius = 1000; // Radius of the carousel

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayTimerRef.current = setInterval(() => {
        setRotation((prev) => prev + theta);
      }, autoPlayInterval);

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, theta, isDragging]);

  // Apply rotation to ring
  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(0px, 0px, 0px) rotateY(${rotation}deg)`;
    }
  }, [rotation]);

  // Calculate position for each slide
  const getSlideStyle = (index: number) => {
    const angle = theta * index;
    const angleRad = (angle * Math.PI) / 180;
    
    const x = Math.sin(angleRad) * radius;
    const z = Math.cos(angleRad) * radius;
    
    return {
      opacity: 1,
      transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${-angle}deg)`,
      backfaceVisibility: 'hidden' as const,
      transformOrigin: '50% 50%',
    };
  };

  // Mouse/Touch drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentRotation(rotation);
    
    if (draggerRef.current) {
      draggerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    const rotationDelta = deltaX * 0.5; // Sensitivity
    setRotation(currentRotation + rotationDelta);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (draggerRef.current) {
      draggerRef.current.style.cursor = 'grab';
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Navigation
  const handlePrevious = () => {
    setRotation((prev) => prev - theta);
  };

  const handleNext = () => {
    setRotation((prev) => prev + theta);
  };

  return (
    <div className="banner-slider relative h-[600px] md:h-[370px] overflow-hidden bg-gradient-to-b from-background to-accent/20">
      {/* Container with perspective */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {/* 3D Ring */}
        <div
          ref={ringRef}
          id="ring"
          className="relative w-full h-full transition-transform duration-500 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translate3d(0px, 0px, 0px) rotateY(${rotation}deg)`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="img absolute left-1/2 top-1/2 w-[700px] h-[300px] rounded-lg overflow-hidden shadow-2xl"
              style={{
                ...getSlideStyle(index),
                marginLeft: '-350px',  // Center horizontally (half of width)
                marginTop: '-150px',   // Center vertically (half of height)
              }}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {(slide.title || slide.description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  {slide.title && (
                    <h3 className="text-2xl font-serif font-bold mb-2">
                      {slide.title}
                    </h3>
                  )}
                  {slide.description && (
                    <p className="text-sm opacity-90">{slide.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vignette overlay */}
      <div className="vignette absolute inset-0 pointer-events-none">
        <div className="w-full h-full" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 100%)'
        }} />
      </div>

      {/* Dragger (invisible drag area) */}
      <div
        ref={draggerRef}
        id="dragger"
        className="absolute inset-0 cursor-grab active:cursor-grabbing select-none touch-none z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ opacity: isDragging ? 0.1 : 0 }}
      />

      {/* Navigation Buttons */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={handlePrevious}
          className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Dots indicator */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => {
            const normalizedRotation = ((rotation / theta) % itemCount + itemCount) % itemCount;
            const isActive = Math.round(normalizedRotation) === index;
            return (
              <button
                key={index}
                onClick={() => setRotation(theta * index)}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-primary/30 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

        <Button
          variant="secondary"
          size="icon"
          onClick={handleNext}
          className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}