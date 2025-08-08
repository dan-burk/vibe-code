import { Send, Loader2 } from 'lucide-react'

interface InputPanelProps {
  input: string
  setInput: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  language: string
}

export default function InputPanel({ input, setInput, onSubmit, isLoading, language }: InputPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit()
    }
  }

  const placeholder = language === 'es' 
    ? 'Escribe tu pregunta aquí...' 
    : 'Type your question here...'

  const submitText = language === 'es' ? 'Enviar' : 'Submit'

  return (
    <div className="h-[500px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {language === 'es' ? 'Entrada' : 'Input'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'es' 
            ? 'Escribe tu pregunta y presiona enviar.'
            : 'Type your question and press submit.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex-1 mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full min-h-[280px] max-h-[320px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors text-sm"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'es' ? 'Cmd/Ctrl + Enter' : 'Cmd/Ctrl + Enter'}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'es' ? 'Enviando...' : 'Sending...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{submitText}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}