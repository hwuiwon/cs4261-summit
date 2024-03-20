from http import HTTPStatus

from exceptions import SummitDBException, SummitException, SummitExceptionCode
from fastapi import APIRouter
from loguru import logger
from models.RequestModels import RSVPRequest
from models.ResponseModels import (
    NewRSVPResponse,
    DeletePostResponse,
    ErrorDTO,
)
from services import DynamoDBService

router = APIRouter()
dynamodb_service = DynamoDBService()

"""
| Endpoint                       | Description                          | Method |
|--------------------------------|--------------------------------------|--------|
| `/rsvp`                        | RSVP to an event                     | POST   |
| `/rsvp/{post_id}`              | Cancel RSVP                          | DELETE |
"""


@router.post(
    "/rsvp",
    summary="RSVP to an event",
    tags=["RSVP"],
    response_model=NewRSVPResponse,
    responses={
        200: {"model": NewRSVPResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def new_rsvp(rsvp_request: RSVPRequest):
    if not rsvp_request.post_id or not rsvp_request.user_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="User ID and post ID is required",
        )

    logger.info("rsvp_request={}", rsvp_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.new_rsvp(
            user_id=rsvp_request.user_id,
            post_id=rsvp_request.post_id,
        )
    except SummitDBException as e:
        logger.error("rsvp_request={}, error={}", rsvp_request, e)
        raise

    return NewRSVPResponse(status=HTTPStatus.OK.value)


@router.delete(
    "/rsvp",
    summary="Cancel RSVP",
    tags=["RSVP"],
    response_model=DeletePostResponse,
    responses={
        200: {"model": DeletePostResponse, "description": "OK"},
        400: {"model": ErrorDTO, "message": "Error: Bad request"},
    },
)
async def cancel_rsvp(rsvp_request: RSVPRequest):
    if not rsvp_request.post_id or not rsvp_request.user_id:
        raise SummitException(
            code=SummitExceptionCode.BAD_REQUEST,
            message="User ID and post ID is required",
        )

    logger.info("rsvp_request={}", rsvp_request)

    dynamodb_service = DynamoDBService()

    try:
        dynamodb_service.cancel_rsvp(
            user_id=rsvp_request.user_id, post_id=rsvp_request.post_id
        )
    except SummitDBException as e:
        logger.error("rsvp_request={}, error={}", rsvp_request, e)
        raise

    return DeletePostResponse(status=HTTPStatus.OK.value)
