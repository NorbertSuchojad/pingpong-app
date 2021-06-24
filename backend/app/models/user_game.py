from app.db import db
from app.models.base import BaseModel


class UserGameModel(BaseModel):
    __tablename__ = 'user_games'
    __table_args__ = {'schema': 'public'}

    confirmed = db.Column(db.Boolean, default=False)
    winner = db.Column(db.Boolean, default=False)
    rounds_win = db.Column(db.Integer)
    rounds_lost = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))

    games = db.relationship('GameModel', lazy='subquery')
    users = db.relationship('UserModel', lazy='subquery')
