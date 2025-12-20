import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { processInstruction, startSession } from './services/agentService.js';
import { generatePdf, checkPdflatex } from './services/pdfService.js';
import type {
  ClientMessage,
  ServerMessage,
  Session,
  WorkspaceState,
  ScribeResponse,
} from './types/index.js';

// In-memory session storage (use Redis in production)
const sessions = new Map<string, Session>();

// Express app for health checks and HTTP endpoints
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', async (_req, res) => {
  const pdflatexAvailable = await checkPdflatex();
  res.json({
    status: 'ok',
    pdflatex: pdflatexAvailable,
    sessions: sessions.size,
  });
});

// PDF download endpoint (for fallback if WebSocket fails)
app.post('/api/pdf', async (req, res) => {
  try {
    const { workspaceItems, graphState, studentName } = req.body;
    const pdfBase64 = await generatePdf({
      workspaceItems,
      graphState,
      studentName,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="math-work-${new Date().toISOString().split('T')[0]}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

/**
 * Send a message to a WebSocket client
 */
function sendMessage(ws: WebSocket, message: ServerMessage): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Create or get a session
 */
function getOrCreateSession(sessionId?: string): Session {
  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    session.lastActivity = new Date();
    return session;
  }

  const newSession: Session = {
    id: uuidv4(),
    createdAt: new Date(),
    lastActivity: new Date(),
    workspaceState: {
      items: [],
      graphState: { points: [], lines: [], functions: [] },
    },
  };

  sessions.set(newSession.id, newSession);
  return newSession;
}

/**
 * Handle WebSocket connection
 */
wss.on('connection', async (ws: WebSocket) => {
  console.log('Client connected');

  // Create new session and send init message
  const session = getOrCreateSession();

  sendMessage(ws, {
    type: 'session_init',
    sessionId: session.id,
    payload: { text: '' } as ScribeResponse,
  });

  // Send initial greeting
  for await (const response of startSession()) {
    sendMessage(ws, {
      type: 'scribe_response',
      sessionId: session.id,
      payload: response,
    });
  }

  // Handle incoming messages
  ws.on('message', async (data: Buffer) => {
    try {
      const message: ClientMessage = JSON.parse(data.toString());
      const currentSession = getOrCreateSession(message.sessionId);

      switch (message.type) {
        case 'instruction': {
          if (!message.payload.instruction) {
            sendMessage(ws, {
              type: 'error',
              sessionId: currentSession.id,
              payload: { message: 'No instruction provided' },
            });
            return;
          }

          // Update workspace state if provided
          if (message.payload.workspaceState) {
            // Ensure timestamps are Date objects
            if (message.payload.workspaceState.items) {
              message.payload.workspaceState.items.forEach(item => {
                if (typeof item.timestamp === 'string') {
                  item.timestamp = new Date(item.timestamp);
                }
              });
            }
            currentSession.workspaceState = message.payload.workspaceState;
          }

          // Send processing indicator
          sendMessage(ws, {
            type: 'processing',
            sessionId: currentSession.id,
            payload: { text: 'Thinking...' } as ScribeResponse,
          });

          // Process instruction with Claude
          let lastResponse: ScribeResponse | null = null;
          for await (const response of processInstruction(
            message.payload.instruction,
            currentSession.workspaceState,
            currentSession.agentSessionId
          )) {
            lastResponse = response;
            console.log('Sending scribe_response payload:', JSON.stringify(response, null, 2));
            sendMessage(ws, {
              type: 'scribe_response',
              sessionId: currentSession.id,
              payload: response,
            });
          }

          // Ensure a "finished" message is always sent
          if (!lastResponse || !lastResponse.finished) {
            sendMessage(ws, {
              type: 'scribe_response',
              sessionId: currentSession.id,
              payload: { text: '', finished: true },
            });
          }
          break;
        }

        case 'export_pdf': {
          try {
            const pdfBase64 = await generatePdf({
              workspaceItems: currentSession.workspaceState.items,
              graphState: currentSession.workspaceState.graphState,
              date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            });

            sendMessage(ws, {
              type: 'pdf_ready',
              sessionId: currentSession.id,
              payload: {
                pdfBase64,
                filename: `math-work-${new Date().toISOString().split('T')[0]}.pdf`,
              },
            });
          } catch (error) {
            console.error('PDF generation error:', error);
            sendMessage(ws, {
              type: 'error',
              sessionId: currentSession.id,
              payload: { message: 'Failed to generate PDF' },
            });
          }
          break;
        }

        case 'new_session': {
          // Create a fresh session
          const newSession = getOrCreateSession();
          sendMessage(ws, {
            type: 'session_init',
            sessionId: newSession.id,
            payload: { text: '' } as ScribeResponse,
          });

          // Send greeting for new session
          for await (const response of startSession()) {
            sendMessage(ws, {
              type: 'scribe_response',
              sessionId: newSession.id,
              payload: response,
            });
          }
          break;
        }

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Message handling error:', error);
      sendMessage(ws, {
        type: 'error',
        sessionId: '',
        payload: { message: 'Failed to process message' },
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Clean up old sessions periodically (every 30 minutes)
setInterval(
  () => {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000); // 1 hour
    for (const [id, session] of sessions) {
      if (session.lastActivity < cutoff) {
        sessions.delete(id);
        console.log(`Cleaned up session ${id}`);
      }
    }
  },
  30 * 60 * 1000
);

// Start server
const PORT = parseInt(process.env.PORT || '8080', 10);
server.listen(PORT, () => {
  console.log(`Math Scribe backend listening on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
