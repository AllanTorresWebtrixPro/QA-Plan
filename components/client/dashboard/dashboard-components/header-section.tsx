"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface HeaderSectionProps {
  users: User[];
  selectedUserFilter: string;
  onUserFilterChange: (userId: string) => void;
}

export function HeaderSection({
  users,
  selectedUserFilter,
  onUserFilterChange,
}: HeaderSectionProps) {
  // Get selected user object
  const selectedUser = selectedUserFilter === "all" ? null : users.find((user) => user.id === selectedUserFilter);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          MTP Application QA Plan
        </h1>
      </div>

      {/* User Filter Dropdown */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Filter by User:</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[180px]"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {selectedUserFilter === "all" ? "All" : selectedUser?.avatar || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium truncate">
                {selectedUserFilter === "all" ? "All Users" : selectedUser?.name || "Unknown User"}
              </span>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b">
              Filter Tests
            </div>
            <DropdownMenuItem
              onClick={() => onUserFilterChange("all")}
              className={`flex items-center gap-3 cursor-pointer py-2 ${
                selectedUserFilter === "all" ? "bg-accent" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  All
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">All Users</div>
                {selectedUserFilter === "all" ? (
                  <div className="text-xs text-muted-foreground">
                    Currently selected
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Show all test results
                  </div>
                )}
              </div>
            </DropdownMenuItem>
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => onUserFilterChange(user.id)}
                className={`flex items-center gap-3 cursor-pointer py-2 ${
                  selectedUserFilter === user.id ? "bg-accent" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  {selectedUserFilter === user.id && (
                    <div className="text-xs text-muted-foreground">
                      Currently selected
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
