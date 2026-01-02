import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ScribeResponse, WorkspaceState, ConversationMessage } from '../types/index.js';

// ESM directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Anthropic client
const anthropic = new Anthropic();

// Load skill content at startup (fail fast if missing)
let SKILL_CONTENT: string;
try {
  const SKILL_PATH = join(__dirname, '../../.claude/skills/math-scribe/SKILL.md');
  SKILL_CONTENT = readFileSync(SKILL_PATH, 'utf-8');
} catch (error) {
  console.error('FATAL: Could not load SKILL.md:', error);
  process.exit(1);
}

/**
 * Parses Claude's JSON response into a ScribeResponse object.
 * The SKILL.md instructs Claude to output valid JSON in a specific format.
 * This function enforces that format.
 */
function parseScribeResponse(text: string): ScribeResponse {
  try {
    const codeBlockMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      const jsonString = codeBlockMatch[1];
      const parsed = JSON.parse(jsonString);

      // Check for the standard ScribeResponse format
      if (parsed.text || parsed.latex || (parsed.graph && typeof parsed.graph === 'object')) {
        return {
          text: parsed.text || '',
          latex: parsed.latex,
          graph: parsed.graph,
          finished: parsed.finished,
        };
      }

      // Fallback for unknown formats
      return { text: `(Received unrecognized format: ${jsonString})` };
    }
  } catch (e) {
    console.warn('Failed to parse JSON response:', e);
  }

  // Fallback: treat entire response as text if no valid JSON block is found
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
 * Formats conversation history for inclusion in the prompt.
 */
function formatConversationHistory(conversationHistory: ConversationMessage[]): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'No previous conversation.';
  }

  return conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'Scribe'}: ${msg.content}`)
    .join('\n');
}

/**
 * Process a student instruction using the Anthropic SDK.
 * Yields ScribeResponse objects as Claude responds.
 */
export async function* processInstruction(
  instruction: string,
  workspaceState: WorkspaceState,
  conversationHistory: ConversationMessage[] = []
): AsyncGenerator<ScribeResponse> {
  const workspaceContext = formatWorkspaceContext(workspaceState);

  // Build the system prompt with embedded skill content
  const systemPrompt = `You ARE the mathematical scribe described below. Do not narrate. Do not explain your thinking. Simply respond as the scribe would.

<scribe-role>
${SKILL_CONTENT}
</scribe-role>

<critical-format-requirements>
Your entire response must be a single valid JSON code block. Nothing else.

DO NOT output:
- Any text before the JSON block
- Any explanation of what you're doing
- Any meta-commentary like "I need to apply..." or "As the scribe..."
- Any text after the JSON block

ONLY output:
\`\`\`json
{...your response...}
\`\`\`
</critical-format-requirements>`;

  // Build the user message with workspace context and instruction
  const userMessage = `<current-workspace>
${workspaceContext}
</current-workspace>

<conversation-history>
${formatConversationHistory(conversationHistory)}
</conversation-history>

<student-says>
${instruction}
</student-says>

JSON response:`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract text from the response
    for (const block of message.content) {
      if (block.type === 'text') {
        const response = parseScribeResponse(block.text);
        yield response;
      }
    }
  } catch (error) {
    console.error('Anthropic API error:', error);
    yield {
      text: "I'm having trouble processing that. Could you try again?",
    };
  }
}

/**
 * Get the initial greeting for a new scribe session.
 */
export function getGreeting(): ScribeResponse {
  return {
    text: "I'm ready to write for you. Just tell me what to put down and I'll do exactly that. What are we working on?",
  };
}
