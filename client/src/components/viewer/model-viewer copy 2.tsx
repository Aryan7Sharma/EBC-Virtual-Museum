import { useEffect, useRef, useState } from "react";
import { Maximize, RotateCcw, Play, Pause, Loader2, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Extend JSX.IntrinsicElements to include the 'model-viewer' element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "auto-rotate"?: boolean;
        "auto-rotate-delay"?: string;
        "rotation-per-second"?: string;
        "camera-controls"?: boolean;
        "touch-action"?: string;
        style?: React.CSSProperties;
        "camera-orbit"?: string;
        "field-of-view"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        "interpolation-decay"?: string;
        "camera-target"?: string;
      };
    }
  }
}

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  title?: string;
}

export function ModelViewer({ modelUrl, className = "", title }: ModelViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const modelViewerElementRef = useRef<any>(null);
  const savedOrbitRef = useRef<string | null>(null); // Store current orbit when pausing

  useEffect(() => {
    if (!viewerRef.current) return;

    // Dynamically import model-viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const modelViewer = viewerRef.current?.querySelector("model-viewer");
    if (modelViewer) {
      modelViewerElementRef.current = modelViewer;
      // Set initial auto-rotate
      (modelViewer as any).autoRotate = true;
    }
  }, [modelUrl]);

  const resetCamera = () => {
    const modelViewer = modelViewerElementRef.current;
    if (!modelViewer) return;

    // Reset camera to default centered position
    modelViewer.cameraOrbit = "0deg 75deg 105%";
    modelViewer.fieldOfView = "auto";
    
    // Reset turntable rotation to 0
    modelViewer.resetTurntableRotation();
    
    // Jump to the new camera position immediately
    modelViewer.jumpCameraToGoal();
    
    // Clear saved orbit
    savedOrbitRef.current = null;
  };

  const handlePlayPause = () => {
    const modelViewer = modelViewerElementRef.current;
    if (!modelViewer) return;

    if (isPlaying) {
      // PAUSE: Stop auto-rotation and save current orientation
      modelViewer.autoRotate = false;
      
      // Save the current camera orbit so we can resume from this exact position
      savedOrbitRef.current = modelViewer.getCameraOrbit();
      
      setIsPlaying(false);
    } else {
      // PLAY: Resume auto-rotation from saved position
      if (savedOrbitRef.current) {
        // Restore the saved orbit position
        modelViewer.cameraOrbit = savedOrbitRef.current;
        modelViewer.jumpCameraToGoal(); // Jump immediately to saved position
      }
      
      // Resume auto-rotation from current position
      modelViewer.autoRotate = true;
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    const modelViewer = modelViewerElementRef.current;
    if (!modelViewer) return;

    // Stop rotation
    modelViewer.autoRotate = false;
    setIsPlaying(false);
    
    // Reset to default position
    resetCamera();
  };

  const handleFullscreen = () => {
    const modelViewer = modelViewerElementRef.current;
    if (modelViewer && modelViewer.requestFullscreen) {
      modelViewer.requestFullscreen();
    }
  };

  return (
    <Card className="relative overflow-hidden" data-testid="model-viewer">
      <div className="aspect-video relative bg-[#1a1a1a]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-2">Loading 3D model...</p>
            </div>
          </div>
        )}
        <div ref={viewerRef} className="w-full h-full">
          <model-viewer
            src={modelUrl}
            alt={title || "3D Model"}
            auto-rotate-delay="0"
            rotation-per-second="30deg"
            camera-controls
            touch-action="pan-y"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1a1a1a",
            }}
            camera-orbit="0deg 75deg 105%"
            field-of-view="auto"
            min-camera-orbit="auto auto 5%"
            max-camera-orbit="auto auto 500%"
            interpolation-decay="200"
            camera-target="auto auto auto"
          />
        </div>
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            title={isPlaying ? "Pause rotation" : "Play rotation"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            title="Reset view to center"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleFullscreen}
            data-testid="button-fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3 border-t border-border bg-card">
        <p className="text-sm text-muted-foreground">
          Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </Card>
  );
}