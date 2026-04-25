import { ArtifactCard, ArtifactCardSkeleton } from "./artifact-card";
import { NewArtifactCard } from "../new-home/artifact-card-3d";
import type { ArtifactWithRelations } from "@shared/schema";

interface ArtifactGridProps {
  artifacts: ArtifactWithRelations[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ArtifactGrid({ artifacts, isLoading, emptyMessage = "No artifacts found" }: ArtifactGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-artifacts-loading">
        {Array.from({ length: 8 }).map((_, i) => (
          <ArtifactCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!artifacts.length) {
    return (
      <div className="text-center py-16" data-testid="grid-artifacts-empty">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-artifacts">
      {artifacts.map((artifact) => (
        <NewArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
}
