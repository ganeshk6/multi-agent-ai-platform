<div align="center">

# 🤖 Multi-Agent AI Platform

**Build, orchestrate and run collaborative AI agents with LangChain.js and LangGraph.js — 100% JavaScript, on a MERN microservices architecture.**

![MERN](https://img.shields.io/badge/Stack-MERN-47A248?logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![LangChain.js](https://img.shields.io/badge/LangChain.js-Enabled-1C3C3C)
![LangGraph.js](https://img.shields.io/badge/LangGraph.js-Orchestration-blueviolet)
![Firebase](https://img.shields.io/badge/Firebase-Google%20Auth-FFCA28?logo=firebase&logoColor=black)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

</div>

> 📝 **Note:** `Agents` is a placeholder name. Replace it with the actual project name.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Project Status](#-project-status)
3. [Key Features](#-key-features)
4. [System Architecture](#-system-architecture)
5. [Authentication Flow (Firebase + Google)](#-authentication-flow-firebase--google)
6. [Multi-Agent Workflow (LangGraph.js)](#-multi-agent-workflow-langgraphjs)
7. [RAG Pipeline (Planned)](#-rag-pipeline-planned)
8. [Chat Request Lifecycle](#-chat-request-lifecycle)
9. [Tech Stack](#-tech-stack)
10. [Services Breakdown](#-services-breakdown)
11. [Project Structure](#-project-structure)
12. [Database Design](#-database-design)
13. [API Reference](#-api-reference)
14. [Getting Started](#-getting-started)
15. [Environment Variables](#-environment-variables)
16. [Docker & Deployment](#-docker--deployment)
17. [Security](#-security)
18. [Roadmap](#-roadmap)
19. [Contributing](#-contributing)
20. [License](#-license)

---

## 🌟 Overview

**Agents** is a full-stack **Multi-Agent AI Platform** where multiple specialized AI agents collaborate to solve complex tasks. Instead of a single LLM prompt, a **Supervisor agent** plans the task, delegates work to specialist agents (Researcher, RAG Agent, Coder, Writer, Critic) and combines their outputs into a verified final answer.

The entire platform is written in **JavaScript/TypeScript (Node.js)** — including the AI layer — so the team works in a single language end to end.

| Layer | Technology |
|---|---|
| UI | React |
| APIs & Services | Node.js + Express |
| Authentication | **Firebase Authentication** (Google Sign-In) |
| Database | MongoDB |
| Cache / Realtime | Redis |
| LLM Abstractions & Tools | **LangChain.js** |
| Multi-Agent Orchestration | **LangGraph.js** |
| Knowledge (RAG) | LangChain.js retrievers + vector store *(planned)* |
| Packaging | Docker + Docker Compose |

---

## 📌 Project Status

The project is under active development. This README is updated as new modules are completed.

| Module | Status | Notes |
|---|---|---|
| Auth | ✅ Done | Google Sign-In via Firebase Auth, ID token verification on the backend |
| Chat (Conversations + Messages) | ✅ Done | Conversation list, messages inside a conversation |
| Redis | ✅ In use | Caching / realtime support |
| Docker setup | ✅ In use | Containerized services |
| Agent orchestration (LangGraph.js) | 🚧 Planned | Supervisor + specialist agents |
| RAG / Knowledge Base | 🚧 Planned | Document upload, embeddings, retrieval |
| Tools (web search, code, APIs) | 🚧 Planned | Exposed to agents via LangChain.js tools |
| Agent builder UI, memory, observability | 🚧 Planned | See [Roadmap](#-roadmap) |

---

## ✨ Key Features

**Available now**
- 🔐 Google Sign-In using Firebase Authentication (backend verifies Firebase ID tokens)
- 💬 Chat with multiple conversations, each holding its own messages
- ⚡ Redis for caching and fast data access
- 🐳 Dockerized setup for consistent environments

**Coming next**
- 🧠 Multi-agent orchestration with LangGraph.js (Supervisor → specialist agents → Critic)
- 📚 RAG knowledge base — upload PDF / DOCX / TXT and chat with your documents
- 🔧 Tool calling — web search, code execution, REST API calls
- 🌊 Token-by-token streaming of agent responses
- 🔍 Agent trace viewer (which agent ran, which tool was called)
- 🙋 Human-in-the-loop approvals for sensitive actions
- 🧩 Custom agent builder (prompt, model, tools, knowledge base)

---

## 🏗 System Architecture

> ✅ Solid boxes = implemented · 🚧 Dashed boxes = planned

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        UI["React Frontend<br/>Firebase JS SDK"]
    end

    subgraph IdP["🔑 Identity Provider"]
        FB["✅ Firebase Authentication<br/>Google Sign-In"]
    end

    subgraph Edge["🚪 Edge Layer"]
        GW["API Gateway / Nginx<br/>Routing + Auth check"]
    end

    subgraph Services["⚙️ Node.js Microservices"]
        AUTH["✅ Auth Service<br/>Express + Firebase Admin SDK"]
        CHAT["✅ Chat Service<br/>Conversations + Messages"]
        AGENT["🚧 Agent Service<br/>LangChain.js + LangGraph.js"]
        RAG["🚧 RAG Service<br/>Ingestion + Retrieval"]
    end

    subgraph Data["🗄️ Data Layer"]
        MONGO[("✅ MongoDB<br/>users, conversations, messages")]
        REDIS[("✅ Redis<br/>cache, rate limit, pub/sub")]
        VDB[("🚧 Vector Store")]
    end

    subgraph External["🌐 External"]
        LLM["LLM Providers<br/>OpenAI / Gemini / Anthropic / Ollama"]
    end

    UI -->|Google Sign-In| FB
    FB -->|Firebase ID Token| UI
    UI -->|HTTPS + Bearer ID Token| GW
    GW --> AUTH
    AUTH -.verify token.-> FB
    GW --> CHAT
    CHAT -.-> AGENT
    AGENT -.-> RAG
    AGENT -.-> LLM
    RAG -.-> VDB
    AUTH --> MONGO
    AUTH --> REDIS
    CHAT --> MONGO
    CHAT --> REDIS
    AGENT -.-> MONGO
    AGENT -.-> REDIS

    style AGENT stroke-dasharray: 5 5
    style RAG stroke-dasharray: 5 5
    style VDB stroke-dasharray: 5 5
    style LLM stroke-dasharray: 5 5
```

### Design Principles

- **Single responsibility** — each service owns one domain and its data.
- **One language** — Node.js everywhere, so code, types and utilities can be shared.
- **Stateless services** — state lives in MongoDB, Redis and LangGraph checkpoints, so services scale horizontally.
- **Container-first** — every service ships with its own Dockerfile.

---

## 🔑 Authentication Flow (Firebase + Google)

Authentication is handled by **Firebase Authentication** with the **Google** sign-in provider. There are no custom passwords or self-issued JWTs. The client signs in with Google, receives a **Firebase ID token**, and sends it to the backend with every request. The backend verifies the token using the **Firebase Admin SDK**.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant FE as React Frontend
    participant FB as Firebase Auth
    participant G as Google
    participant GW as API Gateway / Auth Service
    participant DB as MongoDB

    U->>FE: Click "Continue with Google"
    FE->>FB: signInWithPopup(GoogleAuthProvider)
    FB->>G: Google OAuth consent
    G-->>FB: Verified Google account
    FB-->>FE: Firebase user + ID token
    FE->>GW: API request (Authorization: Bearer <ID token>)
    GW->>FB: admin.auth().verifyIdToken(token)
    FB-->>GW: Decoded token (uid, email, name, picture)
    GW->>DB: Find or create User by firebaseUid
    DB-->>GW: User document
    GW-->>FE: Response (user + data)
```

### Frontend (React)

```js
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const auth = getAuth();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const idToken = await result.user.getIdToken(); // auto-refreshed by Firebase SDK
  return { user: result.user, idToken };
}

// Attach the token to every API call
api.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Backend (Node.js + Express)

```js
// services/auth-service/src/middleware/verifyFirebaseToken.js
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
```

> 💡 Firebase ID tokens expire after 1 hour. The Firebase client SDK refreshes them automatically, so the backend needs no refresh-token logic.

---

## 🔄 Multi-Agent Workflow (LangGraph.js)

*(Planned)* The core of the AI layer is a **LangGraph.js `StateGraph`**. A shared state flows through nodes, and the **Supervisor** decides the next node using conditional edges.

```mermaid
stateDiagram-v2
    [*] --> Supervisor: User query

    Supervisor --> Planner: Complex task
    Supervisor --> RAGAgent: Needs private knowledge
    Supervisor --> Researcher: Needs web info
    Supervisor --> Coder: Needs code / computation
    Supervisor --> Writer: Ready to compose answer

    Planner --> Supervisor: Plan created
    RAGAgent --> Supervisor: Context + sources
    Researcher --> Supervisor: Search findings
    Coder --> Supervisor: Code + output

    Writer --> Critic: Draft answer
    Critic --> Writer: Needs revision (loop, max N)
    Critic --> HumanApproval: Sensitive action detected
    HumanApproval --> Writer: Approved / Edited
    Critic --> [*]: Approved → Final answer
```

### Agents & Responsibilities

| Agent | Role | Tools / Resources |
|---|---|---|
| 🎯 **Supervisor** | Understands intent, routes to the right agent, decides when to finish | Router LLM, conditional edges |
| 🗺️ **Planner** | Breaks complex goals into ordered sub-tasks | LLM with structured output (Zod) |
| 📚 **RAG Agent** | Grounds answers in uploaded documents | Retriever, re-ranker |
| 🌐 **Researcher** | Finds up-to-date public information | Web search tool |
| 💻 **Coder** | Writes and runs code, does data analysis | Sandboxed code executor |
| ✍️ **Writer** | Composes the final, well-formatted response | LLM with style prompts |
| 🧐 **Critic** | Fact-checks, validates against sources, triggers revisions | Self-reflection prompts |

### Graph State & Construction (LangGraph.js — simplified)

```js
// services/agent-service/src/graph/builder.js
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

const AgentState = Annotation.Root({
  messages:      Annotation({ reducer: (a, b) => a.concat(b), default: () => [] }),
  plan:          Annotation({ default: () => [] }),   // sub-tasks from Planner
  nextAgent:     Annotation(),                        // Supervisor's routing decision
  retrievedDocs: Annotation({ default: () => [] }),   // RAG context + sources
  toolOutputs:   Annotation({ default: () => ({}) }), // results from tools
  revisionCount: Annotation({ default: () => 0 }),    // Critic ↔ Writer loop counter
  finalAnswer:   Annotation(),
});

const workflow = new StateGraph(AgentState)
  .addNode("supervisor", supervisorNode)
  .addNode("planner", plannerNode)
  .addNode("rag_agent", ragNode)
  .addNode("researcher", researchNode)
  .addNode("coder", coderNode)
  .addNode("writer", writerNode)
  .addNode("critic", criticNode)
  .addEdge(START, "supervisor")
  .addConditionalEdges("supervisor", (state) => state.nextAgent, {
    planner: "planner",
    rag_agent: "rag_agent",
    researcher: "researcher",
    coder: "coder",
    writer: "writer",
  })
  .addEdge("planner", "supervisor")
  .addEdge("rag_agent", "supervisor")
  .addEdge("researcher", "supervisor")
  .addEdge("coder", "supervisor")
  .addEdge("writer", "critic")
  .addConditionalEdges("critic", shouldRevise, { writer: "writer", [END]: END });

// A checkpointer gives persistent thread memory + resume (human-in-the-loop)
export const agentApp = workflow.compile({ checkpointer });
```

### Calling the Graph from the Chat Service

```js
const stream = await agentApp.stream(
  { messages: [{ role: "user", content: userMessage }] },
  { configurable: { thread_id: conversationId }, streamMode: "updates" }
);

for await (const update of stream) {
  // push each agent step / token to the client (SSE or Socket.IO)
}
```

---

## 📚 RAG Pipeline (Planned)

### 1️⃣ Ingestion Flow

```mermaid
flowchart LR
    A["📄 Upload<br/>PDF / DOCX / TXT / URL"] --> B["Store raw file"]
    B --> C["Loader<br/>(LangChain.js document loaders)"]
    C --> D["Chunking<br/>RecursiveCharacterTextSplitter<br/>size 800 / overlap 100"]
    D --> E["Embedding Model"]
    E --> F[("Vector Store<br/>vectors + metadata")]
    C --> G["Update status in MongoDB<br/>processing → indexed"]
```

### 2️⃣ Retrieval & Generation Flow

```mermaid
flowchart LR
    Q["❓ User Query"] --> R["Query Rewriting<br/>(use chat history)"]
    R --> E["Embed Query"]
    E --> V[("Vector Store<br/>Top-K similarity search")]
    V --> F["Metadata Filter<br/>(userId, knowledgeBaseId)"]
    F --> RR["Optional Re-ranker"]
    RR --> P["Prompt Builder<br/>Context + Question"]
    P --> L["LLM"]
    L --> A["✅ Answer + Source Citations"]
```

> 💡 **Vector store options (decide later):** MongoDB Atlas Vector Search (keeps everything in one DB), Qdrant, Pinecone or Chroma — all supported by LangChain.js.

---

## 📡 Chat Request Lifecycle

How a message flows through the platform. Steps marked 🚧 arrive once the agent service is added; today the Chat Service stores messages and returns the response.

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant FE as React Frontend
    participant GW as API Gateway
    participant CH as Chat Service
    participant RD as Redis
    participant DB as MongoDB
    participant AG as 🚧 Agent Service
    participant LLM as 🚧 LLM Provider

    U->>FE: Send message
    FE->>GW: POST /api/conversations/:id/messages (Bearer Firebase ID token)
    GW->>GW: Verify ID token (Firebase Admin SDK)
    GW->>CH: Forward request
    CH->>DB: Save user message
    CH->>RD: Read / update cached conversation context
    CH->>AG: 🚧 Invoke graph (thread_id = conversationId)
    AG->>LLM: 🚧 Supervisor + agents + tools
    AG-->>CH: 🚧 Stream tokens + agent events
    CH-->>FE: Response (SSE / WebSocket when streaming is added)
    CH->>DB: Save assistant message
    FE-->>U: Show answer
```

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** | UI framework |
| **Firebase JS SDK** | Google Sign-In and ID token management |
| **Redux Toolkit / Zustand** | State management |
| **Tailwind CSS** | Styling |
| **React Flow** *(planned)* | Visual agent graph & agent builder |
| **EventSource / Socket.IO Client** *(planned)* | Streaming responses |
| **React Markdown** | Rendering AI responses and code |

### Backend (Node.js)
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | Auth, Chat and (future) Agent / RAG services |
| **MongoDB + Mongoose** | Primary database |
| **Redis** | Caching, rate limiting, pub/sub |
| **Firebase Admin SDK** | Verify Firebase ID tokens on the backend |
| **Zod / Joi** | Request validation |

### AI Layer (Node.js — planned)
| Technology | Purpose |
|---|---|
| **LangChain.js** (`langchain`, `@langchain/core`) | Prompts, tools, retrievers, document loaders, text splitters |
| **LangGraph.js** (`@langchain/langgraph`) | Multi-agent orchestration, state, checkpoints, human-in-the-loop |
| **`@langchain/openai` / `google-genai` / `anthropic` / `ollama`** | Pluggable LLM & embedding providers |
| **Vector store** | MongoDB Atlas Vector Search / Qdrant / Pinecone / Chroma |
| **LangSmith / Langfuse** | LLM tracing & evaluation |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| **Firebase Authentication** | Managed identity provider (Google Sign-In) |
| **Docker + Docker Compose** | Containerization & local orchestration |
| **Nginx** *(optional)* | Reverse proxy / load balancing |
| **GitHub Actions** | CI/CD pipelines |

---

## 🧩 Services Breakdown

| Service | Status | Port | Responsibility |
|---|---|---|---|
| `frontend` | ✅ | `3000` | React user interface |
| `auth-service` | ✅ | `8001` | Verify Firebase ID tokens, sync user profile in MongoDB |
| `chat-service` | ✅ | `8002` | Conversations and messages |
| `agent-service` | 🚧 | `8003` | LangGraph.js agents, supervisor, tool orchestration |
| `rag-service` | 🚧 | `8004` | Document upload, embeddings, retrieval |
| `mongodb` | ✅ | `27017` | Primary datastore |
| `redis` | ✅ | `6379` | Cache & pub/sub |

> Ports are examples — update them to match your `docker-compose.yml`.

---

## 📂 Project Structure

```
multiagents/
├── docker-compose.yml
├── .env.example
├── README.md
├── frontend/                      # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── services/              # API clients
│   └── Dockerfile
├── services/
│   ├── auth-service/              # ✅
│   │   ├── src/{controllers,models,routes,middleware,utils}
│   │   └── Dockerfile
│   ├── chat-service/              # ✅
│   │   ├── src/{controllers,models,routes,middleware}
│   │   └── Dockerfile
│   ├── agent-service/             # 🚧 planned
│   │   ├── src/
│   │   │   ├── graph/             # LangGraph.js state + builder
│   │   │   │   └── nodes/         # supervisor, planner, rag, researcher, coder, writer, critic
│   │   │   ├── tools/
│   │   │   ├── prompts/
│   │   │   └── memory/
│   │   └── Dockerfile
│   └── rag-service/               # 🚧 planned
│       ├── src/{loaders,splitters,embeddings,retrievers,routes}
│       └── Dockerfile
└── docs/                          # Architecture docs, screenshots
```

> Adjust folder names to match your actual repository.

---

## 🗃 Database Design

Current collections: **User**, **Conversation**, **Message**.

```mermaid
erDiagram
    USER ||--o{ CONVERSATION : owns
    CONVERSATION ||--o{ MESSAGE : contains

    USER {
        ObjectId _id
        string firebaseUid
        string name
        string email
        string photoURL
        date createdAt
    }
    CONVERSATION {
        ObjectId _id
        ObjectId userId
        string title
        date createdAt
        date updatedAt
    }
    MESSAGE {
        ObjectId _id
        ObjectId conversationId
        string role
        string content
        date createdAt
    }
```

### Planned Collections (Future)

| Collection | Purpose |
|---|---|
| `Agent` | Custom agent config (prompt, model, tools, knowledge bases) |
| `KnowledgeBase` | Group of documents used for RAG |
| `Document` | Uploaded file metadata + indexing status |
| `TraceStep` | Per-message agent / tool execution trace |

---

## 🔌 API Reference

> Base URL: `http://localhost:8000/api` — endpoint names below are examples; align them with your actual routes.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/google` | Verify Firebase ID token, create the user on first login and return the profile |
| `GET` | `/auth/me` | Get current user profile (requires `Authorization: Bearer <Firebase ID token>`) |

> Login/logout itself happens on the client with the Firebase SDK. There are no `/register`, `/login` or `/refresh` endpoints.

### Chat
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/conversations` | List user conversations |
| `POST` | `/conversations` | Create a new conversation |
| `GET` | `/conversations/:id` | Get a conversation |
| `DELETE` | `/conversations/:id` | Delete a conversation |
| `GET` | `/conversations/:id/messages` | List messages in a conversation |
| `POST` | `/conversations/:id/messages` | Send a message |

### Planned
| Area | Endpoints |
|---|---|
| Agents | `GET/POST /agents`, `PUT/DELETE /agents/:id` |
| Knowledge Base | `POST /kb`, `POST /kb/:id/documents`, `GET /kb/:id/documents`, `POST /kb/:id/search` |
| Streaming | `POST /conversations/:id/stream` (SSE) |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose v2+
- [Node.js](https://nodejs.org/) 18+ (for running without Docker)
- A [Firebase](https://console.firebase.google.com/) project with **Authentication → Google** provider enabled
- An API key for an LLM provider (OpenAI / Gemini / Anthropic) **or** [Ollama](https://ollama.com/) — needed once the agent service is added

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/multi-agent-ai-platform-agents.git
cd multi-agent-ai-platform-agents

# 2. Configure environment
cp .env.example .env
# → open .env and add your Firebase credentials and other secrets

# 3. Start the platform
docker compose up --build

# 4. Open the app
# Frontend → http://localhost:3000
# API      → http://localhost:8000
```

### Local Development (Without Docker)

```bash
# Start only the databases
docker compose up mongodb redis -d

# Run each service in a separate terminal
cd services/auth-service && npm install && npm run dev
cd services/chat-service && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

---

## 🔑 Environment Variables

```env
# ---------- General ----------
NODE_ENV=development

# ---------- Firebase Auth (backend - Admin SDK) ----------
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# ---------- Firebase Auth (frontend - Web SDK, e.g. Vite) ----------
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=...

# ---------- Databases ----------
MONGO_URI=mongodb://mongodb:27017/multi-agent-ai-platform-agents
REDIS_URL=redis://redis:6379

# ---------- LLM Providers (needed when agent-service is added) ----------
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=...
OLLAMA_BASE_URL=http://host.docker.internal:11434
DEFAULT_LLM_PROVIDER=openai
DEFAULT_MODEL=gpt-4o-mini

# ---------- Observability (optional) ----------
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=...
LANGCHAIN_PROJECT=multi-agent-ai-platform-agents
```

---

## 🐳 Docker & Deployment

### docker-compose.yml (Excerpt)

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [auth-service, chat-service]

  auth-service:
    build: ./services/auth-service
    env_file: .env
    ports: ["8001:8001"]
    depends_on: [mongodb, redis]

  chat-service:
    build: ./services/chat-service
    env_file: .env
    ports: ["8002:8002"]
    depends_on: [mongodb, redis]

  # 🚧 Planned
  # agent-service:
  #   build: ./services/agent-service
  #   env_file: .env
  #   depends_on: [mongodb, redis]
  #
  # rag-service:
  #   build: ./services/rag-service
  #   env_file: .env

  mongodb:
    image: mongo:7
    volumes: ["mongo_data:/data/db"]

  redis:
    image: redis:7-alpine

volumes:
  mongo_data:
```

### Sample Node.js Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8001
CMD ["node", "src/index.js"]
```

### CI/CD Pipeline

```mermaid
flowchart LR
    DEV["👨‍💻 Push to GitHub"] --> CI["GitHub Actions<br/>Lint + Test"]
    CI --> BUILD["Build Docker Images"]
    BUILD --> REG["Push to Registry<br/>(GHCR / ECR)"]
    REG --> DEPLOY["Deploy<br/>(EC2 + Compose)"]
```

---

## 🔒 Security

- 🔐 Google Sign-In via Firebase Authentication — no passwords stored in our database.
- ✅ Every request is authenticated by verifying the Firebase ID token with the Admin SDK.
- 🔑 Firebase service-account keys are kept only in environment variables / secrets, never in the frontend or Git.
- 🚦 Rate limiting per user / IP using Redis.
- 🧼 Input validation on every endpoint (Zod / Joi).
- 🧱 Per-user data isolation (every query is scoped by `userId`).
- 🔑 Secrets only via environment variables — never committed to Git.
- 🧪 *(Planned)* Sandboxed code execution and prompt-injection guardrails for agents.

---

## 🗺 Roadmap

- [x] Authentication service
- [x] Chat service (conversations + messages)
- [x] Redis integration
- [x] Dockerized setup
- [ ] Agent service with LangChain.js + LangGraph.js (Supervisor + specialist agents)
- [ ] Streaming responses (SSE / Socket.IO)
- [ ] RAG knowledge base (upload → chunk → embed → retrieve)
- [ ] Tool calling (web search, code execution, API calls)
- [ ] Agent trace viewer in UI
- [ ] Persistent agent memory (LangGraph checkpointer)
- [ ] Human-in-the-loop approvals
- [ ] Custom agent builder (React Flow)
- [ ] Observability (LangSmith / Langfuse)
- [ ] CI/CD with GitHub Actions
- [ ] Kubernetes manifests / Helm charts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) and make sure lint and tests pass before submitting.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👥 Team & Contact

| Name | Role | GitHub |
|---|---|---|
| _Your Name_ | Full Stack Developer | [@username](https://github.com/username) |
| _Teammate_ | Full Stack Developer | [@username](https://github.com/username) |

<div align="center">

⭐ If you find this project useful, please give it a star! ⭐

</div>