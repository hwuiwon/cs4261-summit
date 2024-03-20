from pydantic import BaseModel
from utils import deserialize


class PostModel(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    tags: list[str]
    created_at: str
    updated_at: str


def to_post_model(response: dict, deserialized: bool = False) -> PostModel:
    item = response if deserialized else deserialize(response["Item"])

    return PostModel(
        id=item.get("id", ""),
        user_id=item.get("user_id", ""),
        title=item.get("title", ""),
        description=item.get("description", ""),
        tags=item.get("tags", []),
        created_at=item.get("created_at", ""),
        updated_at=item.get("updated_at", ""),
    )


def get_post_key(post_id: str) -> dict:
    return {"id": {"S": post_id}}
