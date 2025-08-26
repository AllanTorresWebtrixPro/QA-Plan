# Miscellaneous Issues Feature

## Overview

The Miscellaneous Issues feature allows users to report and manage issues that don't fit into specific test categories. This provides a way to capture general problems, bugs, or concerns that arise during testing but aren't covered by existing test cases.

## Features

### 1. **Issue Reporting**
- Create new issues with title, description, category, and priority
- Automatic Basecamp card creation for issue tracking
- User attribution and timestamps

### 2. **Issue Management**
- Edit issue details (title, description, category, priority)
- Update issue status (Open, In Progress, Resolved, Closed)
- Assign issues to team members
- Delete issues when no longer needed

### 3. **Filtering and Search**
- Filter by category, priority, and status
- Clear filters functionality
- Real-time filtering without page reload

### 4. **Basecamp Integration**
- Automatic card creation when issues are reported
- Cards include issue details, reporter information, and timestamps
- Integration with existing Basecamp workflow

## Database Schema

### `qa_misc_issues` Table

```sql
CREATE TABLE qa_misc_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  reported_by TEXT NOT NULL REFERENCES qa_users(id) ON DELETE CASCADE,
  assigned_to TEXT REFERENCES qa_users(id) ON DELETE SET NULL,
  basecamp_card_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `misc_issues_with_users` View

A view that joins misc issues with user information for easier querying:

```sql
CREATE VIEW misc_issues_with_users AS
SELECT 
  mi.*,
  reporter.name as reporter_name,
  reporter.email as reporter_email,
  reporter.avatar as reporter_avatar,
  assignee.name as assignee_name,
  assignee.email as assignee_email,
  assignee.avatar as assignee_avatar
FROM qa_misc_issues mi
LEFT JOIN qa_users reporter ON mi.reported_by = reporter.id
LEFT JOIN qa_users assignee ON mi.assigned_to = assignee.id;
```

## API Endpoints

### GET /api/qa/misc-issues
Fetch all miscellaneous issues with optional filtering.

**Query Parameters:**
- `category` - Filter by category
- `priority` - Filter by priority
- `status` - Filter by status
- `assignedTo` - Filter by assigned user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "misc-001",
      "title": "General UI Responsiveness Issues",
      "description": "The application seems to have some responsiveness issues...",
      "category": "UI/UX",
      "priority": "Medium",
      "status": "Open",
      "reported_by": "allan-torres",
      "reporter_name": "Allan Torres",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/qa/misc-issues
Create a new miscellaneous issue.

**Request Body:**
```json
{
  "title": "Issue Title",
  "description": "Detailed description of the issue",
  "category": "UI/UX",
  "priority": "Medium",
  "reportedBy": "user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created issue */ },
  "basecampCardCreated": true,
  "basecampError": null
}
```

### PUT /api/qa/misc-issues
Update an existing miscellaneous issue.

**Request Body:**
```json
{
  "id": "misc-001",
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Performance",
  "priority": "High",
  "status": "In Progress",
  "assignedTo": "user-id"
}
```

### DELETE /api/qa/misc-issues?id={issueId}
Delete a miscellaneous issue.

## Installation and Setup

### 1. Run Database Migration

```bash
yarn migrate:misc-issues
# or
npm run migrate:misc-issues
```

### 2. Verify Installation

1. Navigate to `/misc-issues` in your application
2. Verify the page loads correctly
3. Test creating a new issue
4. Verify Basecamp integration works (if configured)

### 3. Access the Feature

The Misc Issues page is accessible via:
- Main navigation menu: "Misc Issues"
- Direct URL: `/misc-issues`

## Usage

### Reporting a New Issue

1. Navigate to the Misc Issues page
2. Click "Report Issue" button
3. Fill in the form:
   - **Title**: Brief description of the issue
   - **Description**: Detailed explanation
   - **Category**: Select appropriate category
   - **Priority**: Set priority level
4. Click "Create Issue"

### Managing Issues

1. **View Issues**: All issues are displayed in a card layout
2. **Filter Issues**: Use the filter dropdowns to narrow down results
3. **Edit Issues**: Click the edit button to modify issue details
4. **Update Status**: Change status directly from the edit dialog
5. **Delete Issues**: Use the delete button to remove issues

### Categories

Available categories for misc issues:
- General
- UI/UX
- Performance
- Browser Compatibility
- Security
- Accessibility
- Integration
- Data
- Other

### Priorities

- **High**: Critical issues that need immediate attention
- **Medium**: Important issues that should be addressed soon
- **Low**: Minor issues that can be addressed when time permits

### Statuses

- **Open**: New issue, not yet addressed
- **In Progress**: Issue is being worked on
- **Resolved**: Issue has been fixed
- **Closed**: Issue is resolved and verified

## Basecamp Integration

When a misc issue is created:

1. A Basecamp card is automatically created
2. The card includes:
   - Issue title and description
   - Category and priority
   - Reporter information
   - Creation timestamp
3. The card ID is stored in the `basecamp_card_ids` field
4. Cards appear in the configured Basecamp project's default column

## Security and Permissions

- All authenticated users can view misc issues
- All authenticated users can create new issues
- Issue editing and deletion may be restricted based on user roles
- Basecamp integration requires proper configuration

## Troubleshooting

### Common Issues

1. **Migration Fails**
   - Ensure you have the correct environment variables
   - Check that the database is accessible
   - Verify the service role key has sufficient permissions

2. **Basecamp Cards Not Created**
   - Verify Basecamp configuration in environment variables
   - Check Basecamp API access and permissions
   - Review server logs for error messages

3. **Page Not Loading**
   - Ensure the migration has been run successfully
   - Check that all components are properly imported
   - Verify the navigation is correctly configured

### Debug Mode

Enable debug logging by checking the browser console and server logs for detailed error messages.

## Future Enhancements

Potential improvements for the misc issues feature:

1. **Advanced Filtering**: Add date range filters and text search
2. **Issue Templates**: Pre-defined templates for common issue types
3. **File Attachments**: Allow screenshots and files to be attached
4. **Issue Comments**: Add commenting system for issue discussions
5. **Email Notifications**: Notify assigned users when issues are created/updated
6. **Issue Analytics**: Dashboard showing issue trends and statistics
7. **Bulk Operations**: Select multiple issues for bulk status updates
8. **Issue Export**: Export issues to CSV or other formats
