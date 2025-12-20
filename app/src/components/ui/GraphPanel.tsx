import { useState, useEffect } from 'react';
import GraphCanvas from './GraphCanvas';
import type { GraphState } from '../../types/components';

interface Graph {
  id: string;
  label: string;
  state: GraphState;
}

interface GraphPanelProps {
  graphs: Graph[];
  onTabChange?: (graphId: string) => void;
}

export default function GraphPanel({ graphs, onTabChange }: GraphPanelProps) {
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Auto-select the latest graph when a new one is added
  useEffect(() => {
    if (graphs.length > 0) {
      const latestGraph = graphs[graphs.length - 1];
      setActiveTabId(latestGraph.id);
      onTabChange?.(latestGraph.id);
    }
  }, [graphs.length, onTabChange]);

  const activeGraph = graphs.find((g) => g.id === activeTabId) || graphs[0];

  if (graphs.length === 0) {
    return null;
  }

  const handleTabClick = (graphId: string) => {
    setActiveTabId(graphId);
    onTabChange?.(graphId);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Tab bar */}
      {graphs.length > 1 && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {graphs.map((graph) => (
            <button
              key={graph.id}
              onClick={() => handleTabClick(graph.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTabId === graph.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {graph.label}
            </button>
          ))}
        </div>
      )}

      {/* Single tab header when only one graph */}
      {graphs.length === 1 && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {graphs[0].label}
          </span>
        </div>
      )}

      {/* Graph canvas container */}
      <div className="flex-1 p-4">
        {activeGraph && <GraphCanvas graphState={activeGraph.state} />}
      </div>
    </div>
  );
}
