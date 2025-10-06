from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=["username"]
    
    def __str__(self) -> str:
        return self.email
    
class Movie(models.Model):
    title = models.CharField(max_length=200, verbose_name="Tytuł")
    description = models.TextField(verbose_name="Opis")
    duration = models.IntegerField(verbose_name="Czas trwania (minuty)")
    image = models.ImageField(upload_to='movies/', null=True, blank=True, verbose_name="Plakat")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data dodania")

    class Meta:
        verbose_name = "Film"
        verbose_name_plural = "Filmy"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
class Seat(models.Model):
    row_number = models.IntegerField(verbose_name="Numer rzędu")
    seat_number = models.IntegerField(verbose_name="Numer miejsca")
    is_active = models.BooleanField(default=True, verbose_name="Aktywne miejsce")
    
    class Meta:
        verbose_name = "Miejsce"
        verbose_name_plural = "Miejsca"
        unique_together = ('row_number', 'seat_number')
        ordering = ['row_number', 'seat_number']
    
    def __str__(self):
        return f"Rząd {self.row_number}, Miejsce {self.seat_number}"
    
class Screening(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='screenings')
    start_time = models.DateTimeField(verbose_name="Godzina rozpoczęcia")
    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Cena biletu")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Seans"
        verbose_name_plural = "Seanse"
        ordering = ['start_time']
    
    def __str__(self):
        return f"{self.movie.title} - {self.start_time.strftime('%d.%m.%Y %H:%M')}"
    
    @property
    def available_seats(self):
        booked_seats = Booking.objects.filter(
            screening=self,
            status__in=['confirmed', 'paid']
        ).values_list('seat_id', flat=True)
        
        return Seat.objects.filter(is_active=True).exclude(id__in=booked_seats)
    
class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Oczekująca'),
        ('confirmed', 'Potwierdzona'),
        ('paid', 'Opłacona'),
        ('cancelled', 'Anulowana'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    screening = models.ForeignKey(Screening, on_delete=models.CASCADE, related_name='bookings')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booking_time = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=6, decimal_places=2)
    
    class Meta:
        verbose_name = "Rezerwacja"
        verbose_name_plural = "Rezerwacje"
        unique_together = ('screening', 'seat')
        ordering = ['-booking_time']
    
    def __str__(self):
        return f"{self.user.email} - {self.screening} - {self.seat}"
    
    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.screening.price
        super().save(*args, **kwargs)
