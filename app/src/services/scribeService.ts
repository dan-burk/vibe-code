// WebSocket Scribe Service - connects to Math Scribe backend
// Replaces mockScribe.ts when using the real backend

import type { ScribeResponse, WorkspaceItem, GraphState } from '../types/components'

// Message types matching backend
interface ServerMessage {
  type: 'scribe_response' | 'error' | 'session_init' | 'pdf_ready' | 'processing'
  sessionId: string
  payload: ScribeResponse | ErrorPayload | PdfPayload
}

interface ErrorPayload {
  message: string
  code?: string
}

interface PdfPayload {
  pdfBase64: string
  filename: string
}

interface WorkspaceState {
  items: WorkspaceItem[]
  graphState: GraphState
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

type MessageHandler = (message: ServerMessage) => void
type ConnectionHandler = () => void
type ErrorHandler = (error: Event | Error) => void

class ScribeService {
  private ws: WebSocket | null = null
  private sessionId: string | null = null
  private messageHandlers: Set<MessageHandler> = new Set()
  private connectionHandlers: Set<ConnectionHandler> = new Set()
  private errorHandlers: Set<ErrorHandler> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  /**
   * Get the WebSocket URL from environment or default
   */
  private getWsUrl(): string {
    // Check for environment variable (Vite)
    const envUrl = import.meta.env?.VITE_WS_URL
    if (envUrl) return envUrl

    // Default to localhost in development
    if (import.meta.env?.DEV) {
      return 'ws://localhost:8080/ws'
    }

    // Production - use relative WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws`
  }

  /**
   * Connect to the WebSocket server
   */
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.getWsUrl()
        console.log('Connecting to WebSocket:', wsUrl)
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.connectionHandlers.forEach((handler) => handler())
          resolve()
        }

        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event)
          this.errorHandlers.forEach((handler) => handler(event))
          reject(new Error('WebSocket connection failed'))
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.handleDisconnect()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: ServerMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(message: ServerMessage): void {
    // Update session ID if received
    if (message.type === 'session_init') {
      this.sessionId = message.sessionId
    }

    // Notify all handlers
    this.messageHandlers.forEach((handler) => handler(message))
  }

  /**
   * Handle WebSocket disconnect with reconnection
   */
  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error)
        })
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
      this.errorHandlers.forEach((handler) =>
        handler(new Error('Connection lost. Please refresh the page.'))
      )
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.sessionId = null
    this.reconnectAttempts = this.maxReconnectAttempts // Prevent auto-reconnect
  }

  /**
   * Send an instruction to the scribe and handle streaming responses
   */
  sendInstruction(
    instruction: string,
    workspaceState: WorkspaceState,
    conversationHistory: ConversationMessage[],
    onResponse: (response: ScribeResponse) => void,
    onFinish: () => void,
    onError: (error: Error) => void
  ): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect()
        .then(() =>
          this.sendInstruction(
            instruction,
            workspaceState,
            conversationHistory,
            onResponse,
            onFinish,
            onError
          )
        )
        .catch(onError)
      return
    }

    const handler = (message: ServerMessage) => {
      if (message.type === 'scribe_response') {
        const response = message.payload as ScribeResponse
        onResponse(response)
        if (response.finished) {
          this.messageHandlers.delete(handler)
          onFinish()
        }
      } else if (message.type === 'error') {
        this.messageHandlers.delete(handler)
        onError(new Error((message.payload as ErrorPayload).message))
      }
      // Note: We don't resolve/finish on 'processing'.
      // The stream is considered finished only on `response.finished` or an error.
    }

    this.messageHandlers.add(handler)

    // Add a timeout for the whole operation
    const timeout = setTimeout(() => {
      this.messageHandlers.delete(handler)
      onError(new Error('Request timed out after 60 seconds'))
    }, 60000)

    // Clear timeout if the stream finishes properly
    const originalOnFinish = onFinish
    onFinish = () => {
      clearTimeout(timeout)
      originalOnFinish()
    }

    this.ws.send(
      JSON.stringify({
        type: 'instruction',
        sessionId: this.sessionId,
        payload: {
          instruction,
          workspaceState,
          conversationHistory,
        },
      })
    )
  }

  /**
   * Request PDF export
   */
  async exportPdf(): Promise<{ pdfBase64: string; filename: string }> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect()
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('PDF generation timed out'))
      }, 120000) // 2 minute timeout for PDF

      const handler = (message: ServerMessage) => {
        if (message.type === 'pdf_ready') {
          clearTimeout(timeout)
          this.messageHandlers.delete(handler)
          resolve(message.payload as PdfPayload)
        } else if (message.type === 'error') {
          clearTimeout(timeout)
          this.messageHandlers.delete(handler)
          reject(new Error((message.payload as ErrorPayload).message))
        }
      }

      this.messageHandlers.add(handler)

      this.ws!.send(
        JSON.stringify({
          type: 'export_pdf',
          sessionId: this.sessionId,
          payload: {},
        })
      )
    })
  }

  /**
   * Download PDF from base64
   */
  downloadPdf(pdfBase64: string, filename: string): void {
    const binaryString = atob(pdfBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Start a new session
   */
  async newSession(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect()
      return
    }

    this.ws.send(
      JSON.stringify({
        type: 'new_session',
        payload: {},
      })
    )
  }

  /**
   * Subscribe to all messages
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  /**
   * Subscribe to connection events
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler)
    return () => this.connectionHandlers.delete(handler)
  }

  /**
   * Subscribe to error events
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId
  }
}

// Export singleton instance
export const scribeService = new ScribeService()

// Also export the class for testing
export { ScribeService }
