# App Requirements

## UI Description

### Style Inspiration

- Claude.ai (conversational interface)
- Overleaf (LaTeX rendering quality)
- ChatGPT (clean chat UI)
- Notion (minimal, focused design)

### Layout

#### Chat Panel (Main Area)

Conversational interface where user messages and AI responses are displayed. Math content rendered with LaTeX inline.

#### Input Area (Bottom)

Text input field for user messages with send button. Could include quick-action buttons for common math requests.

#### Sidebar (Optional)

- Conversation history
- New conversation button
- User settings/logout

#### Header

Clean header with:
- App branding (Math Scribe logo/name)
- User avatar/login status
- Settings menu

#### PDF Export Button

Prominent button to export current conversation or selected response to PDF.

### Device Responsiveness

- Desktop: Full sidebar + chat view
- Tablet: Collapsible sidebar
- Mobile: Chat-focused, hamburger menu for sidebar

### Theme

Clean, professional, math-friendly:
- Light mode (default)
- Dark mode (stretch goal)
- High contrast for math readability

## User Flow

### Step 1: Landing

User arrives at homepage. If not logged in, sees login prompt or limited demo.

### Step 2: Authentication

User signs in with Google. Redirected to main chat interface.

### Step 3: New Conversation

User sees empty chat or welcome message explaining Math Scribe's capabilities.

### Step 4: Ask a Math Question

User types a math question or request (e.g., "Explain the quadratic formula" or "Help me solve x^2 + 5x + 6 = 0").

### Step 5: AI Response with LaTeX

Math Scribe responds with explanation including rendered LaTeX formulas. User sees beautifully formatted math.

### Step 6: Continue Conversation

User can ask follow-up questions. Context is maintained throughout the conversation.

### Step 7: Export to PDF

User clicks "Export PDF" button. Current conversation (or selected portion) is rendered to a downloadable PDF.

### Step 8: New Conversation or History

User can start a new conversation or access previous conversations from sidebar.

## Core UI Components

### ChatMessage Component

```
┌─────────────────────────────────────────┐
│ [Avatar] User                     12:34 │
│ Can you explain the derivative of sin?  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ [Avatar] Math Scribe              12:35 │
│ The derivative of sin(x) is cos(x).     │
│                                         │
│ Using the limit definition:             │
│                                         │
│    d                 sin(x+h) - sin(x)  │
│   ── sin(x) = lim   ─────────────────   │
│   dx          h→0          h            │
│                                         │
│ [📄 Export this response]               │
└─────────────────────────────────────────┘
```

### Input Component

```
┌─────────────────────────────────────────┐
│ Ask a math question...            [Send]│
└─────────────────────────────────────────┘
```

### PDF Export Modal (Optional)

```
┌─────────────────────────────────────────┐
│ Export to PDF                           │
│                                         │
│ ○ Current response only                 │
│ ● Entire conversation                   │
│                                         │
│ Filename: [math-scribe-export____]      │
│                                         │
│              [Cancel]  [Download PDF]   │
└─────────────────────────────────────────┘
```

## LaTeX Rendering Requirements

### Inline Math

- Delimiters: `$...$`
- Renders inline with text
- Example: "The value of $\pi$ is approximately 3.14159"

### Block Math

- Delimiters: `$$...$$`
- Renders centered on its own line
- Example: Equations, formulas, multi-line derivations

### Supported Notation

Must support common math notation:
- Fractions: `\frac{a}{b}`
- Exponents/subscripts: `x^2`, `x_n`
- Greek letters: `\alpha`, `\beta`, `\pi`
- Integrals: `\int_a^b f(x) dx`
- Summations: `\sum_{i=1}^n`
- Matrices: `\begin{matrix}...\end{matrix}`
- Square roots: `\sqrt{x}`
- Limits: `\lim_{x \to 0}`

### Error Handling

- Malformed LaTeX should display gracefully (show source or error indicator)
- Should not break the entire message rendering

## PDF Export Requirements

### Content

- Include all rendered LaTeX (as images or vector)
- Preserve conversation structure
- Include timestamps (optional)
- Add header with "Math Scribe" branding

### Quality

- High resolution for math formulas
- Readable when printed
- Reasonable file size

### Naming

- Default: `math-scribe-[date]-[time].pdf`
- User customizable

## Stretch Goals

### 1. Math Input Palette

Visual buttons for common math symbols that insert LaTeX into the input field.

### 2. Multiple Conversations

Sidebar showing conversation history with titles.

### 3. Share Functionality

Generate shareable link to a conversation (read-only).

### 4. Template Library

Pre-built prompts for common math topics:
- "Explain [concept]"
- "Solve step by step: [equation]"
- "Create practice problems for [topic]"

### 5. Dark Mode

Full dark theme with proper contrast for math rendering.

### 6. Export Formats

Additional export options:
- LaTeX source (.tex)
- Markdown with LaTeX
- PNG image of specific formula

### 7. Collaborative Mode

Teacher can view/assist student's conversation in real-time.

### 8. Voice Input

Speak math problems (with speech-to-text).

## Accessibility

- Keyboard navigation support
- Screen reader compatibility for non-math text
- Alt text for rendered math (where possible)
- Sufficient color contrast

## Performance

- LaTeX rendering should be fast (< 100ms per formula)
- Conversation should load quickly from Firestore
- PDF generation should show progress indicator for long conversations
