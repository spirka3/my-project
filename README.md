# Announcement Management System

## Tech Stack

* Backend: NestJS, GraphQL (Code-first), TypeORM
* Database: PostgreSQL (Docker)
* Frontend: React (Vite)
* Testing: Jest

---

## Prerequisites
You need Node.js and Docker installed on your machine.

### Setup

1.  Install dependencies:
    ```bash
    # Run in root folder
    npm install
    ```

2.  Start the Database:
    ```bash
    # Run in root folder
    npm run docker:db
    ```

3.  Launch the Backend & Frontend:
    ```bash
    # Run in root folder
    npm run start:dev
    ```

---

## Endpoints

* API Endpoint: `http://localhost:3000/`
* GraphQL Playground: `http://localhost:3000/graphql`
* Web Interface: `http://localhost:5173/`

---

## Testing

Test GraphQL in Postman Collection: [Open Shared Workspace](https://web.postman.co/workspace/My-Workspace~4231c771-d876-47d9-8dc5-0a9027d129d3/request/69a4beef5d99735f55f073ce?action=share&source=copy-link&creator=12631069)

Test Backend:
```bash
# Run in root folder
npm test --prefix server
```
