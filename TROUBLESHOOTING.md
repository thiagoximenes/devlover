# 🔧 Troubleshooting e FAQ - DevManager Pro

Este documento contém soluções para problemas comuns e respostas para perguntas frequentes.

---

## 📋 Índice

- [Problemas de Instalação](#problemas-de-instalação)
- [Problemas com Supabase](#problemas-com-supabase)
- [Problemas de Autenticação](#problemas-de-autenticação)
- [Problemas com Deploy](#problemas-com-deploy)
- [Problemas de Performance](#problemas-de-performance)
- [FAQ](#faq)

---

## 🔨 Problemas de Instalação

### Erro: "Cannot find module"

**Sintomas:**
```
Error: Cannot find module '@/components/ui/button'
```

**Soluções:**

1. Verifique se as dependências foram instaladas:
   ```bash
   npm install
   ```

2. Limpe o cache e reinstale:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Verifique se o `tsconfig.json` tem o path alias configurado:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

---

### Erro: "Package not found"

**Sintomas:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/pacote-inexistente
```

**Soluções:**

1. Verifique se o nome do pacote está correto no `package.json`

2. Atualize o npm:
   ```bash
   npm install -g npm@latest
   ```

3. Limpe o cache:
   ```bash
   npm cache clean --force
   ```

---

### Erro: "Node version incompatible"

**Sintomas:**
```
error Requires Node.js 18.x or higher
```

**Soluções:**

1. Verifique sua versão do Node:
   ```bash
   node --version
   ```

2. Instale a versão correta usando [nvm](https://github.com/nvm-sh/nvm):
   ```bash
   nvm install 18
   nvm use 18
   ```

3. Ou baixe diretamente: https://nodejs.org/

---

## 🗄️ Problemas com Supabase

### Erro: "Invalid API key"

**Sintomas:**
```
Error: Invalid API key
```

**Soluções:**

1. Verifique se o arquivo `.env.local` existe na raiz do projeto

2. Confirme que as variáveis estão nomeadas corretamente:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
   ```

3. Pegue as credenciais corretas no Supabase:
   - Acesse: **Settings** → **API**
   - Copie **Project URL** e **anon public key**

4. **IMPORTANTE**: Após alterar `.env.local`, **reinicie o servidor**:
   ```bash
   # Pare o servidor (Ctrl+C) e:
   npm run dev
   ```

---

### Erro: "relation does not exist"

**Sintomas:**
```
Error: relation "public.clients" does not exist
```

**Soluções:**

1. As migrations SQL não foram executadas. No Supabase:
   - Vá em **SQL Editor**
   - Copie o conteúdo de `supabase/migrations/20260129212110_*.sql`
   - Execute no editor

2. Verifique se as tabelas foram criadas:
   - Vá em **Table Editor**
   - Confirme que todas as tabelas estão lá

---

### Erro: "Row Level Security policy violation"

**Sintomas:**
```
Error: new row violates row-level security policy for table "clients"
```

**Soluções:**

1. RLS está ativo mas as policies não foram criadas. Execute novamente a migration completa.

2. Verifique se o usuário está autenticado:
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User:', user); // Deve retornar o usuário, não null
   ```

3. Verifique se as policies existem:
   - No Supabase, vá em **Authentication** → **Policies**
   - Cada tabela deve ter policies definidas

4. Para debugar, você pode **TEMPORARIAMENTE** desabilitar RLS (NUNCA EM PRODUÇÃO):
   ```sql
   ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
   ```

---

### Erro: "User already registered"

**Sintomas:**
```
Error: User already registered
```

**Soluções:**

1. Email já está cadastrado. Opções:
   - Use outro email
   - Faça login com o email existente
   - Ou delete o usuário no Supabase (**Authentication** → **Users**)

---

## 🔐 Problemas de Autenticação

### Usuário criado mas não consegue logar

**Soluções:**

1. Verifique se o email foi confirmado:
   - No Supabase: **Authentication** → **Users** → Coluna **Confirmed At**
   - Se `null`, o email não foi confirmado

2. Confirme manualmente (desenvolvimento):
   - Clique nos **3 pontinhos** ao lado do usuário
   - **Confirm email**

3. Configure email de confirmação (produção):
   - **Settings** → **Authentication** → **SMTP Settings**
   - Configure um provedor de email

---

### Erro: "Refresh token is missing"

**Sintomas:**
```
Error: Refresh token is missing
```

**Soluções:**

1. Token expirou. Faça logout e login novamente.

2. Limpe o localStorage:
   ```javascript
   // No console do navegador:
   localStorage.clear();
   location.reload();
   ```

3. Aumente o tempo de expiração do token (Supabase):
   - **Settings** → **Authentication** → **JWT expiry**

---

### Usuário não tem permissão de admin

**Soluções:**

1. Promova o usuário a admin manualmente:
   - No Supabase: **Table Editor** → **user_roles**
   - Edite o registro do usuário
   - Altere `role` para `admin`

2. Faça logout e login novamente para atualizar o token

---

## 🚀 Problemas com Deploy

### Build falha na Vercel

**Sintomas:**
```
Error: Build failed
```

**Soluções:**

1. Verifique os logs de build:
   - Na Vercel: **Deployments** → Clique no deploy → **Build Logs**

2. Erros comuns:
   - **TypeScript errors**: Corrija os erros de tipo
   - **Missing dependencies**: Adicione ao `package.json`
   - **Environment variables**: Configure na Vercel

3. Teste o build localmente:
   ```bash
   npm run build
   ```

---

### Site carrega mas páginas dão 404

**Sintomas:**
Rota funciona localmente mas não na Vercel.

**Soluções:**

1. Adicione `vercel.json` na raiz do projeto:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. Isso faz o Vercel redirecionar todas as rotas para o `index.html`, permitindo o React Router funcionar.

---

### Variáveis de ambiente não funcionam

**Sintomas:**
```
Error: Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')
```

**Soluções:**

1. Na Vercel, configure as variáveis de ambiente:
   - **Settings** → **Environment Variables**
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **IMPORTANTE**: Após adicionar variáveis, **Redeploy** o projeto:
   - **Deployments** → **...** → **Redeploy**

3. Variáveis devem começar com `VITE_` para serem expostas no Vite

---

## ⚡ Problemas de Performance

### Aplicação lenta / muitas re-renders

**Soluções:**

1. Use React Query para cache:
   ```typescript
   const { data } = useQuery({
     queryKey: ['clients'],
     queryFn: fetchClients,
     staleTime: 5 * 60 * 1000, // 5 minutos
   });
   ```

2. Memoize componentes pesados:
   ```typescript
   export const ClientCard = React.memo(({ client }) => {
     // ...
   });
   ```

3. Use `useMemo` e `useCallback` quando apropriado:
   ```typescript
   const filteredClients = useMemo(() => {
     return clients.filter(c => c.name.includes(search));
   }, [clients, search]);
   ```

---

### Imagens/avatars demorando para carregar

**Soluções:**

1. Otimize imagens antes do upload

2. Use lazy loading:
   ```html
   <img src="..." loading="lazy" />
   ```

3. Configure o Supabase Storage com CDN (plano pago)

---

## ❓ FAQ

### Como adicionar um novo usuário admin?

1. Cadastre o usuário normalmente pelo sistema
2. No Supabase: **Table Editor** → **user_roles**
3. Crie um novo registro:
   - `user_id`: UUID do usuário
   - `role`: `admin`
4. Ou edite o registro existente alterando `role` para `admin`

---

### Como alterar os valores dos planos?

**Opção 1: Pelo painel admin**
1. Faça login como admin
2. Acesse `/admin/plans`
3. Edite os valores e clique em **Salvar**

**Opção 2: Diretamente no banco**
1. No Supabase: **Table Editor** → **plans**
2. Edite os registros diretamente

---

### Como exportar todos os dados?

**Para backups:**
1. No Supabase: **Database** → **Backups** (plano Pro)
2. Ou: **SQL Editor** → Execute:
   ```sql
   -- Exportar clientes
   COPY (SELECT * FROM public.clients) TO STDOUT WITH CSV HEADER;
   ```

**Pelo painel admin:**
- Use o botão **Exportar CSV** na página de pagamentos
- Ou implemente exportação customizada para outras tabelas

---

### Como integrar com Stripe para pagamentos reais?

Esta funcionalidade está no roadmap (v2.0). Atualmente o checkout é simulado.

Para implementar:
1. Crie conta no [Stripe](https://stripe.com/)
2. Instale o SDK: `npm install @stripe/stripe-js`
3. Configure webhook para confirmar pagamentos
4. Atualize a tabela `payments` ao receber confirmação

Documentação: https://stripe.com/docs/payments/accept-a-payment

---

### Como configurar email transacional?

1. No Supabase: **Settings** → **Authentication** → **SMTP Settings**

2. Escolha um provedor:
   - **SendGrid** (recomendado - free tier generoso)
   - **Mailgun**
   - **Amazon SES**

3. Configure credenciais do provedor

4. Personalize templates:
   - **Email Templates** → Edite **Confirm signup**, **Reset password**, etc.

---

### Como migrar dados de outro sistema?

1. Exporte dados do sistema antigo (CSV, JSON)

2. Transforme os dados para o formato do DevManager:
   ```typescript
   // Exemplo: transformar CSV de clientes
   const transformed = csvData.map(row => ({
     name: row.cliente,
     email: row.email,
     website_url: row.site,
     // ...
   }));
   ```

3. Importe via:
   - **Supabase Table Editor** → **Insert** → **Bulk insert**
   - Ou script personalizado usando o cliente Supabase

---

### Como fazer backup dos dados regularmente?

**Opção 1: Plano Pro do Supabase**
- Backups automáticos diários
- Retenção configurável

**Opção 2: Script customizado**
```bash
# Cron job para backup diário
0 2 * * * pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup_$(date +\%Y\%m\%d).sql
```

**Opção 3: Third-party**
- Use serviços como [pgBackups](https://www.pgbackups.com/)

---

### Como adicionar mais campos a uma tabela?

1. Crie uma nova migration SQL:
   ```sql
   -- supabase/migrations/20260201_add_client_fields.sql
   ALTER TABLE public.clients 
   ADD COLUMN phone TEXT,
   ADD COLUMN address TEXT;
   ```

2. No Supabase: **SQL Editor** → Execute a migration

3. Atualize os tipos TypeScript:
   ```typescript
   interface Client {
     // ... campos existentes
     phone?: string;
     address?: string;
   }
   ```

4. Atualize os formulários para incluir os novos campos

---

### Posso usar este projeto comercialmente?

Sim! O projeto está sob licença **MIT**, que permite uso comercial.

Requisitos:
- Mantenha o aviso de copyright e licença
- O software é fornecido "como está", sem garantias

---

### Como obter suporte?

- **Bugs**: Abra uma [issue](https://github.com/SEU-USUARIO/devmanager-pro/issues)
- **Dúvidas**: Use [Discussions](https://github.com/SEU-USUARIO/devmanager-pro/discussions)
- **Comunidade**: Discord do Supabase - https://discord.supabase.com

---

## 🆘 Ainda com problemas?

Se nenhuma solução acima resolveu:

1. Abra uma **issue detalhada** com:
   - Descrição do problema
   - Passos para reproduzir
   - Screenshots/logs
   - Ambiente (SO, Node version, navegador)

2. Verifique **issues fechadas** - talvez já foi resolvido

3. Entre na comunidade do Supabase no Discord

---

**Última atualização**: 30/01/2026
