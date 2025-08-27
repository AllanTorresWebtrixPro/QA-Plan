import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createBasecampService } from "@/services/basecamp-service";
import { getUserById } from "@/services/qa-service";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/qa/misc-issues
 * Fetch all miscellaneous issues
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    let query = supabase
      .from("misc_issues_with_users")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq("category", category);
    }
    if (priority) {
      query = query.eq("priority", priority);
    }
    if (status) {
      query = query.eq("status", status);
    }
    if (assignedTo) {
      query = query.eq("assigned_to", assignedTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching misc issues:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in GET /api/qa/misc-issues:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/qa/misc-issues
 * Create a new miscellaneous issue
 */
export async function POST(request: NextRequest) {
  try {
    const { title, description, category, priority, reportedBy } = await request.json();

    if (!title || !description || !reportedBy) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, reportedBy" },
        { status: 400 }
      );
    }

    // Generate a unique ID for the misc issue
    const issueId = `misc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create the misc issue
    const { data: newIssue, error: createError } = await supabaseAdmin
      .from("qa_misc_issues")
      .insert({
        id: issueId,
        title,
        description,
        category: category || 'General',
        priority: priority || 'Medium',
        reported_by: reportedBy,
        status: 'Open'
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating misc issue:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // Try to create Basecamp card if environment variables are configured
    let basecampCardCreated = false;
    let basecampError = null;
    let basecampCardId = null;

    console.log("Attempting to create Basecamp card for misc issue:", { title, category, priority, reportedBy });

    try {
      const basecampService = createBasecampService("default_user");
      const userInfo = await getUserById(reportedBy);
      
      console.log("User info for Basecamp card:", userInfo);

      const cardContent = `
        <strong>Misc Issue Report:</strong><br>
        <strong>Title:</strong> ${title}<br>
        <strong>Category:</strong> ${category || 'General'}<br>
        <strong>Priority:</strong> ${priority || 'Medium'}<br>
        <strong>Reported By:</strong> ${userInfo?.name || reportedBy}<br>
        <strong>Description:</strong><br>
        ${description.replace(/\n/g, "<br>")}<br>
        <br>
        <em>Created at: ${new Date().toISOString()}</em>
      `;

      console.log("Creating Basecamp card with:", {
        projectId: basecampService.getProjectId(),
        columnId: basecampService.getDefaultColumnId(),
        title: `Misc Issue: ${title}`,
        content: cardContent.substring(0, 100) + "...", // Log first 100 chars
      });

      const basecampResponse = await basecampService.createCard(
        basecampService.getProjectId(),
        basecampService.getDefaultColumnId(),
        {
          title: `Misc Issue: ${title}`,
          content: cardContent,
          notify: false,
        }
      );

      console.log("Basecamp response:", basecampResponse);

      if (basecampResponse.success) {
        basecampCardCreated = true;
        basecampCardId = basecampResponse.data?.id;
        
        console.log("Basecamp card created successfully with ID:", basecampCardId);
        
        // Update the misc issue with the Basecamp card ID
        if (basecampCardId) {
          await supabaseAdmin
            .from("qa_misc_issues")
            .update({
              basecamp_card_ids: [basecampCardId]
            })
            .eq("id", issueId);
        }
      } else {
        basecampError = basecampResponse.error;
        console.error("Basecamp card creation failed:", basecampResponse.error);
      }
    } catch (basecampConfigError) {
      console.warn("Basecamp integration not configured or failed:", basecampConfigError);
    }

    return NextResponse.json({
      success: true,
      data: newIssue,
      basecampCardCreated,
      basecampError
    });
  } catch (error) {
    console.error("Error in POST /api/qa/misc-issues:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/qa/misc-issues
 * Update a miscellaneous issue
 */
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, category, priority, status, assignedTo } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;

    const { data: updatedIssue, error: updateError } = await supabaseAdmin
      .from("qa_misc_issues")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating misc issue:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedIssue });
  } catch (error) {
    console.error("Error in PUT /api/qa/misc-issues:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/qa/misc-issues
 * Delete a miscellaneous issue
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("qa_misc_issues")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting misc issue:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Misc issue deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/qa/misc-issues:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
