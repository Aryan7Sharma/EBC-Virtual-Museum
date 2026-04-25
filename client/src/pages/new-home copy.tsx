import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Box } from "lucide-react";
import { NewHeader } from "@/components/new-home/header";
import { NewFooter } from "@/components/new-home/footer";
import { NewBannerSlider } from "@/components/new-home/banner-slider";
import { NewArtifactCard } from "@/components/new-home/artifact-card-3d";
import { NewCategoryCard } from "@/components/new-home/category-card";
import { ThemeToggle } from "@/components/theme-toggle";
import type { ArtifactWithRelations, Category } from "@shared/schema";

export default function NewHomePage() {
  // Fetch featured artifacts
  const { data: featuredArtifacts, isLoading: isLoadingFeatured } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/artifacts", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/v1/artifacts?featured=true&limit=6");
      if (!response.ok) throw new Error("Failed to fetch featured artifacts");
      const data = await response.json();
      return data.artifacts;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/v1/categories"],
  });

  // Fetch recent artifacts
  const { data: recentArtifacts, isLoading: isLoadingRecent } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/artifacts", "recent"],
    queryFn: async () => {
      const response = await fetch("/api/v1/artifacts?sortBy=newest&limit=4");
      if (!response.ok) throw new Error("Failed to fetch recent artifacts");
      const data = await response.json();
      return data.artifacts;
    },
  });

  // Banner slider slides
  const slides = [
    { id: "1", imageUrl: "/slider-1.png" },
    { id: "2", imageUrl: "/slider-2.png" },
    { id: "3", imageUrl: "/slider-3.png" },
    { id: "4", imageUrl: "/slider-4.png" },
    { id: "5", imageUrl: "/slider-5.png" },
    { id: "6", imageUrl: "/slider-6.png" },
    { id: "7", imageUrl: "/slider-7.png" },
    { id: "8", imageUrl: "/slider-3.png" },
    { id: "9", imageUrl: "/slider-4.png" },
    { id: "10", imageUrl: "/slider-5.png" },
  ];

  return (
    <div className="font-['Poppins',sans-serif]">
      {/* Header */}
      <NewHeader />

      <ThemeToggle />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[rgba(232,245,255,1)] to-[rgba(255,255,255,1)] pt-[90px]">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          <div className="text-center pt-10">
            <p className="text-[#EE4035] text-sm tracking-[3px] font-medium mb-6">
              Digital Museum Experience
            </p>
            <h1 className="text-[58px] font-bold text-[#353535] max-w-[630px] mt-[25px] mb-[9px] mx-auto leading-tight">
              Discover the Ancient Treasures of
            </h1>
            <h2 className="text-[58px] font-bold text-[#1A75BB] mt-[0px] mb-[16px] mx-auto leading-[58px]">
              Khmer Civilization
            </h2>
            <p className="text-[#353535] max-w-[735px] mx-auto my-[0px]">
              Explore our extensive collection of heritage from across Cambodia throughout different eras. Experience our Khmer history through interactive 3D models and curated exhibitions.
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-8 flex-wrap mt-6">
              <Link href="/collection">
                <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#1A75BB] text-white text-base font-medium shadow-[inset_4px_4px_4px_rgba(255,255,255,0.25)] hover:bg-[#EE4035] transition-colors">
                  Explore Collection
                  <img src="/right-wh.svg" alt="" className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/collection?has3d=true">
                <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/10 backdrop-blur-[20px] border-b border-white/50 text-[#353535] text-base font-medium shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:bg-[#EE4035] hover:text-white transition-colors">
                  <img src="/box-bl.svg" alt="" className="w-4 h-4 hover:invert transition duration-300 ease-in-out" />
                  3D Gallery
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Slider */}
      <NewBannerSlider slides={slides} />

      {/* Featured Artifacts Section */}
      <section className="pb-[50px] bg-[#fff]">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-black mb-1.5">
              Featured Artifacts
            </h2>
            <p className="text-[#353535]">Highlights from our collection</p>
          </div>

          {/* Cards Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {isLoadingFeatured ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-[10px] h-[400px]" />
                  </div>
                ))}
              </>
            ) : (
              featuredArtifacts?.slice(0, 3).map((artifact) => (
                <NewArtifactCard key={artifact.id} artifact={artifact} />
              ))
            )}
          </div> */}

          <div className="mt-8 overflow-x-auto">
            <div className="flex gap-8 min-w-max md:grid md:grid-cols-2 lg:grid-cols-3 md:min-w-0">

              {isLoadingFeatured ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-[10px] h-[400px]" />
                    </div>
                  ))}
                </>
              ) : (
                featuredArtifacts?.slice(0, 3).map((artifact) => (
                  <div className="min-w-[280px] md:min-w-0">
                    < NewArtifactCard key={artifact.id} artifact={artifact} />
                  </div>
                ))
              )}
            </div>
          </div>




          {/* View All Button */}
          <div className="flex items-center justify-center mt-8">
            <Link href="/collection?featured=true">
              <a className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-[10px] bg-[#E7F5FF33] text-[#1A75BB] text-base font-medium w-full max-w-[180px] backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] bg-[#E7F5FF66] transition-colors">
                View All
                <img src="/right-blue.svg" alt="" className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore by Category Section */}
      <section className="py-[45px] bg-[#F7F7F7]">
        <div className="container-fluid px-4 mx-auto max-w-[900px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-black mb-1.5">
              Explore by Category
            </h2>
            <p className="text-[#353535]">Browse our collection by artifact type</p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-9">
            {categories?.slice(0, 6).map((category) => (
              <NewCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Newly Added Section */}
      <section className="py-[45px]">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-black mb-1.5">
              Newly Added
            </h2>
            <p className="text-[#353535]">Latest additions to our collection</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {isLoadingRecent ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-[10px] h-[400px]" />
                  </div>
                ))}
              </>
            ) : (
              recentArtifacts?.map((artifact) => (
                <NewArtifactCard key={artifact.id} artifact={artifact} />
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="flex items-center justify-center mt-8">
            <Link href="/collection?sortBy=newest">
              <a className="flex items-center justify-center gap-2.5 w-full px-[22px] py-[10px] rounded-[10px] bg-[#E7F5FF33] text-[#1A75BB] text-base font-medium w-full max-w-[180px] backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] bg-[#E7F5FF66] transition-colors">
                View All
                <img src="/right-blue.svg" alt="" className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <div className="container-fluid px-4 mx-auto max-w-[1440px] mb-[50px]">
        <section className="text-center rounded-[10px] px-11 py-11 bg-[rgb(246_251_255_/_25%)] backdrop-blur-[20px] shadow-[inset_4px_4px_4px_rgba(0,0,0,0.04),4px_4px_4px_rgba(0,0,0,0.04)]">
          <p className="text-[#EE4035] text-sm tracking-[3px] font-normal mb-3">
            The Vision
          </p>
          <h2 className="text-[32px] font-bold text-[#1A75BB] mb-2.5">
            Preserving Heritage through Innovation
          </h2>
          <p className="text-[#616161] mb-6">
            The EBC Museum bridges the gap between Cambodia's ancient past and the digital future. Our initiative utilizes advanced 3D technology to preserve and showcase the nation's cultural treasures—from Angkorian temple carvings to the intricate artistry of shadow puppets. By creating high-fidelity digital twins of these artifacts, we provide an interactive gateway for global education and research. We are committed to ensuring that the soul of our heritage remains accessible, protected, and inspiring for a modern, tech-driven world.
          </p>
          <Link href="/collection?has3d=true">
            <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#1A75BB] text-white font-medium shadow-[inset_2px_2px_2px_rgb(255_255_255_/_25%)] hover:bg-[#EE4035] transition-colors">
              <img src="/box-wh.svg" alt="" className="w-4 h-4" />
              View 3D Collection
            </a>
          </Link>
        </section>
      </div>

      {/* Footer */}
      <NewFooter />
    </div>
  );
}