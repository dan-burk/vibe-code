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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Output
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI-generated response will appear here.
          </p>
        </div>

        {output && !isLoading && (
          <button
            onClick={handleCopy}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-2"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[250px]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Generating AI response...
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                This may take a few seconds
              </p>
            </div>
          </div>
        ) : output ? (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-gray-900 dark:text-white font-sans leading-relaxed text-base">
              {output}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[250px]">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">Ready to help!</h3>
              <p className="text-sm max-w-md mx-auto">
                Submit your question above and I'll provide a detailed AI-powered response here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}