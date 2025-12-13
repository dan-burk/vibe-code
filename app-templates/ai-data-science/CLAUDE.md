# AI Data Science App Template

A React + Firebase AI Assistant web application that allows unauthenticated users to make limited API calls, then prompts them to log in using Firebase Auth. The backend is built using serverless Google Cloud Functions, protected by Firebase ID tokens, with data stored in Firebase Firestore.

## Template Documentation

- [App Overview](./app_overview.md) - Complete technical architecture and Q&A
- [App Requirements](./app_requirements.md) - UI/UX specifications and user flow

## Tech Stack

### Frontend
- **Framework:** ReactJS (Vite + TypeScript)
- **Hosting:** Firebase Hosting
- **Styling:** Tailwind CSS

### Authentication
- **Provider:** Firebase Auth
- **Methods:** Google, Email/Password, Anonymous, Microsoft, Facebook

### Backend
- **Platform:** Google Cloud Functions
- **Language:** NodeJS
- **API Integration:** OpenAI API

### Database
- **Type:** Firebase Firestore

### Domain
- **Provider:** GoDaddy (or custom domain provider)
- **Custom Domain:** mycoolapp.com (configurable)

## Key Features

- Clean two-panel interface (input/output)
- Limited unauthenticated access (2 API calls)
- Firebase-powered authentication
- Protected backend API calls via Cloud Functions
- Usage tracking and rate limiting
- Mobile responsive design
- Professional UI inspired by RTutor.ai, Julius.ai, and DeepNote

## Getting Started with This Template

### Prerequisites

- Node.js and npm installed
- VSCode or your preferred code editor
- Git installed (for version control)
- Firebase account (for backend services)
- GCP account (for Cloud Functions)

### Implementation Steps

#### Step 1: Project Setup

Choose one of these options:

**Option A: Fork Base Repo**

1. Fork a React starter template (e.g., Vite + React + TypeScript)
2. Clone your forked repo to your local machine
3. Reference this template documentation for implementation guidance

**Option B: Clone and Customize**

1. Clone a React starter template directly (e.g., Vite + React + TypeScript)
2. Delete the `.git` folder to remove the original repo's version control
3. Reference this template documentation for implementation guidance

#### Step 2: Local Development Setup

Navigate to the app directory and install dependencies:

```bash
cd app
npm install
```

Start the development server:

```bash
npm run dev
```

#### Step 3: Version Control Setup

1. Delete the preexisting `.git` folder (if using Option B)
2. Initialize a new Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
```

3. Create a new repository on GitHub
4. Link your local repo to GitHub:

```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

#### Step 4: Firebase Configuration

Create a `.env` file in the app directory with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Step 5: Backend Setup

1. Set up Google Cloud Functions
2. Configure Firebase ID token validation
3. Integrate OpenAI API
4. Set up Firestore database

#### Step 6: Iteration Process

Once your development server is running:

1. Make changes to your React prototype
2. Test locally with `npm run dev`
3. Update `app/CLAUDE.md` if new files are created
4. Commit changes frequently to GitHub

### Important Tips

- **Keep context updated:** Maintain `app/CLAUDE.md` as the backbone of organization
- **Commit frequently:** Think of this as saving your work
- **Test locally:** Always verify changes work before committing
- **Document changes:** Keep documentation up to date

## Development Workflow

### Making Changes

1. Create a new branch for features:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally

3. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```

4. Push to GitHub:
```bash
git push origin feature/your-feature-name
```

### File Naming Conventions

When working with files, ensure proper naming:
- `main_tsx.tsx` → `main.tsx`
- `globals_css.css` → `globals.css`
- `input_panel_tsx.ts` → `InputPanel.tsx`

## Security

- **API Keys:** Never store secrets in frontend code
- **Backend Protection:** Cloud Functions validate Firebase ID tokens
- **Firestore Rules:** Access controlled by user UID
- **Rate Limiting:** Anonymous (2 calls max), Authenticated (UID-based)

## Stretch Goals

- [ ] History tab for previous inputs/outputs
- [ ] Rate limiting and usage quotas
- [ ] User profiles and preferences in Firestore
- [ ] Share/export output functionality (copy to clipboard, download)
- [ ] UI polish (loading animations, error messages)
- [ ] Dark/light mode toggle
- [ ] Multi-language support

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Google Cloud Functions](https://cloud.google.com/functions/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

## Implementation Status

When implementing this template, update this section to track progress:

- [ ] Frontend setup
- [ ] Firebase authentication
- [ ] Backend Cloud Functions
- [ ] Firestore database
- [ ] OpenAI integration
- [ ] Rate limiting
- [ ] Domain configuration
- [ ] Production deployment
