from pydantic import BaseModel
from utils import deserialize


class UserModel(BaseModel):
    id: str
    name: str
    current_rsvps: list[str]
    interests: list[str]
    created_at: str
    updated_at: str


def to_user_model(response: dict) -> UserModel:
    item = deserialize(response["Item"])

    return UserModel(
        id=item.get("id", ""),
        name=item.get("name", ""),
        interests=item.get("interests", []),
        current_rsvps=item.get("current_rsvps", []),
        created_at=item.get("created_at", ""),
        updated_at=item.get("updated_at", ""),
    )


def get_user_key(user_id: str) -> dict:
    return {"id": {"S": user_id}}
