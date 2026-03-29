# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
# Need to copy other workspace packages if they exist, but we copy all
COPY . .
RUN npm install -g pnpm
RUN pnpm install

# Build frontend
RUN pnpm run build --filter frontend

# Stage 2: Production (nginx)
FROM nginx:alpine AS production
# Copy dist to nginx
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s CMD wget --spider http://localhost || exit 1
CMD ["nginx", "-g", "daemon off;"]