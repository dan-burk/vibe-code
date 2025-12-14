// Mock Scribe Service - simulates AI responses for testing
// Replace with actual Claude API integration later

import type { ScribeResponse } from '../types/components'

// Simple pattern matching for demo purposes
export async function getMockScribeResponse(
  instruction: string,
  _currentWorkspace: string
): Promise<ScribeResponse> {
  const lowerInstruction = instruction.toLowerCase().trim()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Handle confirmations
  if (
    lowerInstruction === 'yes' ||
    lowerInstruction === 'yeah' ||
    lowerInstruction === "that's right"
  ) {
    return {
      text: "Got it. What's next?",
    }
  }

  if (
    lowerInstruction === 'no' ||
    lowerInstruction === 'undo' ||
    lowerInstruction === 'wait'
  ) {
    return {
      text: 'Okay, removed that. What should I write instead?',
      graph: { action: 'remove', data: { id: 'last' } },
    }
  }

  // Handle "I'm done"
  if (
    lowerInstruction.includes("i'm done") ||
    lowerInstruction.includes("that's my answer") ||
    lowerInstruction.includes('finished')
  ) {
    return {
      text: 'All done! Your final answer is boxed. Ready to export?',
      finished: true,
    }
  }

  // Handle formula requests - scribe asks student for the formula
  if (
    lowerInstruction.includes('slope formula') ||
    lowerInstruction.includes('quadratic formula') ||
    lowerInstruction.includes('distance formula')
  ) {
    const formulaType = lowerInstruction.includes('slope')
      ? 'slope'
      : lowerInstruction.includes('quadratic')
        ? 'quadratic'
        : 'distance'
    return {
      text: `What's the ${formulaType} formula?`,
    }
  }

  // Handle equation writing
  if (
    lowerInstruction.includes('write') ||
    lowerInstruction.includes('equals') ||
    lowerInstruction.includes('plus') ||
    lowerInstruction.includes('minus')
  ) {
    // Parse simple equations
    const latex = parseSimpleEquation(instruction)
    return {
      text: `Done - I wrote ${latex}. Is that what you wanted?`,
      latex: latex,
    }
  }

  // Handle graphing - plot a point
  if (
    lowerInstruction.includes('point at') ||
    lowerInstruction.includes('plot') ||
    lowerInstruction.includes('put a dot')
  ) {
    const coords = extractCoordinates(instruction)
    if (coords) {
      return {
        text: `Point at (${coords.x}, ${coords.y}). Is that what you wanted?`,
        graph: {
          action: 'add_point',
          data: { x: coords.x, y: coords.y },
        },
      }
    }
  }

  // Handle drawing a line
  if (
    lowerInstruction.includes('draw a line') ||
    lowerInstruction.includes('connect')
  ) {
    return {
      text: 'Line drawn through your two points. Is that what you wanted?',
      graph: {
        action: 'add_line',
        data: {
          points: [
            [0, 1],
            [3, 3],
          ],
        }, // Mock points
      },
    }
  }

  // Handle coordinate plane
  if (
    lowerInstruction.includes('coordinate plane') ||
    lowerInstruction.includes('graph') ||
    lowerInstruction.includes('axes')
  ) {
    return {
      text: 'Coordinate plane ready. Is that what you wanted?',
      graph: { action: 'clear' },
    }
  }

  // Default - just acknowledge and wait
  return {
    text: `Got it. What would you like me to write next?`,
  }
}

// Helper to parse simple equations from speech
function parseSimpleEquation(instruction: string): string {
  const lower = instruction.toLowerCase()

  // Common patterns
  if (lower.includes('x plus') && lower.includes('equals')) {
    const match = lower.match(/x plus (\w+) equals (\w+)/)
    if (match) {
      const a = wordToNumber(match[1]) ?? match[1]
      const b = wordToNumber(match[2]) ?? match[2]
      return `x + ${a} = ${b}`
    }
  }

  if (lower.includes('x minus') && lower.includes('equals')) {
    const match = lower.match(/x minus (\w+) equals (\w+)/)
    if (match) {
      const a = wordToNumber(match[1]) ?? match[1]
      const b = wordToNumber(match[2]) ?? match[2]
      return `x - ${a} = ${b}`
    }
  }

  if (lower.includes('y equals')) {
    const match = lower.match(/y equals (.+)/)
    if (match) {
      return `y = ${parseExpression(match[1])}`
    }
  }

  // Slope formula
  if (lower.includes('y two minus y one')) {
    return 'm = \\frac{y_2 - y_1}{x_2 - x_1}'
  }

  // Generic: just return cleaned up version
  return instruction
    .replace(/write /i, '')
    .replace(/equals/gi, '=')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/times/gi, '\\cdot')
    .replace(/divided by/gi, '/')
    .trim()
}

// Helper to extract coordinates from text
function extractCoordinates(
  text: string
): { x: number; y: number } | null {
  // Try to find patterns like (3, 2) or "3, 2" or "three two"
  const patterns = [
    /\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?/, // (3, 2) or 3, 2
    /at\s+(-?\d+)\s+(-?\d+)/, // at 3 2
    /(-?\d+)\s+(-?\d+)/, // 3 2
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return { x: parseInt(match[1]), y: parseInt(match[2]) }
    }
  }

  // Try word numbers
  const words = text.toLowerCase().split(/\s+/)
  const numbers: number[] = []
  for (const word of words) {
    const num = wordToNumber(word)
    if (num !== null) {
      numbers.push(num)
    }
  }
  if (numbers.length >= 2) {
    return { x: numbers[0], y: numbers[1] }
  }

  return null
}

// Convert word to number
function wordToNumber(word: string): number | null {
  const map: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    negative: -1, // modifier
  }
  const num = parseInt(word)
  if (!isNaN(num)) return num
  return map[word.toLowerCase()] ?? null
}

// Parse expression
function parseExpression(expr: string): string {
  return expr
    .replace(/two x/gi, '2x')
    .replace(/three x/gi, '3x')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .trim()
}
