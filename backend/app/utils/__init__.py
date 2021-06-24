import copy
from typing import Union, Tuple

from app.db import db
from app.models.game import GameModel
from app.models.ligue import LigueModel
from app.models.round import RoundModel
from app.models.stats import StatsModel
from app.models.user import UserModel
from app.models.user_game import UserGameModel
from app.models.user_round import UserRoundModel


def add_new_game(game: GameModel, user_id: int) -> Union[Tuple[bool, None], Tuple[bool, GameModel]]:
    new_game = copy.deepcopy(game)
    ligue = LigueModel.find_by_active()
    current_user = UserModel.find_by_id(user_id)
    if not ligue:
        print('ligue is null')
        return True, None
    new_game.ligue = ligue
    new_game.save_to_db()
    obj_to_save = []

    for user_game in new_game.user_games:
        user = UserModel.find_by_nickname(user_game.user.nickname)
        ugm = UserGameModel(game_id=new_game.id, user_id=user.id, winner=user_game.winner,
                            confirmed=current_user == user, rounds_win=user_game.rounds_win,
                            rounds_lost=user_game.rounds_lost)
        obj_to_save.append(ugm)

    for r in new_game.rounds:
        this_round = RoundModel(game_id=new_game.id, round_no=r.round_no)
        this_round.save()
        for user_round in r.user_rounds:
            user = UserModel.find_by_nickname(user_round.user.nickname)
            urm = UserRoundModel(round_id=this_round.id, user_id=user.id, points_earned=user_round.points_earned,
                                 points_lost=user_round.points_lost,
                                 winner=user_round.winner)
            obj_to_save.append(urm)
        # for r in user_rounds:
        #     r.save()
        # for r in rounds:
        #     r.save()
    for obj in obj_to_save:
        obj.save()
    return False, new_game


def confirm_game(game: GameModel):
    # game = GameModel.find_by_id(game_id)

    game.player_one.this_points = 0
    game.player_two.this_points = 0

    for round in game.rounds:
        game.player_one.points_earned += round.player_one_score
        game.player_one.points_lost += round.player_two_score
        game.player_two.points_earned += round.player_two_score
        game.player_two.points_lost += round.player_one_score
        if round.player_one_score > round.player_two_score:
            game.player_one.this_points += 1
        else:
            game.player_two.this_points += 1

    game.player_one.total_games += 1
    game.player_two.total_games += 1
    if game.winner.id == game.player_one.id:
        game.player_one.total_wins += 1
        game.player_two.total_lost += 1
    else:
        game.player_two.total_wins += 1
        game.player_one.total_lost += 1

    if game.player_one.nickname == game.winner.nickname:
        game.player_one.points += 2
    else:
        game.player_two.points += 2

    game.player_one.balance = game.player_one.points_earned - game.player_one.points_lost
    game.player_two.balance = game.player_two.points_earned - game.player_two.points_lost

    # try:
    with db.atomic():
        game.save_to_db()
        game.player_one.save_to_db()
        game.player_two.save_to_db()
    # except:
    #     print("some errror")
    #     return True, None

    return False, game


def confirm_games(game_ids, user_id: int):
    games = GameModel.select().where(GameModel.id << game_ids)
    current_user = UserModel.find_by_id(user_id)
    games_confirmed = 0
    opponent_must_confirm = 0
    games_updated_before = 0
    with db.atomic():
        for game in games:
            winner = None
            looser = None
            user_games = []
            points = 0
            if len(list(filter(lambda x: x.confirmed, game.user_games))) == 2:
                '''if game is fully confirmed...'''
                games_updated_before += 1
                # continue

            if list(filter(lambda x: (x.confirmed and x.user.nickname == current_user.nickname), game.user_games)):
                '''if on list is game confirmed by current user...'''
                opponent_must_confirm += 1
                # continue

            for user_game in game.user_games:
                user_game = UserGameModel.find_by_id(user_game.id)
                user_game.confirmed = True
                user = UserModel.find_by_nickname(user_game.user.nickname)

                if user_game.winner:
                    winner = user
                    points = user_game.rounds_win - user_game.rounds_lost
                    stats_winner = StatsModel.find_by_user(user)
                else:
                    looser = user
                    stats_looser = StatsModel.find_by_user(user)
                user_games.append(user_game)

            for _round in game.rounds:
                for user_round in _round.user_rounds:
                    print(user_round.id, _round.round_no)
                    if user_round.user.nickname == winner.nickname:
                        winner.points_earned += user_round.points_earned
                        winner.points_lost += user_round.points_lost
                        print(stats_winner.points_earned)
                        stats_winner.points_earned += user_round.points_earned
                        print(stats_winner.points_earned)
                        stats_winner.points_lost += user_round.points_lost
                        if user_round.winner:
                            stats_winner.sets_win += 1
                        else:
                            stats_winner.sets_lost += 1
                    elif user_round.user.nickname == looser.nickname:
                        looser.points_earned += user_round.points_earned
                        looser.points_lost += user_round.points_lost
                        stats_looser.points_earned += user_round.points_earned
                        stats_looser.points_lost += user_round.points_lost
                        if user_round.winner:
                            stats_looser.sets_win += 1
                        else:
                            stats_looser.sets_lost += 1

        winner.points += points
        winner.total_games += 1
        winner.total_wins += 1
        winner.balance = winner.points_earned - winner.points_lost

        stats_winner.points = stats_winner.points + points
        stats_winner.total_wins = stats_winner.total_wins + 1
        stats_winner.balance = stats_winner.points_earned - stats_winner.points_lost

        looser.total_games += 1
        looser.total_lost += 1
        looser.balance = looser.points_earned - looser.points_lost

        stats_looser.total_lost = stats_looser.total_lost + 1
        stats_looser.balance = stats_looser.points_earned - stats_looser.points_lost

        winner.save()
        looser.save()
        stats_winner.save()
        stats_looser.save()
        for user_game in user_games:
            user_game.save()
        games_confirmed += 1

    return games_updated_before, opponent_must_confirm, games_confirmed
