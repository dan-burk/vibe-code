import { useState, KeyboardEvent } from 'react'
import { Send, Loader2, RotateCcw } from 'lucide-react'

interface InputBarProps {
  onSubmit: (instruction: string) => void
  onReset?: () => void
  isLoading: boolean
  disabled?: boolean
  placeholder?: string
  showReset?: boolean
}

export default function InputBar({
  onSubmit,
  onReset,
  isLoading,
  disabled = false,
  placeholder = 'Type your instruction...',
  showReset = false,
}: InputBarProps) {
  const [input, setInput] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSubmit = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const handleResetConfirm = () => {
    setShowResetConfirm(false)
    onReset?.()
  }

  const handleResetCancel = () => {
    setShowResetConfirm(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
            Start a new problem? This will clear all your current work.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleResetConfirm}
              className="px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
            >
              Yes, start new
            </button>
            <button
              onClick={handleResetCancel}
              className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Reset button */}
        {showReset && onReset && (
          <button
            onClick={handleResetClick}
            disabled={isLoading}
            className="flex-shrink-0 p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 rounded-lg transition-colors"
            title="New Problem"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {/* Text input */}
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            rows={1}
            className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none text-base"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading || disabled}
          className="flex-shrink-0 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          title="Send"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
