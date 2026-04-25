import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function NewHeader() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const isHome = location === "/";
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-5 bg-card/10 backdrop-blur-[20px] shadow-lg border-b border-border/50">
      <div className="container-fluid px-4 mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 w-[18%]">
            <Link href="/">
              <a className="block">
                <img src="/logo.png" alt="EBC" className="h-12" />
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3" aria-label="Main menu">
            <Link href="/">
              <a className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location === "/" 
                  ? "bg-primary text-primary-foreground shadow-inner" 
                  : "text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}>
                Home
              </a>
            </Link>
            <Link href="/collection">
              <a className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location === "/collection" 
                  ? "bg-primary text-primary-foreground shadow-inner" 
                  : "text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}>
                Collection
              </a>
            </Link>
            <Link href="/about">
              <a className={`px-4 py-2 rounded-lg font-medium transition-all ${
                location === "/about" 
                  ? "bg-primary text-primary-foreground shadow-inner" 
                  : "text-foreground hover:bg-primary hover:text-primary-foreground"
              }`}>
                About
              </a>
            </Link>
          </nav>

          {/* Right Side - Search & Auth */}
          <div className="flex items-center gap-6 w-[18%] justify-end">
            <button 
              className="p-2 hover:opacity-70 transition-opacity text-foreground"
              aria-label="Search"
            >
              <a href="/collection"><Search className="w-5 h-5" /></a>
            </button>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.profileImageUrl || undefined}
                        alt={user.firstName || "User"}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.firstName?.[0] ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p
                      className="text-sm font-medium"
                      data-testid="text-user-name"
                    >
                      {user.firstName} {user.lastName}
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      data-testid="text-user-email"
                    >
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" data-testid="link-admin">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/signin">
                  <a className="hidden md:block text-foreground font-medium hover:text-primary transition-colors">
                    SIGN IN
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="hidden md:block px-5 py-2 rounded-full bg-card/10 backdrop-blur-sm border border-border shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-medium">
                    SIGN UP
                  </a>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 bg-primary text-primary-foreground rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-card/90 backdrop-blur-[20px] rounded-lg shadow-lg border border-border">
            <nav className="flex flex-col gap-2">
              <Link href="/">
                <a className={`px-4 py-2 rounded-lg font-medium text-center transition-all ${
                  location === "/" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/collection">
                <a className={`px-4 py-2 rounded-lg font-medium text-center transition-all ${
                  location === "/collection" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                }`}>
                  Collection
                </a>
              </Link>
              <Link href="/about">
                <a className={`px-4 py-2 rounded-lg font-medium text-center transition-all ${
                  location === "/about" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-muted"
                }`}>
                  About
                </a>
              </Link>

              {!isAuthenticated && (
                <div className="flex gap-2 mt-2">
                  <Link href="/signin">
                    <a className="flex-1 px-4 py-2 rounded-lg font-medium text-center bg-muted text-foreground hover:bg-muted/80 transition-all">
                      SIGN IN
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className="flex-1 px-4 py-2 rounded-lg font-medium text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                      SIGN UP
                    </a>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}