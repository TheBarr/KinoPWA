import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
import os

if not firebase_admin._apps:
    cred_path = os.path.join(settings.BASE_DIR, 'firebase-credentials.json')
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK zainicjalizowany")
    else:
        print("❌ Brak pliku firebase-credentials.json")

def send_notification_to_user(user, title, body, data=None):
    """
    Wyślij powiadomienie do użytkownika
    """
    from .models import FCMToken
    
    try:
        fcm_token_obj = FCMToken.objects.get(user=user)
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=fcm_token_obj.token,
        )
        
        response = messaging.send(message)
        print(f'✅ Powiadomienie wysłane do {user.email}: {response}')
        return True
        
    except FCMToken.DoesNotExist:
        print(f'⚠️  Brak tokena FCM dla {user.email}')
        return False
    except Exception as e:
        print(f'❌ Błąd wysyłania powiadomienia: {e}')

        if 'registration-token-not-registered' in str(e):
            try:
                FCMToken.objects.filter(user=user).delete()
                print(f'🗑️  Usunięto nieprawidłowy token dla {user.email}')
            except:
                pass
        return False

def send_booking_confirmation(booking):
    """
    Powiadomienie po rezerwacji
    """
    title = "🎬 Rezerwacja potwierdzona!"
    body = f"{booking.screening.movie.title} - {booking.screening.start_time.strftime('%d.%m %H:%M')}, Rząd {booking.seat.row_number} Miejsce {booking.seat.seat_number}"
    
    data = {
        'type': 'booking_confirmation',
        'booking_id': str(booking.id),
        'movie_id': str(booking.screening.movie.id)
    }
    
    return send_notification_to_user(booking.user, title, body, data)

def send_screening_reminder(booking):
    """
    Przypomnienie 1h przed seansem
    """
    title = "⏰ Seans już za godzinę!"
    body = f"{booking.screening.movie.title} - Rząd {booking.seat.row_number}, Miejsce {booking.seat.seat_number}"
    
    data = {
        'type': 'screening_reminder',
        'booking_id': str(booking.id),
    }
    
    return send_notification_to_user(booking.user, title, body, data)