import { Link } from "wouter";
import {
  Laptop,
  GraduationCap,
  Book,
  Monitor,
  Facebook,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";

export function NewFooter() {
  return (
    <>
      {/* Main Footer */}
      <footer className="bg-section-gray py-10 sm:py-12 lg:py-16">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[1440px]">

          {/* Grid Layout: stacks on mobile, 2-col on tablet, 4-col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Column 1: Logo and Social Icons */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="mb-6">
                <img
                  src="/ebc-logo.png"
                  alt="EBC Educational Broadcasting Cambodia"
                  className="h-12 sm:h-14"
                />
              </div>

              {/* Social Media Icons Row 1 */}
              <div className="flex gap-3 mb-3">
                <a
                  href="https://ebc.edu.kh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="EBC Website"
                >
                  <Laptop className="w-5 h-5" />
                </a>
                <a
                  href="https://elearning.ebc.edu.kh/?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="E-Learning"
                >
                  <GraduationCap className="w-5 h-5" />
                </a>
                <a
                  href="https://elibrary.ebc.edu.kh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="E-Library"
                >
                  <Book className="w-5 h-5" />
                </a>
                <a
                  href="https://iptv.ebc.edu.kh/iptv/channel/1.m3u8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="IPTV"
                >
                  <Monitor className="w-5 h-5" />
                </a>
              </div>

              {/* Social Media Icons Row 2 */}
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/EducationalBroadcastingCambodia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@EBC_Cambodia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#ee4035] flex items-center justify-center text-white hover:bg-[#c0302a] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@ebcambodia?_t=ZS-90VgAwHvhS5&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/educationalbroadcastingcambodia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1A75BB] flex items-center justify-center text-white hover:bg-[#155a94] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-xl sm:text-2xl font-bold text-[#EE4035] mb-4 sm:mb-6">
                Quick Links
              </h3>
              {/* Two sub-columns of links side by side */}
              <div className="flex gap-8 sm:gap-10">
                <ul className="space-y-2 text-center text-sm sm:text-base sm:text-left">
                  {[
                    { label: "Steering Committee", href: "https://ebc.edu.kh/en/steering-committees/" },
                    { label: "About EBC", href: "https://ebc.edu.kh/en/about-us/" },
                    { label: "What We Do", href: "https://ebc.edu.kh/en/what-we-do/" },
                    { label: "Services & Facilities", href: "https://ebc.edu.kh/en/service-facilities/" },
                    { label: "Platform Ecosystem", href: "https://ebc.edu.kh/en/platformecosystem/#" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-color hover:text-[#EE4035] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2 text-center text-sm sm:text-base sm:text-left">
                  {[
                    { label: "Events", href: "https://ebc.edu.kh/videos/?type=latest-event" },
                    { label: "Scholarships", href: "https://ebc.edu.kh/en/all-scholarships/" },
                    { label: "News", href: "https://ebc.edu.kh/en/news/" },
                    { label: "Programs", href: "https://ebc.edu.kh/en/get-all-programs/" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-color hover:text-[#EE4035] transition-colors"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Support Center */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-xl sm:text-2xl font-bold text-[#EE4035] mb-4 sm:mb-6">
                Support Center
              </h3>
              <ul className="space-y-2 text-sm text-center sm:text-base sm:text-left">
                {[
                  { label: "Support", href: "https://t.me/ebc_support" },
                  { label: "Ticketing Support", href: "https://docs.google.com/forms/d/e/1FAIpQLSeLiSQZZc9fNJLml9skiBBy-6WDXpsNwnDbfVfX4PBtJ09NOw/viewform?usp=sharing" },
                  { label: "LMS Teacher Tutorials", href: "https://www.youtube.com/playlist?list=PLxcO_MFWQBDfJRhsDTNPA5lwesdCMKF4d" },
                  { label: "LMS Administrator Tutorials", href: "https://www.youtube.com/playlist?list=PLxcO_MFWQBDcWDGNpPoSbtMbFSKsc3il9" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-color hover:text-[#EE4035] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Us */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-xl sm:text-2xl font-bold text-[#EE4035] mb-4 sm:mb-6">
                Contact us
              </h3>
              <ul className="space-y-3 text-sm sm:text-base w-full">
                <li className="flex justify-center sm:justify-start items-start gap-2">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 fill-[#1a75bb] text-[#f5f5f5]" />
                  <a
                    href="mailto:info@ebc.edu.kh"
                    className="text-body-color hover:text-[#EE4035] transition-colors break-all"
                  >
                    info@ebc.edu.kh
                  </a>
                </li>
                <li className="flex justify-center sm:justify-start items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 fill-[#1a75bb] text-[#f5f5f5]" />
                  <a
                    href="tel:+85512299600"
                    className="text-body-color hover:text-[#EE4035] transition-colors"
                  >
                    +855 12 299 600 (General Information)
                  </a>
                </li>
                <li className="flex justify-center sm:justify-start items-start gap-2">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 fill-[#1a75bb] text-[#f5f5f5]" />
                  <a
                    href="tel:+85510299600"
                    className="text-body-color hover:text-[#EE4035] transition-colors"
                  >
                    +855 10 299 600 (Technical Support)
                  </a>
                </li>
                <li className="flex justify-center sm:justify-start items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 fill-[#1a75bb] text-[#f5f5f5]" />
                  <a
                    href="https://www.google.com/maps/place/EBC+Educational+Broadcasting+Cambodia/@11.537949,104.9068256,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-color hover:text-[#EE4035] transition-colors"
                  >
                    #242, Street. 271, S/k Beoung Tompun, K/h Meanchey, PP, Cambodia.
                  </a>
                </li>
              </ul>

              {/* Message Us Button */}
              <div className="mt-6">
                <a
                  href="mailto:info@ebc.edu.kh?subject=Contact%20from%203D%20Museum"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A75BB] text-white rounded hover:bg-[#155a94] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message us
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#1A75BB] py-4">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[1440px]">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-white text-sm sm:flex-wrap sm:text-center sm:gap-[11px] lg:flex-nowrap lg:text-left lg:gap-0">
            <p className="sm:w-[100%] sm:justify-center lg:justify-start sm:flex sm:text-align sm:gap-[10px] lg:w-[calc(100%-128px)]">© 2026 Educational Broadcasting Cambodia. All Rights Reserved.
              <span className="flex flex-wrap items-center justify-center gap-[8px]">
              <a
                href="https://ebc.edu.kh/en/privacy-policies/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Privacy Policies
              </a>
              <span className="hidden sm:inline">|</span>
              <a
                href="https://ebc.edu.kh/en/term-and-conditions/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Term and Conditions
              </a>
            </span>
            </p>

            <a
              href="https://mptc.gov.kh/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold sm:w-[100%] lg:w-[128px]"
            >
              Powered by MPTC
            </a>
          </div>
        </div>
      </div>
    </>
  );
}