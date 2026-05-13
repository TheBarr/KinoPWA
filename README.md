# 🎬 Movie Ticket - Cinema Booking PWA

Progressive Web App do rezerwacji biletów kinowych. React + Django REST Framework + Firebase Cloud Messaging.

## ✨ Features

- 🎫 System rezerwacji miejsc z interaktywną mapą sali
- 🔐 Autoryzacja JWT z refresh tokenami
- 📱 PWA - działa offline, można zainstalować
- 🔔 Push notifications (Firebase Cloud Messaging)
- 🎨 Responsive design (Tailwind CSS)
- ⚡ Cache strategia dla lepszej wydajności

## 🚀 Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- Firebase account

### Backend Setup

1. **Clone & Install:**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Variables:**

   ```bash
   cp .env.example .env
   # Edytuj .env i wypełnij swoimi danymi
   ```

3. **Firebase Credentials:**

   - Pobierz `firebase-credentials.json` z Firebase Console
   - Umieść w folderze `backend/`

4. **Database:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Create seats (opcjonalnie):**

   ```bash
   python manage.py shell
   ```

   ```python
   from api.models import Seat
   for row in range(1, 11):
       for seat in range(1, 13):
           Seat.objects.create(row_number=row, seat_number=seat)
   ```

6. **Run:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install:**

   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables:**

   ```bash
   cp .env.example .env
   # Wypełnij danymi z Firebase Console
   ```

3. **Firebase Service Worker:**

   ```bash
   cp public/firebase-messaging-sw.js.template public/firebase-messaging-sw.js
   # Edytuj firebase-messaging-sw.js i wklej dane Firebase
   ```

4. **Run:**

   ```bash
   # Development
   npm run dev

   # Production build + preview
   npm run build
   npm run preview
   ```

## 🔑 Firebase Setup

1. Utwórz projekt w [Firebase Console](https://console.firebase.google.com/)
2. Dodaj aplikację Web
3. Włącz **Cloud Messaging**
4. Pobierz:
   - Web app config → do `.env`
   - VAPID key → do `.env` jako `VITE_FIREBASE_VAPID_KEY`
   - Service account key → jako `firebase-credentials.json`

## 📁 Project Structure

```
.
├── backend/
│   ├── api/               # Django app
│   ├── backend/           # Settings
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── contexts/
    │   ├── firebase/
    │   └── utils/
    ├── .env.example
    └── package.json
```

## 🛠️ Tech Stack

**Frontend:**

- React 18 + Vite
- Tailwind CSS
- Firebase SDK
- Vite PWA Plugin

**Backend:**

- Django 5.0
- Django REST Framework
- SimpleJWT
- Firebase Admin SDK

## 👨‍💻 Author

TheBarr
