"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { isAdmin } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface TestDisableButtonProps {
  testId: string;
  testTitle: string;
  isDisabled: boolean;
  onToggle: (testId: string, newStatus: boolean) => void;
  className?: string;
}

export function TestDisableButton({
  testId,
  testTitle,
  isDisabled,
  onToggle,
  className = "",
}: TestDisableButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  // Only show for admins
  if (!isAdmin(profile)) {
    return null;
  }

  const handleToggle = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "User profile not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/qa/toggle-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          userId: profile.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle test status");
      }

      // Call the parent callback to update the UI
      onToggle(testId, data.test.disabled);

      toast({
        title: "Success",
        description: data.message,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error toggling test status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle test status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actionText = isDisabled ? "Enable" : "Disable";
  const confirmationText = isDisabled 
    ? `Are you sure you want to enable the test "${testTitle}"? This will make it visible to all users.`
    : `Are you sure you want to disable the test "${testTitle}"? This will hide it from testers and exclude it from progress calculations.`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <Badge 
        variant={isDisabled ? "secondary" : "outline"}
        className={`text-xs ${isDisabled ? "bg-gray-100 text-gray-600" : ""}`}
      >
        {isDisabled ? (
          <>
            <EyeOff className="h-3 w-3 mr-1" />
            Disabled
          </>
        ) : (
          <>
            <Eye className="h-3 w-3 mr-1" />
            Enabled
          </>
        )}
      </Badge>

      {/* Toggle Button with Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={isDisabled ? "default" : "outline"}
            size="sm"
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                {isLoading ? "Updating..." : actionText}
              </>
            ) : (
              actionText
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionText} Test
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle}
              disabled={isLoading}
              className={isDisabled ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                actionText
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
