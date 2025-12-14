# Math Scribe - Open Issues

## Status
Paused for review. Template files created but need revision based on SKILL.md review.

## What Was Done
- Created math-scribe template files (CLAUDE.md, app_overview.md, app_requirements.md)
- Added Math Scribe to app-templates/CLAUDE.md catalog
- Tech stack decided: React + Firebase + Claude API

## What Needs to Be Fixed

### 1. Messaging/Branding Mismatch

| Current Specs Say | SKILL.md Actually Does |
|-------------------|------------------------|
| "Math tutoring application" | **Faithful scribe** - writes EXACTLY what student dictates |
| "AI helps solve problems" | **AI NEVER helps** - student does all thinking |
| "Ask a math question" | Student dictates: "write x plus 3 equals 7" |
| "Step-by-step problem solving" | Scribe only writes what student says, even if wrong |
| KaTeX in browser | **TikZ/LaTeX compiled to PDF** (more complex) |

**Key point**: This is an **accessibility tool** for an 8th grader with cerebral palsy who cannot write legibly. The AI is their hands, not their brain. It must:
- Write EXACTLY what the student says (even if mathematically wrong)
- NEVER correct, teach, or help
- Ask "Is that what you wanted?" after each action
- Let the student learn from their own mistakes

### 2. UI Flow Needs Simplification

Current specs describe a ChatGPT-style "ask questions" interface. Should be:
- Student dictates → AI writes exactly that → Confirms "Is that what you wanted?"
- No "explain this" or "solve this" prompts
- Much simpler interface - just input and rendered output
- Possibly voice input support (student may have difficulty typing)

### 3. Technical Issue: LaTeX Compilation

**Problem**: SKILL.md uses TikZ/PGFPlots for graphs, which KaTeX cannot render.

**Current spec**: KaTeX in browser (won't work for graphs)

**Options to decide**:
1. **Firebase Function + LaTeX service** (e.g., latex.js, or call Overleaf API)
2. **Self-hosted pdflatex** (more complex infrastructure)
3. **Simplified approach**: KaTeX for equations only, simpler canvas-based graphing for plots

## Open Questions (Need Answers)

1. **LaTeX compilation**: Do you want full TikZ support (requires server-side compilation), or is simpler in-browser graphing acceptable?

2. **Voice input**: Should the UI support voice dictation (since the student may have difficulty typing)?

3. **Confirmation flow**: The AI frequently asks "Is that what you wanted?" - should this be prominent in the UI?

## Files to Update Once Decisions Made

- `app-templates/math-scribe/CLAUDE.md` - Rebrand from "tutoring" to "scribe/accessibility"
- `app-templates/math-scribe/app_overview.md` - Update description, workflow, LaTeX compilation approach
- `app-templates/math-scribe/app_requirements.md` - Simpler UI flow, different user journey

## Reference

The core skill definition is in: `app-templates/math-scribe/SKILL.md`

Key quote from SKILL.md:
> "Act as a faithful scribe for an 8th grade math student who cannot write legibly due to cerebral palsy. Your ONLY job is to translate spoken instructions into written mathematics and visual representations."
