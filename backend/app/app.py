import os
import traceback

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from marshmallow import ValidationError

from app.resources.stats import Stats

load_dotenv(".env")  # need to be here
from app.db import db, metadata, engine

from app.resources.game import Game, GameList, GameRoundList, AddGame
from app.resources.ligue import Ligue, LigueList
from app.resources.round import Round

from app.resources.google_login import GoogleAuthorize
from app.resources.user import UserRegister, User, UserLogin, SetPassword, Users, Opponents, ChangeImageUri, UserStats


def create_app():
    flask_app = Flask(__name__)
    CORS(flask_app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    flask_app.config["DEBUG"] = False
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI')
    flask_app.config["PROPAGATE_EXCEPTIONS"] = True
    flask_app.config["SECURITY_PASSWORD_HASH"] = 'bcrypt'
    flask_app.config["SECURITY_CSRF_PROTECT_MECHANISMS"] = ["token"]
    flask_app.config["SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS"] = True
    flask_app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
    flask_app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT",
                                                                '146585145368132386173505678016728509634')
    admin_email = os.environ.get("ADMIN_EMAIL")
    admin_pass = os.environ.get("ADMIN_PASS")

    flask_app.secret_key = os.environ.get("JWT_SECRET_KEY")
    flask_app.config['JWT_SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
    api = Api(flask_app)
    jwt = JWTManager(flask_app)
    db.init_app(flask_app)

    # tables = {
    #     'ligue': LigueModel,
    #     'games': GameModel,
    #     'role': RoleModel,
    #     'rounds': RoundModel,
    #     'user_games': UserGameModel,
    #     'user_rounds': UserRoundModel,
    #     'users': UserModel,
    #     'stats': StatsModel
    # }

    @flask_app.before_first_request
    def create_tables():
        with flask_app.app_context():
            try:
                metadata.create_all(engine)
                # db.create_all(app=flask_app)

                db.session.commit()
                # if not LigueModel.find_by_active():
                #     LigueModel.create(active=True, name='First ligue')
                # if len(RoleModel.get_all()) == 0:
                #     role_admnin = RoleModel.create(name='ADMIN', description='admin role')
                #     RoleModel.create(name='USER', description='user role', basic_role=True)
                # if len(UserModel.find_admins()) == 0:
                #     role_admnin = RoleModel.select().where(RoleModel.name == 'ADMIN')
                #     UserModel.create(email=admin_email, domain=admin_email.split('@')[1],
                #                      nickname=admin_email.split('@')[0],
                #                      password=admin_pass, role=role_admnin)
            except:
                traceback.print_exc()

    @flask_app.errorhandler(ValidationError)
    def handle_marshmallow_validation(err):
        return jsonify(err.messages), 400

    api.add_resource(UserRegister, "/api/v1/register")
    api.add_resource(User, "/api/v1/user")
    api.add_resource(UserStats, "/api/v1/user/stats")
    api.add_resource(Users, "/api/v1/users")
    api.add_resource(Opponents, "/api/v1/opponents")
    api.add_resource(UserLogin, "/api/v1/login")
    api.add_resource(SetPassword, "/api/v1/user/password")
    api.add_resource(ChangeImageUri, "/api/v1/user/image")
    api.add_resource(GoogleAuthorize, "/api/v1/oauth2/callback/google", endpoint="google.authorize")
    api.add_resource(GameList, "/api/v1/games")
    api.add_resource(Game, "/api/v1/game/<int:game_id>")
    api.add_resource(AddGame, "/api/v1/game")
    api.add_resource(GameRoundList, "/api/v1/game/<int:game_id>/rounds")
    api.add_resource(Ligue, "/api/v1/ligue")
    api.add_resource(LigueList, "/api/v1/ligues")
    api.add_resource(Stats, "/api/v1/ligue/stats")
    api.add_resource(Round, "/api/v1/round")

    return flask_app


app = create_app()

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=8080, threaded=True)
