# Build image to run TESTS
# docker build -t chatgpt-web_app:test --target test  .

# Build image to run DEV server
# docker build -t chatgpt-web_app:dev --target development .

# Run local DEV server
# docker run --rm --name chatgpt-app_container -p 3000:3000 \
# -v "$(pwd)":/app \
# -v /app/node_modules \
# -e OPENAI_API_KEY=your_dev_key \
# -e NODE_ENV=development \
# chatgpt-web_app:dev

# docker run  --name chatgpt-app_server_container -p 3000:3000   -e OPENAI_API_KEY=your_dev_key   -e NODE_ENV=development   chatgpt-web_app:dev


# Use a specific tag for reproducibility
FROM node:18-alpine3.15 AS base

# It's a good practice to not run applications with root privileges
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Set working directory
WORKDIR /app

# Set a default value for environment variables
ENV OPENAI_API_KEY=""
ENV CODE=""

# Base stage for shared environment setup
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN yarn install

# Development stage
FROM base AS development
# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Switch to non-root user for security
USER appuser
# Expose the port Next.js dev server runs on
EXPOSE 3000
# Command to start the development server with hot reload
CMD ["yarn", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM deps AS test

WORKDIR /app
COPY . .
# NODE_ENV=test was added here to install both dependencies and devDependencies
RUN NODE_ENV=test yarn install
# --frozen-lockfile
CMD ["yarn", "test:ci"]

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
CMD ["node", "server.js"]
