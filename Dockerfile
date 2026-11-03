FROM node:20-bookworm-slim

# Instalar OpenSSL necessário para o motor do Prisma no Linux
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Variáveis de ambiente de produção e banco SQLite persistente no Easypanel
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/prisma/data/tripflow.db"

# Copiar arquivos de dependências e schema do Prisma
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Garantir que o diretório do volume SQLite exista
RUN mkdir -p /app/prisma/data

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm install

# Copiar restante do código da aplicação
COPY . .

# Gerar o Prisma Client e compilar a aplicação Next.js
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Inicializar o schema SQLite no volume mapeado e iniciar o servidor na porta 3000
CMD ["sh", "-c", "mkdir -p /app/prisma/data && npx prisma db push && npm start"]

