from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from datetime import datetime, timezone
from core.db import db
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from core.db import db
from .serializers import LoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.exceptions import TokenError


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        user_document = {
            "email": validated_data["email"],
            "password": make_password(validated_data["password"]),
            "created_at": datetime.now(timezone.utc),
            "role": "user",
        }
        result = db.users.insert_one(user_document)

        return Response(
            {
                "message": "User registered successfully.",
                "email": validated_data["email"],
                "id": str(result.inserted_id),
            },
            status=status.HTTP_201_CREATED,
        )

class MongoUser:
    def __init__(self, user_id):
        self.id = user_id
        self.pk = user_id

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = db.users.find_one({"email": email})

        if user is None or not check_password(password, user["password"]):
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        mongo_user = MongoUser(str(user["_id"]))
        refresh = RefreshToken.for_user(mongo_user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user["email"],
                "role": user.get("role", "user"),
            },
            status=status.HTTP_200_OK,
        )

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "email": request.user.email,
            },
            status=status.HTTP_200_OK,
        )

class TokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)
        except TokenError:
            return Response(
                {"error": "Invalid or expired refresh token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {"access": str(refresh.access_token)},
            status=status.HTTP_200_OK,
        )
