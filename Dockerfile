# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
# Copy proxy package
COPY packages/proxy ./packages/proxy

# Install dependencies (frozen lockfile not required for initial build but good practice)
RUN pnpm install

# Build the proxy
WORKDIR /app/packages/proxy
RUN pnpm run build

# Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/proxy/package.json ./packages/proxy/
COPY --from=builder /app/packages/proxy/dist ./packages/proxy/dist

# Install only production dependencies
RUN pnpm install --prod --filter proxy

# Set non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p /app/packages/proxy/logs && \
    chown -R nodejs:nodejs /app/packages/proxy/logs

USER nodejs

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/admin/health || exit 1

WORKDIR /app/packages/proxy
CMD ["node", "dist/index.js"]
