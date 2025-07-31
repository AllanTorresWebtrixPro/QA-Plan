"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Check } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface HeaderSectionProps {
  users: User[];
  currentUser: string;
  onUserSwitch: (userId: string) => void;
}

export function HeaderSection({
  users,
  currentUser,
  onUserSwitch,
}: HeaderSectionProps) {
  // Get current user object
  const currentUserObject =
    users.find((user) => user.id === currentUser) || users[0];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          MTP Application QA Plan
        </h1>
      </div>

      {/* User Switcher with Database Dropdown */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Current User:</span>

        {/* Main Dropdown for Database Users */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[180px]"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {currentUserObject?.avatar || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium truncate">
                {currentUserObject?.name || "Select User"}
              </span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
              Switch User
            </div>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => onUserSwitch(user.id)}
                className={`flex items-center gap-3 cursor-pointer py-2 ${
                  currentUser === user.id ? "bg-accent" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  {currentUser === user.id && (
                    <div className="text-xs text-muted-foreground">
                      Current User
                    </div>
                  )}
                </div>
                {currentUser === user.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Access Buttons for Database Users */}
        <div className="flex gap-1">
          {users.map((user) => (
            <Button
              key={user.id}
              variant={currentUser === user.id ? "default" : "outline"}
              size="sm"
              onClick={() => onUserSwitch(user.id)}
              className="flex items-center gap-1 px-2"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs hidden sm:inline">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
