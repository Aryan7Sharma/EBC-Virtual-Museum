import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function NewHomeHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="new-home-header">
      <div className="container-fluid">
        <div className="row">
          {/* Logo */}
          <div className="col-md-3 logo-grid">
            <Link href="/">
              <a aria-label="EBC Home">
                <img src="/logo.png" alt="EBC logo" />
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <div className="col-md-6 nav-grid">
            <nav aria-label="Main menu">
              <button
                className="menu-toggle"
                aria-expanded={isMenuOpen}
                aria-controls="main-menu"
                aria-label="Toggle main menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="ml-2">Menu</span>
              </button>

              <ul id="main-menu" className={isMenuOpen ? "active" : ""}>
                <li>
                  <Link href="/">
                    <a className={location === "/" ? "active" : ""}>Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/collection">
                    <a className={location === "/collection" ? "active" : ""}>Collection</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className={location === "/about" ? "active" : ""}>About</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Search and Auth */}
          <div className="col-md-3 header-right-grid">
            <button className="header-search-outer" aria-label="Search">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <div className="user-info">
                <span>{user?.firstName || "User"}</span>
              </div>
            ) : (
              <>
                <Link href="/signin">
                  <a>SIGN IN</a>
                </Link>
                <Link href="/signup">
                  <a className="sign-up-btn">SIGN UP</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}