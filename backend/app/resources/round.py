from flask_jwt_extended import jwt_required
from flask_restful import Resource

from app.models.round import RoundModel
from app.schemas.round import RoundSchema

ROUND_NOT_FOUND = "Round not found"

round_schema = RoundSchema()


class Round(Resource):
    @classmethod
    @jwt_required
    def get(cls, round_id: int):
        round = RoundModel.find_by_id(round_id)
        if not round:
            return {"messagge": ROUND_NOT_FOUND}, 404
        return round_schema.dump(round), 200
