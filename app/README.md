# React + Firebase AI Assistant

A modern web application built with ReactJS and TypeScript that provides an AI assistant interface with Firebase authentication and usage limits.

## Features

- **Two-Panel Interface**: Clean input/output layout inspired by RTutor.ai and Julius.ai
- **Usage Limiting**: 2 free requests before login required
- **Multi-language Support**: English and Spanish interface
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a professional look

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Future**: Firebase Auth, Firestore, Google Cloud Functions

## Quick Start

**Navigate to the `app/` directory first:**
   ```bash
   cd app/
   ```

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components (future)
│   ├── layout/        # Header, Footer, Layout
│   ├── ui/           # InputPanel, OutputPanel, etc.
│   └── modals/       # Modal components (future)
├── types/            # TypeScript type definitions
├── utils/            # Helper functions and constants
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Current Functionality

- ✅ Two-panel input/output interface
- ✅ Usage tracking (localStorage)
- ✅ Language switching (EN/ES)
- ✅ Dark/light mode toggle
- ✅ Responsive design
- ✅ Mock AI responses
- ⏳ Firebase authentication (planned)
- ⏳ Backend API integration (planned)
- ⏳ Real AI responses (planned)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your configuration values
3. Restart the development server

## Next Steps

1. **Backend Setup**: Create Google Cloud Functions for API calls
2. **Firebase Integration**: Add authentication and database
3. **AI Integration**: Connect to OpenAI API through backend
4. **Domain Setup**: Configure custom domain with GoDaddy
5. **Deployment**: Deploy to Firebase Hosting

## Design Inspiration

The UI is inspired by modern AI tools like:
- RTutor.ai - Clean two-panel layout
- Julius.ai - Professional styling
- DeepNote - Interactive elements

## GitHub Setup & Version Control

### Initial Setup (Private Repo)

1. **Create GitHub repo** (on GitHub website)
   - Create new private repository named `react-firebase-ai-assistant`
   - Don't initialize with README (we already have one)

2. **Connect local project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - React AI Assistant prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/react-firebase-ai-assistant.git
   git push -u origin main
   ```

### Daily Development Workflow

```bash
# Save your work
git add .
git commit -m "Add feature description"
git push

# Pull latest changes (if working with others)
git pull
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details