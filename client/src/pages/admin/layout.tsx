import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Box, LayoutDashboard, MessageSquare, Users, FolderTree, Settings, ArrowLeft, Menu, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/artifacts", label: "Artifacts", icon: Box },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  //{ href: "/admin/users", label: "Users", icon: Users },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

function SidebarContent() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2" data-testid="link-admin-home">
          {/* <Box className="h-6 w-6 text-primary" /> */}
          <img src="/logo.png" alt="EBC" className="h-12 w-auto object-contain" />
          {/* <span className="font-serif text-lg font-semibold">Admin</span> */}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1" data-testid="admin-nav">
        {sidebarLinks.map((link) => {
          const isActive = location === link.href ||
            (link.href !== "/admin" && location.startsWith(link.href));

          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2", isActive && "bg-primary text-white")}
                data-testid={`link-admin-${link.label.toLowerCase()}`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-2" data-testid="link-back-to-site">
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoggingOut) {
      toast({
        title: "Access Denied",
        description: "Please sign in to access the admin panel.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/v1/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background" data-testid="admin-layout">
      <aside className="hidden lg:block w-64 border-r border-border bg-sidebar shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* <header className="h-14 border-b border-border bg-background flex items-center justify-between gap-4 px-4" data-testid="admin-header">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block" data-testid="text-admin-user">
                {user?.firstName + '(Admin)' || user?.email + '(Admin)'} 
              </span>
            </div>
          </div>
        </header> */}


        <header className="h-14 border-b border-border bg-background flex items-center justify-between gap-4 px-4" data-testid="admin-header">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex-1 lg:hidden" />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              {/* Desktop & Tablet - Dropdown Menu */}
              <div className="hidden sm:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium" data-testid="text-admin-user">
                        {user?.firstName ? `${user.firstName} (Admin)` : `${user?.email} (Admin)`}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile - Avatar + Logout Button */}
              <div className="flex sm:hidden items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  data-testid="button-logout-mobile"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
