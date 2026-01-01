# Math Scribe Backend
# Includes Node.js and TeX Live for PDF generation

FROM node:20-slim AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    # TeX Live for PDF generation
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    # curl for health checks
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy skill files for the agent
COPY .claude ./.claude

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
