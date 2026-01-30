# 🔧 Como Instalar Dependências - npm não reconhecido

## 🔴 PROBLEMA

Quando você tenta rodar `npm install`, aparece:
```
'npm' não é reconhecido como um comando interno ou externo
```

Isso significa que o Node.js/npm não está no PATH do PowerShell.

---

## ✅ SOLUÇÕES (4 opções)

### **Opção 1: Terminal Integrado do VS Code** (MAIS FÁCIL)

1. **Abra o VS Code** na pasta do projeto
2. Pressione **`` Ctrl + ` ``** (ou Menu → Terminal → New Terminal)
3. No terminal que abrir, digite:
   ```bash
   npm install
   ```
4. Aguarde 2-5 minutos

✅ O terminal do VS Code geralmente encontra o npm automaticamente!

---

### **Opção 2: Git Bash** (se você tem Git instalado)

1. **Abra o Windows Explorer**
2. Navegue até: `c:\Github Projects\devlover`
3. **Clique com botão direito** dentro da pasta
4. Escolha **"Git Bash Here"**
5. No Git Bash, digite:
   ```bash
   npm install
   ```

---

### **Opção 3: Prompt de Comando (CMD)**

O CMD geralmente tem o npm no PATH, ao contrário do PowerShell.

1. Pressione **Win + R**
2. Digite: `cmd`
3. Pressione Enter
4. Digite:
   ```cmd
   cd "c:\Github Projects\devlover"
   npm install
   ```

---

### **Opção 4: Adicionar npm ao PATH do PowerShell** (solução permanente)

Se quiser usar o PowerShell, você pode adicionar o npm ao PATH:

1. **Encontre onde o npm está instalado**:
   - Geralmente em: `C:\Program Files\nodejs\`
   - Ou em: `C:\Users\SEU_USUARIO\AppData\Roaming\npm\`

2. **Abra PowerShell como Administrador**:
   - Pressione Win + X
   - Escolha "Windows PowerShell (Admin)"

3. **Execute este comando** (ajuste o caminho se necessário):
   ```powershell
   $env:Path += ";C:\Program Files\nodejs"
   ```

4. **Feche e abra novamente** o PowerShell

5. Teste:
   ```powershell
   npm --version
   ```

Se aparecer a versão (ex: `10.2.4`), funcionou!

---

## 🎯 RECOMENDAÇÃO

**Use a Opção 1 (Terminal do VS Code)**

É a forma mais fácil e não precisa configurar nada!

---

## ⚠️ IMPORTANTE - Verificar se Node.js está instalado

Antes de tudo, vamos verificar se o Node.js está instalado:

### No CMD (Win + R → `cmd`):
```cmd
node --version
```

Se aparecer algo como `v18.17.0` ou `v20.x.x`, está instalado! ✅

Se der erro "não reconhecido", você precisa instalar o Node.js:

1. **Baixe aqui**: https://nodejs.org/
2. Escolha a versão **LTS** (recomendada)
3. Instale (next, next, finish)
4. **Feche e abra novamente** o terminal
5. Teste: `node --version`

---

## 📦 Depois de instalar as dependências

Quando o `npm install` terminar (vai demorar 2-5 minutos):

1. Você verá uma pasta **node_modules** criada
2. Pode rodar o servidor:
   ```bash
   npm run dev
   ```
3. Deve abrir em: `http://localhost:5173`

---

## 🆘 AINDA NÃO FUNCIONA?

Se mesmo no CMD ou Git Bash não funcionar, pode ser que o Node.js não esteja instalado.

**Solução**:
1. Baixe o Node.js: https://nodejs.org/
2. Instale a versão **LTS** (versão com suporte de longo prazo)
3. Durante a instalação, marque a opção "Add to PATH"
4. Depois de instalar, **feche TODOS os terminais** abertos
5. Abra um novo terminal e teste: `npm --version`

---

## 🎉 CHECKLIST

- [ ] Node.js instalado (`node --version` funciona)
- [ ] npm reconhecido (`npm --version` funciona)
- [ ] `npm install` executado com sucesso
- [ ] Pasta `node_modules` foi criada
- [ ] `npm run dev` inicia o servidor
- [ ] Site abre em `http://localhost:5173`

---

**Última atualização**: 30/01/2026  
**Status**: Aguardando instalação de dependências

**Quando conseguir rodar, me avisa! 🚀**
