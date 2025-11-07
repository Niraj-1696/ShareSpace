# Admin Notification System for User Registration

## Overview

This system automatically notifies admins when new users register and allows admins to approve or reject registrations.

## Implementation Details

### 1. User Registration Flow

- When a user fills out the registration form and clicks "Register", their account is created with `status: "pending"`
- All admin users automatically receive a notification about the new registration
- The new user cannot log in until approved by an admin

### 2. Admin Notifications

- **Notification Title**: "New User Registration"
- **Notification Message**: Contains user's name, PSID, and Roll Number
- **Click Action**: Redirects to `/admin` page

### 3. Admin Panel Features

- **Pending Users Highlighted**: Orange background and left border for pending users
- **Status Badge**: Color-coded status indicators (Orange=Pending, Green=Active, Red=Blocked)
- **Pending Counter**: Shows count of pending registrations at the top
- **Filter Toggle**: Switch to show only pending users
- **User Details Modal**: Click "View Details" to see full user information including college ID image

### 4. Approval Process

1. Admin receives notification when user registers
2. Admin goes to Admin Panel → Users tab
3. Admin can:
   - **View Details**: See user information and college ID image
   - **Approve**: Sets status to "active" - user can now log in
   - **Reject**: Sets status to "blocked" - user cannot log in

### 5. User Feedback

- **Registration**: User sees "Awaiting admin approval" message
- **Login Attempt**:
  - Pending users: "Your registration is pending admin approval"
  - Blocked users: "Your account has been blocked. Please contact admin"
- **Status Update**: User receives notification when approved/rejected

### 6. Backend Changes Made

#### User Model (`server/models/usermodel.js`)

- Already had `status` field with default "active"

#### Registration Route (`server/routes/usersRoute.js`)

- Sets new users to `status: "pending"`
- Creates notifications for all admin users
- Updated success message

#### Login Route (`server/routes/usersRoute.js`)

- Blocks pending and blocked users with specific error messages
- Only allows "active" users to log in

#### Status Update Route (`server/routes/usersRoute.js`)

- Creates notifications for users when their status changes from pending
- Notifies users of approval/rejection

### 7. Frontend Changes Made

#### Admin Users Component (`client/src/Pages/Admin/Users.js`)

- Added pending user counter and filter toggle
- Enhanced status display with color-coded badges
- Highlighted pending users with orange styling
- Sorted users to show pending ones first

## Testing the Flow

1. **Register a New User**:

   - Go to `/register`
   - Fill out the form with college ID image
   - Submit registration
   - Should see "Awaiting admin approval" message

2. **Check Admin Notifications**:

   - Login as admin user
   - Check notifications (should see new registration notification)
   - Click notification to go to admin panel

3. **Admin Approval**:

   - Go to Admin Panel → Users tab
   - See pending user highlighted in orange
   - Use filter toggle to show only pending users
   - Click "View Details" to verify user information
   - Click "Approve" or "Reject"

4. **User Login Test**:
   - Try logging in with the new user account
   - Before approval: Should see pending message
   - After approval: Should be able to log in
   - After rejection: Should see blocked message

## File Changes Summary

### Modified Files:

1. `server/routes/usersRoute.js` - Added notification creation and improved status handling
2. `client/src/Pages/Admin/Users.js` - Enhanced UI for managing pending users

### No new files created - Used existing notification system infrastructure.

## Admin Account Access

Make sure you have at least one user with `role: "admin"` in your database to receive and process registration notifications.
