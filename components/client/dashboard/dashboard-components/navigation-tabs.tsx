"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Shield,
  FileText,
  MapPin,
  Route,
  UserPlus,
  Building2,
  Users2,
  CreditCard,
  Users,
  PieChart,
  Settings,
} from "lucide-react";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationTabs({
  activeTab,
  onTabChange,
}: NavigationTabsProps) {
  const tabs = [
    {
      name: "All",
      icon: BarChart3,
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      name: "Auth",
      icon: Shield,
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      name: "Settings",
      icon: Settings,
      color: "from-slate-500/20 to-gray-500/20",
    },
    {
      name: "Invoices",
      icon: FileText,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      name: "Surveys",
      icon: BarChart3,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      name: "On-Site",
      icon: MapPin,
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      name: "Trips",
      icon: Route,
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      name: "Prospects",
      icon: UserPlus,
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      name: "Clients",
      icon: Building2,
      color: "from-gray-500/20 to-slate-500/20",
    },
    {
      name: "Agents",
      icon: Users2,
      color: "from-violet-500/20 to-purple-500/20",
    },
    {
      name: "Payments",
      icon: CreditCard,
      color: "from-emerald-500/20 to-green-500/20",
    },
    {
      name: "Team",
      icon: Users,
      color: "from-rose-500/20 to-pink-500/20",
    },
    {
      name: "Summary",
      icon: PieChart,
      color: "from-amber-500/20 to-yellow-500/20",
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-background via-background/95 to-background rounded-xl border border-border/50 shadow-lg shadow-black/5">
      <div className="flex items-center justify-between p-2">
        {/* Scrollable tabs container */}
        <div className="main-tabs-scroll flex items-center space-x-0.5 overflow-x-auto overflow-y-hidden flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
          {tabs.map(({ name, icon: Icon, color }) => (
            <div key={name} className="relative group flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(name)}
                className={cn(
                  "relative px-3 py-3 text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out",
                  "hover:scale-105 hover:shadow-md rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
                  "flex items-center gap-1.5 sm:gap-2 min-w-fit",
                  "backdrop-blur-sm whitespace-nowrap",
                  activeTab === name
                    ? `text-primary bg-gradient-to-r ${color} shadow-lg border border-primary/20`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200",
                    activeTab === name ? "scale-110" : "group-hover:scale-110"
                  )}
                />
                <span className="relative z-10 font-semibold hidden sm:inline">
                  {name}
                </span>
                <span className="relative z-10 font-semibold sm:hidden">
                  {name.length > 3 ? name.substring(0, 3) : name}
                </span>
                {activeTab === name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg animate-pulse" />
                )}
              </Button>
              {activeTab === name && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 sm:w-3 sm:h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse shadow-lg" />
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              const container = document.querySelector(".main-tabs-scroll");
              if (container) {
                container.scrollLeft -= 200;
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              const container = document.querySelector(".main-tabs-scroll");
              if (container) {
                container.scrollLeft += 200;
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Enhanced border bottom with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
    </div>
  );
}
