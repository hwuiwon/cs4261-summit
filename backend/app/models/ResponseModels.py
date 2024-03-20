from models import PostModel, UserModel
from pydantic import BaseModel


class ErrorDTO(BaseModel):
    code: int
    message: str


class GetPostResponse(BaseModel):
    status: int
    post: PostModel


class GetAllPostsResponse(BaseModel):
    status: int
    posts: list[PostModel]


class CreatePostResponse(BaseModel):
    status: int


class DeletePostResponse(BaseModel):
    status: int


class GetUserResponse(BaseModel):
    status: int
    user: UserModel


class CreateUserResponse(BaseModel):
    status: int


class DeleteUserResponse(BaseModel):
    status: int
