# 🎨 Frontend Application for De Scheve Schilder CMS

This is the frontend of the **De Scheve Schilder CMS**, a full-stack application for managing students and invoices. The application provides a clean, single-page interface for interacting with the backend API.

## 🚀 Key Technologies

- **Framework:** Vue.js 3
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** Vue Router
- **API Client:** Axios
- **Styling:** Custom CSS with CSS variables
- **Containerization:** Docker

## 📦 Project Structure

The project follows a standard Vue.js and Vite directory structure:

```
frontend-scheve-schilder-cms/
├── src/
│   ├── components/     # Reusable Vue components (StudentList.vue, StudentDetail.vue, InvoiceBatch.vue)
│   ├── router/         # Main router configuration (index.ts)
│   ├── types/          # TypeScript interfaces for data models
│   ├── assets/         # Static assets (CSS files, images)
│   └── main.ts         # Application entry point
├── vite.config.ts      # Vite configuration with API proxy
├── Dockerfile          # Multi-stage Docker build
└── nginx.conf          # Nginx configuration for production
```

## ⚙️ Development Environment Setup

### Prerequisites

- **Node.js & npm:** Required for running the local development server
- **Docker Desktop:** Required to run the full containerized stack

### Running Locally (for quick development)

1. Navigate to the `frontend-scheve-schilder-cms` directory in your terminal
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`. API requests will be proxied to the backend running at `http://localhost:5000` via the Vite proxy configured in `vite.config.ts`.

### Running with Docker Compose (full stack)

To run both the frontend and backend together in a production-like environment:

1. Ensure you are in the root directory of the entire project (the folder containing `docker-compose.yml`)
2. Run the command:
   ```bash
   docker compose up --build
   ```
3. The frontend application will be available at `http://localhost`

## 🧭 Application Pages

- **Ledenboek** (`/students`): Displays a list of all students retrieved from the API. You can add, edit, and delete students from this page.
- **Incasso boekingen** (`/invoices`): A page for managing invoices. You can generate new invoices in batches and view or download past invoices.
- **Student Detail** (`/students/:id`): Shows the detailed information for a single student, including their linked invoices and an option to view their registration document.

## 🐛 Troubleshooting

- **CORS Errors**: If you encounter CORS errors when running `npm run dev`, ensure `http://localhost:5173` is explicitly allowed in the backend's CORS policy.
- **502 Bad Gateway**: This indicates the Nginx proxy is failing to connect to the backend. Double-check the backend service name and port in `docker-compose.yml` and `nginx.conf`.