# Math Scribe - Issues Resolved

## Status
**COMPLETED** - Template files updated to match SKILL.md accessibility scribe intent.

## What Was Done

### Initial Work
- Created math-scribe template files (CLAUDE.md, app_overview.md, app_requirements.md)
- Added Math Scribe to app-templates/CLAUDE.md catalog
- Tech stack decided: React + Firebase + Claude API

### Revisions Completed
All three template files updated to correct the messaging/branding mismatch:

1. **CLAUDE.md** - Rebranded from "tutoring app" to "accessibility scribe"
2. **app_overview.md** - Updated workflow, added voice input, Desmos/Plotly for graphs
3. **app_requirements.md** - Simplified UI, voice-first design, confirmation flow

## Decisions Made

### 1. LaTeX/Graphing Approach
**Decision:** KaTeX (equations) + Desmos/Plotly (graphs) - all in-browser

**Rationale:**
- KaTeX handles all 8th grade math equations perfectly
- Desmos/Plotly provides interactive, accessible graphs
- No server-side LaTeX compilation needed
- Instant rendering, simpler architecture

### 2. Input Method
**Decision:** Text input (primary) with optional voice input (Web Speech API)

**Rationale:**
- Text input is the primary interaction method
- Voice input available as an option for students who prefer or need it
- Web Speech API works in Chrome, Safari, Edge
- Text always available, voice is supplementary

### 3. Confirmation Flow
**Decision:** Yes - AI always asks "Is that what you wanted?"

**Rationale:**
- Voice recognition may mishear
- AI may misinterpret
- Student must catch mistakes before proceeding
- Prominent Yes/No buttons in UI

## Key Clarifications in Updated Specs

| Previous Specs Said | Updated Specs Say |
|---------------------|-------------------|
| "Math tutoring application" | Accessibility scribe - writes EXACTLY what student dictates |
| "AI helps solve problems" | AI NEVER helps - student does all thinking |
| "Ask a math question" | Student dictates: "write x plus 3 equals 7" |
| "Chat-style interface" | Workspace + confirmation bar + text input (voice optional) |
| TikZ/LaTeX compiled to PDF | KaTeX (equations) + Desmos/Plotly (graphs) in browser |

## Files Updated

- [x] `app-templates/math-scribe/CLAUDE.md`
- [x] `app-templates/math-scribe/app_overview.md`
- [x] `app-templates/math-scribe/app_requirements.md`

## Next Steps

Ready to implement in `/app` folder when needed.
