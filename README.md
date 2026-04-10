# CodeSpartans_P2

Full-stack inventory/production management app:

## Tech Stack
- **Backend**: Django REST Framework (PostgreSQL recommended; local uses SQLite)
- **Frontend**: React + Vite + Tailwind + React Query
- **Mobile**: Expo (React Native)
- **Pages**: Dashboard, Sales, Purchases, Production, Suppliers, Login

## Local Setup
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install django djangorestframework corsheaders pillow
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Mobile
```bash
cd mobileApp
npm install
npx expo start
```

## Production Deployment
- **Repo**: https://github.com/{your-username}/code-spartans-p2
- Frontend: Build `npm run build` in frontend/, deploy dist/ to Netlify/Vercel/GitHub Pages.
- Backend: Deploy to Render/Railway/Heroku with PostgreSQL DB.
- Update API baseURL in frontend/src/api.js for production backend URL.
- Mobile: `eas build` with Expo.

## API
- Base: http://localhost:8000 (dev)
- Auth: /api/login/
- Protected: /api/dashboard/, /api/sales/, etc.
