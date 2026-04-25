import { useState, useRef } from "react";
import { Upload, X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ModelUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ModelUpload({ value, onChange, disabled }: ModelUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [modelInfo, setModelInfo] = useState<{
    filename: string;
    size: number;
    url: string;
  } | null>(
    value
      ? {
          filename: value.split("/").pop() || "model",
          size: 0,
          url: value,
        }
      : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    //const validExtensions = [".glb", ".gltf", ".obj", ".fbx", ".blend"];
    const validExtensions = [".glb"];
    const fileName = file.name.toLowerCase();
    const isValidType = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValidType) {
      //return "Please upload a .glb, .gltf, .obj, .fbx, or .blend file";
      return "Please upload a .glb file";
    }

    // Check file size (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Model file size must be less than 50MB";
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append("model", file);

      const response = await fetch("/api/v1/admin/upload/artifact-model", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload model");
      }

      const data = await response.json();
      
      setModelInfo({
        filename: data.filename,
        size: data.size,
        url: data.url,
      });
      
      onChange(data.url);

      toast({
        title: "Success",
        description: "3D model uploaded successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload model",
        variant: "destructive",
      });
      setModelInfo(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setModelInfo(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        // accept=".glb,.gltf,.obj,.fbx,.blend"
        accept=".glb"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {modelInfo ? (
        <div className="border rounded-lg p-4 bg-accent/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="rounded-full bg-primary/10 p-3">
                <Box className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {modelInfo.filename}
                </p>
                {modelInfo.size > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(modelInfo.size)}
                  </p>
                )}
                {/* <p className="text-xs text-muted-foreground break-all">
                  {modelInfo.url}
                </p> */}
              </div>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isUploading}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors hover:border-primary hover:bg-accent/50
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Uploading model...</p>
                <p className="text-xs text-muted-foreground">This may take a while for large files</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-accent p-3">
                  <Box className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Click to upload 3D model
                  </p>
                  <p className="text-xs text-muted-foreground">
                    GLB or GLTF or OBJ or FBX or BLEND format (max 50MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}