# App Requirements

## UI Description

### Design Philosophy

**Simple, focused, accessible.** This is not a chat interface—it's a workspace where math appears as the student dictates it. The UI should feel like having a patient scribe sitting next to the student, ready to write whatever they say.

### Style Inspiration

- Google Docs (clean workspace)
- Desmos (beautiful math rendering)
- Voice memo apps (prominent microphone button)
- Accessibility-first design

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Math Scribe                              [Export PDF] [👤]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                      WORKSPACE                              │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │    Equations and graphs render here                 │   │
│   │    as student dictates them                         │   │
│   │                                                     │   │
│   │         m = (y₂ - y₁) / (x₂ - x₁)                   │   │
│   │                                                     │   │
│   │         m = (-2 - 1) / (-5 - (-3))                  │   │
│   │                                                     │   │
│   │    [Interactive Graph Here]                         │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   💬 "Point at (3, 3). Is that what you wanted?"            │
│                                                             │
│                              [✓ Yes]    [✗ No / Undo]       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Type your instruction...                    [🎤] [Send]   │
│                                                             │
│  Text input (primary)              Voice button (optional)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key UI Elements

#### 1. Workspace (Main Area)

The primary area where math content appears. This is NOT a chat log—it's a clean workspace showing:
- Rendered equations (KaTeX)
- Interactive graphs (Desmos/Plotly)
- Work steps in order

The workspace should look like a clean sheet of paper with math on it.

#### 2. Confirmation Bar

Prominent area showing the AI's confirmation question after each action:

- Shows what the AI just did
- Displays "Is that what you wanted?"
- Two clear buttons: **Yes** and **No/Undo**
- This is ALWAYS visible after any AI action

#### 3. Input Area

Two input methods available:

**Text Input (Primary)**
- Standard text field
- Placeholder: "Type your instruction..."
- The main way students interact with the app

**Voice Button (Optional)**
- Microphone icon next to send button
- Visual states: idle, listening, processing
- Pulsing animation when active
- For students who prefer or need voice input

#### 4. Header

Minimal header with:
- App name (Math Scribe)
- Export PDF button
- User avatar / login status

No sidebar, no chat history, no complexity.

### Device Responsiveness

- **Desktop:** Full workspace view
- **Tablet:** Same layout, touch-optimized buttons
- **Mobile:** Stacked layout, extra-large voice button

### Theme

- Light mode (default)
- High contrast for readability
- Large, clear fonts
- Accessible color choices

## User Flow

### Step 1: Landing / Login

User arrives. If not logged in, sees simple login screen with Google Sign-in.

### Step 2: Ready State

After login, user sees:
- Empty workspace
- AI greeting: "I'm ready to write for you. Just tell me what to put down. What are we working on?"
- Text input field with optional voice button

### Step 3: Student Gives Instruction

Student types (or speaks): "Write x plus three equals seven"

**Text flow (primary):**
1. Student types instruction in text field
2. Student clicks Send (or presses Enter)
3. Instruction sent to AI

**Voice flow (optional):**
1. Student clicks microphone button
2. Microphone pulses (listening)
3. Transcript appears in real-time
4. Student stops speaking or clicks again
5. Instruction sent to AI

### Step 4: AI Writes + Confirms

AI responds:
- Renders `x + 3 = 7` in the workspace
- Displays in confirmation bar: "Done—I wrote x + 3 = 7. Is that what you wanted?"

### Step 5: Student Confirms or Corrects

**If correct:** Student says "Yes" or clicks Yes button
- AI waits silently for next instruction

**If incorrect:** Student says "No" or "Wait, I meant..." or clicks No
- AI undoes the action
- Asks what they wanted instead

### Step 6: Continue Working

Loop continues:
- Student dictates
- AI writes exactly that
- AI confirms
- Student approves or corrects

### Step 7: Finish and Export

When student is done:
- Student says "I'm done" or "That's my answer"
- AI boxes the final answer
- Student clicks Export PDF
- PDF downloads with all work and boxed answer

## Core UI Components

### VoiceButton Component (Optional)

```
  [🎤]   ← Next to send button

States:
- Idle: Gray microphone
- Listening: Pulsing blue with animation
- Processing: Spinner
- Error: Red with retry option
```

### ConfirmationBar Component

```
┌─────────────────────────────────────────────────────────────┐
│  💬 "I wrote x + 3 = 7. Is that what you wanted?"           │
│                                                             │
│                              [✓ Yes]    [✗ No / Undo]       │
└─────────────────────────────────────────────────────────────┘
```

### Workspace Component

Clean area for rendered math:
- Equations render via KaTeX
- Graphs render via Desmos/Plotly
- Steps appear in order, top to bottom
- Can scroll if content exceeds viewport

### InputBar Component

```
┌─────────────────────────────────────────────────────────────┐
│  Type your instruction...                    [🎤]  [Send]   │
└─────────────────────────────────────────────────────────────┘
```

## Voice Input Requirements (Optional Feature)

### Browser Support

Web Speech API is supported in:
- Chrome (desktop & Android)
- Safari (desktop & iOS)
- Edge

Text input always available as primary method.

### Voice UX Requirements

1. **Clear affordance** - Voice button visible next to send button
2. **Visual feedback** - Show when listening (animation)
3. **Interim results** - Show transcription as student speaks
4. **Easy correction** - Student can re-speak if misheard
5. **Not required** - Text input is always the fallback

### Voice Commands to Support

| Student Says | Expected Action |
|--------------|-----------------|
| "Write [equation]" | Render equation |
| "Plot a point at [coords]" | Add point to graph |
| "Draw a line through [points]" | Add line to graph |
| "Subtract 3 from both sides" | Show algebraic step |
| "Yes" / "Yeah" / "That's right" | Confirm and wait |
| "No" / "Wait" / "Undo" | Undo last action |
| "I'm done" / "That's my answer" | Mark final answer |

## Confirmation Flow Requirements

### After Every AI Action

The AI MUST ask for confirmation. This is non-negotiable because:
1. Voice recognition may mishear
2. AI may misinterpret
3. Student needs to catch mistakes before proceeding

### Confirmation UI States

**Awaiting confirmation:**
- Confirmation bar is prominent
- Yes/No buttons are clearly visible
- Input is disabled until confirmed

**After "Yes":**
- Confirmation bar shows "Got it. What's next?"
- Input becomes active

**After "No":**
- Last action is undone
- AI asks "What should I write instead?"

## Graph Requirements

### Coordinate Plane

Default settings:
- x-axis: -10 to 10
- y-axis: -10 to 10
- Grid lines visible
- Axis labels visible

### Supported Graph Actions

| Action | What Student Says |
|--------|-------------------|
| Create graph | "Draw a coordinate plane" |
| Plot point | "Put a point at (3, 2)" |
| Draw line | "Draw a line through those points" |
| Shade region | "Shade below the line" |
| Label point | "Label that point A" |

### Graph Interactivity

- Pan and zoom (for student to examine)
- Hover to see coordinates
- Touch-friendly on mobile

## PDF Export Requirements

### Content

- All equations rendered beautifully
- Graphs included as images
- Final answer boxed/highlighted
- Clean, printable layout

### Trigger

- Button click: "Export PDF"
- Voice command: "I'm done" or "Download my work"

### Output

- Filename: `math-work-[date].pdf`
- One page if possible, multi-page if needed
- Readable when printed

## Accessibility Requirements

### Motor Accessibility

- Large tap targets (minimum 44x44px)
- Text input with optional voice alternative
- No precise gestures required
- Keyboard navigation support

### Visual Accessibility

- High contrast text
- Large, readable fonts
- Clear visual hierarchy
- No color-only indicators

### Cognitive Accessibility

- Simple, predictable interface
- One action at a time
- Clear confirmation before proceeding
- No time pressure

## Performance Requirements

- Voice recognition response: < 500ms
- Equation rendering: < 100ms
- Graph updates: < 200ms
- PDF generation: Show progress for > 2 seconds

## Error Handling

### Voice Recognition Errors

- "I didn't catch that. Could you say it again?"
- Show what was heard, let student correct

### Network Errors

- "Having trouble connecting. Your work is saved."
- Retry automatically

### Rendering Errors

- Show raw text if KaTeX fails
- Log error but don't break UI

## Stretch Goals

- [ ] Offline mode (queue actions when offline)
- [ ] Multiple workspaces
- [ ] Share workspace with teacher (read-only)
- [ ] Dark mode
- [ ] Custom voice wake word
- [ ] Export to LaTeX source
