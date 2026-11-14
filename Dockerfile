FROM node:24-trixie-slim AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      ca-certificates \
      libstdc++6 \
    && rm -rf /var/lib/apt/lists/*


FROM base AS deps

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      python3 \
      make \
      g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci


FROM deps AS builder

COPY . .

RUN mkdir -p public

RUN DATABASE_URL="postgresql://granfort:build-only@localhost:5432/granfort?schema=public" \
    npx prisma generate

RUN DATABASE_URL="postgresql://granfort:build-only@localhost:5432/granfort?schema=public" \
    npm run build


FROM deps AS migrator

COPY . .

RUN DATABASE_URL="postgresql://granfort:build-only@localhost:5432/granfort?schema=public" \
    npx prisma generate

CMD ["npx", "prisma", "migrate", "deploy"]


FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nextjs \
    && useradd --system --uid 1001 --gid nextjs nextjs \
    && mkdir -p /var/lib/granfort/uploads \
    && chown -R nextjs:nextjs /var/lib/granfort/uploads

COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
