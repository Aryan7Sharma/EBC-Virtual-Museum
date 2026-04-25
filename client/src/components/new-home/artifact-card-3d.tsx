import { Link } from "wouter";
import { Box } from "lucide-react";
import type { ArtifactWithRelations } from "@shared/schema";

interface NewArtifactCardProps {
  artifact: ArtifactWithRelations;
}

export function NewArtifactCard({ artifact }: NewArtifactCardProps) {
  return (
    <Link href={`/artifacts/${artifact.id}`}>
      <a className="block">
        <div className="mb-[20px] relative bg-[#EBEBEB33] rounded-[10px] overflow-hidden shadow-[2px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.15)] transition-shadow">
          {/* 3D Badge */}
          {artifact.has3dModel && (
            <button className="absolute right-0 top-0 z-10 bg-white text-[#1A75BB] shadow-[-1px_2px_2px_rgba(0,0,0,0.1)] px-3 py-1 rounded-bl-[10px] flex items-center gap-1 text-sm font-medium">
              {/* <Box className="w-4 h-4" />3D */}
              <img src="/box-blue.svg" alt="3D Model Available" className="w-4 h-4" />
              3D
            </button>
          )}

          {/* Image Container with Glassmorphism */}
          <div className="h-[245px] flex items-center justify-center overflow-hidden p-2.5 bg-white/10 backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.03),inset_0_8px_10px_rgb(255_255_255)] rounded-t-[10px]">
            {/* {artifact.imageUrls && artifact.imageUrls.length > 0 ? (
              <img
                src={artifact.imageUrls[0]}
                alt={artifact.title}
                className="max-h-[240px] object-contain"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded">
                <Box className="w-16 h-16 text-gray-300" />
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

                  <img
                    src={"/3d-img.png"}
                    alt={artifact.title}

                    loading="lazy"
                  />

                )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-base font-bold text-heading-dark mb-3 min-h-[1px]">
              {artifact?.title
                ? `${artifact.title.slice(0, 25).trimEnd()}...`
                : "No Title available"}
            </h3>
            <p className="text-sm text-muted-gray leading-relaxed">
              {artifact?.shortDescription
                ? `${artifact.shortDescription.slice(0, 50).trimEnd()}...`
                : "No description available"}

            </p>

            {/* Badge and Name */}
            {/* Badge and Name */}
            <div className="flex flex-col items-start gap-2.5 mt-3">
              {artifact.category && (
                <span className="text-sm text-accent-red px-3 py-1 rounded-[10px] bg-[#FFD7D533] backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.04),0_8px_30px_rgba(255,255,255,0.55)]">
                  {artifact.category.name}
                </span>
              )}
              <span className="text-xs text-muted-gray px-2">
                {artifact.period || artifact.year || "NA"}
              </span>
            </div>

          </div>
        </div>
      </a>
    </Link>
  );
}