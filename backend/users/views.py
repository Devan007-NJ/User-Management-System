from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from bson import ObjectId
from bson.errors import InvalidId
from django.contrib.auth.hashers import make_password
from datetime import datetime, timezone
from core.db import db
from rest_framework.permissions import BasePermission

def serialize_user(user_doc):
    return {
        "id": str(user_doc["_id"]),
        "email": user_doc["email"],
        "created_at": user_doc.get("created_at"),
        "role": user_doc.get("role", "user"),
    }


class UserViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        users = db.users.find()
        data = [serialize_user(u) for u in users]
        return Response(data, status=status.HTTP_200_OK)

    def create(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if db.users.find_one({"email": email}):
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user_doc = {
            "email": email,
            "password": make_password(password),
            "created_at": datetime.now(timezone.utc),
        }
        result = db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

        return Response(serialize_user(user_doc), status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        try:
            user = db.users.find_one({"_id": ObjectId(pk)})
        except InvalidId:
            return Response({"error": "Invalid user id."}, status=status.HTTP_400_BAD_REQUEST)

        if user is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serialize_user(user), status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        try:
            object_id = ObjectId(pk)
        except InvalidId:
            return Response({"error": "Invalid user id."}, status=status.HTTP_400_BAD_REQUEST)

        update_fields = {}
        if "email" in request.data:
            update_fields["email"] = request.data["email"]
        if "password" in request.data:
            update_fields["password"] = make_password(request.data["password"])

        if not update_fields:
            return Response({"error": "Nothing to update."}, status=status.HTTP_400_BAD_REQUEST)

        result = db.users.update_one({"_id": object_id}, {"$set": update_fields})
        if result.matched_count == 0:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user = db.users.find_one({"_id": object_id})
        return Response(serialize_user(user), status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        try:
            object_id = ObjectId(pk)
        except InvalidId:
            return Response({"error": "Invalid user id."}, status=status.HTTP_400_BAD_REQUEST)

        result = db.users.delete_one({"_id": object_id})
        if result.deleted_count == 0:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, 'role', None) == 'admin'