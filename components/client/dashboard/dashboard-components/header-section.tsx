"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          MTP Application QA Plan
        </h1>
      </div>

      {/* User Switcher */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Current User:</span>
        <div className="flex gap-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant={currentUser === user.id ? "default" : "outline"}
              size="sm"
              onClick={() => onUserSwitch(user.id)}
              className="flex items-center gap-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              {user.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
