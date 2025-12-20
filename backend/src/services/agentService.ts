import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk';
import type { ScribeResponse, WorkspaceState } from '../types/index.js';

/**
 * Parses Claude's JSON response into a ScribeResponse object.
 * The SKILL.md instructs Claude to output valid JSON.
 */
function parseScribeResponse(text: string): ScribeResponse {
  // Try to extract JSON from the response
  try {
    // Look for JSON object in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text || '',
        latex: parsed.latex,
        graph: parsed.graph,
        finished: parsed.finished,
      };
    }
  } catch (e) {
    // JSON parsing failed, treat as plain text
    console.warn('Failed to parse JSON response:', e);
  }

  // Fallback: treat entire response as text
  return { text: text.trim() };
}

/**
 * Formats the current workspace state as context for Claude.
 */
function formatWorkspaceContext(workspaceState: WorkspaceState): string {
  const lines: string[] = ['Current workspace state:'];

  if (workspaceState.items.length === 0) {
    lines.push('- Empty workspace (no equations or text yet)');
  } else {
    lines.push('Equations/text on workspace:');
    for (const item of workspaceState.items) {
      const prefix = item.isBoxed ? '[BOXED] ' : '';
      lines.push(`- ${prefix}${item.type}: ${item.content}`);
    }
  }

  const { points, lines: graphLines, functions } = workspaceState.graphState;
  if (points.length > 0 || graphLines.length > 0 || functions.length > 0) {
    lines.push('\nGraph elements:');
    for (const point of points) {
      lines.push(`- Point at (${point.x}, ${point.y})${point.label ? ` labeled "${point.label}"` : ''}`);
    }
    for (const line of graphLines) {
      const pointStr = line.points.map((p) => `(${p[0]}, ${p[1]})`).join(' to ');
      lines.push(`- Line through ${pointStr}`);
    }
    for (const fn of functions) {
      lines.push(`- Function: ${fn.latex}`);
    }
  } else {
    lines.push('\nGraph: Empty (coordinate plane ready)');
  }

  return lines.join('\n');
}

/**
 * Process a student instruction using the Claude Agent SDK.
 * Yields ScribeResponse objects as Claude responds.
 */
export async function* processInstruction(
  instruction: string,
  workspaceState: WorkspaceState,
  sessionId?: string
): AsyncGenerator<ScribeResponse> {
  const workspaceContext = formatWorkspaceContext(workspaceState);

  const options: ClaudeAgentOptions = {
    // Use project settings to load SKILL.md from .claude/skills/
    settingSources: ['project'],
    // Only allow the Skill tool - no file system access
    allowedTools: [],
    // Bypass permissions since we're running in a controlled backend
    permissionMode: 'bypassPermissions',
    // Limit turns to prevent runaway loops
    maxTurns: 5,
    // Resume from previous session if available
    ...(sessionId && { resume: sessionId }),
  };

  // Build the prompt with workspace context
  const prompt = `${workspaceContext}

Student says: "${instruction}"

Respond with valid JSON following the math-scribe skill format.`;

  try {
    for await (const message of query({
      prompt,
      options,
    })) {
      // Handle different message types
      if (message.type === 'assistant' && message.message?.content) {
        for (const block of message.message.content) {
          if ('text' in block && block.text) {
            const response = parseScribeResponse(block.text);
            yield response;
          }
        }
      }

      // Capture session ID for resumption (available in init message)
      if (message.type === 'system' && message.subtype === 'init') {
        // Session ID available for future resumption
        console.log('Agent session ID:', message.session_id);
      }
    }
  } catch (error) {
    console.error('Agent SDK error:', error);
    yield {
      text: "I'm having trouble processing that. Could you try again?",
    };
  }
}

/**
 * Start a new scribe session with the initial greeting.
 */
export async function* startSession(): AsyncGenerator<ScribeResponse> {
  yield {
    text: "I'm ready to write for you. Just tell me what to put down and I'll do exactly that. What are we working on?",
  };
}
