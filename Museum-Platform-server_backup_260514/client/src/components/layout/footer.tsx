import { Link } from "wouter";
import { Box } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="link-footer-home">
              <Box className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold">EBC</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Discover the wonders of ancient civilizations through our curated collection 
              of artifacts and interactive 3D experiences.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-collection">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/collection?featured=true" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-featured">
                  Featured Artifacts
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-semibold mb-4">Visit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 EBC Street</li>
              <li>Art District, AD 10001</li>
              <li className="pt-2">
                <a href="mailto:info@ebcnmuseum.org" className="hover:text-foreground transition-colors" data-testid="link-footer-email">
                  info@ebcnmuseum.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p data-testid="text-copyright">&copy; {new Date().getFullYear()} EBC Museum. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
