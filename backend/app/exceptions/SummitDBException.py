from enum import Enum

from .SummitException import SummitException


class SummitDBExceptionCode(Enum):
    ITEM_PUT_ERROR = 4001
    ITEM_UPDATE_ERROR = 4002
    ITEM_BATCH_GET_ERROR = 4003
    ITEM_BATCH_PUT_ERROR = 4004
    ITEM_BATCH_PROCESS_ERROR = 4005
    ITEM_DOES_NOT_EXIST = 4006
    USER_DOES_NOT_EXIST = 4007

    RSVP_IS_FULL = 4101
    DID_NOT_RSVP = 4102
    POST_OWNER = 4103

    NOT_ENOUGH_PERMISSION = 4201

    INVALID_ARGUMENT = 4501


class SummitDBException(SummitException):
    def __init__(self, code: SummitDBExceptionCode, message: str):
        self.code = code
        self.message = message

    def __str__(self):
        return f"FPADBException: [{self.code.value}] {self.code.name}: {self.message}"

    def __repr__(self):
        return f"FPADBException: [{self.code.value}] {self.code.name}: {self.message}"
