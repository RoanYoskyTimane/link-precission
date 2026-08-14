# Link Precision Frontend (React)

## What it is
A clean, responsive React + TypeScript + Vite web client interface for "Link Precision", the URL shortener application.

## What it does
* **Interactive Dashboard**: Provides a simple UI where users can paste long URLs and instantly receive shortened codes.
* **Link Management**: Supports adding, editing, and deleting created short links.
* **Redirection & Stats**: Allows inspecting URL click statistics and redirection metadata.

## How to execute it
### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended).
* npm package manager.

### Steps
1. **Configure Environment Variables**:
   Create a `.env` file in the root directory pointing to the URL shortener backend:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the printed URL (usually `http://localhost:5173`).

4. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```