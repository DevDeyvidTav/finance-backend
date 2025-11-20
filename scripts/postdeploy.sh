#!/bin/bash

# Script para executar após o deploy na Vercel
# Execute localmente com as variáveis de ambiente da produção

echo "🚀 Executando post-deploy..."

# Gera o Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Executa as migrations
echo "🔄 Executando migrations..."
npx prisma migrate deploy

echo "✅ Post-deploy concluído!"

