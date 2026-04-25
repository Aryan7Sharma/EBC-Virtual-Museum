import { Link } from "wouter";
import { ArrowRight, Box } from "lucide-react";
import type { Category } from "@shared/schema";

interface NewCategoryCardProps {
  category: Category;
}

export function NewCategoryCard({ category }: NewCategoryCardProps) {
  return (
    <Link href={`/collection?category=${category.id}`}>
      <a className="block">
        <div className="relative rounded-[10px] overflow-hidden bg-gradient-to-t from-[#393939] to-transparent hover:scale-[1.02] transition-transform">
          {/* Overlay */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#393939] to-transparent opacity-50" />

          {/* Image */}
          <div className="w-full h-[340px]">
            {category.thumbnailUrl ? (
              <img
                src={category.thumbnailUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <Box className="w-20 h-20 text-gray-500" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-[2]">
            <h3 className="text-lg font-bold text-white px-5 pb-5">
              {category.name}
            </h3>
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] rounded-b-[10px] flex items-center gap-2.5 text-white hover:bg-white/20 transition-colors">
              <span className="text-sm font-medium">Explore More</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}