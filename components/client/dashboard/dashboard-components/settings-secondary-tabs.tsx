"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  CreditCard,
  FileText,
  Shield,
  FileCheck,
  FolderOpen,
  BarChart3,
  Mail,
  Bell,
  Eye,
  Monitor,
  Zap,
  Lock,
  Cross,
} from "lucide-react";

interface SettingsSecondaryTabsProps {
  activeSubsection: string;
  onSubsectionChange: (subsection: string) => void;
}

export function SettingsSecondaryTabs({
  activeSubsection,
  onSubsectionChange,
}: SettingsSecondaryTabsProps) {
  const subsections = [
    {
      name: "Company",
      icon: Building2,
      color: "from-blue-500/20 to-indigo-500/20",
    },
    {
      name: "Users",
      icon: Users,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      name: "Payment Methods",
      icon: CreditCard,
      color: "from-purple-500/20 to-violet-500/20",
    },
    {
      name: "Invoice Items",
      icon: FileText,
      color: "from-orange-500/20 to-amber-500/20",
    },
    {
      name: "Travel Insurance",
      icon: Shield,
      color: "from-red-500/20 to-rose-500/20",
    },
    {
      name: "Terms & Conditions",
      icon: FileCheck,
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      name: "Supporting Trip Docs",
      icon: FolderOpen,
      color: "from-slate-500/20 to-gray-500/20",
    },
    {
      name: "Surveys",
      icon: BarChart3,
      color: "from-pink-500/20 to-rose-500/20",
    },
    {
      name: "Email Templates",
      icon: Mail,
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      name: "Email Notifications",
      icon: Bell,
      color: "from-yellow-500/20 to-orange-500/20",
    },
    {
      name: "Access Control",
      icon: Lock,
      color: "from-gray-500/20 to-slate-500/20",
    },
    {
      name: "Accessibility Testing",
      icon: Eye,
      color: "from-cyan-500/20 to-blue-500/20",
    },
    {
      name: "Browser Compatibility",
      icon: Monitor,
      color: "from-emerald-500/20 to-green-500/20",
    },
    {
      name: "Performance Testing",
      icon: Zap,
      color: "from-yellow-500/20 to-amber-500/20",
    },
    {
      name: "Security Testing",
      icon: Shield,
      color: "from-red-500/20 to-pink-500/20",
    },
    {
      name: "Cross-Section Testing",
      icon: Cross,
      color: "from-violet-500/20 to-purple-500/20",
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-lg border border-border/30 shadow-sm">
      <div className="flex items-center justify-between p-1">
        {/* Scrollable subsections container */}
        <div className="settings-tabs-scroll flex items-center space-x-0.5 overflow-x-auto overflow-y-hidden flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
          {subsections.map(({ name, icon: Icon, color }) => (
            <div key={name} className="relative group flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubsectionChange(name)}
                className={cn(
                  "relative px-2 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out",
                  "hover:scale-102 hover:shadow-sm rounded-md",
                  "focus:outline-none focus:ring-1 focus:ring-primary/20",
                  "flex items-center gap-1.5 min-w-fit",
                  "backdrop-blur-sm whitespace-nowrap",
                  activeSubsection === name
                    ? `text-primary bg-gradient-to-r ${color} shadow-md border border-primary/15`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon
                  className={cn(
                    "h-3 w-3 transition-transform duration-150",
                    activeSubsection === name ? "scale-105" : "group-hover:scale-105"
                  )}
                />
                <span className="relative z-10 font-medium">
                  {name}
                </span>
                {activeSubsection === name && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/8 to-primary/3 rounded-md" />
                )}
              </Button>
              {activeSubsection === name && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full shadow-sm" />
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex items-center gap-0.5 ml-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              const container = document.querySelector(".settings-tabs-scroll");
              if (container) {
                container.scrollLeft -= 150;
              }
            }}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              const container = document.querySelector(".settings-tabs-scroll");
              if (container) {
                container.scrollLeft += 150;
              }
            }}
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {/* Subtle border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
    </div>
  );
}
