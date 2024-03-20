from http import HTTPStatus

from exceptions import SummitDBException, SummitException, SummitExceptionCode
from fastapi import APIRouter
from loguru import logger
from models.RequestModels import CreateUserRequest, UpdateUserSkillRequest
from models.ResponseModels import (
    CreateUserResponse,
    DeleteUserResponse,
    ErrorDTO,
    GetUserResponse,
    UpdateUserSkillResponse,
)
from services import DynamoDBService

router = APIRouter()
dynamodb_service = DynamoDBService()

"""
| Endpoint                       | Description                          | Method |
|--------------------------------|--------------------------------------|--------|
| `/user`                        | Register a new user                  | POST   |
| `/user/{user_id}`              | Retrieve a user's details            | GET    |
| `/user/{user_id}`              | Delete a user's account              | DELETE |
| `/user`                        | Edit user's skills                   | PATCH  |
"""


@router.get(
    "/user/{user_id}",
    summary="Retrieve user details",
    tags=["User"],
    response_model=GetUserResponse,
    responses={
        200: {"model": GetUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def get_user(user_id: str):
    if not user_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST, message="user id is required"
        )

    logger.info("user_id={}", user_id)

    try:
        user = dynamodb_service.get_user(user_id)
    except SummitDBException as e:
        logger.error("user_id={}, error={}", user_id, e)
        raise

    return GetUserResponse(status=HTTPStatus.OK.value, user=user)


@router.post(
    "/user",
    summary="Create a new user",
    tags=["User"],
    response_model=CreateUserResponse,
    responses={
        200: {"model": CreateUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def create_user(create_request: CreateUserRequest):
    if not create_request.email or not create_request.name:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="ID, email, and name is required",
        )

    logger.info("create_request={}", create_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.create_user(
            email=create_request.email,
            name=create_request.name,
        )
    except SummitDBException as e:
        logger.error("create_request={}, error={}", create_request, e)
        raise

    return CreateUserResponse(status=HTTPStatus.OK.value)


@router.patch(
    "/user",
    summary="Update user skills",
    tags=["User"],
    response_model=UpdateUserSkillResponse,
    responses={
        200: {"model": UpdateUserSkillResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def update_user_skills(update_request: UpdateUserSkillRequest):
    if not update_request.user_id or not update_request.skills:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="ID and skills are required",
        )

    logger.info("update_request={}", update_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.update_user_skills(
            email=update_request.user_id, skills=update_request.skills
        )
    except SummitDBException as e:
        logger.error("update_request={}, error={}", update_request, e)
        raise

    return UpdateUserSkillResponse(status=HTTPStatus.OK.value)


@router.delete(
    "/user/{user_id}",
    summary="Delete a user",
    tags=["User"],
    response_model=DeleteUserResponse,
    responses={
        200: {"model": DeleteUserResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def delete_user(user_id: str):
    if not user_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="user ID is required",
        )

    logger.info("user_id={}", user_id)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.delete_user(id=user_id)
    except SummitDBException as e:
        logger.error("user_id={}, error={}", user_id, e)
        raise

    return DeleteUserResponse(status=HTTPStatus.OK.value)
