import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { testId, userId } = await request.json()

    if (!testId || !userId) {
      return NextResponse.json(
        { error: "Test ID and User ID are required" },
        { status: 400 }
      )
    }

    // Call the database function to assign the test
    const { data, error } = await supabase.rpc('assign_test_to_user', {
      test_id: testId,
      user_id: userId
    })

    if (error) {
      console.error("Error assigning test:", error)
      return NextResponse.json(
        { error: "Failed to assign test" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Test is already assigned or does not exist" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, message: "Test assigned successfully" })

  } catch (error) {
    console.error("Error in assign-test route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { testId, userId } = await request.json()

    if (!testId || !userId) {
      return NextResponse.json(
        { error: "Test ID and User ID are required" },
        { status: 400 }
      )
    }

    // Call the database function to unassign the test
    const { data, error } = await supabase.rpc('unassign_test', {
      test_id: testId,
      user_id: userId
    })

    if (error) {
      console.error("Error unassigning test:", error)
      return NextResponse.json(
        { error: "Failed to unassign test" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "You can only unassign tests assigned to you" },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, message: "Test unassigned successfully" })

  } catch (error) {
    console.error("Error in unassign-test route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 