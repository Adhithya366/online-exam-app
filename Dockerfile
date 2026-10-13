# Stage 1: Build environment wrapper
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Clean, ultra-slim production runtime environment
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

# 🔴 CRITICAL FIX: Pulls BOTH the backend logic and frontend interface files into the production runner
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/index.html ./index.html

# Enforce secure non-root user execution
USER node
EXPOSE 3000
CMD ["npm", "start"]
