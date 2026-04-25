// import { Link } from "wouter";
// import { useQuery } from "@tanstack/react-query";
// import { Search, Box, ArrowRight, MapPin, Mail } from "lucide-react";
// import { BannerSlider } from "@/components/new-home/banner-slider";
// import { NewHomeHeader } from "@/components/new-home/header";
// import { ArtifactCard3D } from "@/components/new-home/artifact-card-3d";
// import { CategoryCard } from "@/components/new-home/category-card";
// import type { ArtifactWithRelations, Category } from "@shared/schema";
// import "@/styles/new-home.css";
// import "@/styles/new-home-main.css";
// // import 'bootstrap/dist/css/bootstrap-grid.min.css';

// export default function NewHomePage() {
//   // Fetch featured artifacts
//   const { data: featuredArtifacts, isLoading: isLoadingFeatured } = useQuery<ArtifactWithRelations[]>({
//     queryKey: ["/api/v1/artifacts", "featured"],
//     queryFn: async () => {
//       const response = await fetch("/api/v1/artifacts?featured=true&limit=6");
//       if (!response.ok) throw new Error("Failed to fetch featured artifacts");
//       const data = await response.json();
//       return data.artifacts;
//     },
//   });

//   // Fetch categories
//   const { data: categories } = useQuery<Category[]>({
//     queryKey: ["/api/v1/categories"],
//   });

//   // Fetch recent artifacts
//   const { data: recentArtifacts, isLoading: isLoadingRecent } = useQuery<ArtifactWithRelations[]>({
//     queryKey: ["/api/v1/artifacts", "recent"],
//     queryFn: async () => {
//       const response = await fetch("/api/v1/artifacts?sortBy=newest&limit=4");
//       if (!response.ok) throw new Error("Failed to fetch recent artifacts");
//       const data = await response.json();
//       return data.artifacts;
//     },
//   });

//   // Banner slider slides
//   const slides = [
//     { id: "1", imageUrl: "/slider-1.png" },
//     { id: "2", imageUrl: "/slider-2.png" },
//     { id: "3", imageUrl: "/slider-3.png" },
//     { id: "4", imageUrl: "/slider-4.png" },
//     { id: "5", imageUrl: "/slider-5.png" },
//     { id: "6", imageUrl: "/slider-6.png" },
//     { id: "7", imageUrl: "/slider-7.png" },
//     { id: "8", imageUrl: "/slider-3.png" },
//     { id: "9", imageUrl: "/slider-4.png" },
//     { id: "10", imageUrl: "/slider-5.png" },
//   ];

//   return (
//     <div className="new-home-page">
//       {/* Header */}
//       <NewHomeHeader />

//       {/* Hero Section with Banner */}
//       <div className="bg-outer">
//         <div className="banner-outer container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="sub-tag-heading">Digital Museum Experience</div>
//               <h1>Discover the Ancient Treasures of</h1>
//               <h2>Khmer Civilization</h2>
//               <p>
//                 Explore our extensive collection of heritage from across Cambodia throughout different eras.
//                 Experience our Khmer history through interactive 3D models and curated exhibitions.
//               </p>
//               <div className="banner-btn-outer">
//                 <Link href="/collection">
//                   <a className="btn-primary">
//                     Explore Collection <img src="/right-wh.svg" alt="" />
//                   </a>
//                 </Link>
//                 <Link href="/collection?has3d=true">
//                   <a className="btn-secondary">
//                     <img src="/box-bl.svg" alt="" /> 3D Gallery
//                   </a>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Banner Slider */}
//       <BannerSlider slides={slides} autoPlay={true} autoPlayInterval={4000} />

//       {/* Featured Artifacts Section */}
//       <section className="featured-artifacts-section">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="heading-outer">
//                 <div className="heading-name">Featured Artifacts</div>
//                 <p>Highlights from our collection</p>
//               </div>
//             </div>

//             {isLoadingFeatured ? (
//               <>
//                 {Array.from({ length: 3 }).map((_, i) => (
//                   <div key={i} className="col-lg-4 col-12 card-3d-grid">
//                     <div className="skeleton-card" />
//                   </div>
//                 ))}
//               </>
//             ) : (
//               featuredArtifacts?.slice(0, 3).map((artifact) => (
//                 <div key={artifact.id} className="col-lg-4 col-12 card-3d-grid">
//                   <ArtifactCard3D artifact={artifact} />
//                 </div>
//               ))
//             )}

//             <div className="col-12 view-btn-grid">
//               <Link href="/collection?featured=true">
//                 <a className="view-btn">
//                   View All <img src="/right-blue.svg" alt="" />
//                 </a>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Explore by Category Section */}
//       <section className="explore-category-section">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="heading-outer">
//                 <div className="heading-name">Explore by Category</div>
//                 <p>Browse our collection by artifact type</p>
//               </div>
//             </div>

//             {categories?.slice(0, 6).map((category) => (
//               <div key={category.id} className="col-lg-4 col-12 category-grid">
//                 <CategoryCard category={category} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newly Added Section */}
//       <section className="newly-added-section">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="heading-outer">
//                 <div className="heading-name">Newly Added</div>
//                 <p>Latest additions to our collection</p>
//               </div>
//             </div>

//             {isLoadingRecent ? (
//               <>
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="col-lg-3 col-12 card-3d-grid">
//                     <div className="skeleton-card" />
//                   </div>
//                 ))}
//               </>
//             ) : (
//               recentArtifacts?.map((artifact) => (
//                 <div key={artifact.id} className="col-lg-3 col-12 card-3d-grid">
//                   <ArtifactCard3D artifact={artifact} />
//                 </div>
//               ))
//             )}

//             <div className="col-12 view-btn-grid">
//               <Link href="/collection?sortBy=newest">
//                 <a className="view-btn">
//                   View All <img src="/right-blue.svg" alt="" />
//                 </a>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Vision Section */}
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-12">
//             <section className="vision-section">
//               <div className="sub-tag-heading">The Vision</div>
//               <div className="vision-heading">Preserving Heritage through Innovation</div>
//               <p>
//                 The EBC Museum bridges the gap between Cambodia's ancient past and the digital future. Our initiative
//                 utilizes advanced 3D technology to preserve and showcase the nation's cultural treasures—from Angkorian
//                 temple carvings to the intricate artistry of shadow puppets. By creating high-fidelity digital twins of
//                 these artifacts, we provide an interactive gateway for global education and research. We are committed to
//                 ensuring that the soul of our heritage remains accessible, protected, and inspiring for a modern,
//                 tech-driven world.
//               </p>
//               <div className="view-collection-btn">
//                 <Link href="/collection?has3d=true">
//                   <a>
//                     <img src="/box-wh.svg" alt="" /> View 3D Collection
//                   </a>
//                 </Link>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer>
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-md-5 col-12 footer-grid">
//               <div className="footer-logo">
//                 <img src="/ebc-footer.png" alt="EBC Museum" />
//               </div>
//               <p>
//                 Discover the wonders of ancient civilizations through our curated collection of artifacts and interactive
//                 3D experiences.
//               </p>
//             </div>

//             <div className="col-md-2 col-12 footer-grid">
//               <div className="footer-head">Explore</div>
//               <ul className="footer-menu">
//                 <li>
//                   <Link href="/collection">Collection</Link>
//                 </li>
//                 <li>
//                   <Link href="/collection?featured=true">Featured Artifacts</Link>
//                 </li>
//                 <li>
//                   <Link href="/about">About</Link>
//                 </li>
//               </ul>
//             </div>

//             <div className="col-md-5 col-12 footer-grid">
//               <div className="footer-head">Visit</div>
//               <ul className="visit-list">
//                 <li>
//                   <MapPin className="inline h-4 w-4" /> 123 EBC Street Art District, AD 10001
//                 </li>
//                 <li>
//                   <Mail className="inline h-4 w-4" /> <a href="mailto:contact@ebcmuseum.org">contact@ebcmuseum.org</a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </footer>

//       {/* Copyright Section */}
//       <div className="copy-right-section">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-12">
//               <div className="copy-right-outer">
//                 <p>© 2026 EBC Museum. All rights reserved.</p>
//                 <div className="copy-right-link-outer">
//                   <Link href="/privacy">Privacy Policy</Link>
//                   <Link href="/terms">Terms of Service</Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }