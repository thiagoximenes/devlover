# ✅ CHECKLIST DE DEPLOY - DevManager Pro

**Status do código**: ✅ Commitado localmente (commit 3ea701d)  
**Próximo passo**: Push para GitHub e configuração das plataformas

---

## 🔐 CONTAS QUE VOCÊ PRECISA CRIAR

### 1️⃣ Supabase (Backend + Banco de Dados)
- **URL**: https://supabase.com/
- **Ação**: Clicar em "Start your project" → Login com GitHub
- **Custo**: GRATUITO (Free Tier)
- **Necessário para**: Banco de dados, autenticação, APIs

### 2️⃣ Vercel (Hospedagem/Deploy)
- **URL**: https://vercel.com/
- **Ação**: Clicar em "Sign Up" → Login com GitHub  
- **Custo**: GRATUITO (Hobby Tier)
- **Necessário para**: Hospedar a aplicação online

### 3️⃣ GitHub (Versionamento - JÁ TEM)
- ✅ Você já tem conta e repositório criado
- **Repositório**: https://github.com/thiagoximenesweb/devlover

---

## 📋 PASSO A PASSO DETALHADO

### PASSO 1: Push para GitHub (PRIMEIRO FAZER ISSO)

**Problema atual**: O push falhou por autenticação (erro 403)

**Solução**:

```bash
# No terminal, dentro da pasta do projeto:
cd "c:\Github Projects\devlover"

# Se você usa Personal Access Token (recomendado):
git push origin main
# Digite seu username: thiagoximenesweb
# Digite seu token (NÃO senha - veja abaixo como gerar)
```

**Como gerar Personal Access Token do GitHub**:
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Marque os escopos: `repo` (todos os sub-itens)
4. Clique em "Generate token"
5. **COPIE O TOKEN** (você não verá novamente!)
6. Use esse token como senha no `git push`

**Alternativa (mais fácil)**:
1. Faça push direto pelo GitHub Desktop ou Visual Studio Code
2. Ou configure SSH: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh

---

### PASSO 2: Configurar Supabase

#### 2.1 Criar Projeto

1. Acesse: https://supabase.com/
2. Login com GitHub
3. Clique em "New Project"
4. Preencha:
   - **Name**: `devmanager-pro` (ou outro nome)
   - **Database Password**: Crie uma senha FORTE e **SALVE EM LOCAL SEGURO**
   - **Region**: South America (São Paulo) - mais próximo do Brasil
   - **Pricing Plan**: Free
5. Clique em "Create new project"
6. **⏳ AGUARDE** 2-5 minutos enquanto o projeto é criado

#### 2.2 Copiar Credenciais

Após o projeto ser criado:

1. No painel do Supabase, clique em **Settings** (ícone de engrenagem)
2. Vá em **API**
3. **COPIE E SALVE** estas informações:

```
📝 ANOTE AQUI:

Project URL: https://__________________.supabase.co
anon/public key: eyJhbGci___________________________
```

**⚠️ IMPORTANTE**: Você vai precisar dessas informações para o arquivo `.env.local`

#### 2.3 Executar Migrations SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. No seu computador, abra o arquivo:
   - `c:\Github Projects\devlover\supabase\migrations\20260129212110_48059757-2939-4bc1-825f-cf14da1bb32c.sql`
4. **COPIE TODO O CONTEÚDO** desse arquivo (são 284 linhas)
5. **COLE** no SQL Editor do Supabase
6. Clique em **"Run"** (ou Ctrl+Enter)
7. ✅ Deve aparecer "Success" (pode demorar alguns segundos)

#### 2.4 Verificar Tabelas Criadas

1. Vá em **Table Editor** (menu lateral)
2. Você deve ver 10 tabelas criadas:
   - ✅ profiles
   - ✅ user_roles
   - ✅ plans
   - ✅ subscriptions
   - ✅ payments
   - ✅ clients
   - ✅ projects
   - ✅ tasks
   - ✅ contracts
   - ✅ notifications

3. Clique na tabela **plans** e verifique se os 3 planos foram inseridos:
   - Plano Mensal - R$ 30,00
   - Plano Semestral - R$ 150,00
   - Plano Anual - R$ 250,00

---

### PASSO 3: Configurar Projeto Localmente

#### 3.1 Criar arquivo .env.local

1. No VS Code, crie um arquivo chamado `.env.local` na raiz do projeto
2. Cole este conteúdo (substituindo pelas credenciais do Supabase):

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_AQUI
```

**⚠️ Substitua** pelos valores que você copiou no Passo 2.2

#### 3.2 Instalar Dependências

```bash
# No terminal:
npm install
```

Isso vai instalar todas as bibliotecas necessárias (~5 minutos)

#### 3.3 Testar Localmente

```bash
# Iniciar servidor de desenvolvimento:
npm run dev
```

Deve abrir em: `http://localhost:5173`

#### 3.4 Criar Primeiro Usuário e Promover a Admin

1. No navegador, acesse `http://localhost:5173`
2. Clique em **"Cadastrar"**
3. Preencha seus dados:
   - Nome completo
   - Email (use um email real)
   - Senha (mínimo 6 caracteres)
4. Clique em **"Cadastrar"**

**Promover a Admin**:
1. Volte ao Supabase
2. Vá em **Table Editor** → **user_roles**
3. Você verá um registro com seu `user_id`
4. Clique nos **3 pontinhos** → **Edit**
5. Altere o campo `role` de `member` para `admin`
6. Clique em **Save**

**Testar acesso admin**:
1. Faça logout e login novamente
2. Na sidebar, deve aparecer o badge **"Admin"**
3. Clique nele para acessar o painel administrativo

---

### PASSO 4: Deploy na Vercel

#### 4.1 Conectar Repositório

1. Acesse: https://vercel.com/
2. Login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Você verá seus repositórios do GitHub
5. Procure por **"devlover"**
6. Clique em **"Import"**

#### 4.2 Configurar Projeto

Na tela de configuração:

1. **Framework Preset**: Vite (deve detectar automaticamente)
2. **Root Directory**: `.` (deixe como está)
3. **Build Command**: `npm run build` (já preenchido)
4. **Output Directory**: `dist` (já preenchido)

#### 4.3 Adicionar Variáveis de Ambiente

**⚠️ PASSO CRÍTICO**

1. Clique em **"Environment Variables"**
2. Adicione AS MESMAS variáveis do `.env.local`:

```
Nome: VITE_SUPABASE_URL
Valor: https://SEU_PROJETO.supabase.co

Nome: VITE_SUPABASE_ANON_KEY  
Valor: SUA_CHAVE_PUBLICA_AQUI
```

3. Certifique-se de que estão **EXATAMENTE IGUAIS** ao `.env.local`

#### 4.4 Fazer Deploy

1. Clique em **"Deploy"**
2. ⏳ Aguarde 2-5 minutos (build + deploy)
3. ✅ Quando terminar, você verá uma URL: `https://devlover-xxx.vercel.app`

#### 4.5 Testar em Produção

1. Clique na URL gerada
2. Teste:
   - ✅ Landing page carrega
   - ✅ Cadastro funciona
   - ✅ Login funciona
   - ✅ Dashboard carrega
   - ✅ Painel admin acessível

---

## 📝 RESUMO DAS CREDENCIAIS QUE VOCÊ PRECISA ME ENVIAR

**NÃO precisa me enviar nada agora!** Você vai usar as credenciais diretamente no projeto.

Mas se quiser que eu te ajude a debugar algo, me envie:

```
✅ URL do Supabase: https://________________.supabase.co
✅ Project ID do Supabase: (aparece no dashboard)
✅ URL do deploy na Vercel: https://________________.vercel.app
❌ NÃO me envie a ANON_KEY (é pública, mas melhor não expor)
❌ NÃO me envie a senha do banco de dados
```

---

## 🎯 ORDEM RECOMENDADA

```
1️⃣ Push para GitHub (resolver autenticação primeiro)
   ↓
2️⃣ Criar conta Supabase + Executar migrations
   ↓
3️⃣ Configurar .env.local + npm install
   ↓
4️⃣ Testar localmente (npm run dev)
   ↓
5️⃣ Criar primeiro admin e testar painel
   ↓
6️⃣ Deploy na Vercel
   ↓
7️⃣ Testar em produção
   ✅ DONE!
```

---

## 🆘 PROBLEMAS COMUNS

### Push do Git falha (403 Forbidden)

**Solução**:
- Use Personal Access Token em vez de senha
- Ou configure SSH: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh
- Ou use GitHub Desktop: https://desktop.github.com/

### Migrations SQL dão erro

**Solução**:
- Certifique-se de copiar TODO o arquivo SQL
- Execute em um projeto Supabase NOVO (não pode ter tabelas com mesmo nome)

### Site não carrega na Vercel

**Solução**:
- Verifique se as variáveis de ambiente foram configuradas CORRETAMENTE
- Após adicionar variáveis, faça **Redeploy**: Deployments → ... → Redeploy

### "Invalid API key" ao testar localmente

**Solução**:
- Verifique se o `.env.local` está na raiz do projeto
- Confirme que as variáveis começam com `VITE_`
- Reinicie o servidor: Ctrl+C → `npm run dev`

---

## 📞 ONDE PEDIR AJUDA

- **Documentação completa**: [SETUP.md](file:///c:/Github%20Projects/devlover/SETUP.md)
- **Soluções de problemas**: [TROUBLESHOOTING.md](file:///c:/Github%20Projects/devlover/TROUBLESHOOTING.md)
- **Comunidade Supabase**: https://discord.supabase.com (muito ativa!)

---

**Última atualização**: 30/01/2026  
**Status**: ✅ Código commitado, aguardando push e configuração das plataformas

**Boa sorte! 🚀**
