from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from bson import ObjectId
from core.db import db


def serialize_profile(user_doc):
    return {
        "id": str(user_doc["_id"]),
        "email": user_doc["email"],
        "created_at": user_doc.get("created_at"),
        "profile_image": user_doc.get("profile_image"),
    }


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = db.users.find_one({"_id": ObjectId(request.user.id)})
        if user is None:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_profile(user), status=status.HTTP_200_OK)

    def put(self, request):
        update_fields = {}
        if "email" in request.data:
            update_fields["email"] = request.data["email"]

        if not update_fields:
            return Response({"error": "Nothing to update."}, status=status.HTTP_400_BAD_REQUEST)

        db.users.update_one({"_id": ObjectId(request.user.id)}, {"$set": update_fields})
        user = db.users.find_one({"_id": ObjectId(request.user.id)})
        return Response(serialize_profile(user), status=status.HTTP_200_OK)


class ProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        save_path = f"profile_images/{request.user.id}_{image_file.name}"
        full_path = f"media/{save_path}"

        with open(full_path, "wb+") as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        image_url = f"/media/{save_path}"
        db.users.update_one({"_id": ObjectId(request.user.id)}, {"$set": {"profile_image": image_url}})

        return Response({"profile_image": image_url}, status=status.HTTP_200_OK)
# Create your views here.
