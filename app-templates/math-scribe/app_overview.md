# App Overview

## Application Details

**Name:** Math Scribe

**Description:** An AI-powered math tutoring application that helps students and teachers write mathematical content. Built with React and Firebase, it features real-time LaTeX rendering and PDF export, powered by Claude API through a secure Firebase Functions backend.

### Goals

- Create a focused math tutoring assistant
- Render LaTeX beautifully in the browser
- Enable PDF export of generated content
- Use Google Sign-in for simple authentication
- Secure Claude API calls through Firebase Functions
- Store conversation history in Firestore
- Future: Allow users to provide their own API keys

## Frontend

**Framework:** ReactJS (Vite + TypeScript)
**Hosting:** Firebase Hosting

### Key Libraries

- **KaTeX:** Fast LaTeX rendering in browser
- **jsPDF + html2canvas:** PDF generation from rendered content
- **Tailwind CSS:** Styling

### Chat Interface

- Conversational UI optimized for math questions
- Messages display with LaTeX rendered inline
- PDF export button for each response or full conversation

### Deployment

- **Git Repository:** GitHub
- **Auto Deploy:** Firebase Hosting CI/CD
- **Build Command:** `npm run build`

## Authentication

**Provider:** Firebase Auth

### Supported Methods

- Google Sign-in (primary)
- School SSO (future)

### Integration

- **SDK:** Firebase SDK in React
- **Login UI:** Custom or Firebase UI

### Post-Login

- **Get Token:** `firebase.auth().currentUser.getIdToken()`
- **Send to Backend:** `Authorization: Bearer <ID_TOKEN>`

## Backend

**Platform:** Firebase Functions
**Language:** TypeScript / NodeJS

### Function: askClaude

Proxies requests to Claude API with system prompt injection.

**Request Flow:**
1. Receive request with Firebase ID token
2. Validate token (reject if invalid)
3. Load system prompt (math tutoring expertise from skill.md)
4. Call Claude API with user message + system prompt
5. Return Claude's response

**Example Function Structure:**

```typescript
import * as functions from 'firebase-functions';
import Anthropic from '@anthropic-ai/sdk';
import * as admin from 'firebase-admin';

const anthropic = new Anthropic({
  apiKey: functions.config().claude.api_key,
});

export const askClaude = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { message, conversationHistory } = data;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: MATH_SCRIBE_SYSTEM_PROMPT,
    messages: [
      ...conversationHistory,
      { role: 'user', content: message }
    ],
  });

  return {
    content: response.content[0].text,
    usage: response.usage,
  };
});
```

### Future: User-Provided API Keys

```typescript
// Check if user has their own API key
const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
const userApiKey = userDoc.data()?.claudeApiKey;

const client = new Anthropic({
  apiKey: userApiKey || functions.config().claude.api_key,
});
```

## Database

**Type:** Firebase Firestore

### Collections

#### users
```
users/{uid}
  - email: string
  - displayName: string
  - createdAt: timestamp
  - claudeApiKey?: string (encrypted, future)
```

#### conversations
```
conversations/{conversationId}
  - userId: string (uid)
  - title: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

#### messages
```
conversations/{conversationId}/messages/{messageId}
  - role: 'user' | 'assistant'
  - content: string
  - createdAt: timestamp
```

## LaTeX Rendering

### KaTeX Integration

```typescript
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Inline math: $x^2$
<InlineMath math="x^2" />

// Block math: $$\int_0^1 x^2 dx$$
<BlockMath math="\int_0^1 x^2 dx" />
```

### Parsing Claude Responses

Claude responses may contain LaTeX in `$...$` (inline) or `$$...$$` (block) delimiters. Parse and render accordingly:

```typescript
function renderMathContent(text: string) {
  // Split by LaTeX delimiters and render appropriately
  // Handle both inline ($...$) and block ($$...$$) math
}
```

## PDF Export

### Using jsPDF + html2canvas

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 10, 10);
  pdf.save(`${filename}.pdf`);
}
```

## Security

- **Claude API Key:** Stored in Firebase Functions config, never exposed to frontend
- **Firebase ID Tokens:** Validated on every API request
- **Firestore Rules:** Users can only access their own conversations
- **User API Keys (Future):** Encrypted at rest in Firestore

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      match /messages/{messageId} {
        allow read, write: if request.auth != null &&
          get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId == request.auth.uid;
      }
    }
  }
}
```

## Q&A Summary

### Why Claude API instead of OpenAI?

The math tutoring expertise (skill.md) was developed for Claude and works best with Claude's capabilities for structured math content and LaTeX generation.

### Why Firebase Functions instead of Google Cloud Functions directly?

Firebase Functions integrate seamlessly with Firebase Auth token validation and Firestore. Same underlying infrastructure, simpler setup.

### Can users bring their own API keys?

Yes, this is a planned feature. Users would store their encrypted API key in Firestore, and the function would use it instead of the default key.

### Why KaTeX over MathJax?

KaTeX is faster for rendering and works well for most mathematical notation. MathJax can be used as a fallback for edge cases if needed.

### How do I handle LaTeX errors?

KaTeX has an `errorColor` option and can render errors inline. Wrap rendering in try-catch and display fallback for malformed LaTeX.
