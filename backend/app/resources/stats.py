from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from app.models.ligue import LigueModel
from app.models.stats import StatsModel
from app.schemas.stats import StatsSchema

stats_schema = StatsSchema(many=True)


class Stats(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        ligue_name = request.args.get("ligue")
        if ligue_name:
            ligue = LigueModel.find_by_name(ligue_name)
        else:
            ligue = LigueModel.find_by_active()
        stats_list = StatsModel.query.filter(StatsModel.ligue == ligue).order_by(StatsModel.points.desc(),
                                                                                 StatsModel.balance.desc(),
                                                                                 StatsModel.total_wins)
        if not stats_list:
            return {"messagge": "No stats found"}, 404
        return stats_schema.dump(stats_list), 200
