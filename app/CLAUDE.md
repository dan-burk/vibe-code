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
