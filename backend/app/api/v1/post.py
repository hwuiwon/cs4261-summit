from http import HTTPStatus

from exceptions import SummitException, SummitExceptionCode
from fastapi import APIRouter
from models.ResponseModels import ErrorDTO, GetPostResponse

router = APIRouter()


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

    return GetPostResponse(
        status=HTTPStatus.OK.value, post={"title": "Test title", "body": "Test body"}
    )
