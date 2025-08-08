# Getting Started Guide

This guide will walk you through setting up your React prototype project from initial Claude Project setup to version control.

## Prerequisites

Before starting, ensure you have:
- Node.js and npm installed
- VSCode or your preferred code editor
- Git installed (for version control)
- Access to Claude Project

## Step 1: Project Setup

### Option A: Fork Base Repo (If you want to maintain a connection to the original repo)

1. **Fork a React starter template** (e.g., Vite + React + TypeScript)
2. **Clone your forked repo** to your local machine
3. **Upload to Claude Project:**
   - Your custom files: `app_overview.json`, `app_requirements.json`, `app_structure.txt`

### Option B: Clone and Customize (If you want to do your own thing)

1. **Clone a React starter template** directly (e.g., Vite + React + TypeScript)
2. **Delete the `.git` folder** to remove the original repo's version control
3. **Upload to Claude Project:**
   - Your custom files: `app_overview.json`, `app_requirements.json`, `app_structure.txt`

### Choose Your Development Path

At this point, you have two choices:

**Path 1: Generate Custom Files with Claude**
Use the prompt below to have Claude generate all NEW files based on your requirements. This will create custom components and functionality.

**Path 2: Use Template as Starting Point**
Skip to Step 2 and use the template's pre-existing files as your foundation, then iterate from there.

### Prompt for Custom File Generation (Path 1 Only)

Use this prompt to build your custom functionality:

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

## Step 3: Version Control Setup (Option B Only)

Follow the instructions in your project's `README.md` file to:
- Create a GitHub repository
- Initialize Git in your project (Make sure you delete the preexisting .git file before re-intitializing!)
- Set up version control for your project

## Step 4: Create Development Claude Project (Both Option A & B)

### Create a New Claude Project

Create a dedicated Claude Project for ongoing development and iteration.

### Upload All Project Files

Add **ALL** files from your app folder to the Claude Project context, including:
- All React component files (`.tsx`, `.ts`)
- All styling files (`.css`, `.scss`)
- Configuration files (`package.json`, `vite.config.ts`, etc.)
- **`app_structure.txt`** ⚠️ **CRITICAL** - This file is the backbone of organization. Shows the LLM how all files interact with each other.


## Step 5: Iterate on React Prototype

Once your development server is running, version control is set up, and your Claude Project is configured, you can begin iterating on your React prototype.

### Iteration Process

1. Prompt Claude to make changes to your React prototype
2. Test locally with `npm run dev`
3. Update `app_structure.txt` if new files are created
4. Upload any new files to Claude Project context
5. Continue iterating with Claude's help

### Important Tip: Context Management

- **Tell Claude to give you FULL CODE files** This helps for copy-paste into VSCode.
- **Use the Changes to double check Claude** This helps to see if Claude is freaking out
- **Keep your Claude Project updated** with the most recent files
- **Commit to GitHub frequently** think of this as saving your work
- **Create new chats frequently** within the same project to avoid weird rabbit holes. Fresh conversations help maintain focus and prevent confusion


