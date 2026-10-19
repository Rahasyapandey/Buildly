# Buildly

> Think together. Build together.

A collaborative workspace for developers, students, and software engineering teams.

## What is Buildly?

Buildly brings collaborative software planning, communication, and team activities into one platform — removing the need to switch between multiple tools for whiteboarding, software design, and team communication.

## Three Modes

| Mode | Description | Status |
|------|-------------|--------|
| **Build Mode** | Interactive whiteboard, UML, ERDs, flowcharts | 🚧 In Progress |
| **Connect Mode** | Audio/video calls and screen sharing | 📋 Planned |
| **Play Mode** | Multiplayer games and team activities | 📋 Planned |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Backend | Python, FastAPI *(Phase 3)* |
| Database | PostgreSQL *(Phase 3)* |
| Real-time | WebSockets + Yjs *(Phase 4)* |
| Calling | WebRTC *(Phase 6)* |

## Development Phases

- **Phase 1** — Foundation: routing, layout, project structure ✅
- **Phase 2** — Drawing Canvas: freehand drawing and basic shapes
- **Phase 3** — Backend + Persistence: FastAPI, PostgreSQL, save/load boards
- **Phase 4** — Real-Time Collaboration: WebSockets, multi-user boards
- **Phase 5** — Diagramming Tools: UML, ERD, flowcharts
- **Phase 6** — Connect Mode: WebRTC audio/video
- **Phase 7** — Play Mode: multiplayer games
- **Phase 8** — Production Readiness: security, CI/CD, deployment

## Getting Started

```bash
# Install dependencies
cd client
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
Buildly/
└── client/               ← React frontend
    └── src/
        ├── main.tsx      ← Entry point
        ├── App.tsx       ← Router setup
        ├── index.css     ← Global design tokens and reset
        └── pages/
            ├── Landing   ← Public landing page (/)
            ├── Board     ← Workspace (/board)
            └── NotFound  ← 404 fallback
```

## License

MIT