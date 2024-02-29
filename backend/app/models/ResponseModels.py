from pydantic import BaseModel


class ErrorDTO(BaseModel):
    code: int
    message: str


class GetPostResponse(BaseModel):
    status: int
    post: dict
