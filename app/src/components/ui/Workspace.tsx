import { useRef, useMemo, ReactNode } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import type { WorkspaceItem, GraphState, ConversationMessage } from '../../types/components';
import GraphPanel from './GraphPanel';

interface WorkspaceProps {
  items: WorkspaceItem[];
  conversationHistory: ConversationMessage[];
  graphState: GraphState;
  showGraph: boolean;
  children?: ReactNode; // For ConfirmationBar and InputBar
}

export default function Workspace({
  items,
  conversationHistory,
  graphState,
  showGraph,
  children,
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

  // Create graphs array for GraphPanel (currently single graph, expandable later)
  const graphs = useMemo(() => {
    if (!shouldShowGraph) return [];
    return [
      {
        id: 'graph-1',
        label: 'Graph 1',
        state: graphState,
      },
    ];
  }, [shouldShowGraph, graphState]);

  // Empty state - centered placeholder with controls
  if (combinedItems.length === 0 && !shouldShowGraph) {
    return (
      <div
        ref={workspaceRef}
        id="workspace"
        className="flex-1 flex flex-col min-h-[400px]"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-500">
            <p className="text-lg">Your work will appear here...</p>
          </div>
        </div>
        {/* Bottom controls - centered */}
        {children && (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl flex flex-col gap-4">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Centered layout - when no graphs exist
  if (!shouldShowGraph) {
    return (
      <div
        ref={workspaceRef}
        id="workspace"
        className="flex-1 flex flex-col min-h-[400px] overflow-hidden"
      >
        {/* Centered chat panel */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            <div className="space-y-4">
              {combinedItems.map((item) => {
                if ('role' in item) {
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
          </div>
        </div>
        {/* Bottom controls - centered to match chat panel */}
        {children && (
          <div className="flex justify-center mt-4">
            <div className="w-full max-w-3xl flex flex-col gap-4">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Split layout - when graphs exist
  return (
    <div
      ref={workspaceRef}
      id="workspace"
      className="flex-1 flex gap-6 min-h-[400px] overflow-hidden"
    >
      {/* Left column: Chat/Math panel + controls */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Chat panel - darker background for distinction */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-4">
            {combinedItems.map((item) => {
              if ('role' in item) {
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
        </div>
        {/* Bottom controls - aligned with chat panel */}
        {children && (
          <div className="flex flex-col gap-4">
            {children}
          </div>
        )}
      </div>

      {/* Right panel: Graph - white background, fixed width */}
      <div className="w-[450px] flex-shrink-0">
        <GraphPanel graphs={graphs} />
      </div>
    </div>
  );
}