# 🚀 DevManager Pro - Guia de Setup e Deploy

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- Node.js 18+ instalado
- Conta no GitHub (para versionamento)
- Conta no Supabase (será criada)
- Conta na Vercel (será criada)

---

## 📦 Parte 1 - Setup Local (Primeiro Passo)

### 1.1 Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso irá instalar todas as dependências listadas no `package.json`.

### 1.2 Verificar se está tudo OK

Após a instalação, teste se o projeto roda localmente:

```bash
npm run dev
```

Deve abrir em `http://localhost:5173`. Neste momento, você verá erros de conexão com Supabase (esperado, pois ainda não configuramos).

---

## 🗄️ Parte 2 - Configuração do Supabase

### 2.1 Criar Conta e Projeto

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado)
4. Clique em **"New Project"**
5. Preencha:
   - **Name**: `devmanager-pro` (ou nome de sua preferência)
   - **Database Password**: Escolha uma senha forte e **SALVE EM LOCAL SEGURO**
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
6. Clique em **"Create new project"**
7. Aguarde alguns minutos para o projeto ser provisionado

### 2.2 Obter Credenciais

Após o projeto ser criado:

1. No painel do Supabase, clique em **Settings** (ícone de engrenagem)
2. Vá em **API**
3. Copie as seguintes informações:
   - **Project URL** (semelhante a `https://xxxxx.supabase.co`)
   - **anon/public key** (chave pública, pode ser exposta no frontend)

### 2.3 Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env.local`:

```bash
# Windows
echo. > .env.local

# Mac/Linux  
touch .env.local
```

2. Abra o arquivo `.env.local` e adicione:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

**⚠️ IMPORTANTE**: Substitua pelas credenciais copiadas no passo anterior.

3. Adicione `.env.local` ao `.gitignore` (para não commitar credenciais):

```bash
# Abra o arquivo .gitignore e adicione se não existir:
.env.local
```

### 2.4 Executar Migrations SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Abra o arquivo `supabase/migrations/20260129212110_48059757-2939-4bc1-825f-cf14da1bb32c.sql`
4. **Copie TODO o conteúdo** desse arquivo
5. **Cole no editor SQL** do Supabase
6. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde a execução (deve levar alguns segundos)
8. Verifique se aparece **"Success. No rows returned"** ou mensagem similar

### 2.5 Verificar Tabelas Criadas

1. No painel do Supabase, vá em **Table Editor**
2. Verifique se as seguintes tabelas foram criadas:
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

3. Clique na tabela `plans` e verifique se os 3 planos padrão foram inseridos:
   - Plano Mensal - R$ 30,00
   - Plano Semestral - R$ 150,00
   - Plano Anual - R$ 250,00

### 2.6 Criar Primeiro Usuário Admin

1. Testar autenticação:
   - Execute `npm run dev`
   - Acesse `http://localhost:5173`
   - Clique em **"Cadastrar"**
   - Preencha com seus dados de teste
   - Complete o cadastro

2. Promover para Admin:
   - Volte ao Supabase
   - Vá em **Table Editor** → **user_roles**
   - Encontre o registro criado para seu usuário
   - Clique em **Edit**
   - Altere `role` de `member` para `admin`
   - Salve

3. Verificar acesso admin:
   - Faça logout e login novamente
   - Na sidebar, deve aparecer o badge **"Admin"**
   - Clique nele para acessar o painel administrativo

---

## ☁️ Parte 3 - Deploy na Vercel

### 3.1 Preparar Repositório GitHub

1. Inicializar Git (se ainda não fez):

```bash
git init
git add .
git commit -m "Initial commit - DevManager Pro"
```

2. Criar repositório no GitHub:
   - Acesse: https://github.com/new
   - Name: `devmanager-pro`
   - Deixe **Private** (recomendado)
   - **NÃO** marque "Initialize with README" (já temos)
   - Clique em **"Create repository"**

3. Conectar repositório local ao GitHub:

```bash
git remote add origin https://github.com/SEU-USUARIO/devmanager-pro.git
git branch -M main
git push -u origin main
```

### 3.2 Fazer Deploy na Vercel

1. Acesse: https://vercel.com
2. Faça login com sua conta do GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório `devmanager-pro`
5. Clique em **"Import"**

6. Configure o projeto:
   - **Framework Preset**: Vite (deve detectar automaticamente)
   - **Root Directory**: `.` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

7. Adicionar variáveis de ambiente:
   - Clique em **"Environment Variables"**
   - Adicione as duas variáveis:
     - Name: `VITE_SUPABASE_URL` → Value: `sua URL do Supabase`
     - Name: `VITE_SUPABASE_ANON_KEY` → Value: `sua chave pública`
   - **⚠️ IMPORTANTE**: Use exatamente as mesmas valores do `.env.local`

8. Clique em **"Deploy"**

9. Aguarde o build (2-5 minutos)

10. Após o deploy, a Vercel fornecerá uma URL: `https://devmanager-pro.vercel.app`

### 3.3 Configurar Domínio Customizado (Opcional)

Se você tem um domínio próprio:

1. No projeto na Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `app.seudominio.com.br`)
3. Configure os registros DNS conforme instruções da Vercel
4. Aguarde propagação (pode levar até 24h)

---

## ✅ Parte 4 - Testes Pós-Deploy

### 4.1 Testar Autenticação

1. Acesse a URL da Vercel
2. Clique em **"Cadastrar"**
3. Crie uma nova conta de teste
4. Verifique se recebe email de confirmação (se configurado)
5. Faça login

### 4.2 Testar Fluxo Completo

1. **Seleção de Plano**: Escolha um plano
2. **Checkout**: Simule pagamento
3. **Dashboard**: Verifique se carrega corretamente
4. **Criar Cliente**: Adicione um cliente de teste
5. **Criar Projeto**: Vincule ao cliente
6. **Criar Tarefa**: Adicione tarefa ao projeto
7. **Notificações**: Verifique se aparecem

### 4.3 Testar Painel Admin

1. No Supabase, promova o usuário de teste para admin
2. Faça logout e login novamente
3. Acesse `/admin`
4. Verifique:
   - Dashboard com métricas
   - Lista de usuários
   - Gerenciamento de planos
   - Histórico de pagamentos

---

## 🔧 Parte 5 - Configurações Adicionais do Supabase

### 5.1 Configurar Email Templates

1. No Supabase, vá em **Authentication** → **Email Templates**
2. Personalize os templates:
   - **Confirm signup**: Email de confirmação de cadastro
   - **Reset password**: Email de recuperação de senha
   - **Magic Link**: Link mágico de login

### 5.2 Configurar Provedores de Email (Opcional)

Por padrão, Supabase usa um servidor SMTP próprio (limitado). Para produção, configure um provedor:

1. Vá em **Settings** → **Authentication** → **SMTP Settings**
2. Escolha um provedor:
   - **SendGrid** (recomendado para iniciantes - free tier generoso)
   - **Mailgun**
   - **Amazon SES**
3. Configure credenciais conforme documentação do provedor

### 5.3 Configurar Storage (para avatares - futuro)

1. Vá em **Storage**
2. Clique em **"Create a new bucket"**
3. Nome: `avatars`
4. Public: ✅ (para imagens de perfil serem acessíveis)
5. Configure políticas de acesso

---

## 📊 Parte 6 - Monitoramento e Manutenção

### 6.1 Monitorar Logs na Vercel

- Acesse: **Project** → **Deployments** → Clique no deploy → **Logs**
- Verifique erros de build ou runtime

### 6.2 Monitorar Uso do Supabase

- Acesse: **Settings** → **Usage**
- Fique de olho em:
  - Database size (limite: 500MB no free tier)
  - Bandwidth (limite: 5GB/mês)
  - Requests (limite: 50.000/mês)

### 6.3 Backups Automáticos (Plano Pago)

No free tier, backups não são automáticos. Considere:
- Upgrade para plano Pro se o app for crítico
- Ou faça backups manuais via SQL Export

---

## 🚨 Troubleshooting Comum

### Erro: "Invalid API key"

**Solução:**
1. Verifique se as variáveis de ambiente estão corretas
2. Na Vercel, vá em **Settings** → **Environment Variables**
3. Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas
4. Após alterar, faça **Redeploy** do projeto

### Erro: "Row Level Security policy violation"

**Solução:**
1. Verifique se as policies foram criadas corretamente
2. No Supabase, vá em **Authentication** → **Policies**
3. Confira cada tabela
4. Se necessário, re-execute a migration

### Erro: "User not found" após cadastro

**Solução:**
1. Verifique se o trigger `handle_new_user` foi criado
2. No SQL Editor, execute:
   ```sql
   SELECT * FROM auth.users;
   SELECT * FROM public.profiles;
   ```
3. Deve haver correspondência 1:1 entre as tabelas

### Site não carrega na Vercel

**Solução:**
1. Verifique se o build foi bem-sucedido
2. Vá em **Deployments** → clique no último deploy → **Build Logs**
3. Procure por erros TypeScript ou de importação
4. Corrija e faça novo commit/push

---

## 📚 Recursos Úteis

### Documentação Oficial

- **Vite**: https://vitejs.dev/
- **React**: https://react.dev/
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Comunidades

- **Supabase Discord**: https://discord.supabase.com
- **React Brasil (Discord)**: https://react.dev.br/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/supabase

---

## 🎯 Checklist de Deploy

Use este checklist para garantir que tudo foi configurado corretamente:

### Fase 1 - Setup Local
- [ ] `npm install` executado com sucesso
- [ ] `.env.local` criado com credenciais
- [ ] Projeto roda localmente em `http://localhost:5173`

### Fase 2 - Supabase
- [ ] Projeto criado no Supabase
- [ ] Migrations SQL executadas sem erros
- [ ] Tabelas criadas e visíveis no Table Editor
- [ ] Planos padrão inseridos na tabela `plans`
- [ ] Primeiro usuário cadastrado
- [ ] Usuário promovido para admin
- [ ] Acesso ao painel admin funcionando

### Fase 3 - GitHub
- [ ] Repositório criado no GitHub
- [ ] Código commitado e pushed
- [ ] `.env.local` no `.gitignore` (NÃO commitar credenciais!)

### Fase 4 - Vercel
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Deploy ativo e acessível

### Fase 5 - Testes
- [ ] Cadastro de novo usuário funciona
- [ ] Login funciona
- [ ] Seleção de plano funciona
- [ ] Dashboard de membros carrega
- [ ] CRUD de clientes funciona
- [ ] CRUD de projetos funciona
- [ ] Painel admin acessível
- [ ] Gráficos renderizam corretamente

---

## 🔐 Segurança - Checklist

Antes de ir para produção, certifique-se:

- [ ] `.env.local` está no `.gitignore`
- [ ] Credenciais não estão commitadas no GitHub
- [ ] Row Level Security (RLS) habilitado em todas as tabelas
- [ ] Policies de acesso configuradas corretamente
- [ ] Senhas dos usuários são hasheadas pelo Supabase Auth
- [ ] HTTPS habilitado (Vercel já faz isso automaticamente)

---

## 📅 Cronograma Sugerido

**Dia 1 - Setup Local e Supabase (1-2 horas)**
- Instalar dependências
- Criar conta e projeto no Supabase
- Executar migrations
- Testar localmente

**Dia 2 - GitHub e Vercel (30 min - 1 hora)**
- Criar repositório
- Fazer primeiro deploy
- Configurar variáveis de ambiente

**Dia 3 - Testes e Ajustes (1-2 horas)**
- Testar todas as funcionalidades
- Corrigir possíveis bugs
- Configurar email templates

---

**Última atualização**: 30/01/2026  
**Próxima revisão**: Após deploy em produção

---

## 🆘 Suporte

Se encontrar dificuldades:

1. Consulte a documentação oficial das ferramentas
2. Verifique o `troubleshooting.md` (se existir)
3. Entre nas comunidades (Discord do Supabase é muito ativo)
4. Abra uma issue no GitHub do projeto (se for bug)

**Boa sorte com o deploy! 🚀**
