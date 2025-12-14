// Math Scribe Types

// AI Response structure from the scribe
export interface ScribeResponse {
  text: string // What the AI says to the student
  latex?: string // KaTeX string for equations (optional)
  graph?: GraphCommand // Graph commands for Plotly (optional)
  finished?: boolean // True when student says "I'm done"
}

// Graph command structure
export interface GraphCommand {
  action: 'add_point' | 'add_line' | 'add_function' | 'remove' | 'clear'
  data?: GraphData
}

export interface GraphData {
  x?: number
  y?: number
  label?: string
  points?: [number, number][]
  latex?: string
  id?: string
}

// Point on the graph
export interface GraphPoint {
  id: string
  x: number
  y: number
  label?: string
}

// Line on the graph
export interface GraphLine {
  id: string
  points: [number, number][]
}

// Function on the graph
export interface GraphFunction {
  id: string
  latex: string
}

// Complete graph state
export interface GraphState {
  points: GraphPoint[]
  lines: GraphLine[]
  functions: GraphFunction[]
}

// Workspace item - can be equation or text
export interface WorkspaceItem {
  id: string
  type: 'equation' | 'text' | 'graph'
  content: string // LaTeX for equations, plain text otherwise
  isBoxed?: boolean // True for final answer
  timestamp: Date
}

// Message in the conversation history
export interface ConversationMessage {
  id: string
  role: 'student' | 'scribe'
  content: string // What was said
  timestamp: Date
}

// Confirmation state
export type ConfirmationState = 'none' | 'awaiting' | 'confirmed' | 'rejected'

// App state
export interface MathScribeState {
  workspace: WorkspaceItem[]
  graphState: GraphState
  conversationHistory: ConversationMessage[]
  confirmationState: ConfirmationState
  lastScribeResponse: ScribeResponse | null
  isLoading: boolean
  isFinished: boolean
}

// App settings
export interface AppSettings {
  darkMode: boolean
  theme: 'light' | 'dark' | 'system'
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
