// Math Scribe Constants

export const APP_NAME = 'Math Scribe'

export const STORAGE_KEYS = {
  THEME: 'math_scribe_theme',
  WORKSPACE: 'math_scribe_workspace',
  GRAPH_STATE: 'math_scribe_graph',
  CONVERSATION: 'math_scribe_conversation',
  IS_FINISHED: 'math_scribe_finished',
  SHOW_GRAPH: 'math_scribe_show_graph',
} as const

export const GRAPH_DEFAULTS = {
  X_MIN: -10,
  X_MAX: 10,
  Y_MIN: -10,
  Y_MAX: 10,
} as const

export const INITIAL_GREETING = "I'm ready to write for you. Just tell me what to put down and I'll do exactly that. What are we working on?"

export const CONFIRMATION_MESSAGES = {
  AWAITING: 'Is that what you wanted?',
  CONFIRMED: "Got it. What's next?",
  REJECTED: 'What should I write instead?',
} as const

export const COLORS = {
  POINT: '#3b82f6', // blue-500
  LINE: '#10b981', // emerald-500
  FUNCTION: '#8b5cf6', // violet-500
  GRID: '#e5e7eb', // gray-200
} as const
