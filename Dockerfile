# Build image to run TESTS
# docker build -t chatgpt-web_app:test --target test  .

# Build image to run DEV server
# docker build -t chatgpt-web_app:runner --target runner .

# Run local DEV server
# docker run -d --name chatgpt-app_container -p 3000:3000 \
#  -v "$(pwd)":/app \
#  -v /app/node_modules \
#  -e OPENAI_API_KEY=your_dev_key \
#  -e NODE_ENV=development \
#  localhost/chatgpt-web_app


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
COPY package.json  ./
RUN yarn install
#--frozen-lockfile
RUN ls -al /app

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
COPY entrypoint.sh /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]

# CMD ["node", "server.js"]
