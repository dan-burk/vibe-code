import { Copy, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface OutputPanelProps {
  output: string
  isLoading: boolean
}

export default function OutputPanel({ output, isLoading }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="h-[500px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Output
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI response will appear here.
          </p>
        </div>

        {output && !isLoading && (
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto min-h-[400px] max-h-[420px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Generating AI response...
              </p>
            </div>
          </div>
        ) : output ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white font-sans leading-relaxed">
              {output}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-2xl mb-2">💭</p>
              <p className="text-sm">Submit a question to see the AI response here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}