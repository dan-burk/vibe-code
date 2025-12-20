# Math Scribe Backend

Backend service for Math Scribe using Claude Agent SDK with WebSocket communication and LaTeX-based PDF generation.

## Prerequisites

- Node.js 20+
- Claude Code CLI installed (`npm install -g @anthropic-ai/claude-code`)
- Anthropic API key
- TeX Live (for PDF generation) - optional for development

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

3. **Run in development:**
   ```bash
   npm run dev
   ```

## API Endpoints

### WebSocket: `/ws`

Connect for real-time communication with the scribe.

**Client → Server Messages:**

```typescript
// Send instruction
{
  type: 'instruction',
  sessionId: 'uuid',
  payload: {
    instruction: 'Write x plus three equals seven',
    workspaceState: { items: [], graphState: { points: [], lines: [], functions: [] } }
  }
}

// Request PDF export
{ type: 'export_pdf', sessionId: 'uuid', payload: {} }

// Start new session
{ type: 'new_session', payload: {} }
```

**Server → Client Messages:**

```typescript
// Session initialized
{ type: 'session_init', sessionId: 'uuid', payload: {} }

// Scribe response
{
  type: 'scribe_response',
  sessionId: 'uuid',
  payload: {
    text: 'Done - I wrote x + 3 = 7. Is that what you wanted?',
    latex: 'x + 3 = 7'
  }
}

// PDF ready
{
  type: 'pdf_ready',
  sessionId: 'uuid',
  payload: { pdfBase64: '...', filename: 'math-work-2024-01-15.pdf' }
}

// Error
{ type: 'error', sessionId: 'uuid', payload: { message: 'Error message' } }
```

### HTTP: `/health`

Health check endpoint.

```bash
curl http://localhost:8080/health
# { "status": "ok", "pdflatex": true, "sessions": 0 }
```

### HTTP: `POST /api/pdf`

Fallback PDF generation endpoint.

```bash
curl -X POST http://localhost:8080/api/pdf \
  -H "Content-Type: application/json" \
  -d '{"workspaceItems": [], "graphState": {"points": [], "lines": [], "functions": []}}' \
  --output math-work.pdf
```

## Docker Deployment

Build and run with Docker:

```bash
docker build -t math-scribe-backend .
docker run -p 8080:8080 -e ANTHROPIC_API_KEY=your_key math-scribe-backend
```

## Cloud Run Deployment

1. **Build and push:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/math-scribe-backend
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy math-scribe-backend \
     --image gcr.io/PROJECT_ID/math-scribe-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 1Gi \
     --timeout 300s \
     --session-affinity \
     --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest
   ```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Math Scribe Backend                       │
├─────────────────────────────────────────────────────────────┤
│  src/index.ts           - WebSocket server + Express        │
│  src/services/                                               │
│    ├── agentService.ts  - Claude Agent SDK integration      │
│    └── pdfService.ts    - LaTeX → PDF generation            │
│  src/types/index.ts     - Shared TypeScript types           │
├─────────────────────────────────────────────────────────────┤
│  .claude/skills/math-scribe/SKILL.md - Scribe behavior      │
└─────────────────────────────────────────────────────────────┘
```

## The Math Scribe Skill

The SKILL.md file defines Claude's behavior as a faithful scribe:

- **Never corrects** - writes exactly what the student says, even if wrong
- **Never helps** - asks student for formulas instead of providing them
- **Always confirms** - asks "Is that what you wanted?" after every action
- **Outputs JSON** - structured responses for frontend rendering
