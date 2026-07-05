import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
import os

<<<<<<< HEAD
# Inicjalizacja Firebase Admin SDK (tylko raz)
=======
>>>>>>> 32da2c3bc94f701fad1d7cf9c4054d323c7913f1
if not firebase_admin._apps:
    cred_path = os.path.join(settings.BASE_DIR, 'firebase-credentials.json')
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
<<<<<<< HEAD
        print("Firebase Admin SDK zainicjalizowany")
    else:
        print("Brak pliku firebase-credentials.json")
=======
        print("✅ Firebase Admin SDK zainicjalizowany")
    else:
        print("❌ Brak pliku firebase-credentials.json")
>>>>>>> 32da2c3bc94f701fad1d7cf9c4054d323c7913f1

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
<<<<<<< HEAD
        print(f'Powiadomienie wysłane do {user.email}: {response}')
        return True
        
    except FCMToken.DoesNotExist:
        print(f'Brak tokena FCM dla {user.email}')
        return False
    except Exception as e:
        print(f'Błąd wysyłania powiadomienia: {e}')
        # Jeśli token nieprawidłowy, usuń go
        if 'registration-token-not-registered' in str(e):
            try:
                FCMToken.objects.filter(user=user).delete()
                print(f'Usunięto nieprawidłowy token dla {user.email}')
=======
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
>>>>>>> 32da2c3bc94f701fad1d7cf9c4054d323c7913f1
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
<<<<<<< HEAD
    title = "Seans już za godzinę!"
=======
    title = "⏰ Seans już za godzinę!"
>>>>>>> 32da2c3bc94f701fad1d7cf9c4054d323c7913f1
    body = f"{booking.screening.movie.title} - Rząd {booking.seat.row_number}, Miejsce {booking.seat.seat_number}"
    
    data = {
        'type': 'screening_reminder',
        'booking_id': str(booking.id),
    }
    
    return send_notification_to_user(booking.user, title, body, data)