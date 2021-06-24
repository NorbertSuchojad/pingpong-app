import datetime

from app.db import db
from app.models.base import BaseModel
from app.models.ligue import LigueModel
from app.models.user_game import UserGameModel


class GameModel(BaseModel):
    __tablename__ = 'game'
    # __table_args__ = {'schema': 'public', 'extend_existing': True}
    __table_args__ = {'schema': 'public'}
    date_time = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    ligue_id = db.Column(db.Integer, db.ForeignKey('ligue.id'))
    ligue = db.relationship(LigueModel, back_populates='games', lazy='subquery')

    # user_games = relationship('UserModel', secondary=UserGameModel, backref='GameModel')

    user_games = db.relationship('UserModel', secondary=UserGameModel.__table__, lazy='subquery')

    # rounds = db.relationship('RoundModel', lazy='subquery', backref='game')
    # ligue = ForeignKeyField(LigueModel, backref='games')

    # users = db.relationship('UserModel',
    #                         secondary=UserGameModel.__table__,
    #                         secondaryjoin=UserGameModel.user_id,
    #                         back_populates='games',
    #                         lazy='subquery')

    @classmethod
    def find_all(cls) -> "GameModel":
        return cls.query.order_by(cls.date_time).all()

    @classmethod
    def find_by_winner(cls, winner_id: int) -> "GameModel":
        return cls.query.filter_by(cls.winner.id == winner_id).first()

    @classmethod
    def find_by_winner_name(cls, winner_name: str) -> "GameModel":
        return cls.query.filter_by(cls.winner.nickname == winner_name).first()

    @classmethod
    def find_by_id(cls, _id: int) -> "GameModel":
        return cls.query.get(_id)
