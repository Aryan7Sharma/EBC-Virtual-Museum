import { Link } from "wouter";
import { MapPin, Mail } from "lucide-react";

export function NewFooter() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-hero-gradient py-10 sm:py-12 backdrop-blur-[20px] shadow-[inset_4px_4px_4px_rgba(0,0,0,0.04),4px_4px_4px_rgba(0,0,0,0.04)]">
        <div className="px-4 mx-auto max-w-[1440px]">
          
          {/* GRID instead of flex */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {/* Column 1 */}
            <div className="text-center sm:text-left">
              <div className="mb-4">
                <img src="/ebc-footer.png" alt="EBC Museum" className="h-10 mx-auto sm:mx-0" />
              </div>
              <p className="text-muted-gray leading-[24px] text-sm sm:text-base max-w-[356px] mx-auto sm:mx-0">
                Discover the wonders of ancient civilizations through our curated collection of artifacts and interactive 3D experiences.
              </p>
            </div>

            {/* Column 2 */}
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl text-[#EE4035] font-bold tracking-[2px] sm:tracking-[3px] mb-4 sm:mb-6">
                Explore
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/collection">
                    <a className="text-muted-gray hover:text-[#EE4035] transition-colors">
                      Collection
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/collection?featured=true">
                    <a className="text-muted-gray hover:text-[#EE4035] transition-colors">
                      Featured Artifacts
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="text-muted-gray hover:text-[#EE4035] transition-colors">
                      About
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl text-[#EE4035] font-bold tracking-[2px] sm:tracking-[3px] mb-4 sm:mb-6">
                Visit
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start justify-center sm:justify-start gap-2 text-muted-gray">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>123 EBC Street Art District, AD 10001</span>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-gray" />
                  <a
                    href="mailto:contact@ebcmuseum.org"
                    className="text-muted-gray hover:text-[#EE4035] transition-colors"
                  >
                    contact@ebcmuseum.org
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="bg-[#1A75BB] py-4">
        <div className="px-4 mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-white text-sm sm:text-base">
              © 2026 EBC Museum. All rights reserved.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
              <Link href="/privacy">
                <a className="text-white hover:underline text-sm sm:text-base">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-white hover:underline text-sm sm:text-base">
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
