import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Box, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerSlider } from "@/components/ui/banner-slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { ArtifactCard, ArtifactCardSkeleton } from "@/components/artifacts/artifact-card";
import type { ArtifactWithRelations, Category } from "@shared/schema";

export default function HomePage() {
  console.log("HomePage called")
  const { data: featuredArtifacts, isLoading: isLoadingFeatured } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/artifacts", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/v1/artifacts?featured=true&limit=6");
      if (!response.ok) throw new Error("Failed to fetch featured artifacts");
      const data = await response.json();
      return data.artifacts;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/v1/categories"],
  });

  const { data: recentArtifacts, isLoading: isLoadingRecent } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/artifacts", "recent"],
    queryFn: async () => {
      const response = await fetch("/api/v1/artifacts?sortBy=newest&limit=4");
      if (!response.ok) throw new Error("Failed to fetch recent artifacts");
      const data = await response.json();
      return data.artifacts;
    },
  });

  const slides = [
  {
    id: "1",
    imageUrl: "/slider-1.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "2",
    imageUrl: "/slider-2.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "3",
    imageUrl: "/slider-3.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "4",
    imageUrl: "/slider-4.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "5",
    imageUrl: "/slider-5.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "6",
    imageUrl: "/slider-6.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "7",
    imageUrl: "/slider-7.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
    },
    {
    id: "8",
    imageUrl: "/slide-1.png",
    title: "Ancient Artifacts",
    description: "Discover treasures from the past"
  }
];

  return (
    <MainLayout>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-32">
          <p className="mb-6 text-red-500" data-testid="badge-hero">
            Digital Museum Experience
          </p>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6" data-testid="text-hero-title">
            Discover the Ancient Treasures of
            <span className="text-primary block mt-2">Khmer Civilization</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10" data-testid="text-hero-description">
            Explore our extensive collection of heritage from across Cambodia throughout different eras.
            Experience our Khmer history through interactive 3D models and curated exhibitions.
          </p>


          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/collection">
              <Button size="lg" className="gap-2" data-testid="button-explore-collection">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/collection?has3d=true">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-3d-gallery">
                <Box className="h-4 w-4" />
                3D Gallery
              </Button>
            </Link>
          </div>
        </div>

        {/* <div className="absolute inset-0 flex items-center justify-center">
          <BannerSlider 
  slides={slides} 
  autoPlay={true} 
  autoPlayInterval={4000} 
/>
        </div> */}
        

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="featured-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-featured-title">
                Featured Artifacts
              </h2>
              <p className="text-muted-foreground">
                Highlights from our collection
              </p>
            </div>
            <Link href="/collection?featured=true">
              <Button variant="ghost" className="gap-2" data-testid="link-view-all-featured">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-featured-artifacts">
            {isLoadingFeatured
              ? Array.from({ length: 6 }).map((_, i) => <ArtifactCardSkeleton key={i} />)
              : featuredArtifacts?.map((artifact) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} />
                ))}
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50" data-testid="categories-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-categories-title">
                Explore by Category
              </h2>
              <p className="text-muted-foreground">
                Browse our collection by artifact type
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="grid-categories">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/collection?category=${category.id}`}
                  data-testid={`card-category-${category.id}`}
                >
                  <Card className="group hover-elevate active-elevate-2 overflow-hidden cursor-pointer transition-all">
                    <div className="aspect-square relative bg-muted">
                      {category.thumbnailUrl ? (
                        <img
                          src={category.thumbnailUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Box className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-serif font-semibold text-white text-lg" data-testid={`text-category-name-${category.id}`}>
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="recent-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-2" data-testid="text-recent-title">
                Newly Added
              </h2>
              <p className="text-muted-foreground">
                Latest additions to our collection
              </p>
            </div>
            <Link href="/collection?sortBy=newest">
              <Button variant="ghost" className="gap-2" data-testid="link-view-all-recent">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-recent-artifacts">
            {isLoadingRecent
              ? Array.from({ length: 4 }).map((_, i) => <ArtifactCardSkeleton key={i} />)
              : recentArtifacts?.map((artifact) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} />
                ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-cta-title">
            Preserving Heritage through Innovation
          </h2>
          <p className="text-muted-foreground text-lg mb-8" data-testid="text-cta-description">
            The EBC Museum bridges the gap between Cambodia’s ancient past and the digital future. Our initiative utilizes advanced 3D
            technology to preserve and showcase the nation’s cultural treasures—from Angkorian temple carvings to the intricate artistry of shadow puppets.
            By creating high-fidelity digital twins of these artifacts, we provide an interactive gateway for global education and research. We are
            committed to ensuring that the soul of our heritage remains accessible, protected, and inspiring for a modern, tech-driven world.
          </p>
          <Link href="/collection?has3d=true">
            <Button size="lg" className="gap-2" data-testid="button-cta-3d">
              <Box className="h-5 w-5" />
              View 3D Collection
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
