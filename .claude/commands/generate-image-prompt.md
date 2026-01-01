Generate structured AI image generation prompts from markdown documentation sections. Works with ANY markdown file by auto-detecting sections through heading hierarchy.

## Command Usage:

```bash
/generate-image-prompt @path/to/file.md              # Interactive menu
/generate-image-prompt @path/to/file.md "Section 2"  # Direct section
/generate-image-prompt @path/to/file.md --all        # All sections (batch)
```

## Steps:

### 1. Parse Arguments and Read Source File
- Extract file path from @ mention or first argument
- Verify file exists and is markdown (.md extension)
- Read entire file content
- If file not found or not markdown, show helpful error with examples

### 2. Detect Sections Using Heading Hierarchy
- Scan file for `##` headings (primary sections)
- Scan file for `###` headings (subsections)
- Build section index with structure:
  ```
  {
    title: "Chapter 2: MCP Servers",
    level: 2,  # (## = 2, ### = 3)
    line_start: 166,
    line_end: 396,
    parent: null  # (or parent section index)
  }
  ```
- Example detection:
  ```
  Line 29: "## Chapter 1: Claude Code (CLI)"  → Section 1, lines 29-165
  Line 166: "## Chapter 2: MCP Servers"       → Section 2, lines 166-396
  Line 168: "### Question: Where do I..."     → Subsection 2.1, lines 168-179
  ```

### 3. Show Interactive Menu (if no section specified)
- Display: `"Found {N} sections in {filename}:"`
- List all `##` level sections (numbered 1, 2, 3...)
- Show format: `"{number}. {section_title}"`
- Instructions: "Enter number, name fragment, '1,3,5', '1-3', or 'all'"
- If user specified section in command, skip menu and jump to step 4

### 4. Extract Target Section Content
- From section heading line to (next same-level heading line - 1)
- Include all subsections (### and ####) under parent ##
- If user selects subsection specifically, only extract that subsection
- Typically 50-300 lines per section
- Store: section_title, section_content, line_range

### 5. Analyze Content Type (7 visualization types)
Scan section content for keywords to determine visualization type:

| Type | Detection Keywords | Default Dimensions |
|------|-------------------|-------------------|
| **architecture** | "layer", "component", "server", "system", "container", "architecture" | 1920x1080 |
| **workflow** | "step", "process", "workflow", "then", "next", "flow", "procedure" | 1920x1080 |
| **comparison** | table syntax `\|`, "vs", "versus", "compared to", "difference" | 1920x1200 |
| **timeline** | "level", "stage", "evolution", "progression", "history", "timeline" | 2400x600 |
| **code** | code blocks (```), "function", "class", "implementation", "snippet" | 1920x1200 |
| **metaphor** | "like", "think of", "metaphor", "imagine", "similar to", "analogy" | 1200x1200 |
| **conceptual** | (default if no other keywords match) | 1920x1080 |

Use the **first matching type** from the priority order above.

### 6. Generate Structured Prompt

Use template reference: `documentation/architecture_visualization_prompt_2nd_try.md`

**Base structure** (all prompts):

```markdown
# Image Generation Prompt: {Section Title}

## Overview
{2-3 sentence description of what to visualize based on section content}

{Extract key concepts, main topic, purpose from section}

**Target Audience**: {Infer from technical complexity: "Technical developers", "Business stakeholders", "General audience"}

## Visual Style
- **Style**: {Clean/Technical/Artistic based on content type}
- **Layout**: {Vertical/Horizontal/Circular based on visualization type}
- **Color Scheme**:
  - Primary: {Hex code} - {Purpose}
  - Secondary: {Hex code} - {Purpose}
  - Accent: {Hex code} - {Purpose}
  - Background: {Hex code}
  - Text: {Hex code}
- **Typography**: {Clear, readable sans-serif / Monospace for code / etc.}
- **Icons**: {Style guidance - friendly, technical, minimalist, etc.}

## {Type-Specific Content Section}

{Insert appropriate section based on visualization type - see type templates below}

## Composition Guidelines
- **Whitespace**: {Generous / Balanced / Compact - based on content density}
- **Fonts**: Large enough to read in presentations (min 16pt for body text)
- **Emphasis**: {What to highlight - key concepts, relationships, critical points}
- **Layout Flow**: {Top-to-bottom / Left-to-right / Center-outward}

## Example Short Prompt for AI Generation
{100-200 word condensed version optimized for quick image generation}

Include:
- Core visualization description
- Key elements to show
- Style and color guidance
- Layout recommendation

## Metadata
- **Source**: {file_path}
- **Section**: {section_title}
- **Visualization Type**: {detected_type}
- **Suggested Dimensions**: {dimensions based on type}
- **Generated**: {current_date YYYY-MM-DD}
- **Content Lines**: {line_start}-{line_end}
```

**Type-specific middle sections:**

#### Architecture Type:
```markdown
## System Architecture

### Layers / Components
{List major components with descriptions}

1. **{Component Name}**
   - Purpose: {What it does}
   - Visual: {Icon / Shape / Color}
   - Position: {Where in diagram}

### Connections
- {Component A} → {Component B}: {Relationship description}
- Flow arrows with labels
- Interaction types (API calls, data flow, etc.)

### Callouts
{2-3 callout boxes explaining key concepts or clarifications}
```

#### Workflow Type:
```markdown
## Process Workflow

### Steps
{Extract sequential steps from content}

1. **Step Name**: {Description}
   - Input: {What's needed}
   - Action: {What happens}
   - Output: {Result}

### Decision Points
- {Decision description}: Yes → {Path A}, No → {Path B}

### Flow Visualization
- Use clear directional arrows
- Color-code different paths
- Show loops or branches explicitly
```

#### Comparison Type:
```markdown
## Comparison Elements

### Dimensions Being Compared
{Extract comparison categories from table or content}

### Side-by-Side Elements
| Aspect | Option A | Option B |
|--------|----------|----------|
| {Dimension 1} | {Value/Description} | {Value/Description} |

### Visual Encoding
- Use split-screen or column layout
- Color-code differences (green = advantage, red = disadvantage)
- Highlight key differentiators
```

#### Timeline Type:
```markdown
## Timeline Stages

### Progression
{Extract stages/levels/phases from content}

1. **Stage Name** ({Time/Level})
   - Key characteristics
   - Visual representation
   - Transition to next stage

### Overall Flow
- Left-to-right or top-to-bottom progression
- Show evolution/growth visually
- Mark key milestones
```

#### Code Type:
```markdown
## Code Visualization

### Code Structure
{Show code with annotations}

```language
{Actual code snippet from section}
```

### Annotations
- Highlight key lines with callout boxes
- Explain important concepts
- Show data flow or logic path

### Visual Elements
- Syntax highlighting
- Line numbers or section markers
- Arrows pointing to explained sections
```

#### Metaphor Type:
```markdown
## Metaphor Illustration

### Central Metaphor
{Extract metaphor from content}

### Visual Mapping
- {Real concept} = {Metaphor element}
- Show parallel structure
- Make connections obvious

### Relatable Elements
{Describe how to visualize the metaphor clearly}
```

#### Conceptual Type (Default):
```markdown
## Conceptual Diagram

### Key Concepts
{Extract main ideas from section}

1. **{Concept Name}**
   - Definition/Description
   - Visual representation (shape, icon, etc.)
   - Relationships to other concepts

### Relationships
- {Concept A} ↔ {Concept B}: {Connection description}
- Show hierarchy, dependencies, or interactions

### Abstract Representations
{Guidance on visualizing non-physical concepts}
```

### 7. Launch Validation Agent

Invoke the `image-prompt-validator` agent with:
- The generated prompt (full text)
- Section title and source file
- Detected visualization type

Agent will check:
1. Completeness (all required sections present?)
2. Clarity (concrete vs vague descriptions?)
3. Visual Consistency (coherent colors/typography?)
4. Target Audience alignment
5. Actionability (can AI execute this?)

Wait for agent response before proceeding.

### 8. Create Output Directory Structure

**Directory organization**:
- Extract base filename from source path (e.g., `qa.md` → `qa`)
- Create subdirectory: `documentation/image-prompts/{base_filename}/`
- If directory doesn't exist, create it

**Filename generation**:
- Sanitize section title:
  - Convert to lowercase
  - Replace spaces with hyphens
  - Remove special characters (keep only a-z, 0-9, hyphens)
  - Truncate to 50 chars if needed
- Format: `{sanitized_section_title}_{YYYY-MM-DD}.md`
- Examples:
  - `"Chapter 2: MCP Servers"` → `chapter2-mcp-servers_2025-12-23.md`
  - `"Section III.A"` → `section-iii-a_2025-12-23.md`

**File existence check**:
- If file exists with same date, prompt user:
  - "File already exists. Regenerate? (y/n)"
  - Or suggest: "Use a different section or try again tomorrow"

### 9. Write Output File

Write the complete structured prompt to:
`documentation/image-prompts/{base_filename}/{sanitized_section_title}_{YYYY-MM-DD}.md`

### 10. Display Console Summary

**For single section**:
```
Image Prompt Generated Successfully! 🎨

Source: {file_path}
Section: {section_title}
Visualization Type: {type}
Output File: {relative_path_to_output_file}

Validation Result: {APPROVED / MINOR REVISIONS / MAJOR REVISIONS} {✓ or ⚠}

Quick Stats:
- Prompt length: {line_count} lines
- Suggested dimensions: {dimensions}
- Color palette: {color_count} colors defined
- {Additional relevant stats based on type}

{If validation found issues}:
Validation Notes:
- {Issue 1}
- {Issue 2}

Next Steps:
1. Review full prompt: {output_file_path}
2. Copy "Example Short Prompt" section for quick generation
3. Generate another section: /generate-image-prompt @{file_path}
```

**For batch processing** (--all flag):
```
Batch Image Prompts Generated Successfully! 🎨📦

Source: {file_path}
Sections Processed: {count}
Output Directory: documentation/image-prompts/{base_filename}/

Files Created:
✓ {filename1} ({type1})
✓ {filename2} ({type2})
✓ {filename3} ({type3})
...

Validation Results:
- Approved: {approved_count}
- Minor revisions: {minor_count}
- Major revisions: {major_count}

{If any failures}:
Failed Sections:
✗ {section_name}: {error_reason}

Next Steps:
1. Review all prompts: documentation/image-prompts/{base_filename}/
2. Address revisions for flagged prompts
3. Begin image generation with your preferred tool
```

## Error Handling:

**File not found**:
```
Error: File not found: {file_path}

Please check the path and try again.

Examples:
  /generate-image-prompt @documentation/qa.md
  /generate-image-prompt @Presentation/outline.md
```

**Not a markdown file**:
```
Error: File must be a markdown file (.md extension)

Received: {file_path}
Expected: *.md file
```

**No sections detected**:
```
Error: No ## headings found in {file_path}

This command requires markdown files with ## (h2) headings.

Current file structure: {brief summary}
```

**Section not found**:
```
Error: Section "{section_query}" not found in {file_path}

Available sections:
1. {section1_title}
2. {section2_title}
3. {section3_title}

Try:
- Entering a number (1, 2, 3...)
- Using part of the title: "MCP" instead of full title
- Running without arguments for interactive menu: /generate-image-prompt @{file_path}
```

**Validation agent failure**:
```
Warning: Validation agent encountered an error

The prompt was generated but could not be validated automatically.
Please review the output file manually: {output_file_path}

{Agent error message}
```

## Guidelines:

- **Content Extraction**: Focus on extracting the ESSENCE of the section, not just copying text
- **Visual Thinking**: Think about how concepts translate to visual elements
- **Color Psychology**: Choose colors that reinforce the message (blue = trust, green = growth, orange = energy)
- **Hierarchy**: Most important elements should be largest/most prominent
- **Simplicity**: Don't overcrowd - aim for clarity over comprehensiveness
- **Metaphors**: When content has metaphors, make them central to the visualization
- **Context**: Include enough context that the image stands alone
- **Actionability**: Prompts should be specific enough that an AI can execute them
- **Flexibility**: Generated prompts should work across different AI image generators (DALL-E, Midjourney, etc.)

## Special Features:

**Batch Processing** (--all flag):
- Process ALL ## sections in sequence
- Generate separate prompt file for each
- Show aggregate summary at end
- Continue on errors (don't stop entire batch)

**Multi-Select** (in interactive menu):
- "1,3,5" → Process sections 1, 3, and 5
- "1-4" → Process sections 1 through 4
- "all" → Process all sections (same as --all flag)

**Fuzzy Matching** (section selection):
- User can type partial section title
- Match against all section titles
- If multiple matches, show options
- If single match, proceed automatically

## Template Reference:

The comprehensive example template is available at:
`documentation/architecture_visualization_prompt_2nd_try.md`

Use this as reference for:
- Detailed section structures
- Color scheme examples
- Composition guidance
- Metaphor integration
- Target audience specifications

## Token Management:

- Extract only target section (typically 50-300 lines)
- Don't load entire file into context repeatedly
- Validation agent runs in separate context (15k tokens) → returns ~2k report
- Template generation is incremental
- **Target**: ~20k tokens total in main conversation per section
