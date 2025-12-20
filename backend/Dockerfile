# Math Scribe Backend
# Includes Node.js, Claude Code CLI, and TeX Live for PDF generation

FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # TeX Live for PDF generation
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    # Required for Claude Code CLI
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the server
CMD ["node", "dist/index.js"]
