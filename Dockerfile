FROM node:22.16.0-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .


RUN npm run build

RUN ls -la ./public
RUN ls -la ./.next



FROM node:22.16.0-bullseye AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts


RUN ls -la ./public


ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start"]