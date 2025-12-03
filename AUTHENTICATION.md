# Authentication System

## Overview
Simple localStorage-based authentication system for the AI Chat Lab application.

## Features

### 🔐 Authentication
- **Sign Up**: Create new accounts with name, email, and password
- **Sign In**: Login with email and password
- **Remember Me**: Option to stay logged in for 24 hours
- **Session Management**: 1-hour sessions without "Remember Me", 24-hour with it
- **Auto-redirect**: Protected chat interface redirects to login if not authenticated

### 👤 User Management
- **User Profile Display**: Shows name and email in sidebar
- **Logout**: Secure logout with confirmation
- **User-specific Chat History**: Each user has their own isolated chat history

### 🎨 UI/UX
- Modern, clean authentication interface
- Smooth animations and transitions
- Form validation with error messages
- Loading states for better feedback
- Responsive design for mobile devices

## How It Works

### Storage Structure

**Users** (localStorage: `users`)
```json
[
  {
    "id": "1701619200000",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "createdAt": 1701619200000
  }
]
```

**Session** (localStorage/sessionStorage: `session`)
```json
{
  "userId": "1701619200000",
  "email": "john@example.com",
  "name": "John Doe",
  "loginTime": 1701619200000,
  "rememberMe": true
}
```

**Chat History** (localStorage: `chatHistory_{userId}`)
```json
[
  {
    "id": "1701619200000",
    "title": "Previous conversation...",
    "messages": [...],
    "timestamp": 1701619200000
  }
]
```

### Security Notes

⚠️ **Important**: This is a client-side demo authentication system suitable for:
- Local development
- Demos and prototypes
- Learning purposes

**NOT suitable for production** because:
- Passwords are stored in plain text
- No server-side validation
- No encryption
- All data is in localStorage (client-side)

### For Production Use

To make this production-ready, you would need:

1. **Backend Authentication**
   - Proper user database (PostgreSQL, MongoDB, etc.)
   - Password hashing (bcrypt, argon2)
   - JWT tokens or session cookies
   - HTTPS only

2. **Security Enhancements**
   - Rate limiting on login attempts
   - Email verification
   - Password reset functionality
   - CSRF protection
   - XSS protection

3. **Better Session Management**
   - Server-side session validation
   - Refresh tokens
   - Automatic session renewal

## Usage

### Sign Up
1. Navigate to `/auth.html`
2. Click "Create Account"
3. Fill in name, email, and password
4. Click "Create Account"
5. Automatically logged in and redirected to chat

### Sign In
1. Navigate to `/auth.html`
2. Enter email and password
3. (Optional) Check "Remember me"
4. Click "Sign In"
5. Redirected to chat interface

### Logout
1. Click the logout icon in the sidebar footer
2. Confirm logout
3. Session cleared and redirected to login

## Files

- `public/auth.html` - Authentication page HTML
- `public/auth.css` - Authentication styles
- `public/auth.js` - Authentication logic
- `public/script.js` - Updated with auth checks and user-specific storage

## Customization

### Change Session Duration
Edit in `auth.js` and `script.js`:
```javascript
const maxAge = sessionData.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
// Change to desired milliseconds
```

### Styling
All styles are in `public/auth.css` using CSS variables for easy theming.

### Validation Rules
Edit validation in `auth.js`:
```javascript
if (password.length < 6) {
  // Change minimum password length
}
```
