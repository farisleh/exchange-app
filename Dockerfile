FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY . .

RUN pnpm install

EXPOSE 3000
CMD ["pnpm", "run", "dev"]
