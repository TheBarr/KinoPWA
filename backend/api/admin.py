from django.contrib import admin
from .models import CustomUser, Movie
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