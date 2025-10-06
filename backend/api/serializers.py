from .models import CustomUser, Movie, Screening, Seat, Booking
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match!")

        password = attrs.get("password1", "")
        if len(password) < 8:
            raise serializers.ValidationError(
                "Passwords must be at least 8 characters!")

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")

        return CustomUser.objects.create_user(password=password, **validated_data)

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials!")    
    
class MovieSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'duration', 'image', 'created_at']
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            else:
                return obj.image.url
        return None
    
#-------------------------------------------------------------------------- miejsca

class SeatSerializer(serializers.ModelSerializer):
    is_booked = serializers.SerializerMethodField()
    
    class Meta:
        model = Seat
        fields = ['id', 'row_number', 'seat_number', 'is_active', 'is_booked']
    
    def get_is_booked(self, obj):
        screening_id = self.context.get('screening_id')
        if screening_id:
            return Booking.objects.filter(
                screening_id=screening_id,
                seat=obj,
                status__in=['confirmed', 'paid']
            ).exists()
        return False

class ScreeningSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    available_seats_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Screening
        fields = ['id', 'movie', 'start_time', 'price', 'available_seats_count']
    
    def get_available_seats_count(self, obj):
        return obj.available_seats.count()

class BookingSerializer(serializers.ModelSerializer):
    seat = SeatSerializer(read_only=True)
    screening = ScreeningSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'user', 'screening', 'seat', 'status', 'booking_time', 'total_price']

class CreateBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['screening', 'seat']
    
    def validate(self, data):
        screening = data['screening']
        seat = data['seat']
        
        if Booking.objects.filter(
            screening=screening, 
            seat=seat, 
            status__in=['confirmed', 'paid']
        ).exists():
            raise serializers.ValidationError("To miejsce jest już zajęte")
        
        return data
    
    def create(self, validated_data):
        user = self.context['request'].user
        booking = Booking.objects.create(
            user=user,
            status='confirmed',  
            **validated_data
        )
        return booking