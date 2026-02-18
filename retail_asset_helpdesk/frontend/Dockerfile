FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install

# Development stage
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
RUN npm run build

# Production stage
FROM base AS prod
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]