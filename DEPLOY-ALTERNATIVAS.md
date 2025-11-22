# Alternativas de Deploy para Backend NestJS

O NestJS não funciona bem na Vercel devido à natureza serverless. Aqui estão as melhores alternativas:

## ⭐ Opção 1: Railway (Recomendado)

Railway é perfeito para NestJS e oferece deploy gratuito com PostgreSQL incluído.

### Passos:

1. **Acesse**: https://railway.app
2. **Login com GitHub**
3. **New Project** > **Deploy from GitHub repo**
4. **Selecione o repositório**
5. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=sua-connection-string-railway
   JWT_SECRET=seu-secret
   JWT_EXPIRATION=7d
   FRONTEND_URL=https://seu-frontend.vercel.app
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_CALLBACK_URL=https://seu-backend.up.railway.app/auth/google/callback
   PORT=3001
   ```
6. **Deploy automático!**

### Vantagens:
- ✅ Deploy gratuito
- ✅ PostgreSQL incluído gratuitamente
- ✅ Domínio HTTPS automático
- ✅ Logs em tempo real
- ✅ Deploy automático do GitHub
- ✅ Perfeito para NestJS

### Como adicionar PostgreSQL:
1. No projeto, clique em **New** > **Database** > **PostgreSQL**
2. Copie a `DATABASE_URL` gerada
3. Cole nas variáveis de ambiente

---

## ⭐ Opção 2: Render.com

Render oferece plano gratuito e é excelente para Node.js.

### Passos:

1. **Acesse**: https://render.com
2. **New** > **Web Service**
3. **Connect GitHub** e selecione o repositório
4. **Configure**:
   - **Name**: finance-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free

5. **Adicione as variáveis de ambiente** (mesmas da Railway)

6. **Create Web Service**

### Adicionar PostgreSQL:
1. **New** > **PostgreSQL**
2. **Name**: finance-db
3. Copie a **External Database URL**
4. Adicione como `DATABASE_URL` no Web Service

### Vantagens:
- ✅ Plano gratuito
- ✅ PostgreSQL gratuito (90 dias)
- ✅ SSL/HTTPS automático
- ✅ Deploy automático
- ✅ Boa documentação

### Desvantagens:
- ⚠️ Pode "dormir" após inatividade (plano free)
- ⚠️ PostgreSQL gratuito expira em 90 dias

---

## Opção 3: Heroku

Heroku é tradicional mas tem custos.

### Passos:

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create finance-backend`
4. **Add PostgreSQL**: `heroku addons:create heroku-postgresql:mini`
5. **Set env vars**: `heroku config:set JWT_SECRET=...`
6. **Deploy**: `git push heroku main`

### Vantagens:
- ✅ Muito estável
- ✅ PostgreSQL incluído
- ✅ Boa documentação

### Desvantagens:
- ❌ Plano gratuito foi removido
- ❌ Custo mínimo: $7/mês

---

## Opção 4: DigitalOcean App Platform

Para quem quer algo mais robusto.

### Passos:

1. **Acesse**: https://cloud.digitalocean.com
2. **Create** > **App**
3. **Connect GitHub** e selecione o repo
4. **Configure**:
   - **Environment**: Node.js
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm run start:prod`

5. **Add Database** (PostgreSQL)
6. **Configure env vars**
7. **Deploy**

### Vantagens:
- ✅ Muito estável e rápido
- ✅ $5/mês (mais barato que AWS/GCP)
- ✅ PostgreSQL gerenciado
- ✅ Escalável

---

## 🎯 Recomendação Final

**Para desenvolvimento/testes**: Use **Railway** (gratuito e fácil)
**Para produção**: Use **Railway** ou **Render.com**
**Para grande escala**: Use **DigitalOcean** ou **AWS**

---

## Configuração do Backend para Deploy

Independente da plataforma escolhida, garanta que:

1. **package.json** tem o script correto:
```json
{
  "scripts": {
    "build": "prisma generate && nest build",
    "start:prod": "node dist/main.js"
  }
}
```

2. **Procfile** (para Heroku/Railway):
```
web: npm run start:prod
release: npx prisma migrate deploy
```

3. **Variáveis de ambiente** estão configuradas

4. **Google OAuth** está configurado com a URL correta

---

## Após o Deploy

1. Execute as migrations:
```bash
npx prisma migrate deploy
```

2. Teste os endpoints:
```bash
curl https://seu-backend.railway.app
curl https://seu-backend.railway.app/auth/google
```

3. Atualize o frontend com a nova URL do backend

4. Atualize o Google OAuth com a nova callback URL

