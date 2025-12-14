# Math Scribe App Template

A React + Firebase AI-powered math tutoring application that helps students and teachers write mathematical content. Features LaTeX rendering in-browser and PDF export functionality, powered by Claude API.

## Template Documentation

- [App Overview](./app_overview.md) - Complete technical architecture and Q&A
- [App Requirements](./app_requirements.md) - UI/UX specifications and user flow

## Tech Stack

### Frontend
- **Framework:** ReactJS (Vite + TypeScript)
- **Hosting:** Firebase Hosting
- **Styling:** Tailwind CSS
- **LaTeX Rendering:** KaTeX (or MathJax)
- **PDF Generation:** jsPDF + html2canvas

### Authentication
- **Provider:** Firebase Auth
- **Methods:** Google Sign-in (SSO planned for future)

### Backend
- **Platform:** Firebase Functions
- **Language:** NodeJS / TypeScript
- **API Integration:** Claude API (Anthropic)

### Database
- **Type:** Firebase Firestore

### Domain
- **Provider:** Custom domain (configurable)

## Key Features

- Chat-style interface optimized for math tutoring
- LaTeX rendering in real-time (KaTeX)
- PDF export button for generated content
- Firebase-powered Google authentication
- Protected backend API calls via Firebase Functions
- Conversation history storage
- System prompt based on skill.md expertise
- Future: User-provided API keys option

## Architecture

```
React App (Vite + TypeScript)
    │
    ├── Firebase Auth (Google Sign-in)
    │
    ├── KaTeX (LaTeX rendering in browser)
    │
    ├── jsPDF (PDF generation on demand)
    │
    └── Firebase Function (API proxy)
            │
            ├── Validates Firebase ID token
            ├── Loads system prompt (skill.md content)
            └── Calls Claude API
                    │
                    └── Returns LaTeX/math content
```

## Getting Started with This Template

### Prerequisites

- Node.js and npm installed
- VSCode or preferred code editor
- Git installed
- Firebase account
- Anthropic API key (Claude)

### Implementation Steps

#### Step 1: Project Setup

1. Clone or fork a React starter template (Vite + React + TypeScript)
2. Reference this template documentation for implementation guidance

#### Step 2: Local Development Setup

```bash
cd app
npm install
npm run dev
```

#### Step 3: Firebase Configuration

Create a `.env` file in the app directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Step 4: Firebase Functions Setup

1. Initialize Firebase Functions in your project
2. Create a function to proxy Claude API calls
3. Store Claude API key in Firebase Functions config:
   ```bash
   firebase functions:config:set claude.api_key="your_claude_api_key"
   ```
4. Validate Firebase ID tokens in the function

#### Step 5: Install Math/PDF Dependencies

```bash
npm install katex react-katex
npm install jspdf html2canvas
```

#### Step 6: System Prompt Setup

Convert your skill.md content into a system prompt constant:

```typescript
// src/utils/systemPrompt.ts
export const MATH_SCRIBE_SYSTEM_PROMPT = `
[Your skill.md content here - the math tutoring expertise]
`;
```

### Development Workflow

1. Make changes and test locally with `npm run dev`
2. Update `app/CLAUDE.md` as new files are created
3. Commit changes frequently

## Security

- **API Keys:** Claude API key stored only in Firebase Functions config (never in frontend)
- **Backend Protection:** Firebase Functions validate Firebase ID tokens
- **Firestore Rules:** Access controlled by user UID
- **User API Keys (Future):** Stored encrypted in Firestore, never exposed to client

## Core Features

- [x] Chat interface for math tutoring
- [x] LaTeX rendering with KaTeX
- [x] PDF export functionality
- [x] Google authentication
- [x] Conversation history
- [x] Claude API integration

## Stretch Goals

- [ ] User-provided API keys option
- [ ] School SSO integration
- [ ] Multiple conversation threads
- [ ] Template library for common math problems
- [ ] Dark/light mode toggle
- [ ] Export to multiple formats (LaTeX source, PDF, PNG)
- [ ] Collaborative editing (teacher + student)
- [ ] Math notation input palette

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [KaTeX Documentation](https://katex.org/docs/api.html)
- [jsPDF Documentation](https://rawgit.com/MrRio/jsPDF/master/docs/)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Implementation Status

When implementing this template, update this section:

- [ ] Frontend setup (React + Vite + TypeScript)
- [ ] Tailwind CSS configuration
- [ ] Firebase Auth (Google Sign-in)
- [ ] KaTeX integration
- [ ] PDF export functionality
- [ ] Firebase Functions setup
- [ ] Claude API integration
- [ ] System prompt configuration
- [ ] Firestore conversation storage
- [ ] Production deployment
