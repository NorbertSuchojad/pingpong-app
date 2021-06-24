from marshmallow import fields, post_load

from app.ma import ma
from app.models.stats import StatsModel
from app.schemas.user import UserSchema


class StatsSchema(ma.Schema):
    id = fields.Integer(load_only=True)
    user = fields.Nested(UserSchema(only=('nickname', 'image_uri')))

    total_games = fields.Integer()
    total_wins = fields.Integer()
    total_lost = fields.Integer()
    sets_win = fields.Integer()
    sets_lost = fields.Integer()
    points_earned = fields.Integer()
    points_lost = fields.Integer()
    balance = fields.Integer()
    rating = fields.Float()
    points = fields.Integer()

    class Meta:
        model = StatsModel

    @post_load
    def make_stats(self, data, **kwargs):
        return StatsModel(**data)
