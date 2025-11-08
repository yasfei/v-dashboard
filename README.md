# ⚡ Projeto V - Dashboard e Gestão de Usuários

## 🧭 Descrição

Este projeto foi desenvolvido para demonstrar habilidades em **Next.js**, **Tailwind CSS** e **Prisma ORM**, construindo dashboards e sistemas de gestão de usuários com boas práticas modernas do Next.js, como **Server Components**, **Suspense**, **Loading Skeletons**, **Cache** e **Server Actions**.

O objetivo é criar interfaces funcionais para visualização de clientes e gerenciamento de usuários, de forma responsiva e interativa.

---

## 📊 Funcionalidades

### 🖥️ Dashboard

* Exibição de tabelas listando clientes de um consultor específico.
* Filtros de clientes por consultor.
* Consulta por datas de cadastro.
* Paginação dos resultados para facilitar a navegação.
* Métricas e contadores relacionados aos clientes.
* Exclusão de clientes diretamente da dashboard, com confirmação.

### 👥 Gestão de Usuários

* Criação e atualização de usuários (upsert) via formulários.
* Validação de campos obrigatórios (nome, email, tipo de usuário).
* Relacionamento entre **consultores** e **clientes**.
* Modal deslizante para edição de usuários.
* Multi-select para associar clientes a consultores.
* Confirmação de ações antes de atualizar ou deletar usuários.

---

## 🧩 Tecnologias Utilizadas

* **Next.js 15/16** – Server Components, Suspense, Server Actions.
* **Tailwind CSS** – estilização responsiva e moderna.
* **Prisma ORM** – modelagem e manipulação do banco de dados.
* **Framer Motion** – animações para modais e transições.
* **TypeScript** – tipagem estática e segurança de dados.

---


## ⚙️ Setup

### 1. Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd nome-do-projeto
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` com as variáveis necessárias:

```
DATABASE_URL=<URL_DO_BANCO_DE_DADOS>
NEXT_PUBLIC_API_URL=<URL_DA_API>
```

### 4. Rodar o projeto

```bash
npm run dev
```

O site estará disponível em `http://localhost:3000`.

---

## ☁️ Deploy

* **Front-end:** Vercel (https://v-dashboard-y-git-main-yasmins-projects-78977879.vercel.app?_vercel_share=eb7VLPZ5qhKMvfwcp8lHkyj9f7kXYRmf)
* **Banco de dados:** Supabase

💡 Certifique-se de configurar as variáveis de ambiente antes de publicar.

---

## ✨ Observações

* A Dashboard exibe todos os clientes quando nenhum filtro de consultor é aplicado.
* As animações dos modais foram implementadas com **Framer Motion**, proporcionando experiência fluida. (WIP)
* Todos os formulários possuem validação e confirmação antes de ações críticas (atualização ou exclusão). (WIP)
* Funcionalidades extras:

  * 🔎 Filtro por datas de cadastro de clientes.
  * 🗑️ Exclusão de clientes diretamente da Dashboard.
  * 📄 Paginação de resultados.
  * ✅ Confirmação de formulário antes de qualquer alteração.
  * 🎞️ Animações de abertura e fechamento de modais com Framer Motion

