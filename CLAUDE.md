# Vibe Code Project Context

  The full plan is in /home/daniel/.claude/plans/smooth-giggling-kahn.md.

This is a multi-template web application development project organized for efficient prototyping and implementation.

## Project Organization

This repository uses a hierarchical structure where each folder has its own CLAUDE.md context file:

### Root Level (You are here)
General project overview and folder structure guidance.

### `/app` Folder
The active implementation workspace. Contains the current app being developed.
- **Context:** See `app/CLAUDE.md` for detailed file structure, component relationships, and implementation specifics
- **Purpose:** Active development, testing, and building

### `/app-templates` Folder
Template library for different application types.
- **Context:** See `app-templates/CLAUDE.md` for template catalog
- **Purpose:** Reference specifications and architecture patterns

### `/app-templates/[template-name]` Subfolders
Individual template specifications (e.g., `ai-data-science/`)
- **Context:** Each has its own `CLAUDE.md` with template-specific details
- **Purpose:** Complete documentation for implementing that specific template type

## Folder Structure

```
vibe-code/
├── app/                           # Active implementation
│   ├── src/                       # Source code
│   ├── public/                    # Static assets
│   ├── CLAUDE.md                  # Implementation context
│   └── ...                        # Build configs, dependencies
│
├── app-templates/                 # Template library
│   ├── CLAUDE.md                  # Template catalog
│   └── [template-name]/           # Individual templates
│       ├── CLAUDE.md              # Template-specific guide
│       ├── app_overview.md        # Technical specs
│       └── app_requirements.md    # Requirements
│
├── CLAUDE.md                      # This file (project context)
└── README.md                      # Project documentation
```

## Navigation Guide

**When working on the current implementation:**
→ Use `app/CLAUDE.md`

**When exploring template options:**
→ Use `app-templates/CLAUDE.md`

**When implementing a specific template:**
→ Use `app-templates/[template-name]/CLAUDE.md`

**For general project info:**
→ Use this file or `README.md`

## Context Hierarchy

Each CLAUDE.md file knows its scope:

1. **Root CLAUDE.md** (this file): Project structure and navigation
2. **app/CLAUDE.md**: Implementation details and file organization
3. **app-templates/CLAUDE.md**: Template catalog and overview
4. **app-templates/[template]/CLAUDE.md**: Specific template implementation guide

## Quick Reference

- **Current implementation status:** Check `app/CLAUDE.md`
- **Available templates:** Check `app-templates/CLAUDE.md`
- **Template details:** Check `app-templates/[template-name]/CLAUDE.md`
- **Project overview:** Check `README.md`

## Development Pattern

1. Choose a template from `app-templates/`
2. Review template's CLAUDE.md for specifications
3. Implement in `app/` following template guidance
4. Update `app/CLAUDE.md` as implementation evolves
5. Commit changes frequently

## Key Principles

- **Each folder is self-contained** with its own context
- **CLAUDE.md files are hierarchical** - each knows its scope
- **Templates are reference specs** - not rigid requirements
- **The app folder is your workspace** - where implementation happens
