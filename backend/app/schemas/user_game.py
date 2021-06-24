from marshmallow import fields, post_load

from app.ma import ma
from app.models.user_game import UserGameModel
from app.schemas.user import UserSchema


class UserGameSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    user = fields.Nested(UserSchema(only=('nickname', 'image_uri')))
    confirmed = fields.Boolean()
    winner = fields.Boolean()
    rounds_win = fields.Integer()
    rounds_lost = fields.Integer()

    @post_load
    def make_game(self, data, **kwargs):
        return UserGameModel(**data)

    class Meta:
        model = UserGameModel
        load_instance = True
        load_only = ()
        dump_only = ("id", "date_time")
