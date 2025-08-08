import { AlertCircle } from 'lucide-react'

interface UsageIndicatorProps {
  usageCount: number
  maxUsage: number
}

export default function UsageIndicator({ usageCount, maxUsage }: UsageIndicatorProps) {
  const percentage = (usageCount / maxUsage) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = usageCount >= maxUsage

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[200px]">
      <div className="flex items-center space-x-2 mb-2">
        {isNearLimit && (
          <AlertCircle className={`w-4 h-4 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
        )}
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Usage: {usageCount}/{maxUsage}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {isAtLimit 
          ? 'Login required to continue' 
          : `${maxUsage - usageCount} requests remaining`
        }
      </p>
    </div>
  )
}