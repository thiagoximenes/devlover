# ⚠️ ATENÇÃO - Variáveis de Ambiente da Vercel

## 🔴 PROBLEMA IDENTIFICADO

Você tem muitas variáveis configuradas na Vercel (excelente!), mas **FALTAM as variáveis específicas do Vite**.

### O que você tem atualmente:

Baseado na imagem enviada, a Vercel criou automaticamente estas variáveis através da integração com Supabase:

✅ Variáveis do Postgres:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

✅ Variáveis do Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

✅ Variáveis Next.js:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

## ❌ O QUE ESTÁ FALTANDO

**Este é um projeto React + Vite, NÃO Next.js!**

O Vite só expõe variáveis que começam com **`VITE_`** para o código do frontend.

As variáveis `NEXT_PUBLIC_*` **NÃO funcionam** em projetos Vite!

### Variáveis que você PRECISA adicionar:

```
VITE_SUPABASE_URL=https://ffhsmywdpcecspyhvzxp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaHNteXdkcGNlY3NweWh2enhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDEyNzQsImV4cCI6MjA4NTM3NzI3NH0.VMmgbjMa_G1ayA3lq1G4IpTs7LOvJzsczZk9vi3T0lc
```

---

## ✅ COMO CORRIGIR NA VERCEL

### Passo a Passo:

1. **Acesse seu projeto na Vercel**:
   - https://vercel.com/dashboard
   - Clique no projeto **"devlover"**

2. **Vá em Settings**:
   - Clique na aba **"Settings"** no topo
   - No menu lateral, clique em **"Environment Variables"**

3. **Adicione as DUAS variáveis do Vite**:

   **Variável 1**:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://ffhsmywdpcecspyhvzxp.supabase.co`
   - **Environments**: Marque **Production**, **Preview** e **Development**
   - Clique em **"Save"**

   **Variável 2**:
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaHNteXdkcGNlY3NweWh2enhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDEyNzQsImV4cCI6MjA4NTM3NzI3NH0.VMmgbjMa_G1ayA3lq1G4IpTs7LOvJzsczZk9vi3T0lc`
   - **Environments**: Marque **Production**, **Preview** e **Development**
   - Clique em **"Save"**

4. **Fazer Redeploy**:
   - Após adicionar as variáveis, vá em **"Deployments"**
   - Clique nos **3 pontinhos** do último deployment
   - Clique em **"Redeploy"**
   - Aguarde o build terminar

---

## 📝 RESUMO

### Variáveis que você pode IGNORAR (já existem, mas não vamos usar):
- ❌ `NEXT_PUBLIC_*` - São para Next.js, não Vite
- ❌ `POSTGRES_*` - Conexão direta ao banco (não usamos no frontend)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Apenas backend (NUNCA expor no frontend!)
- ❌ `SUPABASE_JWT_SECRET` - Interno do Supabase
- ❌ `SUPABASE_SECRET_KEY` - Interno do Supabase

### Variáveis que são ÚTEIS (mas não usamos diretamente):
- ✅ `SUPABASE_URL` - Mesma que `VITE_SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY` - Mesma que `VITE_SUPABASE_ANON_KEY`

### Variáveis que você PRECISA adicionar (as únicas que importam para Vite):
- 🎯 `VITE_SUPABASE_URL`
- 🎯 `VITE_SUPABASE_ANON_KEY`

---

## 🔍 Por que isso aconteceu?

A Vercel tem uma integração automática com Supabase que cria várias variáveis automaticamente. Isso é ótimo para projetos Next.js, mas para Vite precisamos do prefixo `VITE_`.

A integração não sabe que você está usando Vite, então criou as variáveis com os prefixos padrão (`NEXT_PUBLIC_*` e `SUPABASE_*`).

---

## ✅ DEPOIS DE ADICIONAR AS VARIÁVEIS

Quando fizer o redeploy, o site deve funcionar perfeitamente! 

Você saberá que funcionou se:
- ✅ A landing page carrega
- ✅ Consegue fazer cadastro
- ✅ Consegue fazer login
- ✅ Dashboard carrega os dados

Se der erro de conexão ao Supabase, é porque as variáveis `VITE_*` não foram configuradas corretamente.

---

## 📸 Como deve ficar na Vercel

Após adicionar as 2 variáveis, você deve ver na lista:

```
✅ VITE_SUPABASE_URL (Production, Preview, Development)
✅ VITE_SUPABASE_ANON_KEY (Production, Preview, Development)

(Plus todas as outras que já existem)
```

---

**Última atualização**: 30/01/2026  
**Status**: Aguardando adição das variáveis VITE_* na Vercel

**Após adicionar, faça redeploy e teste o site! 🚀**
