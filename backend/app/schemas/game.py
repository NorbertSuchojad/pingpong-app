from marshmallow import fields, post_load

from app.ma import ma
from app.models.game import GameModel
from app.schemas.round import RoundSchema
from app.schemas.user_game import UserGameSchema


class GameSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    date_time = fields.DateTime()  # '%H:%M %Y-%m-%d')
    rounds = fields.Nested(RoundSchema(many=True))
    players = fields.Nested(UserGameSchema(many=True), attribute='user_games')

    @post_load
    def make_game(self, data, **kwargs):
        return GameModel(**data)

    class Meta:
        model = GameModel
        load_instance = True
        load_only = ()
        dump_only = ("id", "date_time")
