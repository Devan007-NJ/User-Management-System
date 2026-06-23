from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from core.db import db
from bson import ObjectId

class MongoUser:
    def __init__(self, user_doc):
        self.id = str(user_doc["_id"])
        self.pk = self.id
        self.email = user_doc["email"]
        self.role = user_doc.get("role", "user")
        self.is_authenticated = True

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")

        if user_id is None:
            raise AuthenticationFailed("Token contained no recognizable user identification.")

        try:
            user_doc = db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            raise AuthenticationFailed("Invalid user identifier in token.")

        if user_doc is None:
            raise AuthenticationFailed("User not found.")

        return MongoUser(user_doc)