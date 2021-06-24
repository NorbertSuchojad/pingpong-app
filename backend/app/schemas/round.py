from marshmallow import fields, post_load

from app.ma import ma
from app.models.round import RoundModel
from app.schemas.user_round import UserRoundSchema


class RoundSchema(ma.Schema):
    round_no = fields.Integer()
    user_rounds = fields.Nested(UserRoundSchema(many=True))

    @post_load
    def make_round(self, data, **kwargs):
        return RoundModel(**data)

    class Meta:
        # fields = ('player_one_score', 'player_two_score', 'round_no')
        model = RoundModel
        # load_instance = True
        # load_only = ("id",)
        # dump_only = ()
