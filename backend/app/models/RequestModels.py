from pydantic import BaseModel
from constants import SKILL_LEVEL


class CreatePostRequest(BaseModel):
    user_id: str
    title: str
    description: str
    tags: str
    max_people: int
    skill_level: SKILL_LEVEL


class CreateUserRequest(BaseModel):
    email: str
    name: str


class RSVPRequest(BaseModel):
    post_id: str
    user_id: str


class UpdateUserSkillRequest(BaseModel):
    user_id: str
    skills: dict[str, SKILL_LEVEL]


class CreateCommentRequest(BaseModel):
    user_id: str
    post_id: str
    data: str


class DeleteCommentRequest(BaseModel):
    user_id: str
    post_id: str
    comment_id: str
