import { useState, useEffect, useCallback } from 'react'
import Layout from './components/layout/Layout'
import Workspace from './components/ui/Workspace'
import ConfirmationBar from './components/ui/ConfirmationBar'
import InputBar from './components/ui/InputBar'
import { getMockScribeResponse } from './services/mockScribe'
import { exportWorkspaceToPDF } from './utils/pdfExport'
import { INITIAL_GREETING, STORAGE_KEYS } from './utils/constants'
import type {
  WorkspaceItem,
  GraphState,
  ConfirmationState,
  ScribeResponse,
} from './types/components'

// Initial empty graph state
const initialGraphState: GraphState = {
  points: [],
  lines: [],
  functions: [],
}

function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Workspace state
  const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([])
  const [graphState, setGraphState] = useState<GraphState>(initialGraphState)
  const [showGraph, setShowGraph] = useState(false)

  // Interaction state
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('none')
  const [confirmationMessage, setConfirmationMessage] = useState(INITIAL_GREETING)
  const [lastResponse, setLastResponse] = useState<ScribeResponse | null>(null)
  const [isFinished, setIsFinished] = useState(false)

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
      const { action, data } = response.graph

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
            }))
            setShowGraph(true)
          }
          break

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
            }))
            setShowGraph(true)
          }
          break

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
            }))
            setShowGraph(true)
          }
          break

        case 'remove':
          // Remove last item from appropriate array
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
          break

        case 'clear':
          setGraphState(initialGraphState)
          setShowGraph(true)
          break
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
    if (response.text.includes('?')) {
      setConfirmationState('awaiting')
    } else {
      setConfirmationState('none')
    }
    setConfirmationMessage(response.text)
    setLastResponse(response)
  }, [])

  // Handle student instruction submission
  const handleSubmit = useCallback(
    async (instruction: string) => {
      if (isLoading) return

      setIsLoading(true)

      try {
        // Get current workspace state for context
        const workspaceContext = workspaceItems.map((item) => item.content).join('\n')

        // Get mock response (replace with actual API call later)
        const response = await getMockScribeResponse(instruction, workspaceContext)

        processScribeResponse(response)
      } catch (error) {
        console.error('Error getting scribe response:', error)
        setConfirmationMessage(
          "I'm having trouble connecting. Could you say that again?"
        )
        setConfirmationState('none')
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, workspaceItems, processScribeResponse]
  )

  // Handle confirmation (Yes)
  const handleConfirm = useCallback(() => {
    setConfirmationState('confirmed')
    setConfirmationMessage("Got it. What's next?")
    setTimeout(() => setConfirmationState('none'), 1500)
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

  return (
    <Layout
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      onExportPDF={handleExportPDF}
      isFinished={isFinished}
    >
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 gap-4">
        {/* Workspace - Main area for equations and graphs */}
        <Workspace
          items={workspaceItems}
          graphState={graphState}
          showGraph={showGraph}
        />

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
          isLoading={isLoading}
          disabled={confirmationState === 'awaiting'}
          placeholder="Type your instruction..."
        />
      </div>
    </Layout>
  )
}

export default App
