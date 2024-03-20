import time
import boto3
from botocore.exceptions import ClientError
import uuid
from constants import (
    AWS_ACCESS_KEY,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    DYNAMODB_POST_TABLE,
    DYNAMODB_USER_TABLE,
)
from exceptions import SummitDBException, SummitDBExceptionCode
from loguru import logger
from models.PostModel import PostModel, get_post_key, to_post_model
from models.UserModel import UserModel, get_user_key, to_user_model


class DynamoDBService:
    """
    Handles all of the operations related to DynamoDB.
    https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html
    """

    def __init__(self):
        self.client = boto3.client(
            "dynamodb",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
        self.resource = boto3.resource(
            "dynamodb",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

    def put_item(self, table_name: str, item: dict) -> None:
        try:
            self.client.put_item(
                Item=item,
                TableName=table_name,
            )
        except ClientError as e:
            logger.error("table_name={}, item={}, error={}", table_name, item, str(e))
            raise SummitDBException(
                code=SummitDBExceptionCode.ITEM_PUT_ERROR,
                message="Could not append item to table",
            )

    def get_item(self, table_name: str, key: dict) -> dict:
        response = self.client.get_item(
            Key=key,
            TableName=table_name,
        )

        if "Item" not in response:
            raise SummitDBException(
                code=SummitDBExceptionCode.ITEM_DOES_NOT_EXIST,
                message="Item does not exist",
            )

        return response

    def scan_items(self, table_name: str) -> dict:
        table = self.resource.Table(table_name)

        response = table.scan()

        if "Items" not in response:
            raise SummitDBException(
                code=SummitDBExceptionCode.ITEM_DOES_NOT_EXIST,
                message="No items in table",
            )

        data = response["Items"]

        while "LastEvaluatedKey" in response:
            response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            data.extend(response["Items"])

        return data

    def delete_item(self, table_name: str, key: dict) -> dict:
        response = self.client.delete_item(
            TableName=table_name, Key=key, ReturnValues="ALL_OLD"
        )

        if "Attributes" not in response:
            raise SummitDBException(
                code=SummitDBExceptionCode.ITEM_DOES_NOT_EXIST,
                message="Item does not exist",
            )

        return response

    def create_post(
        self, user_id: str, title: str, description: str, tags: list[str] = []
    ) -> None:
        logger.info(
            "user_id={}, title={}, description={}, tags={}",
            user_id,
            title,
            description,
            tags,
        )

        timestamp = str(time.time())

        new_post = {
            "id": {"S": str(uuid.uuid4())},
            "user_id": {"S": user_id},
            "title": {"S": title},
            "description": {"S": description},
            "tags": {"L": [{"S": i} for i in tags]},
            "created_at": {"S": timestamp},
            "updated_at": {"S": timestamp},
        }

        self.put_item(DYNAMODB_POST_TABLE, new_post)

    def get_post(self, post_id: str) -> PostModel:
        logger.info("post_id={}", post_id)

        try:
            response = self.get_item(DYNAMODB_POST_TABLE, get_post_key(post_id))
            return to_post_model(response)
        except SummitDBException as e:
            e.message = "Could not get post"
            raise

    def get_all_posts(self) -> PostModel:
        try:
            response = self.scan_items(DYNAMODB_POST_TABLE)
            return response
        except SummitDBException as e:
            e.message = "Could not get all posts"
            raise

    def remove_post(self, post_id: str) -> dict:
        logger.info("post_id={}", post_id)

        return self.delete_item(DYNAMODB_POST_TABLE, get_post_key(post_id))

    def get_user(self, user_id: str) -> UserModel:
        logger.info("user_id={}", user_id)

        try:
            response = self.get_item(DYNAMODB_USER_TABLE, get_user_key(user_id))
            return to_user_model(response)
        except SummitDBException as e:
            e.message = "Could not get user"
            raise

    def create_user(self, email: str, name: str) -> None:
        logger.info(
            "email={}, name={}",
            email,
            name,
        )

        timestamp = str(time.time())
        new_user = {
            "id": {"S": email},
            "name": {"S": name},
            "interests": {"L": []},
            "created_at": {"S": timestamp},
            "updated_at": {"S": timestamp},
        }

        self.put_item(DYNAMODB_USER_TABLE, new_user)

    def delete_user(self, id: str) -> dict:
        logger.info("id={}", id)

        try:
            self.get_user(id)
        except SummitDBException as e:
            e.message = "User does not exist"
            raise

        return self.delete_item(DYNAMODB_USER_TABLE, get_user_key(id))
