import datetime
import string

from flask import request
from flask_jwt_extended import create_refresh_token, create_access_token
from flask_restful import Resource

from app.models.role import RoleModel
from app.models.user import UserModel


class GoogleAuthorize(Resource):
    @classmethod
    def post(cls):
        code = 200
        resp = request.get_json()
        if resp is None or resp.get("access_token") is None:
            error_response = {
                "error": request.args["error"],
                "error_description": request.args["error_description"]
            }
            return error_response, 400

        email = resp.get("email")
        if email.split('@')[1] != 'e-point.pl':
            error_response = {
                "error": "domain_error",
                "error_description": "domain not allowed"
            }
            return error_response, 401

        user = UserModel.find_by_email(email)

        if not user:
            user = UserModel(email=email, image_uri=resp.get('image_uri'), nickname=email.split('@')[0],
                             domain=email.split('@')[1])
            if UserModel.find_by_nickname(user.nickname):
                import random
                user.nickname = user.nickname + '_' + ''.join(
                    random.choices(string.ascii_uppercase + string.digits, k=5))
            user_role = RoleModel.get_default()
            user.role = user_role
            code = 201
        elif user.image_uri == '':
            user.image_uri = resp.get('image_uri')
            code = 200

        user.save_to_db()

        valid_to = 3600
        access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(seconds=valid_to),
                                           fresh=True)
        refresh_token = create_refresh_token(identity=user.id)

        return {'access_token': access_token, 'refresh_token': refresh_token, 'expiration_date': f'{valid_to}'}, code
