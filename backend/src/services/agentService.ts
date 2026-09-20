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

// Model config is set at deploy time (see cloudbuild.yaml). Fail fast if missing.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`FATAL: ${name} is not set`);
    process.exit(1);
  }
  return value;
}

const CLAUDE_MODEL = requireEnv('CLAUDE_MODEL');
const MAX_TOKENS = parseInt(requireEnv('CLAUDE_MAX_TOKENS'), 10);

// Load skill content at startup (fail fast if missing)
let SKILL_CONTENT: string;
try {
  const SKILL_PATH = join(__dirname, '../../.claude/skills/math-scribe/SKILL.md');
  SKILL_CONTENT = readFileSync(SKILL_PATH, 'utf-8');
} catch (error) {
  console.error('FATAL: Could not load SKILL.md:', error);
  process.exit(1);
}

// Tool the model must call to answer. Mirrors ScribeResponse, so we read the
// structured input directly instead of parsing JSON out of the model's text.
const SCRIBE_TOOL: Anthropic.Tool = {
  name: 'scribe_response',
  description: "Write down what the student dictated and reply to them. This is the only way to respond.",
  input_schema: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        description: 'What you say to the student.',
      },
      latex: {
        type: 'string',
        description:
          'KaTeX string. This is the DEFAULT way to record anything the student dictates, including a bare point like "(2, 1)".',
      },
      graph: {
        type: 'object',
        description:
          'Graph command. ONLY when the student used an explicit graphing word (plot, graph, draw, put a dot). A bare "point 2,1" is written with latex instead - do not plot it.',
        properties: {
          action: {
            type: 'string',
            enum: ['add_point', 'add_line', 'add_function', 'remove', 'clear'],
          },
          data: {
            type: 'object',
            properties: {
              x: { type: 'number' },
              y: { type: 'number' },
              label: { type: 'string' },
              points: {
                type: 'array',
                items: { type: 'array', items: { type: 'number' } },
              },
              latex: { type: 'string' },
              id: { type: 'string' },
            },
          },
        },
        required: ['action'],
      },
      finished: {
        type: 'boolean',
        description: "True when the student says they are done.",
      },
    },
    required: ['text'],
  },
};

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
 * Builds an alternating messages array from the conversation history, with the
 * current instruction (plus workspace context) as the final user message.
 * The frontend can send consecutive same-role messages, so they get merged.
 */
function buildMessages(
  instruction: string,
  workspaceContext: string,
  conversationHistory: ConversationMessage[]
): Anthropic.MessageParam[] {
  const messages: ConversationMessage[] = [];

  for (const msg of conversationHistory) {
    // The array must start with a user message
    if (messages.length === 0 && msg.role !== 'user') continue;

    const last = messages[messages.length - 1];
    if (last && last.role === msg.role) {
      last.content = `${last.content}\n${msg.content}`;
    } else {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // Workspace state describes the present, so it only goes on the final turn
  const currentMessage = `<current-workspace>
${workspaceContext}
</current-workspace>

<student-says>
${instruction}
</student-says>`;

  const last = messages[messages.length - 1];
  if (last && last.role === 'user') {
    last.content = `${last.content}\n${currentMessage}`;
  } else {
    messages.push({ role: 'user', content: currentMessage });
  }

  return messages;
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
Respond only by calling the scribe_response tool. Everything the student hears goes in the tool's text field - never narrate or explain outside the tool call.
</critical-format-requirements>`;

  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      tools: [SCRIBE_TOOL],
      tool_choice: { type: 'tool', name: SCRIBE_TOOL.name },
      messages: buildMessages(instruction, workspaceContext, conversationHistory),
    });

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    if (!toolUse) {
      console.warn('No tool_use block in response, stop_reason:', message.stop_reason);
      yield { text: "Sorry, I didn't catch that. Could you say it again?" };
      return;
    }

    yield toolUse.input as ScribeResponse;
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
