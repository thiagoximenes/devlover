# 🤝 Guia de Contribuição - DevManager Pro

Obrigado por considerar contribuir com o DevManager Pro! Este documento fornece diretrizes para contribuições ao projeto.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)
- [Estrutura de Commits](#estrutura-de-commits)

---

## 📜 Código de Conduta

Este projeto e todos os participantes estão regidos por um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

**Esperamos que você:**
- Use linguagem acolhedora e inclusiva
- Seja respeitoso com diferentes pontos de vista
- Aceite críticas construtivas graciosamente
- Foque no que é melhor para a comunidade

---

## 🎯 Como Posso Contribuir?

### Reportar Bugs

Antes de criar um bug report, verifique se o problema já não foi reportado. Se não encontrar nada similar:

1. Use o template de issue "Bug Report"
2. Descreva o problema de forma clara e concisa
3. Forneça passos para reproduzir o bug
4. Inclua screenshots se aplicável
5. Especifique seu ambiente (SO, navegador, versão Node)

### Sugerir Melhorias

Para sugerir melhorias ou novas funcionalidades:

1. Use o template de issue "Feature Request"
2. Explique o problema que a feature resolve
3. Descreva a solução proposta
4. Considere alternativas
5. Adicione mockups/diagramas se relevante

### Contribuir com Código

1. **Fork** o repositório
2. Crie uma **branch** a partir de `main`:
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-fix
   ```
3. Faça suas alterações seguindo os [padrões de código](#padrões-de-código)
4. **Teste** suas alterações
5. **Commit** seguindo a [estrutura de commits](#estrutura-de-commits)
6. **Push** para sua branch
7. Abra um **Pull Request**

---

## 💻 Padrões de Código

### TypeScript

- Use TypeScript em **todos** os novos arquivos
- Evite o uso de `any` - prefira tipos específicos ou `unknown`
- Defina interfaces para objetos complexos
- Use enums para valores constantes relacionados

```typescript
// ✅ Bom
interface Client {
  id: string;
  name: string;
  email: string;
}

// ❌ Evite
const client: any = { ... };
```

### React

- Use **componentes funcionais** com hooks
- Extraia lógica complexa em **custom hooks**
- Componentes devem ter uma única responsabilidade
- Use `React.memo()` apenas quando necessário

```typescript
// ✅ Bom
export function ClientCard({ client }: ClientCardProps) {
  const { isAdmin } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

// ❌ Evite componentes gigantes com múltiplas responsabilidades
```

### Nomenclatura

- **Componentes**: PascalCase (`ClientCard.tsx`)
- **Funções/variáveis**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Arquivos de tipos**: kebab-case com `.types.ts` (`client.types.ts`)
- **Custom hooks**: prefixo `use` (`useAuth`, `useClients`)

### Estrutura de Componentes

```typescript
// 1. Imports externos (React, bibliotecas)
import { useState } from "react";
import { Card } from "@/components/ui/card";

// 2. Imports internos (utils, hooks, types)
import { useAuth } from "@/hooks/useAuth";
import type { Client } from "@/types/client.types";

// 3. Tipos/Interfaces
interface ClientCardProps {
  client: Client;
  onEdit?: (id: string) => void;
}

// 4. Componente
export function ClientCard({ client, onEdit }: ClientCardProps) {
  // 4.1 Hooks
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // 4.2 Handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(client.id);
  };
  
  // 4.3 Render
  return (
    <Card>
      {/* JSX */}
    </Card>
  );
}
```

### Tailwind CSS

- Siga a ordem de classes: layout → spacing → typography → colors → effects
- Use as classes do shadcn/ui quando possível
- Extraia combinações repetidas em componentes

```typescript
// ✅ Bom ordem
<div className="flex items-center gap-4 p-4 text-lg font-semibold text-primary bg-background rounded-lg shadow-md">

// ❌ Evite ordem aleatória
<div className="text-lg shadow-md flex bg-background p-4 rounded-lg items-center font-semibold gap-4 text-primary">
```

### Supabase e Dados

- Use **React Query** para cache de dados
- Sempre trate erros de queries
- Use tipos gerados do Supabase quando possível
- Não exponha credenciais sensíveis no frontend

```typescript
// ✅ Bom
const { data: clients, error, isLoading } = useQuery({
  queryKey: ['clients'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) throw error;
    return data;
  }
});

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

---

## 🔄 Processo de Pull Request

### Checklist antes de abrir o PR

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada (se aplicável)
- [ ] Branch está atualizada com `main`
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Build passa (`npm run build`)
- [ ] Testes passam (`npm run test`)

### Template de Pull Request

```markdown
## Descrição

Breve descrição das mudanças implementadas.

## Tipo de mudança

- [ ] Bug fix (correção que resolve um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## Como testar

1. Passo 1
2. Passo 2
3. Resultado esperado

## Screenshots (se aplicável)

[Adicione screenshots aqui]

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados
- [ ] Documentação atualizada
- [ ] Build passa sem erros
```

### Processo de Review

1. Pelo menos **1 aprovação** é necessária
2. Todos os comentários devem ser **resolvidos** ou **discutidos**
3. **CI/CD deve passar** (build, lint, testes)
4. Após aprovação, o PR pode ser **merged** por um mantenedor

---

## 🐛 Reportando Bugs

### Formato de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots para ilustrar o problema.

**Ambiente**
- OS: [ex: Windows 11]
- Navegador: [ex: Chrome 120]
- Versão Node: [ex: 18.17.0]

**Informações Adicionais**
Qualquer contexto adicional sobre o problema.
```

---

## 💡 Sugerindo Melhorias

### Formato de Feature Request

```markdown
**Problema Relacionado**
Descreva o problema que esta feature resolveria.

**Solução Proposta**
Descrição clara da solução que você gostaria de ver.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Mockups, diagramas, referências, etc.
```

---

## 📝 Estrutura de Commits

Usamos **Conventional Commits** para manter um histórico claro.

### Formato

```
<tipo>(<escopo>): <assunto>

<corpo opcional>

<rodapé opcional>
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças em documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição/correção de testes
- `chore`: Tarefas de manutenção

### Exemplos

```bash
# Nova feature
git commit -m "feat(clients): add export to CSV functionality"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentação
git commit -m "docs(readme): update installation instructions"

# Refatoração
git commit -m "refactor(dashboard): extract metrics into separate component"

# Breaking change
git commit -m "feat(api)!: change client endpoint structure

BREAKING CHANGE: client.site is now client.website_url"
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm run test

# Modo watch
npm run test:watch

# Com coverage
npm run test -- --coverage
```

### Escrever Testes

- Teste **comportamento**, não implementação
- Use **nomes descritivos** para os testes
- Siga o padrão **AAA** (Arrange, Act, Assert)

```typescript
import { render, screen } from '@testing-library/react';
import { ClientCard } from './ClientCard';

describe('ClientCard', () => {
  it('should render client name correctly', () => {
    // Arrange
    const client = { id: '1', name: 'Acme Corp', email: 'hi@acme.com' };
    
    // Act
    render(<ClientCard client={client} />);
    
    // Assert
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});
```

---

## 📞 Dúvidas?

Se tiver alguma dúvida sobre como contribuir:

- Abra uma [Discussion](https://github.com/SEU-USUARIO/devmanager-pro/discussions)
- Entre em contato: seu.email@exemplo.com

---

**Obrigado por contribuir! 🚀**
