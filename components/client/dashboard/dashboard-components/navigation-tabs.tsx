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
    },
    {
      name: "Auth",
      icon: Shield,
    },
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Invoices",
      icon: FileText,
    },
    {
      name: "Surveys",
      icon: BarChart3,
    },
    {
      name: "On-Site",
      icon: MapPin,
    },
    {
      name: "Trips",
      icon: Route,
    },
    {
      name: "Prospects",
      icon: UserPlus,
    },
    {
      name: "Clients",
      icon: Building2,
    },
    {
      name: "Agents",
      icon: Users2,
    },
    {
      name: "Payments",
      icon: CreditCard,
    },
    {
      name: "Team",
      icon: Users,
    },
    {
      name: "Summary",
      icon: PieChart,
    },
  ];

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-1">
        {/* Scrollable tabs container */}
        <div className="main-tabs-scroll flex items-center space-x-1 overflow-x-auto overflow-y-hidden flex-1 scrollbar-hide">
          {tabs.map(({ name, icon: Icon }) => (
            <div key={name} className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(name)}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-gray-50 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1",
                  "flex items-center gap-2 min-w-fit",
                  "whitespace-nowrap",
                  activeTab === name
                    ? "text-blue-700 bg-blue-50 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    activeTab === name ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span className="font-medium">
                  {name}
                </span>
              </Button>
              {activeTab === name && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
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
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
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
    </div>
  );
}
