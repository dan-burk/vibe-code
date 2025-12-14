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
│   │   └── mockScribe.ts            # Mock AI responses (replace with API)
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

## Mock AI Service

The `mockScribe.ts` service simulates AI responses:
- Parses simple instructions (write, plot, draw)
- Returns structured responses with latex/graph commands
- Replace with actual Claude API integration

## Next Steps (Backend)

1. **Firebase Setup:**
   - Create Firebase project
   - Enable Authentication (Google Sign-in)
   - Enable Firestore

2. **Firebase Functions:**
   - Create `transcribeMath` function
   - Load SKILL.md as system prompt
   - Integrate Claude API

3. **Connect Frontend:**
   - Replace mockScribe with Firebase callable function
   - Add authentication flow
   - Save workspaces to Firestore

4. **Voice Input (Optional):**
   - Add Web Speech API integration
   - Voice button component
   - Real-time transcription

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
