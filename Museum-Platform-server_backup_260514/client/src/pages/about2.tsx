import { Link } from "wouter";
import { ArrowRight, Box, Globe, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/main-layout";
import { NewHeader } from "@/components/new-home/header";
import { NewFooter } from "@/components/new-home/footer";

export default function AboutPage() {
  const stats = [
    { icon: Box, label: "Artifacts", value: "500+" },
    { icon: Globe, label: "Regions", value: "25" },
    { icon: Users, label: "Visitors", value: "10K+" },
    { icon: Calendar, label: "Years of History", value: "5000+" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[linear-gradient(180deg,rgba(232,245,255,1)_0%,rgba(255,255,255,1)_100%)]">
        <NewHeader />
      
      {/* Hero Section */}
      <section className="bg-card  pt-[130px] pb-12 px-4 sm:px-6 lg:px-8" data-testid="about-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold mb-6" data-testid="text-about-title">
            About EBC Museum
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-about-intro">
            Dedicated to preserving and sharing Cambodia's economic and monetary heritage through immersive digital experiences and cutting-edge 3D technology, fostering a deeper understanding of our national identity.
          </p>
        </div>
      </section>

      <div data-testid="about-page">
        {/* Stats Section */}
        <section className="bg-card py-16" data-testid="about-stats">
          <div className="container-fluid px-4 mx-auto max-w-[1440px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="font-serif text-3xl font-semibold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted py-20" data-testid="about-mission">
          <div className="container-fluid px-4 mx-auto max-w-[1440px] text-justify">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">The Genesis of the EBC 3D Museum</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The EBC 3D Museum of Artifacts was established by Educational Broadcasting Cambodia (EBC) to solve a critical challenge: making Cambodia's
                  vast historical treasures accessible to a digital-first generation. Launched as part of a national initiative to modernize education, the
                  museum functions as a high-tech intersection where traditional curatorial practices meet modern data science.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">A Technological Safeguard</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At the core of the museum is the use of high-fidelity 3D scanning and photogrammetry. These tools allow for the capture of artifacts
                  with sub-millimeter precision, documenting everything from the weathering on ancient stone to the vibrant pigments of traditional
                  textiles. By housing these digital assets within a permanent virtual vault, EBC creates a redundant layer of protection for Cambodia's
                  physical history, ensuring that even if physical artifacts are subject to the passage of time, their digital likeness remains perfect and permanent.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">Bridging the Digital Divide</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The platform was engineered to democratize culture, fundamentally shifting how heritage is consumed. Previously, the specialized
                  knowledge and visual splendor of Cambodia's history were largely confined to physical galleries in the capital. The EBC 3D
                  Museum breaks these geographic constraints, providing a high-performance digital library that is accessible via smartphones
                  and computers in even the most remote provinces. This allows the museum to serve as a decentralized educational hub,
                  bringing the gallery directly to the student.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">The Immersive Shift</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By integrating Augmented Reality (AR) and Virtual Reality (VR), the museum evolves beyond the limitations of traditional media.
                  Instead of viewing a flat image in a textbook, users can "place" a 3D artifact in their own classroom or walk through a virtual
                  reconstruction of a temple site. This merging of historical artifacts with immersive technology transforms passive observation
                  into an interactive journey. This hands-on engagement fosters a deep-seated national pride and ensures that Cambodia's "living
                  history" thrives and remains relevant within the 21st-century digital landscape.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To democratize Cambodian heritage by blending history with 3D innovation, inspiring a globally connected and empowered generation of learners.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To empower all Cambodians to reclaim their heritage through a world-class digital gateway, bridging our storied past with a future of immersive 3D
                  education and global cultural pride.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="container-fluid px-4 mx-auto max-w-[1440px] my-[50px]">
          <section className="text-center rounded-[10px] px-11 py-11 bg-accent/30 backdrop-blur-[20px] shadow-lg">
            <p className="text-secondary text-sm tracking-[3px] font-normal mb-3">
              The Vision
            </p>
            <h2 className="text-[32px] font-bold text-primary mb-2.5">
              Start Exploring
            </h2>
            <p className="text-muted-foreground mb-6">
              Discover the wonders of human history through our extensive collection
              of artifacts from around the world.
            </p>
            <Link href="/collection?has3d=true">
              <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors">
                <Box className="w-4 h-4" />
                View 3D Collection
              </a>
            </Link>
          </section>
        </div>
      </div>
      
      <NewFooter />
    </div>
    </div>
  );
}