# Math Scribe - Project Context

An accessibility tool that acts as a faithful mathematical scribe for students who cannot write legibly. The AI writes EXACTLY what the student dictates—never correcting, teaching, or helping—preserving complete student agency over their learning.

## Purpose

This is **NOT** a tutoring app. It's an **accessibility accommodation** for students who cannot write legibly. The AI is the student's **hands**, not their **brain**.

**Core principle:** Write exactly what the student says, even if mathematically wrong. The student learns from their own mistakes.

## Tech Stack

- **Framework:** React (Vite + TypeScript)
- **Styling:** Tailwind CSS
- **Equation Rendering:** KaTeX (react-katex)
- **Graph Rendering:** Plotly.js (react-plotly.js)
- **PDF Export:** jsPDF + html2canvas
- **Icons:** Lucide React

## Project Structure

```
app/
├── public/                          # Static assets
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # App header with Export PDF button
│   │   │   ├── Footer.tsx           # Simple footer
│   │   │   └── Layout.tsx           # Main layout wrapper
│   │   └── ui/
│   │       ├── Workspace.tsx        # Main area for equations/graphs
│   │       ├── ConfirmationBar.tsx  # "Is that what you wanted?" + Yes/No
│   │       ├── InputBar.tsx         # Text input for instructions
│   │       └── GraphCanvas.tsx      # Plotly.js graph component
│   ├── services/
│   │   ├── mockScribe.ts            # Mock AI responses for development
│   │   └── scribeService.ts         # WebSocket client for production
│   ├── types/
│   │   ├── components.ts            # TypeScript types
│   │   ├── react-katex.d.ts         # KaTeX type declarations
│   │   └── react-plotly.d.ts        # Plotly type declarations
│   ├── utils/
│   │   ├── constants.ts             # App constants
│   │   ├── helpers.ts               # Helper functions
│   │   └── pdfExport.ts             # PDF export functionality
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Vite entry point
│   └── globals.css                  # Global styles (Tailwind)
├── index.html                       # HTML entry point
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind config
├── vite.config.ts                   # Vite config
└── CLAUDE.md                        # This file
```

## Key Components

### Workspace (`src/components/ui/Workspace.tsx`)
Main display area showing:
- Rendered equations (KaTeX)
- Interactive graphs (Plotly.js)
- Work steps in order
- Boxed final answer when finished

### ConfirmationBar (`src/components/ui/ConfirmationBar.tsx`)
Shows AI's confirmation after each action:
- Displays what the AI just did
- "Is that what you wanted?"
- Yes/No buttons for confirmation

### InputBar (`src/components/ui/InputBar.tsx`)
Text input for student instructions:
- Enter to send, Shift+Enter for new line
- Disabled while awaiting confirmation

### GraphCanvas (`src/components/ui/GraphCanvas.tsx`)
Interactive Plotly.js graph:
- Coordinate plane (-10 to 10 on both axes)
- Points, lines, and functions
- Hover for coordinates

## State Management

The app uses React useState for:
- `workspaceItems`: Array of equations/text to display
- `graphState`: Points, lines, and functions on the graph
- `confirmationState`: 'none' | 'awaiting' | 'confirmed' | 'rejected'
- `isLoading`: API call in progress
- `isFinished`: Student said "I'm done"

## AI Services

### Mock Scribe (`src/services/mockScribe.ts`)
Local mock service for development without backend:
- Parses simple instructions (write, plot, draw)
- Returns structured responses with latex/graph commands

### WebSocket Scribe (`src/services/scribeService.ts`)
Production service connecting to the backend:
- WebSocket connection to `/ws` endpoint
- Streams responses from Claude Agent SDK
- Handles PDF export via backend

## Backend

The backend is located in `/backend` and uses:
- **Claude Agent SDK** for AI processing
- **WebSocket** for real-time streaming
- **pdflatex** for high-quality PDF generation

See `/backend/README.md` for setup instructions.

### Using the Backend

1. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Configure frontend to use backend:
   ```bash
   # Create .env.local in app/
   echo "VITE_WS_URL=ws://localhost:8080/ws" > .env.local
   ```

3. Import `scribeService` instead of `mockScribe`:
   ```typescript
   import { scribeService } from './services/scribeService'
   ```

## Next Steps

1. **Voice Input (Optional):**
   - Add Web Speech API integration
   - Voice button component
   - Real-time transcription

2. **Authentication (Optional):**
   - Firebase Auth for user accounts
   - Save workspaces to Firestore

## Running the App

```bash
cd app
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Testing the Mock

Try these instructions:
- "Write x plus three equals seven"
- "Plot a point at 3, 2"
- "Draw a coordinate plane"
- "Use the slope formula" (AI will ask what it is)
- "I'm done" (boxes final answer)

---

# Deployment Instructions

## Architecture Overview

| Component | Service | Cost |
|-----------|---------|------|
| Frontend (React) | Firebase Hosting | Free tier |
| Backend (Node.js + WebSocket) | Google Cloud Run | Pay-as-you-go |
| Auth | Firebase Auth | Free tier |

## Prerequisites

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Login to both
firebase login
gcloud auth login
```

## Quick Deploy Commands

### Backend (Cloud Run)
```powershell
cd backend
gcloud run deploy math-scribe-backend --source . --region us-central1 --allow-unauthenticated --set-env-vars ANTHROPIC_API_KEY=your-key-here
```

### Frontend (Firebase Hosting)
```powershell
cd app
npm run build
firebase deploy --only hosting
```

### Get Backend URL
```powershell
gcloud run services describe math-scribe-backend --region us-central1 --format="value(status.url)"
```

## First-Time Setup

### 1. Set Google Cloud Project
```powershell
gcloud config set project math-scribe-3a4b6
```

### 2. Enable Billing
Cloud Run requires billing enabled (has generous free tier):
https://console.cloud.google.com/billing/linkedaccount?project=math-scribe-3a4b6

### 3. Enable Required APIs
When deploying, say "yes" to enable:
- `artifactregistry.googleapis.com`
- `cloudbuild.googleapis.com`
- `run.googleapis.com`

### 4. Fix IAM Permissions (if needed)
If you get permission errors:
```powershell
gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding math-scribe-3a4b6 --member="serviceAccount:639915616844-compute@developer.gserviceaccount.com" --role="roles/artifactregistry.writer"
```

## Deployment Workflow

1. **Deploy backend first** to get the Cloud Run URL
2. **Update `app/.env.production`** with the WebSocket URL:
   ```
   VITE_WS_URL=wss://math-scribe-backend-xxxxxx-uc.a.run.app/ws
   ```
   (Note: `wss://` not `https://`, and add `/ws` at the end)
3. **Build and deploy frontend**

## Troubleshooting

### Wrong Google Cloud Project
```powershell
# Check current project
gcloud config get-value project

# Switch to correct project
gcloud config set project math-scribe-3a4b6
```

### Wrong Firebase Account
```powershell
firebase login
firebase projects:list
```

### Build Fails in Cloud Run
Check logs:
```powershell
gcloud run services logs read math-scribe-backend --region us-central1 --limit 50
```

### Container Won't Start
- Usually means the app is crashing
- Check logs for errors (missing env vars, missing files)
- The `SKILL.md` file must be included (check `.dockerignore`)

### PowerShell Multi-line Commands
Use backticks (`) not backslashes (\), or put everything on one line.

## URLs

- **Frontend:** https://math-scribe-3a4b6.web.app
- **Backend:** Run `gcloud run services describe` command above
- **Firebase Console:** https://console.firebase.google.com/project/math-scribe-3a4b6
- **Cloud Run Console:** https://console.cloud.google.com/run?project=math-scribe-3a4b6

## Cost Estimates (Low Traffic)

- Firebase Hosting: $0 (free tier)
- Cloud Run: $0-5/month (scales to zero)
- Firebase Auth: $0 (free up to 50k MAU)
