# 🎬 KinoPWA

Full-stack cinema ticket booking platform with an interactive seat map, JWT authentication, and offline-first PWA support.

![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-REST_API-A30000?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline--ready-5A0FC8?logo=pwa&logoColor=white)

## About

KinoPWA lets users browse movies, pick a screening, choose seats on an interactive map, and book tickets - all from an installable app that keeps working offline. A Django REST API handles auth, bookings and push notifications; a React SPA delivers the experience.

## Features

- JWT authentication with rotating refresh tokens and blacklisting
- Browse movies & screenings, book seats on an interactive seat map
- Double-booking prevented at the database level (unique seat/screening constraint)
- Push notifications on booking confirmation (Firebase Cloud Messaging)
- Installable, offline-first PWA with per-resource service-worker caching strategies
- Full Django admin panel for managing movies, screenings and bookings
- Dockerized end-to-end with multi-stage builds

## Tech Stack

| Layer         | Technology                                                              |
|---------------|--------------------------------------------------------------------------|
| Backend       | Django 5, Django REST Framework, Simple JWT, PostgreSQL                 |
| Frontend      | React 19, Vite, Tailwind CSS 4, React Router, Axios                     |
| Notifications | Firebase Cloud Messaging                                                 |
| PWA           | vite-plugin-pwa - manifest, offline caching, background service worker  |
| Infra         | Docker (multi-stage), Docker Compose, Nginx, Gunicorn + WhiteNoise      |

## Getting Started

```bash
git clone https://github.com/TheBarr/KinoPWA.git
cd KinoPWA
```

Create `backend/.env` and `frontend/.env` (see below), then:

```bash
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:8000/api
- Django admin → http://localhost:8000/admin

### `backend/.env`

```env
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost

DB_ENGINE=django.db.backends.postgresql
DB_NAME=cinema_db
DB_USER=postgres
DB_PASSWORD=change-me
DB_HOST=db
DB_PORT=5432

# db and backend containers share this file — POSTGRES_* must match DB_* above
POSTGRES_DB=cinema_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-me
```

Push notifications also require `backend/firebase-credentials.json` (Firebase service account key).

### `frontend/.env`

See [`frontend/.env.example`](frontend/.env.example) - API URL plus Firebase web config for FCM.

## API Overview

| Endpoint                            | Description                |
|--------------------------------------|-----------------------------|
| `POST /api/register/`                | Create an account          |
| `POST /api/login/`                   | Log in, receive JWT pair   |
| `POST /api/token/refresh/`           | Refresh access token       |
| `GET /api/movies/`                   | List movies                |
| `GET /api/movies/{id}/screenings/`   | Screenings for a movie     |
| `GET /api/screenings/{id}/seats/`    | Seat map for a screening   |
| `POST /api/bookings/`                | Book a seat                |
| `GET /api/my-bookings/`              | Current user's bookings    |

*Plus endpoints for logout and FCM token registration.*

## Project Structure

```
KinoPWA/
├── backend/           # Django REST API
│   ├── api/           # models, views, serializers, notifications
│   └── backend/       # settings, root urls
├── frontend/          # React PWA
│   └── src/
│       ├── pages/      # Home, Movies, Booking, MyBookings...
│       ├── components/
│       └── utils/       # AuthContext, route guards, axios client
└── docker-compose.yml
```

## Author

**Bartek** — [@TheBarr](https://github.com/TheBarr)
