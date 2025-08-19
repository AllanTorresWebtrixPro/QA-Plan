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
      disabled: false,
    },
    {
      name: "Users",
      icon: Users,
      disabled: false,
    },
    {
      name: "Payment Methods",
      icon: CreditCard,
      disabled: false,
    },
    {
      name: "Invoice Items",
      icon: FileText,
      disabled: false,
    },
    {
      name: "Travel Insurance",
      icon: Shield,
      disabled: false,
    },
    {
      name: "Terms & Conditions",
      icon: FileCheck,
      disabled: false,
    },
    {
      name: "Supporting Trip Docs",
      icon: FolderOpen,
      disabled: false,
    },
    {
      name: "Surveys",
      icon: BarChart3,
      disabled: false,
    },
    {
      name: "Email Templates",
      icon: Mail,
      disabled: false,
    },
    {
      name: "Email Notifications",
      icon: Bell,
      disabled: false,
    },
    {
      name: "Access Control",
      icon: Lock,
      disabled: false,
    },
    {
      name: "Accessibility Testing",
      icon: Eye,
      disabled: true,
    },
    {
      name: "Browser Compatibility",
      icon: Monitor,
      disabled: true,
    },
    {
      name: "Performance Testing",
      icon: Zap,
      disabled: true,
    },
    {
      name: "Security Testing",
      icon: Shield,
      disabled: true,
    },
    {
      name: "Cross-Section Testing",
      icon: Cross,
      disabled: true,
    },
  ];

  // Filter out disabled subsections
  const enabledSubsections = subsections.filter(subsection => !subsection.disabled);

  return (
    <div className="relative bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-1">
        {/* Scrollable subsections container */}
        <div className="settings-tabs-scroll flex items-center space-x-1 overflow-x-auto overflow-y-hidden flex-1 scrollbar-hide">
          {enabledSubsections.map(({ name, icon: Icon }) => (
            <div key={name} className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubsectionChange(name)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "hover:bg-white rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1",
                  "flex items-center gap-2 min-w-fit",
                  "whitespace-nowrap",
                  activeSubsection === name
                    ? "text-blue-700 bg-white border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    activeSubsection === name ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span className="font-medium">
                  {name}
                </span>
              </Button>
              {activeSubsection === name && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-white"
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
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 hover:bg-white"
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
    </div>
  );
}
