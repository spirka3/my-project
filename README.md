# Announcement Management System

## Tech Stack

* Backend: NestJS, GraphQL (Code-first), TypeORM
* Database: PostgreSQL (Docker)
* Frontend: React (Vite) // ...without implemented design
* Testing: Jest

---

## Prerequisites
You need Node.js and Docker installed on your machine.

### Setup
Run in root folder

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set env files:
    ```bash
    cp .env.example .env
    cp server/.env.example server/.env
    ```

3. Start the Database:
    ```bash
    npm run docker:db
    ```
   
4. Launch the Backend & Frontend:
    ```bash
    npm run start:dev
    ```

---

## Endpoints

* API Endpoint: `http://localhost:3000/`
* GraphQL Playground: `http://localhost:3000/graphql`
* Web Interface: `http://localhost:5173/`

---

## Testing

1. Test Backend:
    ```bash
    # Run in root folder
    npm test --prefix server
    ```
   
2. Test GraphQL in Postman Collection
    ```bash
    # http://localhost:3000/graphql
    query Announcement {
        announcement(id: 1) {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
        noFilter: announcements {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
        searchFilter: announcements(filter: { searchTerm: "ent", categoryIds: [1] }) {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
    }
    
    mutation CreateAnnouncement {
        createAnnouncement(
            createAnnouncementInput: {
                title: "Title A"
                content: "Content A"
                categoryIds: [1, 2]
                publicationDate: "2026-03-01T12:00:00Z"
            }
        ) {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
    }
    
    mutation UpdateAnnouncement {
        updateAnnouncement(id: 1, updateAnnouncementInput: {
            id: 2
            publicationDate: "2026-03-01T12:00:00Z"
        }) {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
    }
    
    mutation RemoveAnnouncement {
        removeAnnouncement(id: 1) {
            content
            createdAt
            deletedAt
            id
            publicationDate
            title
            updatedAt
            categories {
                createdAt
                id
                name
                updatedAt
            }
        }
    }
    ```
