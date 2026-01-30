# 🚀 DevManager Pro

> Sistema completo de gestão para desenvolvedores web gerenciarem clientes, projetos, contratos e hospedagens.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-yellow?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.93-3ECF8E?logo=supabase)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

**DevManager Pro** é uma plataforma SaaS multiusuário desenvolvida para facilitar o dia a dia de desenvolvedores web freelancers e agências. Com um design moderno e funcionalidades robustas, o sistema oferece controle completo sobre:

- 👥 **Gestão de Clientes**: Cadastro completo com informações de sites, hospedagem, domínios e credenciais
- 📁 **Projetos e Tarefas**: Organize seu trabalho com projetos vinculados a clientes e tarefas com status
- 📝 **Contratos**: Gerencie contratos financeiros, valores e prazos
- 🔔 **Notificações Inteligentes**: Alertas automáticos de vencimentos de hospedagem e domínio
- 💳 **Sistema de Assinaturas**: 3 planos (Mensal, Semestral, Anual) com checkout integrado
- 🛠️ **Painel Administrativo**: Dashboard executivo com métricas, gráficos e gestão de usuários

---

## ✨ Funcionalidades

### Para Usuários (Área de Membros)

- ✅ Autenticação segura com Supabase Auth
- ✅ Dashboard com visão geral de clientes, projetos e vencimentos
- ✅ CRUD completo de clientes com campos específicos (site, hospedagem, domínio)
- ✅ Gestão de projetos com vinculação a clientes
- ✅ Sistema de tarefas com status (A fazer, Em andamento, Concluído)
- ✅ Contratos financeiros com cálculo de duração e status
- ✅ Central de notificações com alertas de vencimento
- ✅ Perfil editável com upload de avatar
- ✅ Gestão de assinatura (upgrade/downgrade de planos)

### Para Administradores (Painel Admin)

- ✅ Dashboard executivo com 4 cards de métricas
- ✅ 4 gráficos interativos com Recharts (crescimento, receita, distribuição, comparação)
- ✅ Gestão completa de usuários (visualizar, editar, bloquear, excluir)
- ✅ Filtros avançados (por nome, email, status, plano)
- ✅ Gerenciamento de planos (editar valores, duração, ativar/desativar)
- ✅ Sistema de promoções (estrutura preparada)
- ✅ Histórico completo de pagamentos
- ✅ Exportação de relatórios em CSV

---

## 🛠️ Tecnologias

### Frontend

- **[React 18.3](https://react.dev/)** - Biblioteca JavaScript para interfaces
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Superset JavaScript tipado
- **[Vite 5.4](https://vitejs.dev/)** - Build tool ultra-rápida
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis e customizáveis
- **[Recharts 2.15](https://recharts.org/)** - Biblioteca de gráficos para React
- **[React Hook Form 7.61](https://react-hook-form.com/)** - Gestão de formulários
- **[Zod 3.25](https://zod.dev/)** - Validação de schemas TypeScript
- **[React Router DOM 6.30](https://reactrouter.com/)** - Navegação SPA
- **[Lucide React](https://lucide.dev/)** - Ícones modernos

### Backend

- **[Supabase 2.93](https://supabase.com/)** - Backend as a Service
  - Authentication (Auth)
  - PostgreSQL Database
  - Row Level Security (RLS)
  - APIs RESTful automáticas
  - Realtime subscriptions

### DevOps e Ferramentas

- **[Vercel](https://vercel.com/)** - Plataforma de deploy
- **[GitHub](https://github.com/)** - Versionamento de código
- **[Vitest 3.2](https://vitest.dev/)** - Framework de testes
- **[ESLint](https://eslint.org/)** - Linter JavaScript/TypeScript

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Baixar](https://nodejs.org/))
- **npm** ou **yarn** (vem com Node.js)
- **Git** ([Baixar](https://git-scm.com/))

Você também precisará de contas (gratuitas) em:

- **Supabase** ([Criar conta](https://supabase.com/))
- **Vercel** ([Criar conta](https://vercel.com/)) - para deploy

---

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/SEU-USUARIO/devmanager-pro.git
cd devmanager-pro
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

> **⚠️ Importante**: Substitua pelos valores reais do seu projeto Supabase (veja [SETUP.md](./SETUP.md) para instruções detalhadas).

4. **Execute o projeto localmente**

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📚 Configuração

### Banco de Dados

O projeto inclui migrations SQL completas em `supabase/migrations/`. Para executá-las:

1. Acesse o [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Copie o conteúdo de `supabase/migrations/20260129212110_48059757-2939-4bc1-825f-cf14da1bb32c.sql`
3. Cole e execute

Isso criará:
- ✅ 10 tabelas principais
- ✅ Enums personalizados
- ✅ Políticas RLS (Row Level Security)
- ✅ Triggers automáticos
- ✅ Funções auxiliares
- ✅ 3 planos padrão pré-cadastrados

### Primeiro Usuário Admin

Para promover um usuário a administrador:

1. Cadastre-se no sistema
2. No Supabase, acesse **Table Editor** → **user_roles**
3. Edite o registro do seu usuário
4. Altere `role` de `member` para `admin`
5. Faça logout e login novamente

---

## 💻 Uso

### Área de Membros

1. **Cadastre-se** e escolha um plano
2. Complete o **checkout** (simulado)
3. Acesse o **Dashboard** e comece a:
   - Cadastrar clientes
   - Criar projetos vinculados
   - Adicionar tarefas
   - Registrar contratos
   - Receber notificações de vencimentos

### Painel Administrativo

1. Faça login com um usuário **admin**
2. Clique no badge **"Admin"** na sidebar
3. Acesse:
   - **Dashboard**: Métricas e gráficos
   - **Usuários**: Gerencie todos os usuários
   - **Planos**: Edite valores e duração
   - **Pagamentos**: Veja histórico completo

---

## 📁 Estrutura do Projeto

```
devmanager-pro/
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── admin/          # Componentes específicos do admin
│   │   ├── dashboard/      # Componentes da área de membros
│   │   ├── layouts/        # Layouts (MemberLayout, AdminLayout)
│   │   └── ui/             # Componentes shadcn/ui
│   ├── contexts/           # React Context (AuthContext)
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Integrações (Supabase)
│   ├── lib/                # Utilitários
│   ├── pages/              # Páginas da aplicação
│   │   ├── admin/          # Páginas do painel admin
│   │   └── dashboard/      # Páginas da área de membros
│   ├── App.tsx             # Configuração de rotas
│   └── main.tsx            # Entry point
├── supabase/
│   └── migrations/         # Migrations SQL
├── plan.md                 # Especificação completa
├── task.md                 # Checklist de tarefas
├── walkthrough.md          # Documentação técnica
├── SETUP.md                # Guia de setup e deploy
└── package.json            # Dependências
```

---

## 🌐 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Acesse [Vercel](https://vercel.com/)
3. Importe o repositório
4. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy automático!

**📖 Guia completo**: Veja [SETUP.md](./SETUP.md) para instruções passo a passo.

---

## 🗺️ Roadmap

### ✅ Concluído (v1.0)

- Landing page e autenticação
- Área de membros completa
- Painel administrativo com métricas
- Sistema de assinaturas
- Banco de dados com RLS

### 🚧 Em Desenvolvimento (v1.1)

- [ ] Visualização Kanban com drag-and-drop
- [ ] Notificações automáticas por email
- [ ] Sistema de promoções funcionando
- [ ] Paginação em todas as tabelas
- [ ] React Query para cache otimizado

### 🔮 Futuro (v2.0)

- [ ] Integração real com Stripe
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard mobile (React Native)
- [ ] Modo offline com sincronização
- [ ] Integração com Google Drive API
- [ ] Sistema de backup automático
- [ ] Auditoria completa de ações
- [ ] Suporte a múltiplos idiomas (i18n)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga os padrões de código existentes
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Seja descritivo nos commits

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 📞 Contato

**Desenvolvedor**: [Seu Nome]  
**Email**: seu.email@exemplo.com  
**LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)  
**GitHub**: [@seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- [shadcn](https://twitter.com/shadcn) pelos componentes incríveis
- Equipe [Supabase](https://supabase.com/) pelo backend poderoso
- Comunidade [React](https://react.dev/) pelo suporte

---

<div align="center">

**Feito com ❤️ e ☕ por desenvolvedores, para desenvolvedores**

[⬆ Voltar ao topo](#-devmanager-pro)

</div>
