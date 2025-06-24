# Smart-OH: Office Hours Queue System

Smart-OH is a **modern office hours queue system** designed for students, teaching assistants, and instructors.

## Project Organization

- **`./smart-oh`** → Next.js frontend and database logic.
- **`./smart-oh-ws`** → FastAPI WebSocket server for real-time updates.

https://github.com/user-attachments/assets/a9ea0276-0cea-4054-8572-f872a5c9f266

## Prerequisites

Before setting up the project, install:

- [`pnpm`](https://pnpm.io/): `npm install -g pnpm`
- [`uv`](https://docs.astral.sh/uv/):  

  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh  # Linux/MacOS
  ```

## Local setup

### NextJS

```bash
cd smart-oh
pnpm install # Install dependencies
pnpm dev # Start the development server
```

### FastAPI

```bash
cd smart-oh-ws
uv sync # Install dependencies
uv run fastapi dev src/main.py # Start the development server
```

## Branching Strategy & Contribution Workflow

We follow a structured branching model to ensure stability and smooth deployments.

### Branching Strategy

- **`main`**: Production-ready code.
- **`preview`**: Staging branch for testing.

### Workflow for Contributions

1. **Fork & Clone**: Fork the repository and clone it to your local machine.
2. Create a **feature branch** from `preview`:

    ```bash
    git checkout -b feature/my-feature preview
    ```

3. **Commit & Push** changes:

    ```bash
    git commit -m "Add feature X"
    git push origin feature/my-feature
    ```

4. Open a **PR** to `preview` for review.
5. If `preview` is stable, it will be merged to `main` for production.
