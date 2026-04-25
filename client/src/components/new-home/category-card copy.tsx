import { Link } from "wouter";
import { ArrowRight, Box } from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="category-outer">
      <Link href={`/collection?category=${category.id}`}>
        <a>
          <div className="category-imgouter">
            {category.thumbnailUrl ? (
              <img src={category.thumbnailUrl} alt={category.name} />
            ) : (
              <div className="placeholder-img">
                <Box size={64} />
              </div>
            )}
          </div>

          <div className="category-content-outer">
            <div className="category-title">{category.name}</div>
            <span className="category-link">
              Explore More <ArrowRight size={16} className="inline ml-1" />
            </span>
          </div>
        </a>
      </Link>
    </div>
  );
}