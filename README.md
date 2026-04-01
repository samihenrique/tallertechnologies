# GraphQL API - User Management

A minimal GraphQL API built with **NestJS**, **Apollo Server**, and **TypeScript**, featuring an automated test suite and Docker containerization.

## Objectives

- Build a simple GraphQL API with user queries using in-memory data
- Implement type-safe resolvers with the code-first approach
- Create an automated e2e test suite covering functionality, performance, and security
- Containerize the application with Docker

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 11
- **GraphQL:** Apollo Server 5 + @nestjs/graphql (code-first)
- **Testing:** Jest + Supertest
- **Containerization:** Docker + Docker Compose
- **Package Manager:** pnpm

## GraphQL Schema

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

type Query {
  getUser(id: String!): User
  listUsers(limit: Int): [User!]!
}
```

## Project Structure

```
src/
  main.ts                  # Application entry point
  app.module.ts            # Root module with GraphQL configuration
  users/
    user.ts                # User ObjectType definition
    user.module.ts         # Users feature module
    users.resolver.ts      # GraphQL resolvers (getUser, listUsers)
    users.service.ts       # Business logic with in-memory data
test/
  users.e2e-spec.ts        # E2E test suite
  jest-e2e.json            # Jest e2e configuration
Dockerfile                 # Multi-stage Docker build
docker-compose.yml         # Docker Compose setup
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm

### Installation

```bash
pnpm install
```

### Running the API

```bash
# Development (watch mode)
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

The GraphQL Playground will be available at `http://localhost:3000/graphql`.

### Running with Docker

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000/graphql`.

## Example Queries

### List all users

```graphql
query {
  listUsers {
    id
    name
    email
    age
  }
}
```

### List users with limit

```graphql
query {
  listUsers(limit: 1) {
    id
    name
  }
}
```

### Get user by ID

```graphql
query {
  getUser(id: "1") {
    id
    name
    email
    age
  }
}
```

## Testing

### Run e2e tests

```bash
pnpm test:e2e
```

### Test Coverage

The test suite (`test/users.e2e-spec.ts`) covers **7 test cases** across 4 categories:

| Category | Test | Description |
|---|---|---|
| **Valid Queries** | `should return all users` | Verifies `listUsers` returns all users with correct data |
| | `should respect the limit argument` | Verifies `listUsers(limit: 1)` returns only 1 user |
| | `should return a user by id` | Verifies `getUser(id: "1")` returns the correct user |
| **Error Handling** | `should return null for a non-existent user` | Verifies `getUser(id: "999")` returns `null` |
| **Performance** | `should resolve listUsers within 100ms` | Asserts query response time is under 100ms |
| **Security** | `should return an error when querying a non-existent field` | Verifies requesting `password` field returns a GraphQL error |
| | `should return an error for invalid argument type` | Verifies passing `"abc"` as `limit` (Int) returns an error |

## Available Scripts

| Script | Description |
|---|---|
| `pnpm start` | Start the application |
| `pnpm start:dev` | Start in watch mode |
| `pnpm start:prod` | Start in production mode |
| `pnpm build` | Build the project |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run e2e tests |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm lint` | Lint and fix code |
| `pnpm format` | Format code with Prettier |
