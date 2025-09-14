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
    image = models.ImageField(upload_to='media/movies/', null=True, blank=True, verbose_name="Plakat")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data dodania")

    class Meta:
        verbose_name = "Film"
        verbose_name_plural = "Filmy"
        ordering = ['-created_at']

    def __str__(self):
        return self.title