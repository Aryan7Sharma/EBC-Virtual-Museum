import { Link } from "wouter";
import { Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArtifactWithRelations } from "@shared/schema";

interface ArtifactCardProps {
  artifact: ArtifactWithRelations;
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  const primaryImage = artifact.images?.find((img) => img.isPrimary) || artifact.images?.[0];

  return (
    <Link href={`/artifacts/${artifact.id}`} data-testid={`card-artifact-${artifact.id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {
          //   primaryImage ? (
          //   <img
          //     src={primaryImage.url}
          //     alt={primaryImage.altText || artifact.title}
          //     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          //     loading="lazy"
          //   />
          // ) 
              artifact.thumbnailUrl ? (
            <img
              src={artifact.thumbnailUrl}
              alt={artifact.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )
            : (
            <div className="w-full h-full flex items-center justify-center">
              <Box className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          {artifact.has3dModel && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                <Box className="h-3 w-3 mr-1" />
                3D
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-serif font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors" data-testid={`text-artifact-title-${artifact.id}`}>
            {artifact.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2" data-testid={`text-artifact-description-${artifact.id}`}>
            {artifact.shortDescription}
          </p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {artifact.category && (
              <Badge variant="outline" className="text-xs" data-testid={`badge-artifact-category-${artifact.id}`}>
                {artifact.category.name}
              </Badge>
            )}
            {artifact.period && (
              <span className="text-xs text-muted-foreground" data-testid={`text-artifact-period-${artifact.id}`}>
                {artifact.period}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ArtifactCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </Card>
  );
}
