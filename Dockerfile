# Multi-stage Dockerfile for IT-Academy Platform

# 1. Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Production Server
FROM node:22-alpine AS production
WORKDIR /app

# Install backend dependencies
COPY backend/package.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend files
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Create uploads and data directories
RUN mkdir -p /app/uploads /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start server
CMD ["node", "server.js"]
