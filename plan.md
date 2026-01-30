

# 🚀 DevManager Pro - Sistema de Gestão para Desenvolvedores Web

## Visão Geral
Um sistema multiusuário completo para desenvolvedores web gerenciarem seus clientes, projetos, contratos e hospedagens. Com design vibrante e tecnológico, dashboard intuitiva e fluxo de assinatura integrado.

---

## 📄 Landing Page
Uma página inicial moderna e impactante que apresenta o sistema:
- **Hero Section**: Título chamativo, descrição do sistema e botões de Login/Cadastro
- **Seção de Funcionalidades**: Cards animados mostrando todas as features (gestão de clientes, projetos, contratos, lembretes)
- **Seção de Planos**: Os três planos com preços destacados (Mensal R$30 | Semestral R$150 | Anual R$250)
- **Depoimentos/Benefícios**: Por que escolher o DevManager
- **Footer**: Links úteis e informações de contato
- **Design**: Gradientes modernos, cores vibrantes (roxo/azul), animações suaves

---

## 🔐 Autenticação e Onboarding
1. **Cadastro**: Formulário com nome, email e senha
2. **Login**: Email e senha com opção "esqueci minha senha"
3. **Escolha de Plano**: Após cadastro, tela para selecionar o plano desejado
4. **Pagamento Simulado**: Tela de checkout (preparada para futura integração com Stripe)
5. **Acesso Liberado**: Após "pagamento", acesso à área de membros

---

## 👤 Área de Membros (Dashboard)

### Layout Geral
- **Header**: Logo à esquerda | Avatar + Nome à direita com dropdown (Perfil, Assinatura, Sair)
- **Sidebar Moderna**: Menu lateral com ícones e animações

### Funcionalidades:

#### 📋 Dashboard Principal
- Visão geral dos clientes cadastrados
- Próximos vencimentos (hospedagem/domínio)
- Projetos em andamento
- Alertas e notificações

#### 👥 Gestão de Clientes
- Cadastro completo: Nome, Email, Site, Login/Senha do site, Hospedagem, Vencimento hospedagem, Registro de domínio, Vencimento domínio, Pasta Drive, Links
- Lista com busca e filtros
- Edição e exclusão de clientes

#### 📁 Projetos e Tarefas
- Criar projetos vinculados a clientes
- Adicionar tarefas com status (A fazer, Em andamento, Concluído)
- Visualização em kanban ou lista

#### 📝 Contratos
- Cadastrar contratos por cliente
- Valor, período, status do contrato
- Histórico de contratos

#### 🔔 Lembretes/Notificações
- Alertas automáticos de vencimentos
- Central de notificações
- Configurar antecedência dos alertas

#### ⚙️ Perfil do Usuário
- Editar nome, email, avatar
- Alterar senha
- Ver/gerenciar assinatura atual

---

## 🛠️ Painel Administrativo

### Layout
- Mesmo header e sidebar, mas com opções administrativas

### Funcionalidades:

#### 📊 Dashboard com Métricas
- Total de usuários ativos/inativos
- Assinaturas por plano
- Receita estimada
- Gráficos de crescimento

#### 👥 Gerenciar Usuários
- Lista de todos os usuários
- Ver detalhes, editar, bloquear ou excluir
- Filtrar por plano ou status

#### 💳 Gerenciar Planos
- Editar valores dos planos
- Ativar/desativar planos
- Criar promoções

#### 💰 Ver Pagamentos
- Histórico de todas as transações
- Filtrar por período, status, usuário
- Exportar relatórios

---

## 🎨 Design e Estilo
- **Paleta**: Gradientes roxo/azul, acentos vibrantes
- **Cards**: Com sombras suaves e bordas arredondadas
- **Animações**: Transições suaves, hover effects
- **Tipografia**: Moderna e legível
- **Ícones**: Lucide icons consistentes
- **Dark mode ready**: Estrutura preparada para tema escuro

---

## 🗄️ Estrutura de Dados (Backend)
O sistema utilizará **Lovable Cloud** com Supabase para:
- Autenticação de usuários
- Tabelas: users, profiles, user_roles, subscriptions, clients, projects, tasks, contracts, notifications, plans, payments
- Row Level Security para proteção dos dados
- Edge functions para lógicas de negócio

---

## 📱 Responsividade
- Layout totalmente responsivo
- Sidebar colapsável em mobile
- Experiência otimizada para todos os dispositivos

