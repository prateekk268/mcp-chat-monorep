# 🚀 MCP Chat Monorepo

A full-stack monorepo built with **Turborepo**, featuring:

- **Backend (`apps/mcp-ts`)**
  - OpenAI MCP Server (stdio)
  - Express.js API (`/chat`)
  - Node.js + TypeScript

- **Frontend (`apps/client`)**
  - React 19 + Vite
  - TypeScript
  - Simple chat UI connected to the backend API

- **Workspace**
  - npm workspaces
  - Unified dev workflow with Turborepo

---

## 🧰 Tech Stack

### Frontend
- React 19
- Vite
- TypeScript

### Backend
- Node.js
- Express.js
- TypeScript
- ts-node-dev
- OpenAI MCP Server (stdio)

### Dev Tools
- Turborepo
- npm workspaces

---

# ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/prateekk268/mcp-chat-monorep.git
cd mcp-chat-monorepo

2. Install dependencies
bash
Copy code
npm install

3. Configure environment variables
Copy .env.example:

bash
Copy code
cp apps/mcp-ts/.env.example apps/mcp-ts/.env

bash
Copy code
npm run dev

📁 Project Structure
bash
Copy code
mcp-chat-monorepo/
├─ apps/
│  ├─ backend/       # Backend (Express + MCP Server)
│  └─ client/       # Frontend (React + Vite)
├─ turbo.json       # Turborepo config
├─ package.json     # npm workspaces root
└─ README.md