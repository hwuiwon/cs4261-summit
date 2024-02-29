from pydantic import BaseModel
from utils import deserialize


class PostModel(BaseModel):
    id: str
    title: str
    description: str
    tags: list[str]


def to_post_model(response: dict, deserialized: bool = False) -> PostModel:
    item = response if deserialized else deserialize(response["Item"])

    return PostModel(
        id=item.get("id", ""),
        title=item.get("title", ""),
        description=item.get("description", ""),
        tags=item.get("tags", []),
    )


def get_post_key(post_id: str) -> dict:
    return {"id": {"S": post_id}}
