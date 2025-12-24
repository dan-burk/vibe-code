// Shared types - matching frontend types from app/src/types/components.ts

// AI Response structure from the scribe
export interface ScribeResponse {
  text: string; // What the AI says to the student
  latex?: string; // KaTeX string for equations (optional)
  graph?: GraphCommand; // Graph commands for Plotly (optional)
  finished?: boolean; // True when student says "I'm done"
}

// Graph command structure
export interface GraphCommand {
  action: 'add_point' | 'add_line' | 'add_function' | 'remove' | 'clear';
  data?: GraphData;
}

export interface GraphData {
  x?: number;
  y?: number;
  label?: string;
  points?: [number, number][];
  latex?: string;
  id?: string;
}

// Point on the graph
export interface GraphPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
}

// Line on the graph
export interface GraphLine {
  id: string;
  points: [number, number][];
}

// Function on the graph
export interface GraphFunction {
  id: string;
  latex: string;
}

// Complete graph state
export interface GraphState {
  points: GraphPoint[];
  lines: GraphLine[];
  functions: GraphFunction[];
}

// Workspace item - can be equation or text
export interface WorkspaceItem {
  id: string;
  type: 'equation' | 'text' | 'graph';
  content: string; // LaTeX for equations, plain text otherwise
  isBoxed?: boolean; // True for final answer
  timestamp: Date;
}

// Conversation message for history tracking
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// WebSocket message types
export interface ClientMessage {
  type: 'instruction' | 'confirm' | 'reject' | 'export_pdf' | 'new_session';
  sessionId?: string;
  payload: {
    instruction?: string;
    workspaceState?: WorkspaceState;
    conversationHistory?: ConversationMessage[];
  };
}

export interface ServerMessage {
  type: 'scribe_response' | 'error' | 'session_init' | 'pdf_ready' | 'processing';
  sessionId: string;
  payload: ScribeResponse | ErrorPayload | PdfPayload;
}

export interface WorkspaceState {
  items: WorkspaceItem[];
  graphState: GraphState;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

export interface PdfPayload {
  pdfBase64: string;
  filename: string;
}

// Session management
export interface Session {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  workspaceState: WorkspaceState;
  agentSessionId?: string; // Claude Agent SDK session ID for resumption
}

// PDF generation request
export interface PdfRequest {
  workspaceItems: WorkspaceItem[];
  graphState: GraphState;
  studentName?: string;
  date: string;
}
