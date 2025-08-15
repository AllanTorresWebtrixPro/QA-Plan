"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  UserPlus, 
  UserMinus, 
  CheckCircle, 
  XCircle,
  Loader2 
} from "lucide-react"
import { assignTestToUser, unassignTest } from "@/services/qa-service"
import { useToast } from "@/hooks/use-toast"

interface TestAssignmentButtonProps {
  testId: string
  assignedTo?: string
  assignedUserName?: string
  assignedUserAvatar?: string
  assignedUserRole?: string
  completed?: boolean
  onAssignmentChange?: () => void
}

export function TestAssignmentButton({
  testId,
  assignedTo,
  assignedUserName,
  assignedUserAvatar,
  assignedUserRole,
  completed,
  onAssignmentChange
}: TestAssignmentButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const isAssignedToMe = assignedTo === user?.id
  const isUnassigned = !assignedTo

  const handleAssign = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      await assignTestToUser(testId, user.id)
      toast({
        title: "Test Assigned",
        description: "You have successfully assigned this test to yourself.",
      })
      onAssignmentChange?.()
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: error instanceof Error ? error.message : "Failed to assign test",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUnassign = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      await unassignTest(testId, user.id)
      toast({
        title: "Test Unassigned",
        description: "You have successfully unassigned this test.",
      })
      onAssignmentChange?.()
    } catch (error) {
      toast({
        title: "Unassignment Failed",
        description: error instanceof Error ? error.message : "Failed to unassign test",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isAssignedToMe) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {assignedUserAvatar || user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Assigned to you</span>
          {assignedUserRole && (
            <Badge variant="secondary" className="text-xs">
              {assignedUserRole}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnassign}
          disabled={loading || completed}
          className="ml-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserMinus className="h-4 w-4" />
          )}
          Unassign
        </Button>
      </div>
    )
  }

  if (isUnassigned) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleAssign}
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        Assign to Me
      </Button>
    )
  }

  // Assigned to someone else
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">
            {assignedUserAvatar || assignedUserName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">
          Assigned to {assignedUserName}
        </span>
        {assignedUserRole && (
          <Badge variant="secondary" className="text-xs">
            {assignedUserRole}
          </Badge>
        )}
      </div>
      {completed && (
        <Badge variant="default" className="text-xs">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      )}
    </div>
  )
} 