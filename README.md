# Coding Test Monorepo

This is an NX monorepo containing a React (Vite) web application and Node.js/Express API with shared libraries.

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Development

Start both applications:
```bash
yarn start:all
```

Or start them individually:
```bash
# Start the API server (port 3000)
yarn start:api

# Start the web app (port 4200)
yarn start:web
```

### Building

Build all projects:
```bash
yarn build
```

Build individual projects:
```bash
yarn build:web
yarn build:api
```

### Testing

Run all tests:
```bash
yarn test
```

Run E2E tests:
```bash
yarn e2e
```

### Linting

Run linting for all projects:
```bash
yarn lint
```

## Available Scripts

- `yarn start:all` - Start both API and web app concurrently
- `yarn start:api` - Start the API server
- `yarn start:web` - Start the web application
- `yarn build` - Build all projects
- `yarn test` - Run all tests
- `yarn e2e` - Run E2E tests
- `yarn lint` - Lint all projects

## Technology Stack

### Frontend (Web App)
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router

### Backend (API)
- Node.js
- Express
- TypeScript
- CORS & Helmet for security

### Testing
- Jest for unit tests
- Playwright for E2E tests
- Testing Library for React components

### Development Tools
- NX for monorepo management
- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Web App Environment Variables
VITE_API_BASE_URL=http://localhost:3000/api

# Server Environment Variables
SERVER_PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/coding-test
```