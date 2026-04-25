import { Link } from "wouter";
import { MapPin, Mail } from "lucide-react";

export function NewFooter() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gradient-to-t from-[rgb(99_177_236_/_20%)] to-transparent py-10 backdrop-blur-[20px] shadow-[inset_4px_4px_4px_rgba(0,0,0,0.04),4px_4px_4px_rgba(0,0,0,0.04)]">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          <div className="flex flex-wrap -mx-4">
            {/* Column 1 - Logo & Description */}
            <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
              <div className="mb-6">
                <img src="/ebc-footer.png" alt="EBC Museum" className="h-12" />
              </div>
              <p className="text-[#616161] leading-[25px] max-w-[356px]">
                Discover the wonders of ancient civilizations through our curated collection of artifacts and interactive 3D experiences.
              </p>
            </div>

            {/* Column 2 - Explore */}
            <div className="w-full md:w-[28%] px-4 mb-8 md:mb-0">
              <h3 className="text-2xl text-[#EE4035] font-bold tracking-[3px] mb-8">
                Explore
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/collection">
                    <a className="text-[#616161] hover:text-[#EE4035] transition-colors">
                      Collection
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/collection?featured=true">
                    <a className="text-[#616161] hover:text-[#EE4035] transition-colors">
                      Featured Artifacts
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="text-[#616161] hover:text-[#EE4035] transition-colors">
                      About
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Visit */}
            <div className="w-full md:w-[22%] px-4">
              <h3 className="text-2xl text-[#EE4035] font-bold tracking-[3px] mb-8">
                Visit
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-[#616161]">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>123 EBC Street Art District, AD 10001</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#616161]" />
                  <a href="mailto:contact@ebcmuseum.org" className="text-[#616161] hover:text-[#EE4035] transition-colors">
                    contact@ebcmuseum.org
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="bg-[#1A75BB] py-5">
        <div className="container-fluid px-4 mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-white m-0">
              © 2026 EBC Museum. All rights reserved.
            </p>
            <div className="flex items-center gap-9">
              <Link href="/privacy">
                <a className="text-white hover:underline">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-white hover:underline">
                  Terms of Service
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}