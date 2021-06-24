from marshmallow import fields, post_load

from app.ma import ma
from app.models.user import UserModel


class UserSchema(ma.Schema):
    id = fields.Integer(load_only=True)
    email = fields.Email(attribute="email")
    password = fields.String(load_only=True)
    image_uri = fields.String()
    nickname = fields.String()
    total_games = fields.Integer()
    total_wins = fields.Integer()
    total_lost = fields.Integer()
    points_earned = fields.Integer()
    points_lost = fields.Integer()
    balance = fields.Integer()
    rating = fields.Float()
    points = fields.Integer()
    experience = fields.Integer()

    class Meta:
        model = UserModel

    @post_load
    def make_user(self, data, **kwargs):
        return UserModel(**data)
