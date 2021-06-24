from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource

from app.models.ligue import LigueModel
from app.schemas.ligue import LigueSchema
from app.utils.ligue_utils import create_ligue

LIGUE_NOT_FOUND = "Ligue not found"
LIGUE_ALREADY_EXISTS = "Ligue with this name exists"
LIGUE_CREATED_SUCCESSFULLY = "Ligue create success!"

ligue_schema = LigueSchema()
ligues_schema = LigueSchema(many=True)


class Ligue(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        ligue_id = request.args.get("ligue_id")
        if not ligue_id:
            ligue = LigueModel.find_by_active()
            return ligue_schema.dump(ligue), 200
        else:
            ligue = LigueModel.find_by_id(ligue_id)
        return ligue_schema.dump(ligue), 200

    @classmethod
    @jwt_required
    def put(cls):
        ligue = ligue_schema.load(request.get_json())
        message, code = create_ligue(ligue)
        return {"message": message}, code


class LigueList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        ligues = LigueModel.select()
        if len(ligues) == 0:
            return {'message': LIGUE_NOT_FOUND}, 404

        return ligues_schema.dump(ligues), 200
