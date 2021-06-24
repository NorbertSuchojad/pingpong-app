from marshmallow import fields, post_load

from app.ma import ma
from app.models.ligue import LigueModel


class LigueSchema(ma.Schema):
    name = fields.String()
    active = fields.Boolean()

    @post_load
    def make_ligue(self, data, **kwargs):
        return LigueModel(**data)

    class Meta:
        model = LigueModel
