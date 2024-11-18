FROM oven/bun:1

WORKDIR /app

# Copy package management files
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5173

# Set host to 0.0.0.0 for docker
ENV HOST=0.0.0.0

# Start command for development with host flag
CMD ["bun", "run", "dev", "--host"]