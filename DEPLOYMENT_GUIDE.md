# Deployment Guide

## Architecture Overview

| Component | Service | Cost |
|-----------|---------|------|
| Frontend (React) | Firebase Hosting | Free tier |
| Backend (Node.js + WebSocket) | Google Cloud Run | Pay-as-you-go |
| Auth | Firebase Auth | Free tier |

---

# Part 1: Quick Deploy

Use these commands when your environment is already set up.

## Step 1: Deploy Backend

```powershell
# Set the correct project
gcloud config set project math-scribe-3a4b6

# Deploy from backend directory
cd backend
gcloud run deploy math-scribe-backend `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars ANTHROPIC_API_KEY=<your-api-key>
```

**Backend URL:** https://math-scribe-backend-bae5znb3dq-uc.a.run.app

## Step 2: Update Frontend Config

Create or update `app/.env.production` with the backend WebSocket URL:

```
VITE_WS_URL=wss://math-scribe-backend-bae5znb3dq-uc.a.run.app/ws
```

Note: Use `wss://` (not `https://`) and add `/ws` at the end.

## Step 3: Deploy Frontend

```powershell
cd app
npm run build
firebase deploy --only hosting
```

**Frontend URL:** https://math-scribe-3a4b6.web.app

## Step 4: Check Logs
gcloud run services logs read math-scribe-backend --region us-central1 --limit 50
---

# Part 2: First-Time Setup & Troubleshooting

## Prerequisites

### Install Required Tools

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Login to both services
firebase login
gcloud auth login
```

## Initial Setup Steps

### 1. Set Google Cloud Project

```powershell
gcloud config set project math-scribe-3a4b6
```

Verify the correct project:
```powershell
gcloud config get-value project
```

### 2. Enable Billing

Cloud Run requires billing to be enabled (has a generous free tier):

https://console.cloud.google.com/billing/linkedaccount?project=math-scribe-3a4b6

### 3. Enable Required APIs

When deploying, the CLI will prompt you to enable these APIs. Say "yes" to all:
- `artifactregistry.googleapis.com`
- `cloudbuild.googleapis.com`
- `run.googleapis.com`

### 4. Fix IAM Permissions (if needed)

If you encounter permission errors during deployment, run these commands:

```powershell
gcloud projects add-iam-policy-binding math-scribe-3a4b6 `
  --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" `
  --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding math-scribe-3a4b6 `
  --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" `
  --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding math-scribe-3a4b6 `
  --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" `
  --role="roles/artifactregistry.writer"
```

## Troubleshooting

### Wrong Google Cloud Project

Check which project you're using:
```powershell
gcloud config get-value project
```

Switch to the correct project:
```powershell
gcloud config set project math-scribe-3a4b6
```

### Wrong Firebase Account

Verify you're logged in with the correct account:
```powershell
firebase login
firebase projects:list
```

### Build Fails in Cloud Run

View the build logs to diagnose issues:
```powershell
gcloud run services logs read math-scribe-backend --region us-central1 --limit 50
```

Common causes:
- Missing dependencies in package.json
- TypeScript compilation errors
- Missing environment variables

### Container Won't Start

This usually means the app is crashing on startup. Check:
- Missing environment variables (ANTHROPIC_API_KEY)
- Missing files (check `.dockerignore` - SKILL.md must be included)
- Runtime errors in index.ts

View real-time logs:
```powershell
gcloud run services logs read math-scribe-backend --region us-central1 --limit 50
```

### PowerShell Multi-line Commands

Use backticks (\`) to continue commands across lines:
```powershell
gcloud run deploy math-scribe-backend `
  --source . `
  --region us-central1
```

Or put everything on one line:
```powershell
gcloud run deploy math-scribe-backend --source . --region us-central1 --allow-unauthenticated
```

### Getting the Backend URL

If you need to retrieve the deployed backend URL:
```powershell
gcloud run services describe math-scribe-backend --region us-central1 --format="value(status.url)"
```

## Useful Links

- **Frontend:** https://math-scribe-3a4b6.web.app
- **Backend:** https://math-scribe-backend-bae5znb3dq-uc.a.run.app
- **Firebase Console:** https://console.firebase.google.com/project/math-scribe-3a4b6
- **Cloud Run Console:** https://console.cloud.google.com/run?project=math-scribe-3a4b6
