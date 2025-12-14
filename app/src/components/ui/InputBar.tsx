import { useState, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface InputBarProps {
  onSubmit: (instruction: string) => void
  isLoading: boolean
  disabled?: boolean
  placeholder?: string
}

export default function InputBar({
  onSubmit,
  isLoading,
  disabled = false,
  placeholder = 'Type your instruction...',
}: InputBarProps) {
  const [input, setInput] = useState('')

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

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <div className="flex items-end gap-3">
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
