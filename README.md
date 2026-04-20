# HR Workflow Designer

A visual, drag-and-drop HR workflow builder built with React, React Flow, TypeScript, and Zustand.

---

## Getting Started

### Prerequisites
- Node.js >= 18

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Architecture

```
src/
├── api/
│   └── client.ts          # Mock API layer (GET /automations, POST /simulate)
├── components/
│   ├── Canvas/
│   │   └── Canvas.tsx     # ReactFlow canvas with DnD support
│   ├── Forms/
│   │   ├── KeyValueEditor.tsx   # Reusable KV pair editor
│   │   ├── NodeForms.tsx        # Per-node-type config forms
│   │   └── NodeConfigPanel.tsx  # Right panel, renders correct form by type
│   ├── Nodes/
│   │   ├── BaseNode.tsx   # Shared node shell (handles, delete, styling)
│   │   ├── NodeTypes.tsx  # 5 node type components
│   │   └── index.ts       # nodeTypes registry for React Flow
│   ├── Sandbox/
│   │   └── SandboxPanel.tsx  # Simulation modal with step-by-step log
│   └── Sidebar/
│       └── Sidebar.tsx    # Node palette, status, actions
├── hooks/
│   ├── useAutomations.ts  # Fetches mock automation actions
│   └── useSimulation.ts   # Orchestrates validation + simulate API call
├── store/
│   └── workflowStore.ts   # Zustand store — single source of truth
├── types/
│   └── index.ts           # All TypeScript interfaces
├── utils/
│   └── validation.ts      # Workflow graph validation + cycle detection
├── App.tsx
├── main.tsx
└── styles.css
```

---

## Design Decisions

### State Management — Zustand
Chosen over Context/useReducer for its minimal boilerplate and direct selector access without re-render cascades. The entire workflow graph (nodes, edges, selected state, simulation result) lives in one flat store.

### React Flow
Used for the canvas. Custom node types are registered via a `nodeTypes` map. The canvas supports drag-and-drop from the sidebar via `onDrop`/`onDragOver` + `screenToFlowPosition`.

### Node Configuration Forms
Each node type has a dedicated form component. Forms use controlled components bound directly to the Zustand store via `updateNodeData`. The `NodeConfigPanel` acts as a discriminated-union dispatcher — it reads `node.type` and renders the correct form. Adding a new node type requires: a type definition, a node display component, and a form component — nothing else changes.

### Mock API Layer
`src/api/client.ts` simulates network latency with `setTimeout` delays. `GET /automations` returns a static list. `POST /simulate` does a BFS traversal of the workflow graph and returns step-by-step results. The API layer is abstracted behind a single `apiClient` object — swapping in a real backend requires changing only this file.

### Validation
`validateWorkflow()` in `utils/validation.ts` checks for: missing Start/End nodes, duplicate Start nodes, disconnected nodes, and cycles (DFS-based). Errors are surfaced in the sidebar in real time and in the Sandbox panel before simulation.

### Scalability Considerations
- New node types: add to `types/index.ts`, create a display component in `NodeTypes.tsx`, add a form in `NodeForms.tsx`, register in `nodeTypes` map — no other code changes required.
- The `KeyValueEditor` is fully reusable across node types.
- The `apiClient` is a plain object — easy to extend or mock in tests.
- Zustand selectors prevent unnecessary re-renders.

---

## Features Implemented

- [x] Drag-and-drop canvas with 5 node types
- [x] Connect nodes with animated edges
- [x] Select + configure any node via right panel
- [x] Delete nodes/edges (click × or press Delete key)
- [x] Node config forms with all required fields per spec
- [x] Dynamic action parameters (Automated Step)
- [x] Key-value pair editor (Start + Task nodes)
- [x] Mock API — GET /automations
- [x] Mock API — POST /simulate (BFS execution)
- [x] Sandbox panel with step-by-step execution log
- [x] Workflow validation (missing nodes, disconnected, cycles)
- [x] Export workflow as JSON
- [x] Import workflow from JSON file
- [x] MiniMap + Controls
- [x] Real-time status chips in sidebar

## What I'd Add With More Time

- Undo/Redo (Zustand middleware or a history stack)
- Auto-layout (dagre-d3 integration)
- Visual error indicators on nodes themselves
- Node templates / preset workflows
- Backend persistence with a real REST API
- Unit tests for validation logic and hooks
- Node version history / change log
- Keyboard shortcuts (Ctrl+Z, Ctrl+S, etc.)
