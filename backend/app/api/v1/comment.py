from http import HTTPStatus

from exceptions import SummitDBException, SummitException, SummitExceptionCode
from fastapi import APIRouter
from loguru import logger
from models.RequestModels import CreateCommentRequest, DeleteCommentRequest
from models.ResponseModels import (
    CreateCommentResponse,
    DeleteCommentResponse,
    ErrorDTO,
)
from services import DynamoDBService

router = APIRouter()
dynamodb_service = DynamoDBService()

"""
| Endpoint                       | Description                          | Method |
|--------------------------------|--------------------------------------|--------|
| `/comment`                     | Create a new comment                 | POST   |
| `/comment`                     | Delete a comment                     | DELETE |
"""


@router.post(
    "/comment",
    summary="Create a new comment",
    tags=["Comment"],
    response_model=CreateCommentResponse,
    responses={
        200: {"model": CreateCommentResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def create_comment(create_request: CreateCommentRequest):
    if (
        not create_request.user_id
        or not create_request.post_id
        or not create_request.data
    ):
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="User ID, post ID, and data are required",
        )

    logger.info("create_request={}", create_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.create_comment(
            user_id=create_request.user_id,
            post_id=create_request.post_id,
            data=create_request.data,
        )
    except SummitDBException as e:
        logger.error("create_request={}, error={}", create_request, e)
        raise

    return CreateCommentResponse(status=HTTPStatus.OK.value)


@router.delete(
    "/comment",
    summary="Delete a comment",
    tags=["Comment"],
    response_model=DeleteCommentResponse,
    responses={
        200: {"model": DeleteCommentResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def delete_comment(delete_request: DeleteCommentRequest):
    if (
        not delete_request.user_id
        or not delete_request.post_id
        or not delete_request.comment_id
    ):
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="User ID, Post ID, and Comment ID is required",
        )

    logger.info("delete_request={}", delete_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.remove_comment(
            user_id=delete_request.user_id,
            post_id=delete_request.post_id,
            comment_id=delete_request.comment_id,
        )
    except SummitDBException as e:
        logger.error("delete_request={}, error={}", delete_request, e)
        raise

    return DeleteCommentResponse(status=HTTPStatus.OK.value)
