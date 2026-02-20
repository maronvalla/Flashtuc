
  FROM node:20-slim
  WORKDIR /app

  RUN apt-get update -y && apt-get install -y openssl

  COPY package*.json ./
  COPY prisma ./prisma
  RUN npm ci

  COPY . .
  ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
  RUN npm run build

  ENV PORT=8080
  EXPOSE 8080
  CMD ["npm", "start"]