# Math Scribe App Template

An accessibility tool that acts as a faithful mathematical scribe for students who cannot write legibly. The AI writes EXACTLY what the student dictates—never correcting, teaching, or helping—preserving complete student agency over their learning.

## Purpose

This is NOT a tutoring app. It's an **accessibility accommodation** for a student with cerebral palsy who cannot write legibly. The AI is the student's **hands**, not their **brain**.

**Core principle:** Write exactly what the student says, even if mathematically wrong. The student learns from their own mistakes.

## Template Documentation

- [App Overview](./app_overview.md) - Technical architecture and Q&A
- [App Requirements](./app_requirements.md) - UI/UX specifications and user flow
- [SKILL.md](./SKILL.md) - Complete scribe behavior specification (system prompt)

## Tech Stack

### Frontend
- **Framework:** ReactJS (Vite + TypeScript)
- **Hosting:** Firebase Hosting
- **Styling:** Tailwind CSS
- **Equation Rendering:** KaTeX
- **Graph Rendering:** Desmos API or Plotly.js (interactive, accessible graphs)
- **PDF Generation:** jsPDF + html2canvas
- **Voice Input:** Web Speech API (SpeechRecognition)

### Authentication
- **Provider:** Firebase Auth
- **Methods:** Google Sign-in

### Backend
- **Platform:** Firebase Functions
- **Language:** NodeJS / TypeScript
- **API Integration:** Claude API (Anthropic)

### Database
- **Type:** Firebase Firestore

## Key Features

- **Text input** (primary) - Student types instructions
- **Voice input** (optional) - For students who prefer or need to speak
- **Faithful transcription** - AI writes EXACTLY what's dictated, even if wrong
- **Confirmation after every action** - "Is that what you wanted?"
- **KaTeX equation rendering** - Beautiful inline/block math
- **Interactive graphing** - Desmos/Plotly for coordinate planes and functions
- **PDF export** - Download completed work with boxed final answer
- **Never helps** - AI asks "What's the formula?" instead of providing it

## Architecture

```
React App (Vite + TypeScript)
    │
    ├── Firebase Auth (Google Sign-in)
    │
    ├── Web Speech API (Voice input)
    │
    ├── KaTeX (Equation rendering)
    │
    ├── Desmos/Plotly (Graph rendering)
    │
    ├── jsPDF (PDF export)
    │
    └── Firebase Function (API proxy)
            │
            ├── Validates Firebase ID token
            ├── Loads system prompt (SKILL.md content)
            └── Calls Claude API
                    │
                    └── Returns scribe response
```

## Scribe Behavior (from SKILL.md)

### What the AI DOES:
- Write exactly what the student dictates
- Ask clarifying questions when ambiguous ("Where should I put that point?")
- Confirm after each action ("Is that what you wanted?")
- Ask student for formulas ("What's the slope formula?")
- Ask where each number goes in substitutions

### What the AI NEVER does:
- Correct errors
- Provide formulas
- Skip ahead or anticipate
- Hint at mistakes
- Teach unless explicitly asked

## Getting Started with This Template

### Prerequisites

- Node.js and npm installed
- Firebase account
- Anthropic API key (Claude)

### Implementation Steps

#### Step 1: Project Setup

```bash
cd app
npm install
npm run dev
```

#### Step 2: Firebase Configuration

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Step 3: Install Dependencies

```bash
npm install katex react-katex
npm install desmos  # or plotly.js
npm install jspdf html2canvas
```

#### Step 4: Firebase Functions Setup

1. Initialize Firebase Functions
2. Store Claude API key:
   ```bash
   firebase functions:config:set claude.api_key="your_claude_api_key"
   ```
3. Create function that loads SKILL.md as system prompt

#### Step 5: Voice Input Setup

Use Web Speech API for voice recognition:

```typescript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
```

## Security

- **API Keys:** Claude API key stored only in Firebase Functions config
- **Backend Protection:** Firebase Functions validate Firebase ID tokens
- **Firestore Rules:** Access controlled by user UID

## Core Features Checklist

- [ ] Text input (primary)
- [ ] Voice input (optional, Web Speech API)
- [ ] KaTeX equation rendering
- [ ] Desmos/Plotly graph rendering
- [ ] Confirmation UI ("Is that what you wanted?")
- [ ] PDF export with boxed final answer
- [ ] Google authentication
- [ ] Claude API integration with SKILL.md prompt

## Stretch Goals

- [ ] Multiple workspaces/sessions
- [ ] Export to LaTeX source
- [ ] Teacher view mode
- [ ] Offline support
- [ ] Dark mode

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [KaTeX Documentation](https://katex.org/docs/api.html)
- [Desmos API](https://www.desmos.com/api)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference)
