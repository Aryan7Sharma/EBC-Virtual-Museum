import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Box, MapPin, Calendar, Ruler, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MainLayout } from "@/components/layout/main-layout";
import { ImageGallery } from "@/components/viewer/image-gallery";
import { ModelViewer } from "@/components/viewer/model-viewer";
import { CommentSection } from "@/components/comments/comment-section";
import { ArtifactCard, ArtifactCardSkeleton } from "@/components/artifacts/artifact-card";
import { SEOHead } from "@/components/seo-head";
import { useToast } from "@/hooks/use-toast";
import type { ArtifactWithRelations, ArtifactImage } from "@shared/schema";

interface ArtifactDetailData extends ArtifactWithRelations {
  description: string | null;
  images: ArtifactImage[];
}

export default function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: artifact, isLoading } = useQuery<ArtifactDetailData>({
    queryKey: ["/api/v1/artifacts", id],
    queryFn: async () => {
      const response = await fetch(`/api/v1/artifacts/${id}`);
      if (!response.ok) throw new Error("Failed to fetch artifact");
      return response.json();
    },
    enabled: !!id,
  });

  const { data: relatedArtifacts, isLoading: isLoadingRelated } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/artifacts", id, "related"],
    queryFn: async () => {
      const response = await fetch(`/api/v1/artifacts/${id}/related`);
      if (!response.ok) throw new Error("Failed to fetch related artifacts");
      return response.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="aspect-[4/3] rounded-lg" />
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!artifact) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-3xl font-semibold mb-4">Artifact Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The artifact you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/collection">
            <Button>Back to Collection</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const metadataItems = [
    { label: "Material", value: artifact.material, icon: Tag },
    { label: "Region", value: artifact.region, icon: MapPin },
    { label: "Period", value: artifact.period, icon: Calendar },
    { label: "Year", value: artifact.year, icon: Calendar },
    { label: "Location", value: artifact.location, icon: MapPin },
    ...(artifact.dimensions ? [
      { 
        label: "Dimensions", 
        value: `${artifact.dimensions.width || "?"} × ${artifact.dimensions.height || "?"} × ${artifact.dimensions.depth || "?"}`,
        icon: Ruler 
      }
    ] : []),
  ].filter(item => item.value);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const primaryImage = artifact.images?.[0]?.url;

  const handleShare = (platform: "twitter" | "facebook" | "linkedin" | "copy") => {
    const title = artifact.title;
    const text = artifact.shortDescription || `Explore ${artifact.title} at EBC Museum`;
    
    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "The artifact link has been copied to your clipboard.",
        });
        break;
    }
  };

  return (
    <MainLayout>
      <SEOHead
        title={`${artifact.title} | EBC Museum`}
        description={artifact.shortDescription || artifact.description || `Explore ${artifact.title} at EBC Museum`}
        image={primaryImage}
        url={shareUrl}
        type="article"
      />
      <div className="pt-20 px-4 sm:px-6 lg:px-8" data-testid="artifact-detail">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4" data-testid="breadcrumb">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/collection" className="hover:text-foreground transition-colors">Collection</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{artifact.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 py-8">
            <div className="space-y-8">
              <ImageGallery images={artifact.images || []} title={artifact.title} />
              
              {artifact.has3dModel && artifact.modelUrl && (
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-4 flex items-center gap-2">
                    <Box className="h-5 w-5 text-primary" />
                    3D Model
                  </h2>
                  <ModelViewer modelUrl={artifact.modelUrl} title={artifact.title} />
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {artifact.category && (
                    <Badge variant="secondary" data-testid="badge-category">
                      {artifact.category.name}
                    </Badge>
                  )}
                  {artifact.has3dModel && (
                    <Badge variant="outline" className="gap-1">
                      <Box className="h-3 w-3" />
                      3D Model
                    </Badge>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="font-serif text-3xl sm:text-4xl font-semibold" data-testid="text-artifact-title">
                    {artifact.title}
                  </h1>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" data-testid="button-share">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare("twitter")} data-testid="share-twitter">
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("facebook")} data-testid="share-facebook">
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("linkedin")} data-testid="share-linkedin">
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare("copy")} data-testid="share-copy">
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {artifact.shortDescription && (
                  <p className="text-lg text-muted-foreground" data-testid="text-short-description">
                    {artifact.shortDescription}
                  </p>
                )}
              </div>

              {metadataItems.length > 0 && (
                <Card className="p-4" data-testid="metadata-card">
                  <div className="grid grid-cols-2 gap-4">
                    {metadataItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                        <div>
                          <dt className="text-xs text-muted-foreground">{item.label}</dt>
                          <dd className="text-sm font-medium" data-testid={`text-metadata-${item.label.toLowerCase()}`}>
                            {item.value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {artifact.longDescription && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start p-0 h-auto font-serif text-xl font-semibold">
                      Historical Context
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: artifact.longDescription }}
                      data-testid="text-long-description"
                    />
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>

          <Separator className="my-12" />

          <section className="py-8" data-testid="related-artifacts-section">
            <CommentSection artifactId={id!} />
          </section>

          {relatedArtifacts && relatedArtifacts.length > 0 && (
            <>
              <Separator className="my-12" />
              <section className="py-8 pb-16" data-testid="related-artifacts-section">
                <h2 className="font-serif text-2xl font-semibold mb-8">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-related-artifacts">
                  {isLoadingRelated
                    ? Array.from({ length: 4 }).map((_, i) => <ArtifactCardSkeleton key={i} />)
                    : relatedArtifacts.map((artifact) => (
                        <ArtifactCard key={artifact.id} artifact={artifact} />
                      ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
