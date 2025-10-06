from django.contrib import admin
from .models import CustomUser, Movie, Seat, Screening, Booking
from .forms import CustomUserChangeForm, CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin


@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    
    list_display = ('email', 'username', 'is_staff')
    ordering = ('email',)
    search_fields = ('email', 'username')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Podstawowe informacje', {
            'fields': ('title', 'description', 'duration')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Metadane', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )   


@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'is_active']
    list_filter = ['row_number', 'is_active']
    ordering = ['row_number', 'seat_number']

@admin.register(Screening)
class ScreeningAdmin(admin.ModelAdmin):
    list_display = ['movie', 'start_time', 'price']
    list_filter = ['start_time', 'movie']
    search_fields = ['movie__title']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['user', 'screening', 'seat', 'status', 'booking_time']
    list_filter = ['status', 'booking_time']
    search_fields = ['user__email', 'screening__movie__title']