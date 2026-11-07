# CloudOps Switch Multi-Stage Dockerfile
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/switch.yaml ./switch.yaml
COPY --from=build /app/evidence ./evidence

EXPOSE 3000
CMD ["node", "dist/server.js"]
