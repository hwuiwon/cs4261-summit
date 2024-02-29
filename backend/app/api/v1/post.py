from http import HTTPStatus

from exceptions import SummitDBException, SummitException, SummitExceptionCode
from fastapi import APIRouter
from loguru import logger
from models.RequestModels import CreatePostRequest
from models.ResponseModels import (
    CreatePostResponse,
    DeletePostResponse,
    ErrorDTO,
    GetPostResponse,
)
from services import DynamoDBService

router = APIRouter()
dynamodb_service = DynamoDBService()


@router.get(
    "/post/{post_id}",
    summary="Retrieve post details",
    tags=["Post"],
    response_model=GetPostResponse,
    responses={
        200: {"model": GetPostResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def get_post(post_id: str):
    if not post_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST, message="Post id is required"
        )

    logger.info("post_id={}", post_id)

    try:
        post = dynamodb_service.get_post(post_id)
    except SummitDBException as e:
        logger.error("post_id={}, error={}", post_id, e)
        raise

    return GetPostResponse(status=HTTPStatus.OK.value, post=post)


@router.post(
    "/post",
    summary="Create a new post",
    tags=["Post"],
    response_model=CreatePostResponse,
    responses={
        200: {"model": CreatePostResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def create_post(create_request: CreatePostRequest):
    if (
        not create_request.post_id
        or not create_request.title
        or not create_request.description
    ):
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="ID, title, or description is required",
        )

    logger.info("create_request={}", create_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.create_post(
            post_id=create_request.post_id,
            title=create_request.title,
            description=create_request.description,
            tags=create_request.tags.split(","),
        )
    except SummitDBException as e:
        logger.error("create_request={}, error={}", create_request, e)
        raise

    return CreatePostResponse(status=HTTPStatus.OK.value)


@router.delete(
    "/post/{post_id}",
    summary="Delete a post",
    tags=["Post"],
    response_model=DeletePostResponse,
    responses={
        200: {"model": DeletePostResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def delete_post(post_id: str):
    if not post_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="Post ID is required",
        )

    logger.info("post_id={}", post_id)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.remove_post(post_id=post_id)
    except SummitDBException as e:
        logger.error("post_id={}, error={}", post_id, e)
        raise

    return DeletePostResponse(status=HTTPStatus.OK.value)
