# Firebase Google Authentication Setup Guide

## Prerequisites
- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Google Cloud Project with billing enabled (for production)

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "ebusiness-auth")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Toggle "Enable" switch
6. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain
7. Click "Save"

### 3. Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app (</>) 
4. Register app with nickname (e.g., "ebusiness-web")
5. Copy the config object

### 4. Update Firebase Config
Replace the placeholder values in `src/environments/firebase.config.ts` with your actual Firebase config:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyD...", // Your API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id", 
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Test the Integration
1. Start the development server: `ng serve`
2. Navigate to `/login`
3. Click "Sign in with Google"
4. Complete Google OAuth flow
5. Verify you're redirected back and see user info in header

## Security Notes
- Never commit real Firebase config to public repositories
- Use environment variables for production deployments
- Configure Firebase Security Rules for your database/storage
- Set up proper CORS settings for production domains

## Troubleshooting
- **"This app is not authorized"**: Add your domain to Firebase authorized domains
- **Import errors**: Ensure Firebase packages are installed with correct versions
- **Authentication popup blocked**: Enable popups for your domain
- **CORS errors**: Check Firebase authorized domains and app domain configuration
