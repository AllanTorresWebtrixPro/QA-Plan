"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FileText,
  Users,
  Database,
  Home,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Search,
  ExternalLink,
} from "lucide-react";

interface MainNavigationProps {
  currentUser?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  onUserSwitch?: (userId: string) => void;
  users?: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
}

export function MainNavigation({
  currentUser,
  onUserSwitch,
  users = [],
}: MainNavigationProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // Default users if none provided
  const defaultUsers = [
    { id: "user-1", name: "John Doe", avatar: "JD", role: "QA Tester" },
    { id: "user-2", name: "Jane Smith", avatar: "JS", role: "QA Lead" },
    { id: "user-3", name: "Bob Johnson", avatar: "BJ", role: "QA Manager" },
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;
  const displayCurrentUser = currentUser || displayUsers[0];
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      description: "Main QA dashboard with overview and progress",
    },
    {
      title: "Test Cases",
      href: "/test-cases",
      icon: FileText,
      description: "View and manage all test cases",
    },
    {
      title: "Users & Progress",
      href: "/users",
      icon: Users,
      description: "Track user progress and performance",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
      description: "Generate reports and analytics",
    },
    {
      title: "Database",
      href: "/database-test",
      icon: Database,
      description: "Database connection and management",
    },

    {
      title: "Basecamp Config",
      href: "/basecamp-config",
      icon: ExternalLink,
      description: "Configure Basecamp integration",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4 ml-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">MTP QA Plan</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2",
                        isActive(item.href) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.user_metadata?.avatar || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">
                    {user.user_metadata?.name || user.email}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push('/profile')}>
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
