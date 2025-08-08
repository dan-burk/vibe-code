# Getting Started Guide

This guide will walk you through setting up your React prototype project from initial Claude Project setup to version control.

## Prerequisites

Before starting, ensure you have:
- Node.js and npm installed
- VSCode or your preferred code editor
- Git installed (for version control)
- Access to Claude Project

## Step 1: Project Setup with Claude

### Upload Required Files

In Claude Project, upload the following files:
- `app_overview.json`
- `app_requirements.json` 
- `app_structure.txt`

### Initial Prompt

Use this prompt to generate your initial codebase:

```
The goal is to make a React Prototype given the following documentation & then slowly build from there. We will figure out the specs as we go. We will focus on front end before even trying build backend. We will focus on frontend app before firebase auth implementation.

Your job is to write me code for distinct files as shown in the app_requirements.txt. 
IF IN DOUBT MAKE THE CODE SIMPLE! WE WANT THE DEMO TO WORK!
```

### Important Notes

- Claude may hit rate limits during code generation - simply click "Continue" when this happens
- The process will generate multiple code files that you'll need to copy and paste into your project folder
- **Critical:** File names generated may not exactly match `app_structure.txt`

### File Name Corrections

When copying files, ensure proper naming conventions:
- `main_tsx.tsx` → `main.tsx`
- `globals_css.css` → `globals.css`  
- `input_panel_tsx.ts` → `InputPanel.tsx`

⚠️ **Important:** If downloading files instead of copy-pasting, verify that file extensions and types are correct.

### Missing Files

If any files are missing from the generated output, request them in a follow-up prompt to Claude.

## Step 2: Local Development Setup

**Example Terminal Commands:**
```bash
PS C:\Users\yourname\Proj_Arthur_Vibe_Code\app> npm install
PS C:\Users\yourname\Proj_Arthur_Vibe_Code\app> npm run dev
```

### Install Dependencies

Navigate to your project directory in VSCode terminal and run:

```bash
npm install
```

### Start Development Server

Once dependencies are installed, start the development server:

```bash
npm run dev
```

## Step 3: Version Control Setup

Follow the instructions in your project's `README.md` file to:
- Create a GitHub repository
- Initialize Git in your project
- Set up version control for your project

## Step 4: Create Development Claude Project

### Create a New Claude Project

Create a dedicated Claude Project for ongoing development and iteration.

### Upload All Project Files

Add **ALL** files from your app folder to the Claude Project context, including:
- All React component files (`.tsx`, `.ts`)
- All styling files (`.css`, `.scss`)
- Configuration files (`package.json`, `vite.config.ts`, etc.)
- **`app_structure.txt`** ⚠️ **CRITICAL** - This file is the backbone of organization

### Why app_structure.txt is Essential

The `app_structure.txt` file is **very very important** because it:
- Shows the LLM how all files interact with each other
- Defines what folders each file lives in
- Maintains project organization consistency
- Serves as the reference point for all future development

### Project Context Setup

Ensure your Claude Project context includes:
- Complete codebase for reference
- File structure documentation
- Easy access for future iterations and debugging

### Important Tip: Context Management

⚠️ **Context management is key** to successful development:
- **Keep your Claude Project updated** with the most recent files
- **Create new chats frequently** within the same project to avoid weird rabbit holes
- Fresh conversations help maintain focus and prevent confusion

## Next Steps

Once your development server is running, version control is set up, and your Claude Project is configured, you can begin iterating on your React prototype.

### Development Guidelines

- **Focus on frontend functionality first**
- **Keep implementations simple for initial demo**
- **Build backend integration later**
- **Add Firebase auth as a final step**

### Critical: Maintain app_structure.txt

⚠️ **IMPORTANT:** When creating new files during development:
1. Add the new files to your Claude Project context
2. **Update `app_structure.txt`** to reflect the new file locations and purposes
3. This maintains the backbone of organization that Claude needs to understand your project

### Iteration Process

1. Make changes to your React prototype
2. Test locally with `npm run dev`
3. Update `app_structure.txt` if new files are created
4. Upload any new files to Claude Project context
5. Continue iterating with Claude's help

## Troubleshooting

- **Rate limits:** Continue clicking "Continue" in Claude Project
- **Missing files:** Ask Claude for any missing components
- **File naming:** Double-check extensions match your project structure
- **Dependencies:** Run `npm install` if you encounter module errors