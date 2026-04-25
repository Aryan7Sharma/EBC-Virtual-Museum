import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location === "/";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
            <Box className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              EBC
            </span>
          </Link> */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            data-testid="link-home"
          >
            <img
              src="/ebc-logo.png"
              alt="EBC Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            {/* Desktop - Full Name */}
            <div className="hidden lg:flex flex-col leading-tight">
            </div>
            {/* Mobile/Tablet - Abbreviated */}
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium ${
                    location === link.href ? "text-blue" : ""
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/collection">
              <Button variant="ghost" size="icon" data-testid="button-search">
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <ThemeToggle />

            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
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
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm" data-testid="button-signin">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={location === link.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        data-testid={`link-mobile-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  {isAuthenticated && user?.role === "admin" && (
                    <>
                      <Link href="/admin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="link-mobile-admin"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      <Link href="/signin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="link-mobile-signin"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button
                          variant="default"
                          className="w-full justify-start"
                          data-testid="link-mobile-signup"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
