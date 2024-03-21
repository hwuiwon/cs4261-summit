from pydantic import BaseModel
from constants import SKILL_LEVEL
from utils import deserialize


class PostModel(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    max_people: int
    tags: list[str]
    skill_level: SKILL_LEVEL
    participant_ids: list[str]
    comments: list[dict]
    created_at: str
    updated_at: str


def to_post_model(response: dict, deserialized: bool = False) -> PostModel:
    item = response if deserialized else deserialize(response["Item"])

    return PostModel(
        id=item.get("id", ""),
        user_id=item.get("user_id", ""),
        title=item.get("title", ""),
        description=item.get("description", ""),
        skill_level=item.get("skill_level", "Undefined"),
        max_people=item.get("max_people", 0),
        tags=item.get("tags", []),
        comments=item.get("comments", []),
        participant_ids=item.get("participant_ids", []),
        created_at=item.get("created_at", ""),
        updated_at=item.get("updated_at", ""),
    )


def get_post_key(post_id: str) -> dict:
    return {"id": {"S": post_id}}
