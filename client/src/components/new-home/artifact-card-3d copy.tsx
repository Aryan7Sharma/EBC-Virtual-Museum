import { Link } from "wouter";
import { Box } from "lucide-react";
import type { ArtifactWithRelations } from "@shared/schema";

interface ArtifactCard3DProps {
  artifact: ArtifactWithRelations;
}

export function ArtifactCard3D({ artifact }: ArtifactCard3DProps) {
  return (
    <div className="card-3d-outer">
      {artifact.has3dModel && (
        <button className="card-3d-modalbtn">
          <Box size={16} />
          3D
        </button>
      )}

      <Link href={`/artifacts/${artifact.id}`}>
        <a>
          <div className="card-3d-imgouter">
            {/* {artifact.imageUrls && artifact.imageUrls.length > 0 ? (
              <img src={artifact.imageUrls[0]} alt={artifact.title} />
            ) : (
              <div className="placeholder-img">
                <Box size={48} />
              </div>
            )} */}
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
          </div>

          <div className="card-3d-content-outer">
            <div className="card-3d-title">{artifact.title}</div>
            <div className="card-3d-desc">
              {artifact.shortDescription || "No description available"}
            </div>
            <div className="card-3d-badge-name-outer">
              {artifact.category && (
                <div className="card-3d-badge">{artifact.category.name}</div>
              )}
              <div className="card-3d-name-outer">
                {artifact.period || artifact.year || "NA"}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}