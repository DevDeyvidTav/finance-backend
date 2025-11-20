# Deploy na Vercel - Backend Finance

Este guia descreve como fazer o deploy do backend na Vercel.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Banco de dados PostgreSQL (recomendado: [Supabase](https://supabase.com) ou [Neon](https://neon.tech))
3. Credenciais do Google OAuth configuradas

## Configuração do Banco de Dados

### Opção 1: Supabase (Recomendado)
1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (modo Pooling)

### Opção 2: Neon
1. Crie uma conta no [Neon](https://neon.tech)
2. Crie um novo projeto
3. Copie a Connection String

## Passos para Deploy

### 1. Prepare o Repositório
```bash
cd backend-finance
git init
git add .
git commit -m "Initial commit"
```

### 2. Suba para o GitHub
```bash
# Crie um repositório no GitHub
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### 3. Configure a Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New" > "Project"
3. Importe o repositório do GitHub
4. Configure as seguintes variáveis de ambiente:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# JWT
JWT_SECRET=seu-secret-muito-seguro-aqui
JWT_EXPIRATION=7d

# Frontend URL
FRONTEND_URL=https://seu-frontend.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu-secret
GOOGLE_CALLBACK_URL=https://seu-backend.vercel.app/auth/google/callback

# Node Environment
NODE_ENV=production
```

### 4. Configure o Build

A Vercel detectará automaticamente as configurações:

- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build` (ou deixe em branco)
- **Output Directory**: Deixe em branco
- **Install Command**: `npm install`
- **Root Directory**: Deixe em branco (ou `backend-finance` se estiver em monorepo)

### 5. Deploy

1. Clique em "Deploy"
2. Aguarde o build finalizar
3. Após o deploy, execute as migrations:

```bash
# Instale a Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Execute as migrations
vercel env pull
npx prisma migrate deploy
```

### 6. Atualize o Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Vá em APIs e Serviços > Credenciais
3. Edite suas credenciais OAuth
4. Adicione a URL de produção em "URIs de redirecionamento autorizados":
   ```
   https://seu-backend.vercel.app/auth/google/callback
   ```

## Comandos Úteis

### Verificar logs
```bash
vercel logs
```

### Executar migrations
```bash
npx prisma migrate deploy
```

### Ver variáveis de ambiente
```bash
vercel env ls
```

### Adicionar variável de ambiente
```bash
vercel env add NOME_DA_VARIAVEL
```

## Estrutura de Arquivos

- `vercel.json`: Configuração da Vercel
- `.vercelignore`: Arquivos ignorados no deploy
- `package.json`: Scripts de build configurados

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
- Certifique-se de que `prisma generate` está sendo executado no build
- Verifique se `prisma` está nas dependências de produção

### Erro: "Database connection failed"
- Verifique se a `DATABASE_URL` está correta
- Certifique-se de que o banco aceita conexões externas
- Adicione `?sslmode=require` na connection string

### Erro: "OAuth redirect_uri_mismatch"
- Verifique se a URL de callback está configurada no Google Cloud Console
- A URL deve corresponder exatamente (incluindo https://)

## Monitoramento

A Vercel fornece:
- Logs em tempo real
- Métricas de performance
- Alertas de erro

Acesse o dashboard da Vercel para monitorar sua aplicação.

## Custos

- Vercel oferece um plano gratuito generoso
- Supabase/Neon têm planos gratuitos com limitações
- Considere upgrades conforme o uso cresce

## Próximos Passos

1. Configure um domínio customizado
2. Configure alertas de monitoramento
3. Adicione CI/CD para deploys automáticos
4. Configure backups do banco de dados

