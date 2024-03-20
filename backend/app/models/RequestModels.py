from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    user_id: str
    title: str
    description: str
    tags: str


class CreateUserRequest(BaseModel):
    email: str
    name: str
