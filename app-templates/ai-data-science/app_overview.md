# App Overview

## Application Details

**Name:** React + Firebase AI Assistant

**Description:** A web app built in ReactJS that allows unauthenticated users to make limited API calls, then prompts them to log in using Firebase Auth. The backend is built using serverless Google Cloud Functions, protected by Firebase ID tokens. Data is stored in Firebase Firestore.

### Goals

- Create a scalable, low-cost prototype
- Use a custom domain purchased from GoDaddy called mycoolapp.com
- Limit access to backend API calls until user logs in
- Support anonymous and authenticated usage
- Integrate OpenAI API calls from a protected backend
- Use React on the frontend with minimal hosting setup

## Frontend

**Framework:** ReactJS
**Hosting:** Firebase Hosting

### Login Flow

- **Pre-login limit:** 2 API calls
- **Auth prompt after limit:** Yes
- **Tracking method:** localStorage and anonymous Firebase UID

### Deployment

- **Git Repository:** GitHub
- **Auto Deploy:** Yes
- **Build Command:** `npm run build`

## Authentication

**Provider:** Firebase Auth

### Supported Methods

- Google
- Email/Password
- Anonymous
- Microsoft
- Facebook

### Integration

- **SDK:** Firebase SDK in React
- **Login UI:** Uses Firebase UI (customizable and professional)

### Post-Login

- **Get Token:** `firebase.auth().currentUser.getIdToken()`
- **Send to Backend:** `Authorization: Bearer <ID_TOKEN>`

## Backend

**Platform:** Google Cloud Functions
**Language:** NodeJS

### Authentication Strategy

Function is public, but validates Firebase ID token

### Example Logic

1. If request has valid Firebase ID token then allow request
2. If not logged in, allow up to 2 calls (via IP or anonymous UID)
3. After limit reached, return 403 and show login screen

### API Calls

#### askAI

- **Integration:** OpenAI API
- **Authentication Required:** Yes
- **Usage Limited:** Yes

## Database

**Type:** Firebase Firestore

### Usage

- Store user profiles
- Track anonymous and logged-in usage counts
- Save API call history
- Store user messages

## Domain

**Provider:** GoDaddy

### DNS Setup

- **Pointing to:** Firebase Hosting
- **Using:** A/AAAA or CNAME records

## Rate Limiting

- **Anonymous:** Max 2 calls via IP, device ID, or localStorage
- **Authenticated:** Rate limit by Firebase UID or upgrade tier

## Security

- **Function Access:** Public endpoint + Firebase ID token validation
- **Sensitive Keys:** Only stored and used on backend (never in frontend)
- **User Data Access:** Firestore security rules by UID

## Q&A Summary

### Can I replace a weird Google URL with a custom domain?

Yes, point your GoDaddy domain to wherever your frontend is deployed (e.g., Firebase Hosting).

### Do I need a backend for secret API keys?

Yes, never store secrets in frontend. Use a backend (e.g., GCP Cloud Function) to safely handle OpenAI API calls.

### Is Firebase good for auth + database + hosting?

Yes. Firebase is ideal for startups on a budget and gives you integrated tools for fast prototyping.

### Can I protect a Google Cloud Function without making it public?

Not easily for frontend. The best practice is to make it public and validate the Firebase token inside.

### Can Firebase limit usage before requiring login?

Yes. You can use anonymous auth, localStorage, or Cloud Function logic to limit pre-login usage.

### Do Firebase Auth UIs look good?

Yes. FirebaseUI provides clean, responsive login screens and supports easy integration.

### Can GitHub auto-deploy to Firebase?

Yes. Firebase Hosting supports GitHub-based CI/CD workflows for React apps.
