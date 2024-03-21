import time
from constants import SKILL_LEVEL
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

from utils import serialize


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
        self,
        user_id: str,
        title: str,
        description: str,
        max_people: int,
        skill_level: str,
        tags: list[str] = [],
    ) -> None:
        logger.info(
            "user_id={}, title={}, description={}, max_people={}, skill_level={}, tags={}",
            user_id,
            title,
            description,
            max_people,
            skill_level,
            tags,
        )

        timestamp = str(time.time())
        post_id = str(uuid.uuid4())

        new_post = {
            "id": {"S": post_id},
            "user_id": {"S": user_id},
            "title": {"S": title},
            "description": {"S": description},
            "skill_level": {"S": skill_level},
            "max_people": {"N": str(max_people)},
            "tags": {"L": [{"S": i} for i in tags]},
            "participant_ids": {"L": [{"S": user_id}]},
            "comments": {"L": []},
            "created_at": {"S": timestamp},
            "updated_at": {"S": timestamp},
        }

        self.put_item(DYNAMODB_POST_TABLE, new_post)

        user = self.get_user(user_id)
        user.current_rsvps.append(post_id)
        user.posts.append(new_post)
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

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

        removed_post = self.delete_item(DYNAMODB_POST_TABLE, get_post_key(post_id))

        post = to_post_model({"Item": removed_post["Attributes"]})

        logger.info(post)

        for id in post.participant_ids:
            user = self.get_user(id)
            user.current_rsvps.remove(post_id)
            self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

        user = self.get_user(post.user_id)
        user.posts = [i for i in user.posts if i["id"]["S"] != post.id]
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

        return removed_post

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
            "keywords": {"L": []},
            "current_rsvps": {"L": []},
            "posts": {"L": []},
            "comments": {"L": []},
            "skills": {"M": {}},
            "created_at": {"S": timestamp},
            "updated_at": {"S": timestamp},
        }

        self.put_item(DYNAMODB_USER_TABLE, new_user)

    def update_user_skills(
        self,
        email: str,
        skills: dict[str, SKILL_LEVEL],
    ) -> None:
        logger.info("email={}, skills={}", email, skills)

        user = self.get_user(email)
        user.skills = skills
        user.updated_at = str(time.time())
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

    def delete_user(self, id: str) -> dict:
        logger.info("id={}", id)

        try:
            self.get_user(id)
        except SummitDBException as e:
            e.message = "User does not exist"
            raise

        return self.delete_item(DYNAMODB_USER_TABLE, get_user_key(id))

    def new_rsvp(self, user_id: str, post_id: str) -> None:
        logger.info(
            "user_id={}, post_id={}",
            user_id,
            post_id,
        )

        post = self.get_post(post_id)

        if post.max_people <= len(post.participant_ids):
            raise SummitDBException(
                code=SummitDBExceptionCode.RSVP_IS_FULL,
                message="RSVP list is already full",
            )

        post.participant_ids.append(user_id)
        self.put_item(DYNAMODB_POST_TABLE, serialize(post.dict()))

        user = self.get_user(user_id)
        user.current_rsvps.append(post_id)
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

    def cancel_rsvp(self, user_id: str, post_id: str) -> None:
        logger.info(
            "user_id={}, post_id={}",
            user_id,
            post_id,
        )

        post = self.get_post(post_id)

        if user_id not in post.participant_ids:
            raise SummitDBException(
                code=SummitDBExceptionCode.DID_NOT_RSVP,
                message="You didn't RSVP to this event",
            )

        if user_id == post.user_id:
            raise SummitDBException(
                code=SummitDBExceptionCode.POST_OWNER,
                message="You can't cancel RSVP for your event. Try deleting the event",
            )

        post.participant_ids = [i for i in post.participant_ids if i != user_id]
        self.put_item(DYNAMODB_POST_TABLE, serialize(post.dict()))

        user = self.get_user(user_id)
        user.current_rsvps.remove(post_id)
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

    def create_comment(
        self,
        user_id: str,
        post_id: str,
        data: str,
    ) -> None:
        logger.info(
            "user_id={}, post_id={}, data={}",
            user_id,
            post_id,
            data,
        )

        post = self.get_post(post_id)

        timestamp = str(time.time())
        comment_id = str(uuid.uuid4())

        new_comment = {
            "id": comment_id,
            "user_id": user_id,
            "post_id": post_id,
            "data": data,
            "created_at": timestamp,
            "updated_at": timestamp,
        }

        post.comments.append(new_comment)
        self.put_item(DYNAMODB_POST_TABLE, serialize(post.dict()))

        user = self.get_user(user_id)
        user.comments.append(new_comment)
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))

    def remove_comment(
        self,
        user_id: str,
        post_id: str,
        comment_id: str,
    ) -> None:
        logger.info(
            "user_id={}, post_id={}, comment_id={}",
            user_id,
            post_id,
            comment_id,
        )

        post = self.get_post(post_id)
        logger.info(post.comments)
        post.comments = [i for i in post.comments if i["id"] != comment_id]
        self.put_item(DYNAMODB_POST_TABLE, serialize(post.dict()))

        user = self.get_user(user_id)
        user.comments = [i for i in user.comments if i["id"] != comment_id]
        self.put_item(DYNAMODB_USER_TABLE, serialize(user.dict()))
