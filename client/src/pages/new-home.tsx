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
      {/* <div className="bg-hero-gradient pt-[90px]">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          <div className="text-center pt-10">
            <p className="text-accent-red text-sm tracking-[3px] font-medium mb-6">
              Digital Museum Experience
            </p>
            <h1 className="text-[58px] font-bold text-heading-dark max-w-[630px] mt-[25px] mb-[9px] mx-auto leading-tight">
              Discover the Ancient Treasures of
            </h1>
            <h2 className="text-[58px] font-bold text-primary-blue mt-[0px] mb-[16px] mx-auto leading-[58px]">
              Khmer Civilization
            </h2>
            <p className="text-body-color max-w-[735px] mx-auto my-[0px]">
              Explore our extensive collection of heritage from across Cambodia throughout different eras. Experience our Khmer history through interactive 3D models and curated exhibitions.
            </p>

           
            <div className="flex items-center justify-center gap-8 flex-wrap mt-6">
              <Link href="/collection">
                <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-btn-primary text-white text-base font-medium shadow-[inset_4px_4px_4px_rgba(255,255,255,0.25)] hover:bg-btn-primary-hover transition-colors">
                  Explore Collection
                  <img src="/right-wh.svg" alt="" className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/collection?has3d=true">
                <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-white/10 backdrop-blur-[20px] border-b border-white/50 text-body-color text-base font-medium shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:bg-btn-primary-hover hover:text-white transition-colors">
                  <img src="/box-bl.svg" alt="" className="w-4 h-4 hover:invert transition duration-300 ease-in-out" />
                  3D Gallery
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div> */}
      {/* Hero Section */}
      <div className="bg-hero-gradient pt-[80px] sm:pt-[90px]">
        <div className="px-4 mx-auto max-w-[1440px]">
          <div className="text-center pt-8 sm:pt-10">

            <p className="text-accent-red text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] font-medium mb-4 sm:mb-6">
              Digital Museum Experience
            </p>

            <h1 className="
        font-bold text-heading-dark mx-auto
        text-3xl sm:text-4xl md:text-5xl lg:text-[58px]
        leading-tight
        max-w-[90%] sm:max-w-[630px]
        mt-4 sm:mt-[25px] mb-2 sm:mb-[9px]
      ">
              Discover the Ancient Treasures of
            </h1>

            <h2 className="
        font-bold text-primary-blue mx-auto
        text-3xl sm:text-4xl md:text-5xl lg:text-[58px]
        leading-tight
        mb-4 sm:mb-[16px]
      ">
              Khmer Civilization
            </h2>

            <p className="
        text-body-color mx-auto
        text-sm sm:text-base
        max-w-[95%] sm:max-w-[735px]
      ">
              Explore our extensive collection of heritage from across Cambodia throughout different eras.
              Experience our Khmer history through interactive 3D models and curated exhibitions.
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap mt-6">

              <Link href="/collection">
                <a className="
            inline-flex items-center gap-1.5
            px-4 py-2
            text-sm sm:text-base
            rounded-[10px]
            bg-btn-primary text-white font-medium
            shadow-[inset_4px_4px_4px_rgba(255,255,255,0.25)]
            hover:bg-[var(--btn-primary-hover)] transition-colors
          ">
                  Explore Collection
                  <img src="/right-wh.svg" alt="" className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/collection?has3d=true">
                <a
                  className="
      group
      inline-flex items-center gap-1.5
      px-4 py-2
      text-sm sm:text-base
      rounded-[10px]
      bg-white/10 backdrop-blur-[20px]
      border-b border-white/50
      text-body-color font-medium
      shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)]
      hover:bg-[var(--btn-primary-hover)] 
      hover:text-white 
      transition-colors
    "
                >
                  {/* Light mode icon */}
                  <img
                    src="/box-bl.svg"
                    alt=""
                    className="dark:hidden w-4 h-4 transition duration-300 ease-in-out group-hover:invert"
                  />

                  {/* Dark mode icon */}
                  <img
                    src="/box-wh.svg"
                    alt=""
                    className="hidden dark:block w-4 h-4 transition duration-300 ease-in-out group-hover:invert"
                  />

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
      <section className="pb-[50px] bg-section-white">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-heading-dark mb-1.5">
              Featured Artifacts
            </h2>
            <p className="text-body-color">Highlights from our collection</p>
          </div>

          {/* Cards Grid */}
          <div className="mt-8 overflow-x-auto horizontal-scroll">
            <div className="flex gap-6 min-w-max lg:grid lg:grid-cols-3 lg:min-w-0">
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
                  <div className="min-w-[280px] lg:min-w-0" key={artifact.id}>
                    <NewArtifactCard artifact={artifact} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* View All Button */}
          <div className="flex items-center justify-center mt-8">
            <Link href="/collection?featured=true">
              <a className="flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-[10px] bg-btn-secondary text-primary-blue text-base font-medium w-full max-w-[180px] backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:bg-[var(--btn-secondary-hover)] transition-colors">
                View All
                <img src="/right-blue.svg" alt="" className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore by Category Section */}
      <section className="py-[45px] bg-section-gray">
        <div className="container-fluid px-4 mx-auto max-w-[900px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-heading-dark mb-1.5">
              Explore by Category
            </h2>
            <p className="text-body-color">Browse our collection by artifact type</p>
          </div>

          {/* Category Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-9">
            {categories?.slice(0, 6).map((category) => (
              <NewCategoryCard key={category.id} category={category} />
            ))}
          </div> */}
          <div className="mt-9 overflow-x-auto pb-2 horizontal-scroll">
            <div className="flex gap-6 min-w-max lg:grid lg:grid-cols-3 lg:min-w-0 horizontal-scroll">
              {categories?.slice(0, 6).map((category) => (
                <div key={category.id} className="min-w-[220px] lg:min-w-0">
                  <NewCategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newly Added Section */}
      <section className="py-[45px] bg-section-white">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[32px] font-bold text-heading-dark mb-1.5">
              Newly Added
            </h2>
            <p className="text-body-color">Latest additions to our collection</p>
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
              <a className="flex items-center justify-center gap-2.5 w-full px-[22px] py-[10px] rounded-[10px] bg-btn-secondary text-primary-blue text-base font-medium w-full max-w-[180px] backdrop-blur-[20px] border-b border-white/50 shadow-[inset_4px_4px_4px_rgba(0,0,0,0.08),4px_4px_4px_rgba(0,0,0,0.04)] hover:bg-[var(--btn-secondary-hover)] transition-colors">
                View All
                <img src="/right-blue.svg" alt="" className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-section-white">
        <div className="container-fluid px-4 mx-auto max-w-[1440px] pb-[50px]">
          <section className="text-center rounded-[10px] px-11 py-11 bg-vision-section backdrop-blur-[20px] shadow-[inset_4px_4px_4px_rgba(0,0,0,0.04),4px_4px_4px_rgba(0,0,0,0.04)]">
            <p className="text-accent-red text-sm tracking-[3px] font-normal mb-3">
              The Vision
            </p>
            <h2 className="text-[32px] font-bold text-primary-blue mb-2.5">
              Preserving Heritage through Innovation
            </h2>
            <p className="text-muted-gray mb-6">
              The EBC Museum bridges the gap between Cambodia's ancient past and the digital future. Our initiative utilizes advanced 3D technology to preserve and showcase the nation's cultural treasures—from Angkorian temple carvings to the intricate artistry of shadow puppets. By creating high-fidelity digital twins of these artifacts, we provide an interactive gateway for global education and research. We are committed to ensuring that the soul of our heritage remains accessible, protected, and inspiring for a modern, tech-driven world.
            </p>
            <Link href="/collection?has3d=true">
              <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-btn-primary text-white font-medium shadow-[inset_2px_2px_2px_rgb(255_255_255_/_25%)] hover:bg-[var(--btn-primary-hover)] transition-colors">
                <img src="/box-wh.svg" alt="" className="w-4 h-4" />
                View 3D Collection
              </a>
            </Link>
          </section>
        </div>
      </section>
      {/* Footer */}
      <NewFooter />
    </div>
  );
}