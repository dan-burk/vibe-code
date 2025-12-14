# App Templates Catalog

This folder contains specifications and documentation for different web application templates. Each template is fully documented and ready to be implemented in the `/app` folder.

## Purpose

This catalog serves as a reference library for:
- Starting new projects with proven architectures
- Exploring different tech stacks and patterns
- Maintaining consistent documentation across projects
- Rapid prototyping with pre-defined specifications

## Template Structure

Each template folder contains:
```
template-name/
├── CLAUDE.md              # Complete implementation guide
├── app_overview.md        # Technical architecture and Q&A
└── app_requirements.md    # UI/UX specifications and user flow
```

## Available Templates

### 1. AI Data Science App (`ai-data-science/`)

**Type:** React + Firebase + OpenAI Integration

**Description:** A two-panel AI assistant application with limited pre-authentication access, Firebase authentication, and secure backend OpenAI API integration via Google Cloud Functions.

**Tech Stack:**
- Frontend: React (Vite + TypeScript), Tailwind CSS
- Auth: Firebase Auth (Google, Email, Anonymous, Microsoft, Facebook)
- Backend: Google Cloud Functions (NodeJS)
- Database: Firestore
- AI: OpenAI API

**Key Features:**
- Two-panel interface (input/output)
- 2 free API calls before login required
- Professional UI inspired by RTutor.ai, Julius.ai, DeepNote
- Rate limiting and usage tracking
- Mobile responsive

**Use Cases:**
- AI-powered data analysis tools
- Interactive chatbots
- AI assistants for specific domains
- Data science prototypes

**Documentation:**
- [Complete Guide](./ai-data-science/CLAUDE.md)
- [Technical Overview](./ai-data-science/app_overview.md)
- [Requirements](./ai-data-science/app_requirements.md)

---

### 2. Math Scribe (`math-scribe/`)

**Type:** React + Firebase + Claude API Integration

**Description:** An AI-powered math tutoring application that helps students and teachers write mathematical content. Features real-time LaTeX rendering and PDF export functionality.

**Tech Stack:**
- Frontend: React (Vite + TypeScript), Tailwind CSS, KaTeX, jsPDF
- Auth: Firebase Auth (Google Sign-in)
- Backend: Firebase Functions (TypeScript)
- Database: Firestore
- AI: Claude API (Anthropic)

**Key Features:**
- Chat-style interface for math tutoring
- Real-time LaTeX rendering with KaTeX
- PDF export of conversations
- Conversation history storage
- System prompt based on skill.md expertise
- Future: User-provided API keys

**Use Cases:**
- Math tutoring for students
- Teacher assistance for creating math content
- Step-by-step problem solving
- LaTeX document generation

**Documentation:**
- [Complete Guide](./math-scribe/CLAUDE.md)
- [Technical Overview](./math-scribe/app_overview.md)
- [Requirements](./math-scribe/app_requirements.md)

---

## Using a Template

### Step 1: Choose Your Template
Browse the templates above and select one that matches your project needs.

### Step 2: Review Documentation
Read the template's `CLAUDE.md` file for complete specifications:
```bash
# Example
cat app-templates/ai-data-science/CLAUDE.md
```

### Step 3: Implement in /app
Follow the template's implementation guide to build your application in the `/app` folder.

### Step 4: Customize
Adapt the template to your specific requirements while maintaining the core architecture.

## Adding New Templates

To create a new template:

1. **Create folder structure:**
```bash
mkdir app-templates/your-template-name
```

2. **Add required files:**
   - `CLAUDE.md` - Complete implementation guide with:
     - Template description
     - Tech stack details
     - Setup instructions
     - Development workflow
     - Resources
   - `app_overview.md` - Technical specifications:
     - Architecture details
     - Component structure
     - API design
     - Security considerations
   - `app_requirements.md` - Requirements specification:
     - UI/UX requirements
     - User flows
     - Feature list
     - Stretch goals

3. **Update this catalog:**
   Add your new template to the "Available Templates" section above.

4. **Document thoroughly:**
   Ensure future you (or others) can implement it without confusion.

## Template Guidelines

Good templates should:
- ✅ Be technology-specific (clear tech stack)
- ✅ Include complete setup instructions
- ✅ Document architecture decisions
- ✅ Provide example use cases
- ✅ List required accounts/services
- ✅ Include security best practices
- ✅ Reference similar apps for inspiration

Avoid:
- ❌ Vague or incomplete specifications
- ❌ Missing setup steps
- ❌ Undocumented dependencies
- ❌ Template-specific code (keep it conceptual)

## Future Template Ideas

Consider creating templates for:
- E-commerce storefront
- Blog/CMS platform
- Dashboard/analytics app
- Social media clone
- Portfolio website
- SaaS starter
- Mobile-first PWA
- Real-time collaboration tool

## Navigation

- **Back to root:** See `/CLAUDE.md` or `/README.md`
- **View implementation:** See `/app/CLAUDE.md`
- **Choose a template:** See sections above
