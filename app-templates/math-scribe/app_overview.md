# App Overview

## Application Details

**Name:** Math Scribe

**Description:** An accessibility tool that acts as a faithful mathematical scribe for students who cannot write legibly. Built with React and Firebase, it features voice input, real-time equation/graph rendering, and PDF export. The AI writes EXACTLY what the student dictates—never correcting, teaching, or helping.

### Purpose

This is an **accessibility accommodation**, not a tutoring app. Designed for a student with cerebral palsy who cannot write legibly. The AI is the student's **hands**, not their **brain**.

### Goals

- Provide text-to-math transcription for students who cannot write legibly
- Offer optional voice input for students who prefer or need it
- Render equations beautifully with KaTeX
- Render graphs interactively with Desmos/Plotly
- NEVER correct, teach, or help—preserve student agency
- Confirm after every action ("Is that what you wanted?")
- Export completed work to PDF with boxed final answer

## Workflow

### Core Interaction Loop

```
Student speaks → AI writes exactly that → AI asks "Is that what you wanted?"
                                                          │
                                    ┌─────────────────────┴─────────────────────┐
                                    ↓                                           ↓
                               "Yes" / "Yeah"                            "No" / correction
                                    │                                           │
                                    ↓                                           ↓
                            Wait for next instruction              AI undoes and rewrites
```

### What Makes This Different from a Chatbot

| Typical Math Chatbot | Math Scribe |
|----------------------|-------------|
| "Here's how to solve that..." | "What would you like me to write?" |
| Provides formulas | "What's the formula?" (student must know it) |
| Corrects mistakes | Writes mistakes exactly as dictated |
| Explains concepts | Only writes what student says |
| Suggests next steps | Waits silently for instruction |

## Frontend

**Framework:** ReactJS (Vite + TypeScript)
**Hosting:** Firebase Hosting

### Key Libraries

- **KaTeX:** Fast equation rendering in browser
- **Desmos API / Plotly.js:** Interactive graph rendering
- **jsPDF + html2canvas:** PDF generation
- **Web Speech API:** Voice input (browser native)
- **Tailwind CSS:** Styling

### Interface Layout

Simple two-area layout:

```
┌─────────────────────────────────────────────────────────┐
│  Math Scribe                          [Export PDF] [👤] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    WORKSPACE                            │
│                                                         │
│   Rendered equations and graphs appear here             │
│   as the student dictates them                          │
│                                                         │
│              ┌─────────────────────┐                    │
│              │   x + 3 = 7         │                    │
│              │   x + 3 - 3 = 7 - 3 │                    │
│              │   x = 4             │                    │
│              └─────────────────────┘                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  AI: "Is that what you wanted?"        [Yes] [No/Undo]  │
├─────────────────────────────────────────────────────────┤
│  Type your instruction...                   [🎤] [Send]   │
└─────────────────────────────────────────────────────────┘
```

## Voice Input (Optional)

### Web Speech API Integration

```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  // Send to Claude for transcription
};
```

### Voice Input UX

- Microphone button available next to send button
- Visual feedback when listening (pulsing indicator)
- Shows interim transcription as student speaks
- Optional alternative to typing

## Equation Rendering (KaTeX)

### Supported Math

KaTeX handles all 8th grade math and beyond:

| Concept | Example |
|---------|---------|
| Basic operations | `x + 3 = 7` |
| Fractions | `\frac{2}{3}x` |
| Exponents | `x^2` |
| Square roots | `\sqrt{x}` |
| Subscripts | `x_1, y_2` |
| Greek letters | `\pi, \theta` |

### Implementation

```typescript
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

<BlockMath math="x + 3 = 7" />
```

## Graph Rendering (Desmos/Plotly)

### Why In-Browser Graphing?

- **Instant rendering** (no server compilation)
- **Interactive** (zoom, pan, hover for coordinates)
- **Accessible** (better than static images)
- **Simpler architecture** (no LaTeX compilation server)

### Desmos API Example

```typescript
const calculator = Desmos.GraphingCalculator(element, {
  expressions: false,
  settingsMenu: false,
  zoomButtons: false
});

// Plot a point
calculator.setExpression({ id: 'point1', latex: '(0, 1)', pointStyle: Desmos.Styles.POINT });

// Draw a line
calculator.setExpression({ id: 'line1', latex: 'y = \\frac{2}{3}x + 1' });
```

### Plotly.js Alternative

```typescript
import Plotly from 'plotly.js-dist';

Plotly.newPlot('graph', [{
  x: [0, 3],
  y: [1, 3],
  mode: 'lines+markers',
  type: 'scatter'
}], {
  xaxis: { range: [-10, 10] },
  yaxis: { range: [-10, 10] }
});
```

## Backend

**Platform:** Firebase Functions
**Language:** TypeScript / NodeJS

### Function: transcribeMath

Proxies requests to Claude API with SKILL.md as system prompt.

```typescript
import * as functions from 'firebase-functions';
import Anthropic from '@anthropic-ai/sdk';

const SCRIBE_SYSTEM_PROMPT = `[Contents of SKILL.md]`;

export const transcribeMath = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { instruction, currentWorkspace } = data;

  const anthropic = new Anthropic({
    apiKey: functions.config().claude.api_key,
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: SCRIBE_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Current workspace:\n${currentWorkspace}\n\nStudent says: "${instruction}"`
      }
    ],
  });

  return {
    action: response.content[0].text,
    // AI response includes: what was written + confirmation question
  };
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
```

#### workspaces
```
workspaces/{workspaceId}
  - userId: string (uid)
  - title: string
  - equations: string[] (KaTeX strings)
  - graphState: object (Desmos/Plotly state)
  - createdAt: timestamp
  - updatedAt: timestamp
```

## PDF Export

### Generating Final Document

When student says "I'm done":

1. Capture workspace content
2. Render equations and graphs
3. Box the final answer
4. Generate PDF with jsPDF

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function exportWorkspace(elementId: string) {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);

  const pdf = new jsPDF();
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10);
  pdf.save('math-scribe-work.pdf');
}
```

## Authentication

**Provider:** Firebase Auth

### Supported Methods

- Google Sign-in (primary)

### Post-Login

```typescript
const token = await firebase.auth().currentUser.getIdToken();
// Send to backend: Authorization: Bearer <token>
```

## Security

- **Claude API Key:** Stored only in Firebase Functions config
- **Firebase ID Tokens:** Validated on every request
- **Firestore Rules:** Users can only access their own workspaces

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Q&A Summary

### Why voice input?

The student has cerebral palsy and may have difficulty typing. Voice is the most accessible input method.

### Why Desmos/Plotly instead of TikZ?

TikZ requires server-side LaTeX compilation (complex, slow, costly). In-browser graphing is instant, interactive, and more accessible.

### Why does the AI never help?

This is an accommodation, not tutoring. The student must learn by doing their own work. The AI is their hands, not their brain. If the AI corrected mistakes, the student wouldn't learn.

### Why confirm after every action?

The AI might misinterpret spoken instructions. Confirmation ensures the student gets exactly what they intended.

### Can this be used for other students?

Yes—any student who needs writing assistance due to physical disability, injury, or other accommodation needs.
