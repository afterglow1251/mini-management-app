# Mini Project Management App 💼🛠️

Full-stack application: project management app.

**Backend**: NestJS  
**Frontend**: React

## Installation and launch ⚙️

### Backend

1. Go to the backend directory and install the dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a .env file in the backend root and fill it in (example):

   ```env
   PORT                      =

   NODE_ENV                  =

   FRONTEND_URL              =

   DB_HOST                   =
   DB_PORT                   =
   DB_USERNAME               =
   DB_PASSWORD               =
   DB_NAME                   =

   JWT_SECRET                =
   JWT_ACCESS_TOKEN_EXPIRES  =
   JWT_REFRESH_TOKEN_EXPIRES =
   ```

   ⚠️ Fill in the values according to your environment setup.

3. Run the backend:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Go to the frontend directory and install the dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Create a.env file in the frontend root and fill it in (example):

   ```env
   VITE_BACKEND_URL                        =
   VITE_ACCESS_TOKEN_REFRESH_INTERVAL_MS   =
   ```

   ⚠️ Fill in the values according to your environment setup.

3. Run the frontend:
   ```bash
   npm run dev
   ```

## Prerequisites 🧱

This project uses **PostgreSQL**.

- Make sure it's installed.
- Connection settings are in your `.env` file.
- Default config path: `backend/src/database/database.config.ts`
- You can:
  - Edit `.env` to match your setup, **or**
  - Change settings directly in `database.config.ts`
