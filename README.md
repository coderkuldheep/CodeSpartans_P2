# CodeSpartans P2 - Inventory Management System

## Tech Stack
- **Frontend**: React 18 + Vite + React Router + Tailwind CSS + TanStack Query
- **Backend**: Django REST Framework + PostgreSQL/SQLite

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- Local: http://localhost:5173/CodeSpartans_P2/
- Backend runs on http://localhost:8000 (Django)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows
pip install -r requirements.txt  # Create if needed
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## GitHub Pages Demo
✅ Live Demo: https://coderkuldheep.github.io/CodeSpartans_P2/

**Note**: Demo shows frontend only. Login requires backend API:
- Default login: `admin` / `admin123` (if backend deployed)
- Currently shows login form (backend needed for full functionality)

### Deploy Updates
1. Push to `main` → Auto-builds & deploys frontend to GitHub Pages via `.github/workflows/deploy.yml`
2. Build locally: `cd frontend && npm run build && npm run preview`

## Features
- Dashboard with stats
- Suppliers, Purchases, Sales, Production management
- Role-based navigation (Admin, Manager, etc.)
- Responsive UI with Tailwind

## Backend Deployment (for full app)
Host Django on Render/Railway/Heroku, update `frontend/src/api.js` baseURL.

Original Vite template info below...

## React + Vite (Original)

This template provides a minimal setup to get React working in Vite...

[rest of original content truncated for brevity]
