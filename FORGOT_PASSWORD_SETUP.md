# ShareSpace - Forgot Password Setup Guide

## 🔧 Fixed Issues

The forgot password functionality has been completely fixed and improved. Here are the changes made:

### Backend Fixes:

1. **Fixed Reset URL**: Changed from backend URL to frontend URL (`http://localhost:3000/reset-password/${token}`)
2. **Improved Email Template**: Added HTML email with better formatting and user experience
3. **Better Error Handling**: Added validation for email input and user status
4. **Enhanced Security**: Added password length validation and better token verification

### Frontend Fixes:

1. **Improved User Feedback**: Added success/error messages and loading states
2. **Better Form Validation**: Enhanced password confirmation and email validation
3. **Token Validation**: Added proper token existence checks
4. **Responsive UI**: Better alerts and user guidance

## 📧 Email Configuration Setup

### For Gmail (Recommended):

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
3. **Update your .env file**:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### For Other Email Providers:

Update the nodemailer configuration in `server/routes/usersRoute.js`:

```javascript
const transporter = nodemailer.createTransporter({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## 🚀 Setup Instructions

1. **Copy Environment File**:

   ```bash
   cp .env.example .env
   ```

2. **Configure Environment Variables**:
   Edit `.env` with your actual values:

   ```bash
   MONGO_URL=mongodb://localhost:27017/sharespace
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   CLOUD_NAME=your-cloudinary-cloud-name
   CLOUD_API_KEY=your-cloudinary-api-key
   CLOUD_API_SECRET=your-cloudinary-api-secret
   PORT=5000
   ```

3. **Test Your Setup**:

   ```bash
   npm run setup-test
   ```

4. **Start the Application**:

   ```bash
   # Backend (from root directory)
   npm run dev

   # Frontend (in new terminal)
   cd client
   npm start
   ```

## 🔄 How the Forgot Password Flow Works

1. **User requests password reset** → `/forgot-password` page
2. **Enters email address** → Backend validates user exists and is active
3. **Email sent** with reset link → Link points to `http://localhost:3000/reset-password/{token}`
4. **User clicks link** → Frontend validates token and shows reset form
5. **User enters new password** → Backend verifies token and updates password
6. **Success redirect** → User redirected to login with new password

## 🧪 Testing the Flow

1. **Register a new user** (or use existing account)
2. **Go to login page** and click "Forgot Password?"
3. **Enter your email** and click "Send Reset Link"
4. **Check your email** for the reset link
5. **Click the reset link** in the email
6. **Enter new password** and confirm
7. **Login with new password**

## 🛠️ Troubleshooting

### Email Not Sending:

- Check your EMAIL_USER and EMAIL_PASSWORD in .env
- Verify 2FA is enabled and App Password is generated
- Check server logs for email errors

### Reset Link Not Working:

- Ensure frontend is running on http://localhost:3000
- Check that the token in the URL is not expired (1 hour limit)
- Verify JWT_SECRET is set in .env

### Token Expired:

- Reset links expire after 1 hour
- Request a new reset link if expired

### Database Issues:

- Ensure MongoDB is running
- Check MONGO_URL in .env file
- Verify database connection in server logs

## 📝 Key Files Changed

- `server/routes/usersRoute.js` - Fixed reset URL and improved error handling
- `client/src/Pages/ForgotPassword/index.js` - Enhanced UI and feedback
- `client/src/Pages/ResetPassword/index.js` - Added token validation and better UX
- `client/src/apicalls/users.js` - Improved error handling in API calls

The forgot password functionality is now fully operational and user-friendly!
