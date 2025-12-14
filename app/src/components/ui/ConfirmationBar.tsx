import { Check, X, MessageCircle } from 'lucide-react'
import type { ConfirmationState } from '../../types/components'

interface ConfirmationBarProps {
  message: string
  confirmationState: ConfirmationState
  onConfirm: () => void
  onReject: () => void
}

export default function ConfirmationBar({
  message,
  confirmationState,
  onConfirm,
  onReject,
}: ConfirmationBarProps) {
  if (confirmationState === 'none') return null

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        {/* Speech bubble icon */}
        <div className="flex-shrink-0 mt-0.5">
          <MessageCircle className="w-5 h-5 text-blue-500" />
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className="text-gray-700 dark:text-gray-300 text-base">{message}</p>
        </div>

        {/* Confirmation buttons - only show when awaiting */}
        {confirmationState === 'awaiting' && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onConfirm}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors min-w-[80px] justify-center"
            >
              <Check className="w-4 h-4" />
              Yes
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors min-w-[100px] justify-center"
            >
              <X className="w-4 h-4" />
              No / Undo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
