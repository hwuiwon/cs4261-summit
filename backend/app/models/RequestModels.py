from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    id: str
    title: str
    description: str
    tags: str
