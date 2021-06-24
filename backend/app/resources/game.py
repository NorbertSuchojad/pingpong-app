from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from sqlalchemy import and_

from app.models.game import GameModel
from app.models.ligue import LigueModel
from app.models.round import RoundModel
from app.models.user import UserModel
from app.models.user_game import UserGameModel
from app.schemas.game import GameSchema
from app.schemas.round import RoundSchema
from app.schemas.user_game import UserGameSchema
from app.utils import add_new_game, confirm_game, confirm_games

GAME_NOT_FOUND = "Game not found"
NO_GAMES_FOUND = "No games found"

game_schema = GameSchema()
games_schema = GameSchema(many=True)
rounds_schema = RoundSchema(many=True)
user_games_schema = UserGameSchema(many=True)


class Game(Resource):
    @classmethod
    @jwt_required
    def get(cls, game_id: int):
        game = GameModel.find_by_id(game_id)
        if not game:
            return {"messagge": GAME_NOT_FOUND}, 404
        return game_schema.dump(game), 200

    @classmethod
    @jwt_required
    def post(cls, game_id: int):
        player_approve = request.args['player_approve']
        game = GameModel.find_by_id(game_id)
        if not game:
            return {"messagge": GAME_NOT_FOUND}, 404
        setattr(game, player_approve, True)
        if game.player_one_approve and game.player_two_approve:
            confirm_game(game)
        else:
            game.save_to_db()
        return 'ok', 200


class AddGame(Resource):
    @classmethod
    @jwt_required
    def post(cls):
        user_id = get_jwt_identity()
        game_from_request = game_schema.load(request.get_json())
        errors, new_game = add_new_game(game_from_request, user_id)
        if errors:
            return "fail", 500

        return "ok", 201


class GameList(Resource):
    @classmethod
    @jwt_required
    def get(cls):
        ligue_name = request.args.get("ligue")
        all_games = request.args.get('all') == 'true'
        user_games = request.args.get('user') == 'true'
        ligue_games = request.args.get('ligue_games') == 'true'
        remaining = request.args.get('remaining') == 'true'
        user_id = get_jwt_identity()
        if ligue_name:
            ligue = LigueModel.find_by_name(ligue_name)
            if user_games:
                current_user = UserModel.get_by_id(get_jwt_identity())
                games = GameModel.select().join(UserGameModel).where(
                    (GameModel.ligue == ligue) & (UserGameModel.user == current_user)).order_by(GameModel.date_time)
                pass
            else:
                games = GameModel.query.filter((GameModel.ligue == ligue)).order_by(GameModel.date_time).all()
            if not games:
                return {"messagge": NO_GAMES_FOUND}, 200
            return games_schema.dump(games), 200

        if all_games:
            if ligue_games:
                games = GameModel.query.filter(GameModel.ligue == LigueModel.find_by_active()).order_by(
                    GameModel.date_time).all()
            else:
                games = GameModel.query.order_by(GameModel.date_time).all()
        elif remaining:
            return {"messagge": 'Not implemented'}, 200
        elif user_games or ligue_games:
            if user_games and ligue_games:
                games = GameModel.query.filter(
                    and_(UserModel.id == user_id, GameModel.ligue == LigueModel.find_by_active())).order_by(
                    GameModel.date_time).all()
            elif user_games:
                games = GameModel.query.filter(UserModel.id == user_id).order_by(GameModel.date_time).all()
            else:
                games = GameModel.query.filter(GameModel.ligue == LigueModel.find_by_active()).order_by(
                    GameModel.date_time).all()
        else:
            games = GameModel.query.order_by(GameModel.date_time).first()

        if not games:
            return {"messagge": NO_GAMES_FOUND}, 200
        return games_schema.dump(games), 200

    @classmethod
    @jwt_required
    def post(cls):
        user_id = get_jwt_identity()
        json = request.get_json()
        games_updated_before, opponent_must_confirm, games_confirmed = confirm_games(json['game_ids'], user_id)
        return {
                   "games_already_updated": games_updated_before,
                   "games_opponent_must_confirm": opponent_must_confirm,
                   "games_confirmed": games_confirmed
               }, 200


class GameRoundList(Resource):
    @classmethod
    @jwt_required
    def get(cls, game_id: int):
        rounds = RoundModel.find_all_by_game(game_id)
        return rounds_schema.dump(rounds), 200
