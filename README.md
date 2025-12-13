# Vibe Code Project

A collection of web application templates and implementations for rapid prototyping and development.

## Project Structure

This repository is organized into distinct folders, each serving a specific purpose:

```
vibe-code/
├── app/                           # Current implementation (active development)
│   └── CLAUDE.md                  # Implementation-specific context and structure
├── app-templates/                 # Template catalog for different app types
│   ├── CLAUDE.md                  # Template catalog overview
│   └── ai-data-science/           # AI Data Science app template
│       ├── CLAUDE.md              # Template-specific guide and documentation
│       ├── app_overview.md        # Technical architecture
│       └── app_requirements.md    # UI/UX specifications
├── CLAUDE.md                      # Project-level context (this serves as general guide)
└── README.md                      # Project documentation (you are here)
```

### Folder Descriptions

#### `/app`
Contains the current active implementation of your chosen template. This is where you develop, test, and build your application.

- See `app/CLAUDE.md` for implementation details, file structure, and component relationships

#### `/app-templates`
A library of different application templates, each with complete specifications and documentation.

- See `app-templates/CLAUDE.md` for the template catalog
- Each template subfolder contains its own `CLAUDE.md` with detailed implementation guidance

## Available Templates

### AI Data Science App
A React + Firebase AI Assistant featuring two-panel interface, limited pre-auth access, and secure OpenAI integration.

- **Location:** `app-templates/ai-data-science/`
- **Documentation:** See `app-templates/ai-data-science/CLAUDE.md`

## Quick Start

### Working with the Current Implementation

```bash
cd app
npm install
npm run dev
```

For detailed implementation instructions, see `app/CLAUDE.md`

### Starting a New Project from a Template

1. Choose a template from `app-templates/`
2. Review the template's `CLAUDE.md` for specifications
3. Follow the setup instructions in the template documentation
4. Build your implementation in the `app/` folder

## Development Workflow

### General Workflow

1. **Choose or create a template** in `app-templates/`
2. **Implement in `/app`** following the template specifications
3. **Update documentation** as your implementation evolves
4. **Commit frequently** to track your progress

### File Organization Best Practices

- **Keep `app/CLAUDE.md` updated** with current implementation structure
- **Reference template docs** when making architectural decisions
- **Document deviations** from the template in your implementation notes

## Version Control

This project uses Git for version control. Each folder may evolve independently:

- **app/**: Your implementation (frequent commits)
- **app-templates/**: Template specifications (update as you learn)

## Resources

- Firebase: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- React: [https://react.dev](https://react.dev)
- Vite: [https://vitejs.dev](https://vitejs.dev)

## Contributing

To add a new template:

1. Create a new folder in `app-templates/`
2. Add `CLAUDE.md`, `app_overview.md`, and `app_requirements.md`
3. Update `app-templates/CLAUDE.md` to list the new template
4. Document the template thoroughly for future reference

## License

MIT License - See LICENSE file for details
