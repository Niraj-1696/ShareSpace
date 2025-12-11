# ShareSpace Module Organization & Screenshot Requirements

## Module Structure Based on Test Cases

---

## MODULE 1: USER AUTHENTICATION & REGISTRATION SYSTEM

### Module Overview Table

| **Attribute** | **Details** |
|---------------|-------------|
| **Test Cases Covered** | TC1-TC4 (Students), TC1-TC2 (Admin) |
| **Total Test Cases** | 6 |
| **Technologies Used** | Tesseract.js (OCR), JWT, bcrypt, Nodemailer, Multer |
| **API Endpoints** | `/register`, `/login`, `/forgot-password`, `/get-current-user` |
| **Database Collections** | Users, Notifications |
| **External Services** | Cloudinary (Image Storage), OCR Processing |

### Test Cases & Features Table

| **Test Case ID** | **Test Scenario** | **Key Features** | **Expected Result** | **Screenshots Required** |
|------------------|-------------------|------------------|-------------------|------------------------|
| **TC1 (Student)** | Student Registration with OCR | OCR PSID extraction, Image upload, Form validation | Registration success, pending status, admin notification | Registration form, OCR processing, success message |
| **TC2 (Admin)** | Admin User Approval | User verification, Status management, Role assignment | User approved, status active, login enabled | Admin dashboard, approval modal, status change |
| **TC3 (Student)** | Student Login | JWT authentication, Role-based access, Dashboard redirect | Login success, JWT token, appropriate dashboard | Login page, dashboard, role indicators |
| **TC4 (Student)** | Password Recovery | Email token system, Secure reset, Password encryption | Reset token sent, password updated, login enabled | Forgot password form, email, reset form |

### Screenshot Requirements Table

| **Screenshot Category** | **Screenshot Name** | **Purpose** | **Test Case** | **Priority** |
|------------------------|-------------------|-------------|---------------|--------------|
| **Registration Flow** | Registration Form Page | Show complete form with all fields | TC1 | High |
| **Registration Flow** | College ID Upload Interface | File upload with drag-drop | TC1 | High |
| **Registration Flow** | OCR Processing Screen | Loading state during extraction | TC1 | Medium |
| **Registration Flow** | PSID Auto-fill Result | Successful OCR extraction | TC1 | High |
| **Registration Flow** | Registration Success | Pending approval message | TC1 | Medium |
| **Registration Flow** | Validation Error Messages | Form validation feedback | TC1 | Medium |
| **Login Flow** | Login Page Interface | Email/password form | TC3 | High |
| **Login Flow** | Dashboard Redirect | Successful login result | TC3 | High |
| **Login Flow** | Login Error Messages | Invalid credentials handling | TC3 | Medium |
| **Password Recovery** | Forgot Password Form | Email input interface | TC4 | Medium |
| **Password Recovery** | Email Sent Confirmation | Reset email notification | TC4 | Low |
| **Password Recovery** | Reset Password Form | New password interface | TC4 | Medium |
| **Admin Approval** | Admin Users Dashboard | Pending users list | TC2 | High |
| **Admin Approval** | User Verification Modal | College ID review interface | TC2 | High |
| **Admin Approval** | Approval Success Message | Status change confirmation | TC2 | Medium |
| **Admin Approval** | User Details View | Complete user information | TC2 | Medium |

### Key Features:
- College ID OCR verification with Tesseract.js
- PSID auto-extraction and validation
- JWT-based secure authentication
- Email-based password recovery
- Admin approval workflow
- Role-based access control

#### 1.1 Registration Flow Screenshots:
- **Registration Form Page** - Shows all input fields (name, email, password, roll no, class, college ID upload)
- **College ID Upload Interface** - File upload component with drag-and-drop
- **OCR Processing Screen** - Loading state during PSID extraction
- **PSID Extraction Result** - Auto-filled PSID field after OCR processing
- **Registration Success Message** - "Awaiting admin approval" notification
- **Registration Validation Errors** - Invalid email, duplicate PSID, OCR failure messages

#### 1.2 Login Flow Screenshots:
- **Login Page** - Email/password form with forgot password link
- **JWT Authentication Success** - Dashboard redirect after successful login
- **Login Error Messages** - Invalid credentials, pending approval, blocked account
- **Password Reset Flow** - Forgot password form → email sent → reset form → success

#### 1.3 Admin Approval Screenshots:
- **Admin Users Dashboard** - Pending users list with OCR verification details
- **User Verification Modal** - College ID image viewer with approve/reject buttons
- **User Approval Success** - Status change notification and user notification
- **User Details View** - Complete user information with PSID, roll no, class

---

## MODULE 2: PRODUCT MANAGEMENT SYSTEM
**Test Cases:** TC5-TC6 (Students), TC3-TC4 (Admin)

### Key Features:
- Multi-image product listing with Cloudinary integration
- Admin approval workflow for quality control
- Role progression (user → seller after first approved product)
- Product editing and management
- Category-based organization
- Product status tracking (pending/approved/rejected/blocked)

### Required Screenshots:

#### 2.1 Product Creation Screenshots:
- **Add Product Form** - Complete form with all fields (name, description, price, category, age)
- **Image Upload Interface** - Multiple image upload with preview
- **Product Submission Success** - "Product submitted for approval" message
- **Cloudinary Integration** - Image upload progress and success states
- **Product Validation Errors** - Required field errors, price validation, image size limits

#### 2.2 Product Management Screenshots:
- **Seller Product Dashboard** - List of seller's products with status indicators
- **Edit Product Modal** - Product editing interface with pre-filled data
- **Product Status Indicators** - Visual status badges (pending, approved, rejected, blocked)
- **Delete Product Confirmation** - Warning dialog for product deletion
- **Product Updated Success** - Confirmation message after edits

#### 2.3 Admin Product Management Screenshots:
- **Admin Products Dashboard** - All products with seller information and approval queue
- **Product Approval Interface** - Detailed product view for admin review
- **Product Approval Success** - Status change and seller notification
- **Product Rejection Interface** - Rejection form with reason field
- **Product Deletion (Admin)** - Delete option for rejected products with confirmation

---

## MODULE 3: MARKETPLACE BROWSING & SEARCH SYSTEM
**Test Cases:** TC7, TC14-TC15 (Students)

### Key Features:
- Real-time product search and filtering
- Category-based filtering
- Age-based product filtering
- Responsive product grid display
- Advanced search with multiple parameters
- Product detail view with image gallery

### Required Screenshots:

#### 3.1 Homepage & Browse Screenshots:
- **Marketplace Homepage** - Product grid with featured items
- **Filter Sidebar** - Category, price range, age, condition filters
- **Search Bar Interface** - Real-time search with autocomplete
- **Filter Results Display** - Filtered product grid with active filter indicators
- **Empty Search Results** - "No products found" state with suggestions
- **Mobile Responsive View** - Homepage adaptation for mobile devices

#### 3.2 Product Discovery Screenshots:
- **Product Card Design** - Individual product cards in grid layout
- **Product Hover Effects** - Interactive elements and preview features
- **Category Filter Active** - Results showing specific category selection
- **Age Range Filter** - Products filtered by age ranges (0-1 year, 1-2 years, etc.)
- **Search Results Page** - Search query results with relevance sorting

#### 3.3 Product Details Screenshots:
- **Product Details Page** - Complete product information layout
- **Image Gallery Interface** - Multi-image carousel with thumbnail navigation
- **Product Information Section** - Seller details, pricing, specifications
- **Zoom Functionality** - Image zoom feature for detailed viewing
- **Product Sharing Options** - Social sharing buttons and copy link

---

## MODULE 4: COMPETITIVE BIDDING SYSTEM
**Test Cases:** TC8-TC12 (Students)

### Key Features:
- Secure bid placement with privacy protection
- Real-time bid tracking and notifications
- Contact information privacy until acceptance
- Automatic bidding closure after acceptance
- Bid history and status management
- Seller bid management interface

### Required Screenshots:

#### 4.1 Bid Placement Screenshots:
- **Bid Modal Interface** - Bid amount, message, contact form
- **Bid Validation Messages** - Minimum amount, duplicate bid warnings
- **Bid Submission Success** - "Bid placed successfully" notification
- **Bid Placement Error** - "Cannot bid on own product" error
- **Bidding Closed Status** - "Bidding closed - bid accepted" message
- **Bid Amount Validation** - Price format and minimum value errors

#### 4.2 Bid Management Screenshots (Seller):
- **Show Bids Interface** - List of all bids with privacy protection
- **Bid Details View** - Individual bid information without contact details
- **Accept Bid Confirmation** - Modal asking for bid acceptance confirmation
- **Reject Bid Interface** - Bid rejection with optional reason
- **Contact Information Reveal** - Accepted bid showing buyer contact details
- **Bid Response Success** - Notification after accepting/rejecting bid

#### 4.3 Bid Tracking Screenshots (Buyer):
- **My Bids Dashboard** - List of placed bids with status tracking
- **Bid Status Indicators** - Visual status (pending, accepted, rejected)
- **Bid Accepted Notification** - Success message with seller contact info
- **Bid Rejected Notification** - Rejection message with status update
- **Bid History View** - Complete bidding history with timestamps

---

## MODULE 5: USER PROFILE & DASHBOARD SYSTEM
**Test Cases:** TC13, TC16 (Students)

### Key Features:
- Comprehensive user profile with college information
- Product management for sellers
- Bid tracking for buyers
- Role-based dashboard customization
- Account settings and preferences
- Activity history and statistics

### Required Screenshots:

#### 5.1 User Dashboard Screenshots:
- **User Dashboard Home** - Overview with recent activity
- **Profile Tab Interface** - Personal information display (name, email, class, role)
- **General Information View** - College details (PSID, roll no, class) display
- **Role Indicator** - Visual representation of user/seller role
- **Dashboard Navigation** - Tab structure (Products, My Bids, General)
- **Account Statistics** - Number of products, bids, transactions

#### 5.2 Seller Dashboard Screenshots:
- **Products Management Tab** - Seller's product list with management options
- **Product Actions Menu** - Edit, delete, show bids options
- **Seller Statistics** - Sales analytics and performance metrics
- **Revenue Tracking** - Transaction history and earnings (if applicable)
- **Seller Profile View** - Enhanced profile for sellers with ratings
- **Product Performance** - Views, bids, and engagement metrics

#### 5.3 Settings & Preferences Screenshots:
- **Account Settings Page** - Profile editing interface
- **Password Change Form** - Secure password update interface
- **Notification Preferences** - Email and in-app notification settings
- **Privacy Settings** - Contact information visibility options
- **Account Status Display** - Active/pending/blocked status indicator

---

## MODULE 6: NOTIFICATION & COMMUNICATION SYSTEM
**Test Cases:** TC17 (Students), TC6 (Admin)

### Key Features:
- Real-time notification system
- Email integration with Nodemailer
- In-app notification display with read/unread status
- Navigation-based notification handling
- Admin alert system for transactions
- Notification history and management

### Required Screenshots:

#### 6.1 Notification Interface Screenshots:
- **Notification Bell Icon** - Header notification indicator with count
- **Notification Dropdown** - List of recent notifications with preview
- **Unread Notification Count** - Visual indicator for new notifications
- **Notification Categories** - Different types (bid, approval, rejection, etc.)
- **Mark as Read Interface** - Individual and bulk mark as read options
- **Notification Navigation** - Click-to-navigate functionality demonstration

#### 6.2 Notification Types Screenshots:
- **Bid Notification** - "New bid placed" notification format
- **Approval Notification** - "Product approved" notification format
- **Rejection Notification** - "Product rejected" notification format
- **Bid Accepted Notification** - "Your bid was accepted" format
- **Admin Alert Notification** - Transaction monitoring alerts for admin
- **System Notifications** - General platform updates and announcements

#### 6.3 Email Notifications Screenshots:
- **Email Template Design** - Professional email format for notifications
- **Registration Approval Email** - Welcome email after admin approval
- **Password Reset Email** - Secure reset link email format
- **Bid Activity Emails** - Email alerts for important bid activities
- **Admin Alert Emails** - Transaction monitoring emails for administrators

---

## MODULE 7: ADMIN MANAGEMENT SYSTEM
**Test Cases:** TC1-TC8 (Admin)

### Key Features:
- Comprehensive admin dashboard with system overview
- User management with OCR verification review
- Product approval workflow with detailed review
- Transaction monitoring and alerts
- User status management (activate/block/delete)
- Manual OCR verification override
- System analytics and reporting

### Required Screenshots:

#### 7.1 Admin Dashboard Screenshots:
- **Admin Dashboard Home** - System overview with key metrics
- **Navigation Menu** - Admin-specific navigation (Users, Products, Reports)
- **System Statistics** - User count, product count, transaction metrics
- **Quick Actions Panel** - Shortcut buttons for common admin tasks
- **Admin Activity Log** - Recent admin actions and system changes
- **Performance Metrics** - Platform usage analytics and trends

#### 7.2 User Management Screenshots:
- **Users List Interface** - Complete user table with all details (PSID, roll no, class, role, status)
- **User Details Modal** - Detailed user information with college ID image
- **OCR Verification Review** - Manual verification interface for failed OCR
- **User Status Change** - Approve/block/activate user options
- **User Search Interface** - Search by PSID, roll no, name, email
- **Bulk User Operations** - Multiple user selection and actions

#### 7.3 Product Management Screenshots:
- **Products Queue Interface** - Pending products awaiting approval
- **Product Review Modal** - Detailed product view for admin review
- **Product Approval Interface** - Approve/reject buttons with reason field
- **Rejected Products List** - Products rejected by admin with delete option
- **Product Analytics** - Popular categories, pricing trends, approval rates
- **Quality Control Metrics** - Approval/rejection statistics and reasons

#### 7.4 Transaction Monitoring Screenshots:
- **Transaction Alerts** - Real-time bid acceptance notifications
- **Transaction History** - Complete platform transaction log
- **Revenue Analytics** - Platform usage and transaction volume metrics
- **User Activity Monitor** - Real-time user actions and platform usage
- **System Health Dashboard** - Technical metrics and performance indicators

---

## ADDITIONAL TECHNICAL SCREENSHOTS NEEDED:

### Database & Backend Screenshots:
- **MongoDB Compass Interface** - Database collections and document structure
- **API Testing Interface** - Postman screenshots showing API endpoints
- **Server Logs** - Console output showing OCR processing and notifications
- **Cloudinary Dashboard** - Image storage and management interface

### Security & Authentication Screenshots:
- **JWT Token Inspection** - Developer tools showing JWT implementation
- **Password Hashing** - Security implementation demonstration
- **Role-based Access** - Different user role dashboard comparisons
- **OCR Processing** - Real-time PSID extraction demonstration

### Responsive Design Screenshots:
- **Mobile Homepage** - Smartphone view of marketplace
- **Tablet Interface** - Tablet adaptation of key features
- **Desktop Layout** - Full desktop experience
- **Cross-browser Testing** - Screenshots from different browsers

---

## SCREENSHOT ORGANIZATION RECOMMENDATIONS:

### File Naming Convention:
```
Module1_Authentication/
├── 01_registration_form.png
├── 02_ocr_processing.png
├── 03_psid_extraction.png
├── 04_login_page.png
├── 05_admin_approval.png
└── 06_role_progression.png

Module2_ProductManagement/
├── 01_add_product.png
├── 02_image_upload.png
├── 03_admin_review.png
├── 04_product_approval.png
└── 05_seller_dashboard.png

... (continue for all modules)
```

### Screenshot Quality Requirements:
- **Resolution:** Minimum 1920x1080 for desktop screenshots
- **Mobile:** 375x812 (iPhone X) standard resolution
- **Format:** PNG for UI screenshots, JPG for photos
- **Annotations:** Use callouts and highlights for important features
- **Consistency:** Same browser, zoom level, and styling across screenshots

This comprehensive module organization with specific screenshot requirements will help you create a complete visual documentation of your ShareSpace project, covering all test cases and functionality demonstrated in your presentation.