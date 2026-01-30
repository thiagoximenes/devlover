# ✅ PRÓXIMOS PASSOS - Configuração Local

## Status Atual

✅ **Arquivos de ambiente configurados**:
- `.env.example` - Atualizado com suas credenciais
- `.env.local` - Criado e pronto para uso

⏳ **Pendente**: Instalação de dependências e teste local

---

## 🔧 Passo 4: Configurar Localmente

### 4.1 Instalar Dependências

**Opção 1: Terminal Integrado do VS Code**

1. No VS Code, pressione `` Ctrl + ` `` (ou vá em Terminal → New Terminal)
2. Execute:
   ```bash
   npm install
   ```
3. Aguarde a instalação (2-5 minutos)

**Opção 2: Prompt de Comando/PowerShell**

1. Abra o Prompt de Comando ou PowerShell
2. Navegue até a pasta do projeto:
   ```cmd
   cd "c:\Github Projects\devlover"
   ```
3. Execute:
   ```cmd
   npm install
   ```

**Opção 3: GitHub Desktop ou Git Bash**

Se tiver o Git Bash instalado:
```bash
cd /c/Github\ Projects/devlover
npm install
```

---

### 4.2 Iniciar Servidor de Desenvolvimento

Após a instalação das dependências:

```bash
npm run dev
```

Deve abrir automaticamente em: **http://localhost:5173**

---

### 4.3 Criar Primeiro Usuário

1. No navegador, acesse: `http://localhost:5173`
2. Clique em **"Cadastrar"**
3. Preencha:
   - **Nome completo**: Seu nome
   - **Email**: seu@email.com (use um email válido)
   - **Senha**: Mínimo 6 caracteres
4. Clique em **"Cadastrar"**
5. Escolha um plano (pode ser qualquer um)
6. Complete o checkout simulado

✅ Agora você está logado como usuário comum!

---

### 4.4 Promover Usuário a Admin

**No Supabase**:

1. Acesse: https://supabase.com/dashboard/project/ffhsmywdpcecspyhvzxp
2. Vá em **Table Editor** (menu lateral esquerdo)
3. Clique na tabela **user_roles**
4. Você verá um registro com seu `user_id`
5. Clique nos **3 pontinhos** à direita → **Edit row**
6. No campo `role`, altere de `member` para `admin`
7. Clique em **Save**

**De volta ao navegador**:

1. Faça **logout** (canto superior direito → Sair)
2. Faça **login** novamente com suas credenciais
3. Na sidebar, deve aparecer um badge **"Admin"** (estrela roxa)
4. Clique no badge para acessar o **Painel Administrativo**

---

### 4.5 Testar Funcionalidades

**Área de Membros** (`/dashboard`):
- ✅ Dashboard carrega com cards de resumo
- ✅ Criar um cliente de teste
- ✅ Criar um projeto vinculado ao cliente
- ✅ Criar uma tarefa no projeto
- ✅ Verificar notificações

**Painel Admin** (`/admin`):
- ✅ Dashboard com gráficos renderiza
- ✅ Ver lista de usuários (você deve aparecer)
- ✅ Gerenciamento de planos
- ✅ Histórico de pagamentos

---

## 🚀 Passo 5: Deploy na Vercel

Depois de testar localmente, vá para a Vercel:

### 5.1 Importar Projeto

1. Acesse: https://vercel.com/
2. Login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Procure por **"devlover"**
5. Clique em **"Import"**

### 5.2 Configurar Variáveis de Ambiente

**⚠️ PASSO CRÍTICO**

Na tela de configuração, antes de fazer deploy:

1. Clique em **"Environment Variables"**
2. Adicione AS MESMAS variáveis do `.env.local`:

```
Name: VITE_SUPABASE_URL
Value: https://ffhsmywdpcecspyhvzxp.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaHNteXdkcGNlY3NweWh2enhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDEyNzQsImV4cCI6MjA4NTM3NzI3NH0.VMmgbjMa_G1ayA3lq1G4IpTs7LOvJzsczZk9vi3T0lc
```

### 5.3 Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-5 minutos
3. ✅ Quando terminar, você verá uma URL: `https://devlover-xxx.vercel.app`
4. Teste todas as funcionalidades em produção

---

## 📋 Checklist Final

**Antes do Deploy**:
- [ ] npm install executado com sucesso
- [ ] npm run dev funciona e abre em localhost:5173
- [ ] Conseguiu criar conta no sistema
- [ ] Conseguiu promover usuário a admin
- [ ] Testou criar cliente, projeto, tarefa
- [ ] Painel admin acessível e gráficos renderizam

**Deploy**:
- [ ] Repositório no GitHub está atualizado
- [ ] Importou projeto na Vercel
- [ ] Configurou variáveis de ambiente na Vercel
- [ ] Deploy bem-sucedido
- [ ] Site online e funcionando

---

## 🎯 Resumo das Credenciais para Vercel

Quando for configurar as variáveis de ambiente na Vercel, use:

```env
VITE_SUPABASE_URL=https://ffhsmywdpcecspyhvzxp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmaHNteXdkcGNlY3NweWh2enhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDEyNzQsImV4cCI6MjA4NTM3NzI3NH0.VMmgbjMa_G1ayA3lq1G4IpTs7LOvJzsczZk9vi3T0lc
```

**⚠️ NÃO use** as outras keys (service_role, secrets) - elas são apenas para backend e NUNCA devem ser expostas no frontend!

---

## 🆘 Problemas Comuns

### "npm não é reconhecido"

**Solução**:
1. Verifique se o Node.js está instalado: abra CMD e digite `node --version`
2. Se não estiver instalado, baixe em: https://nodejs.org/
3. Após instalar, **feche e abra novamente** o terminal

### "Erro ao conectar com Supabase"

**Solução**:
1. Verifique se o `.env.local` está na raiz do projeto
2. Confirme que as variáveis estão corretas
3. Reinicie o servidor: Ctrl+C → `npm run dev`

### "Usuário não consegue virar admin"

**Solução**:
1. Certifique-se de editar a tabela `user_roles` (não `profiles`)
2. Altere o campo `role` para exatamente `admin` (sem espaços)
3. Faça logout e login novamente para atualizar a sessão

---

**Última atualização**: 30/01/2026  
**Status**: ✅ Arquivos de ambiente configurados, pronto para npm install

**Qualquer dúvida, me chame! 🚀**
