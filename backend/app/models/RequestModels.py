from pydantic import BaseModel


class CreatePostRequest(BaseModel):
    user_id: str
    title: str
    description: str
    tags: str
    max_people: int


class CreateUserRequest(BaseModel):
    email: str
    name: str


class RSVPRequest(BaseModel):
    post_id: str
    user_id: str
