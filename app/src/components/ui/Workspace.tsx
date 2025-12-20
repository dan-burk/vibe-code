import { useRef, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import type { WorkspaceItem, GraphState, ConversationMessage } from '../../types/components';
import GraphCanvas from './GraphCanvas';

interface WorkspaceProps {
  items: WorkspaceItem[];
  conversationHistory: ConversationMessage[];
  graphState: GraphState;
  showGraph: boolean;
}

export default function Workspace({
  items,
  conversationHistory,
  graphState,
  showGraph,
}: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);

  const combinedItems = useMemo(() => {
    const allItems = [...conversationHistory, ...items];
    return allItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [conversationHistory, items]);

  const hasGraphElements =
    graphState.points.length > 0 ||
    graphState.lines.length > 0 ||
    graphState.functions.length > 0;

  const shouldShowGraph = showGraph || hasGraphElements;

  return (
    <div
      ref={workspaceRef}
      id="workspace"
      className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex overflow-hidden min-h-[400px]"
    >
      {combinedItems.length === 0 && !shouldShowGraph ? (
        <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <p className="text-lg">Your work will appear here...</p>
        </div>
      ) : (
        <div className="flex w-full space-x-6">
          {/* Left panel: Conversation and equations */}
          <div
            className={`overflow-y-auto space-y-4 ${
              shouldShowGraph ? 'w-1/2' : 'w-full'
            }`}
          >
            {combinedItems.map((item) => {
              if ('role' in item) {
                // It's a ConversationMessage
                const message = item as ConversationMessage;
                return (
                  <div key={message.id} className={`chat-message ${message.role}`}>
                    <p
                      className={
                        message.role === 'student'
                          ? 'text-right text-gray-700 dark:text-gray-300'
                          : 'text-left text-gray-700 dark:text-gray-300'
                      }
                    >
                      {message.content}
                    </p>
                  </div>
                );
              } else {
                // It's a WorkspaceItem
                const wsItem = item as WorkspaceItem;
                return (
                  <div key={wsItem.id} className="workspace-item">
                    {wsItem.type === 'equation' ? (
                      <div
                        className={`text-xl ${
                          wsItem.isBoxed
                            ? 'border-2 border-blue-500 dark:border-blue-400 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 inline-block'
                            : ''
                        }`}
                      >
                        {wsItem.content.includes('\\') ||
                        wsItem.content.includes('=') ? (
                          <BlockMath math={wsItem.content} />
                        ) : (
                          <InlineMath math={wsItem.content} />
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {wsItem.content}
                      </p>
                    )}
                  </div>
                );
              }
            })}
          </div>

          {/* Right panel: Graph canvas */}
          {shouldShowGraph && (
            <div className="w-1/2 flex-shrink-0">
              <GraphCanvas graphState={graphState} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}