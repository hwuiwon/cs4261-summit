from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    post_id: str
    title: str
    description: str
    tags: str
