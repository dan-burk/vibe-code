import { useState, useEffect, useCallback } from 'react'
import Layout from './components/layout/Layout'
import Workspace from './components/ui/Workspace'
import ConfirmationBar from './components/ui/ConfirmationBar'
import InputBar from './components/ui/InputBar'
import LoginModal from './components/auth/LoginModal'
import { useAuth } from './contexts/AuthContext'
import { scribeService } from './services/scribeService'
import { exportWorkspaceToPDF } from './utils/pdfExport'
import { INITIAL_GREETING, STORAGE_KEYS } from './utils/constants'
import type {
  WorkspaceItem,
  GraphState,
  ConfirmationState,
  ScribeResponse,
  ConversationMessage,
} from './types/components'

// Initial empty graph state
const initialGraphState: GraphState = {
  points: [],
  lines: [],
  functions: [],
}

// Helper to safely parse JSON from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e)
  }
  return fallback
}

// Restore Date objects from parsed JSON (timestamps come back as strings)
function restoreDates<T extends { timestamp: Date | string }>(items: T[]): T[] {
  return items.map(item => ({
    ...item,
    timestamp: typeof item.timestamp === 'string' ? new Date(item.timestamp) : item.timestamp
  }))
}

function App() {
  // Auth state
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Sign-in modal state
  const [showSignInModal, setShowSignInModal] = useState(false)

  // Workspace state - restored from localStorage
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>(() =>
    restoreDates(loadFromStorage(STORAGE_KEYS.WORKSPACE, []))
  )
  const [graphState, setGraphState] = useState<GraphState>(() =>
    loadFromStorage(STORAGE_KEYS.GRAPH_STATE, initialGraphState)
  )
  const [showGraph, setShowGraph] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SHOW_GRAPH, false)
  )
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>(() =>
    restoreDates(loadFromStorage(STORAGE_KEYS.CONVERSATION, []))
  )

  // Interaction state
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('none')
  const [confirmationMessage, setConfirmationMessage] = useState(INITIAL_GREETING)
  const [lastResponse, setLastResponse] = useState<ScribeResponse | null>(null)
  const [isFinished, setIsFinished] = useState(() =>
    loadFromStorage(STORAGE_KEYS.IS_FINISHED, false)
  )

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Save workspace state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(workspaceItems))
  }, [workspaceItems])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRAPH_STATE, JSON.stringify(graphState))
  }, [graphState])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOW_GRAPH, JSON.stringify(showGraph))
  }, [showGraph])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATION, JSON.stringify(conversationHistory))
  }, [conversationHistory])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_FINISHED, JSON.stringify(isFinished))
  }, [isFinished])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem(STORAGE_KEYS.THEME, 'light')
      }
      return newMode
    })
  }, [])

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Process scribe response and update state
  const processScribeResponse = useCallback((response: ScribeResponse) => {
    console.log('Received scribe response:', JSON.stringify(response, null, 2));
    if (response.text) {
      const assistantMessage: ConversationMessage = {
        id: generateId(),
        role: 'scribe',
        content: response.text,
        timestamp: new Date(),
      };
      setConversationHistory((prev) => [...prev, assistantMessage]);
    }
    // Handle latex (equation)
    if (response.latex) {
      const newItem: WorkspaceItem = {
        id: generateId(),
        type: 'equation',
        content: response.latex,
        isBoxed: response.finished,
        timestamp: new Date(),
      }
      setWorkspaceItems((prev) => [...prev, newItem])
    }

    // Handle graph commands
    if (response.graph) {
      const graphActions = Array.isArray(response.graph) ? response.graph : [response.graph];

      for (const graphAction of graphActions) {
        const { action, data } = graphAction;

        switch (action) {
          case 'add_point':
            if (data?.x !== undefined && data?.y !== undefined) {
              setGraphState((prev) => ({
                ...prev,
                points: [
                  ...prev.points,
                  {
                    id: generateId(),
                    x: data.x!,
                    y: data.y!,
                    label: data.label,
                  },
                ],
              }));
              setShowGraph(true);
            }
            break;

          case 'add_line':
            if (data?.points && data.points.length >= 2) {
              setGraphState((prev) => ({
                ...prev,
                lines: [
                  ...prev.lines,
                  {
                    id: generateId(),
                    points: data.points!,
                  },
                ],
              }));
              setShowGraph(true);
            }
            break;

          case 'add_function':
            if (data?.latex) {
              setGraphState((prev) => ({
                ...prev,
                functions: [
                  ...prev.functions,
                  {
                    id: generateId(),
                    latex: data.latex!,
                  },
                ],
              }));
              setShowGraph(true);
            }
            break;

          case 'remove':
            // Remove last item from appropriate array
            setGraphState((prev) => {
              if (prev.points.length > 0) {
                return { ...prev, points: prev.points.slice(0, -1) };
              }
              if (prev.lines.length > 0) {
                return { ...prev, lines: prev.lines.slice(0, -1) };
              }
              if (prev.functions.length > 0) {
                return { ...prev, functions: prev.functions.slice(0, -1) };
              }
              return prev;
            });
            break;

          case 'clear':
            setGraphState(initialGraphState);
            setShowGraph(true);
            break;
        }
      }
    }

    // Handle finished state
    if (response.finished) {
      setIsFinished(true)
      // Box the last equation
      setWorkspaceItems((prev) => {
        if (prev.length === 0) return prev
        const lastIdx = prev.length - 1
        return prev.map((item, idx) =>
          idx === lastIdx ? { ...item, isBoxed: true } : item
        )
      })
    }

    // Update confirmation state
    // Only show Yes/No/Undo buttons if AI actually did something (scribed latex, graph action, or finished)
    const didScribe = response.latex || response.graph || response.finished;
    if (response.text && response.text.includes('?') && didScribe) {
      setConfirmationState('awaiting');
      setConfirmationMessage(response.text);
    } else if (response.text) {
      // For messages without scribing (like clarifying questions), show message without buttons
      setConfirmationState((prev) => prev === 'awaiting' ? prev : 'confirmed');
      setConfirmationMessage(response.text);
    }
    setLastResponse(response);
  }, [])

  // Connect to WebSocket on mount
  // Note: Initial connection may fail but the service retries automatically
  useEffect(() => {
    scribeService.connect().catch(() => {
      // Silently handle initial connection error - the service will retry
      // Errors during actual user interaction are handled in handleSubmit
    })

    return () => {
      scribeService.disconnect()
    }
  }, [])

  // Handle student instruction submission
  const handleSubmit = useCallback(
    (instruction: string) => {
      if (isLoading) return

      // Check authentication - show sign-in modal if not authenticated
      if (!isAuthenticated) {
        setShowSignInModal(true)
        return
      }

      // Clear any existing confirmation message
      setConfirmationState('none')

      const userMessage: ConversationMessage = {
        id: generateId(),
        role: 'student',
        content: instruction,
        timestamp: new Date(),
      }
      setConversationHistory((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Send instruction to backend via WebSocket using callbacks
        scribeService.sendInstruction(
          instruction,
          { items: workspaceItems, graphState },
          conversationHistory,
          (response) => {
            // Process each response as it streams in
            processScribeResponse(response)
          },
          () => {
            // onFinish
            setIsLoading(false)
          },
          (error) => {
            // onError
            console.error('Error getting scribe response:', error)
            setConfirmationMessage(
              "I'm having trouble connecting. Could you say that again?"
            )
            setConfirmationState('none')
            setIsLoading(false)
          }
        )
      } catch (error) {
        // Catch synchronous errors if sendInstruction itself fails
        console.error('Error sending instruction:', error)
        setConfirmationMessage(
          'There was a problem sending your request.'
        )
        setConfirmationState('none')
        setIsLoading(false)
      }
    },
    [isLoading, isAuthenticated, workspaceItems, graphState, conversationHistory, processScribeResponse]
  )

  // Handle confirmation (Yes)
  const handleConfirm = useCallback(() => {
    setConfirmationState('confirmed')
    setConfirmationMessage("Got it. What's next?")
  }, [])

  // Handle rejection (No / Undo)
  const handleReject = useCallback(() => {
    // Undo last action
    if (lastResponse?.latex) {
      setWorkspaceItems((prev) => prev.slice(0, -1))
    }
    if (lastResponse?.graph) {
      // Undo graph action is handled in processScribeResponse with 'remove'
      setGraphState((prev) => {
        if (prev.points.length > 0) {
          return { ...prev, points: prev.points.slice(0, -1) }
        }
        if (prev.lines.length > 0) {
          return { ...prev, lines: prev.lines.slice(0, -1) }
        }
        if (prev.functions.length > 0) {
          return { ...prev, functions: prev.functions.slice(0, -1) }
        }
        return prev
      })
    }

    setConfirmationState('rejected')
    setConfirmationMessage('Okay, removed that. What should I write instead?')
  }, [lastResponse])

  // Handle PDF export
  const handleExportPDF = useCallback(async () => {
    await exportWorkspaceToPDF()
  }, [])

  // Handle reset (new problem)
  const handleReset = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.WORKSPACE)
    localStorage.removeItem(STORAGE_KEYS.GRAPH_STATE)
    localStorage.removeItem(STORAGE_KEYS.SHOW_GRAPH)
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION)
    localStorage.removeItem(STORAGE_KEYS.IS_FINISHED)

    // Reset all state
    setWorkspaceItems([])
    setGraphState(initialGraphState)
    setShowGraph(false)
    setConversationHistory([])
    setIsFinished(false)
    setConfirmationState('none')
    setConfirmationMessage(INITIAL_GREETING)
    setLastResponse(null)
  }, [])

  // Show loading while checking auth state
  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <>
      {/* Sign-in modal - shown when user tries to input without being authenticated */}
      {showSignInModal && (
        <LoginModal onClose={() => setShowSignInModal(false)} />
      )}

      <Layout
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onExportPDF={handleExportPDF}
        isFinished={isFinished}
        onSignInClick={() => setShowSignInModal(true)}
      >
      <div className="flex-1 flex flex-col w-full px-6 py-6">
        {/* Workspace - Main area for equations, graphs, and controls */}
        <Workspace
          items={workspaceItems}
          conversationHistory={conversationHistory}
          graphState={graphState}
          showGraph={showGraph}
        >
          {/* Confirmation Bar - Shows AI message and Yes/No buttons */}
          <ConfirmationBar
            message={confirmationMessage}
            confirmationState={confirmationState}
            onConfirm={handleConfirm}
            onReject={handleReject}
          />

          {/* Input Bar - Text input for instructions */}
          <InputBar
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isLoading}
            disabled={confirmationState === 'awaiting'}
            placeholder="Type your instruction..."
            showReset={workspaceItems.length > 0 || conversationHistory.length > 0}
          />
        </Workspace>
      </div>
    </Layout>
    </>
  )
}

export default App
