from rest_framework import serializers
from core.db import db

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=5, write_only=True)

    def validate_email(self, value):
        existing_user = db.users.find_one({"email": value})
        if existing_user:
            raise serializers.ValidationError("A user with this email already exists.")
        return value
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)