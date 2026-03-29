# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# We copy everything, but note that the backend is a workspace. We'll run prisma generate in `apps/backend` or root.
# Actually, the guide says we run this in apps/backend. Wait, the guide says:
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# RUN npx prisma generate
# RUN npm run build

COPY . .
RUN npm install -g pnpm
RUN pnpm install

# Generate Prisma
RUN pnpm --filter backend exec prisma generate

# Build
RUN pnpm run build --filter backend

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy from builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/prisma ./prisma
# Prisma needs to run migrations so it needs package.json, we'll just copy things
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package*.json ./

USER nestjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]