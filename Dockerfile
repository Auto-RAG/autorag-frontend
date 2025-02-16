# 의존성 설치 단계
FROM node:22-alpine AS deps
WORKDIR /app

# Corepack 활성화 및 Yarn 3.5.1 설치
RUN corepack enable && corepack prepare yarn@3.5.1 --activate

COPY package.json yarn.lock .yarnrc.yml ./
# COPY .yarn ./.yarn

RUN yarn install

# 빌드 단계
FROM node:22-alpine AS builder
WORKDIR /app

# Corepack 활성화 및 Yarn 3.5.1 설치
RUN corepack enable && corepack prepare yarn@3.5.1 --activate

# 소스 파일 복사
COPY . .
COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /app/.yarn ./.yarn

# Add this line to set the environment variable during build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_HOST_URL
ENV NEXT_PUBLIC_HOST_URL=$NEXT_PUBLIC_HOST_URL

# 빌드 전에 디렉토리 확인
RUN ls -la && \
    # Next.js 빌드 실행
    yarn build 
    # ls -la .next
# 실행 단계
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 필요한 파일들 복사
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarnrc.yml ./
# COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

RUN corepack enable && \
    corepack prepare yarn@3.5.1 --activate && \
    yarn install --immutable

EXPOSE 3000

CMD ["yarn", "start"] 
