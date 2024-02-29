from models import PostModel
from pydantic import BaseModel


class ErrorDTO(BaseModel):
    code: int
    message: str


class GetPostResponse(BaseModel):
    status: int
    post: PostModel


class CreatePostResponse(BaseModel):
    status: int


class DeletePostResponse(BaseModel):
    status: int
