import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import GraphCanvas from './GraphCanvas';
import type { WorkspaceItem, GraphState, ConversationMessage } from '../../types/components';

interface PrintSheetProps {
  items: WorkspaceItem[];
  conversationHistory: ConversationMessage[];
  graphState: GraphState;
}

/**
 * A plain white, print-only rendering of the session: numbered steps with real
 * (vector) math, the scribe's narration, and the graph. Rendered into a portal
 * on document.body so no scrolling/overflow container can clip it, and hidden
 * off-screen until the print stylesheet takes over. See the @media print block
 * in globals.css.
 */
export default function PrintSheet({ items, conversationHistory, graphState }: PrintSheetProps) {
  const combinedItems = useMemo(() => {
    const allItems = [...conversationHistory, ...items];
    return allItems.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [conversationHistory, items]);

  const hasGraph =
    graphState.points.length > 0 ||
    graphState.lines.length > 0 ||
    graphState.functions.length > 0;

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Only equations get a step number; narration and student lines sit between them.
  let stepNumber = 0;

  return createPortal(
    <div id="print-sheet">
      <div className="print-header">
        <h1>Math Scribe &mdash; Worked Solution</h1>
        <p>{date}</p>
      </div>

      {combinedItems.length === 0 && (
        <p className="print-note">Nothing has been scribed yet.</p>
      )}

      {combinedItems.map((item) => {
        if ('role' in item) {
          const message = item as ConversationMessage;
          return message.role === 'student' ? (
            <p key={message.id} className="print-said">
              You: {message.content}
            </p>
          ) : (
            <p key={message.id} className="print-note">
              {message.content}
            </p>
          );
        }

        const wsItem = item as WorkspaceItem;
        if (wsItem.type !== 'equation') {
          return (
            <p key={wsItem.id} className="print-note">
              {wsItem.content}
            </p>
          );
        }

        stepNumber += 1;
        return (
          <div
            key={wsItem.id}
            className={`print-step${wsItem.isBoxed ? ' print-step-final' : ''}`}
          >
            <span className="print-step-number">{stepNumber}.</span>
            <div className="print-step-math">
              <BlockMath math={wsItem.content} />
              {wsItem.isBoxed && <span className="print-final-label">Final answer</span>}
            </div>
          </div>
        );
      })}

      {hasGraph && (
        <div className="print-graph">
          <h2>Graph</h2>
          <GraphCanvas graphState={graphState} />
        </div>
      )}
    </div>,
    document.body
  );
}
