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

#### Unit Testing

Run all unit tests:
```bash
yarn test
```

Run backend tests only:
```bash
yarn test:api
```

Run frontend tests only:
```bash
yarn test:web
```

Run tests with coverage:
```bash
yarn test:coverage
```

Run tests in watch mode:
```bash
yarn test:watch
```

#### Test Structure

The application includes comprehensive unit tests for both backend and frontend:

**Backend Tests (`apps/api`)**
- **Services**: OrderService, ExchangeRateService
- **Controllers**: OrderController  
- **App Configuration**: Express app setup, middleware, error handling

**Frontend Tests (`apps/web`)**
- **Components**: ProductCustomizer, OrderHistory, ProductPreview, PriceDisplay
- **Services**: ApiService
- **Pages**: HomePage

#### Test Coverage

**Backend Coverage (42 tests)**
- ✅ OrderService: CRUD operations, price calculations, currency conversion
- ✅ ExchangeRateService: API calls, caching, error handling, fallback rates
- ✅ OrderController: All endpoints, validation, error handling
- ✅ App Configuration: Middleware, CORS, error handling, health checks

**Frontend Coverage (57 tests)**
- ✅ ProductCustomizer: User interactions, form validation, price calculations, API integration
- ✅ OrderHistory: Data loading, order management, error handling
- ✅ ProductPreview: Rendering, color handling, text/image display
- ✅ PriceDisplay: Currency formatting, calculations
- ✅ ApiService: All API methods, error handling
- ✅ HomePage: Component rendering

#### Test Configuration

- **Backend**: Jest with ts-jest, Node.js environment
- **Frontend**: Jest + React Testing Library, jsdom environment
- **Mocking**: External APIs and dependencies are properly mocked
- **Coverage**: Comprehensive coverage of business logic and edge cases

#### E2E Testing

### Linting

Run linting for all projects:
```bash
yarn lint
```

## Available Scripts

### Development
- `yarn start:all` - Start both API and web app concurrently
- `yarn start:api` - Start the API server
- `yarn start:web` - Start the web application

### Building
- `yarn build` - Build all projects
- `yarn build:web` - Build web application
- `yarn build:api` - Build API server

### Testing
- `yarn test` - Run all unit tests
- `yarn test:api` - Run backend tests only
- `yarn test:web` - Run frontend tests only
- `yarn test:coverage` - Run tests with coverage
- `yarn test:watch` - Run tests in watch mode

### Linting
- `yarn lint` - Lint all projects
- `yarn lint:web` - Lint web application
- `yarn lint:api` - Lint API server

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
- **Jest** for unit tests with ts-jest
- **React Testing Library** for React component testing
- **@testing-library/user-event** for user interaction testing
- **Supertest** for API endpoint testing
- **Comprehensive mocking** for external dependencies

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