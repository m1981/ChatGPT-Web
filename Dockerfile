# Use a specific tag for reproducibility
FROM node:18-alpine3.15 AS base

# It's a good practice to not run applications with root privileges
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Set a default value for environment variables
ENV OPENAI_API_KEY=""
ENV CODE=""

# Custom set up like changing the npm registry should be avoided in production Dockerfiles
# If needed, this should be handled during development or CI

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
#--frozen-lockfile
RUN ls -al /app

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server
COPY --from=builder /app/yarn.lock ./yarn.lock

# Ensure the app runs as a non-root user
USER appuser
RUN ls -al /app
EXPOSE 3000
COPY entrypoint.sh /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]

# CMD ["node", "server.js"]
