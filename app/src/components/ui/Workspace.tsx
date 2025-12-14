import { useRef } from 'react'
import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'
import type { WorkspaceItem, GraphState } from '../../types/components'
import GraphCanvas from './GraphCanvas'

interface WorkspaceProps {
  items: WorkspaceItem[]
  graphState: GraphState
  showGraph: boolean
}

export default function Workspace({ items, graphState, showGraph }: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null)

  const hasGraphElements =
    graphState.points.length > 0 ||
    graphState.lines.length > 0 ||
    graphState.functions.length > 0

  return (
    <div
      ref={workspaceRef}
      id="workspace"
      className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-auto min-h-[300px]"
    >
      {items.length === 0 && !showGraph && !hasGraphElements ? (
        <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <p className="text-lg">Your work will appear here...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Rendered equations */}
          {items.map((item) => (
            <div key={item.id} className="workspace-item">
              {item.type === 'equation' ? (
                <div
                  className={`text-xl ${
                    item.isBoxed
                      ? 'border-2 border-blue-500 dark:border-blue-400 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 inline-block'
                      : ''
                  }`}
                >
                  {item.content.includes('\\') || item.content.includes('=') ? (
                    <BlockMath math={item.content} />
                  ) : (
                    <InlineMath math={item.content} />
                  )}
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{item.content}</p>
              )}
            </div>
          ))}

          {/* Graph canvas - show if there are graph elements or explicitly requested */}
          {(showGraph || hasGraphElements) && (
            <div className="mt-6">
              <GraphCanvas graphState={graphState} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
