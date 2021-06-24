import datetime

from flask import request, jsonify, make_response
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required, get_jwt,
)
from flask_restful import Resource
from sqlalchemy import and_

from app.libs.strings import gettext
from app.models.user import UserModel
from app.models.user_game import UserGameModel
from app.schemas.user import UserSchema

EMAIL_ALREADY_EXISTS = "User with that email already exists"
USER_CREATED_SUCCESSFULLY = "User created successfully"
USER_NOT_FOUND = "User not found"
USER_DELETED = "User deleted"
INVALID_CREDENTIALS = "Invalid credentials"
USER_LOGGED_OUT = "User logged out"

user_schema = UserSchema()
users_schema = UserSchema(many=True)


class UserRegister(Resource):
    @classmethod
    def post(cls):
        user = user_schema.load(request.get_json())

        if UserModel.find_by_email(user.email):
            return {"message": EMAIL_ALREADY_EXISTS}, 400
        user.save_to_db()
        return {"message": USER_CREATED_SUCCESSFULLY}, 201


class User(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)
        if not user:
            return {"messagge": USER_NOT_FOUND}, 404
        return user_schema.dump(user), 200

    @classmethod
    @jwt_required
    def delete(cls, user_id):
        user = UserModel.find_by_id(user_id)
        if not user:
            return {"messagge": USER_NOT_FOUND}, 404
        user.delete_from_db()
        return {"messagge": USER_DELETED}, 200


class Users(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        users = UserModel.find_all()
        return users_schema.dump(users), 200


class Opponents(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        users = UserModel.find_who_to_play(get_jwt_identity())
        player_schema = UserSchema(many=True, only=('nickname', 'image_uri'))
        return player_schema.dump(users), 200


class UserLogin(Resource):
    @classmethod
    def post(cls):
        user_json = request.get_json()
        user = UserModel.find_by_email(user_json['email'])

        if user and user.password and user.verify_password(user_json['password']):
            valid_to = 3600
            access_token = create_access_token(identity=user.id, expires_delta=datetime.timedelta(seconds=valid_to),
                                               fresh=True)
            refresh_token = create_refresh_token(identity=user.id)
            return {'access_token': access_token, 'refresh_token': refresh_token, 'expiration_date': valid_to}, 200
        return {"message": INVALID_CREDENTIALS}, 401


class UserLogout(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        jti = get_jwt()["jti"]  # tj "JWT ID"
        return {"message": USER_LOGGED_OUT}, 200


class TokenRefresh(Resource):
    @classmethod
    @jwt_required(fresh=True)
    def post(cls):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        return {"access_token": new_token}, 200


class SetPassword(Resource):
    @classmethod
    @jwt_required(fresh=True)
    def post(cls):
        current_user_id = get_jwt_identity()
        user_json = request.get_json()
        user_data = user_schema.load(user_json)
        user = UserModel.find_by_id(current_user_id)

        if not user:
            return {'message': gettext('user_not_found')}, 400
        if user_data.nickname and user.nickname != user_data.nickname:
            user.nickname = user_json['nickname']

        if user and user.password and user.verify_password(user_json['password']):
            return {'message': gettext('user_password_same')}, 403
        user.password = user_json['password']
        user.save_to_db()

        return {'message': gettext('user_password_updated')}, 201


class ChangeImageUri(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        current_user_id = get_jwt_identity()
        user_data = user_schema.load(request.get_json())
        user = UserModel.find_by_id(current_user_id)

        if not user:
            return {'message': gettext('user_not_found')}, 400

        if not user_data.image_uri:
            return {'message': 'No image url in body'}, 403
        user.image_uri = user_data.image_uri
        user.save_to_db()

        return {'message': gettext('user_image_updated')}, 200


class UserStats(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        current_user_id = get_jwt_identity()
        user = UserModel.find_by_id(current_user_id)
        if not user:
            return {"messagge": USER_NOT_FOUND}, 404

        gw_2_1 = len(UserGameModel.query.join(UserModel).filter(
            and_(UserGameModel.user_id == user.id, UserGameModel.rounds_win == 2,
                 UserGameModel.rounds_lost == 1)).all())
        gw_2_0 = len(UserGameModel.query.join(UserModel).filter(
            and_(UserGameModel.user_id == user.id, UserGameModel.rounds_win == 2,
                 UserGameModel.rounds_lost == 0)).all())
        gl_2_1 = len(UserGameModel.query.join(UserModel).filter(
            and_(UserGameModel.user_id == user.id, UserGameModel.rounds_win == 1,
                 UserGameModel.rounds_lost == 2)).all())
        gl_2_0 = len(UserGameModel.query.join(UserModel).filter(
            and_(UserGameModel.user_id == user.id, UserGameModel.rounds_win == 0,
                 UserGameModel.rounds_lost == 2)).all())
        total_win_lost_stat = {
            "wins": user.total_wins,
            "lost": user.total_lost,
            'total': user.total_games
        }
        game_round_win = {
            "2:1": gw_2_1,
            "2:0": gw_2_0,
            "total": gw_2_1 + gw_2_0
        }
        game_round_lost = {
            '1:2': gl_2_1,
            '0:2': gl_2_0,
            "total": gl_2_1 + gl_2_0
        }
        stat = []
        stat.append(total_win_lost_stat)
        stat.append(game_round_win)
        stat.append(game_round_lost)

        return make_response(jsonify(games=total_win_lost_stat, game_win=game_round_win, game_lost=game_round_lost),
                             200)
