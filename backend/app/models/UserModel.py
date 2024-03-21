from pydantic import BaseModel
from constants import SKILL_LEVEL
from utils import deserialize


class UserModel(BaseModel):
    id: str
    name: str
    current_rsvps: list[str]
    posts: list[dict]
    comments: list[dict]
    keywords: list[str]
    skills: dict[str, SKILL_LEVEL]
    created_at: str
    updated_at: str


def to_user_model(response: dict) -> UserModel:
    item = deserialize(response["Item"])

    return UserModel(
        id=item.get("id", ""),
        name=item.get("name", ""),
        keywords=item.get("keywords", []),
        posts=item.get("posts", []),
        comments=item.get("comments", []),
        current_rsvps=item.get("current_rsvps", []),
        skills=item.get("skills", {}),
        created_at=item.get("created_at", ""),
        updated_at=item.get("updated_at", ""),
    )


def get_user_key(user_id: str) -> dict:
    return {"id": {"S": user_id}}
