"""Set of constants."""

import os

from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY = os.environ["AWS_ACCESS_KEY"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
AWS_REGION = os.environ["AWS_REGION"]

DYNAMODB_USER_TABLE = os.environ["DYNAMODB_USER_TABLE"]
