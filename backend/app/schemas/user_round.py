from marshmallow import fields, post_load

from app.ma import ma
from app.models.user_round import UserRoundModel
from app.schemas.user import UserSchema


class UserRoundSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    # game_date = fields.Pluck(GameSchema, field_name="date_time")
    # rounds = fields.Nested(RoundSchema(many=True))
    user = fields.Nested(UserSchema(only=('nickname', 'image_uri')))
    points_earned = fields.Integer()
    points_lost = fields.Integer()
    winner = fields.Boolean()

    @post_load
    def make_game(self, data, **kwargs):
        return UserRoundModel(**data)

    class Meta:
        model = UserRoundModel
        load_instance = True
        load_only = ()
        dump_only = ("id", "date_time")
