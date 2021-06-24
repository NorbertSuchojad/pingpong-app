# from peewee import IntegerField, ForeignKeyField, DoesNotExist
from app.db import db
from app.models.base import BaseModel
from app.models.game import GameModel


class RoundModel(BaseModel):
    __tablename__ = 'rounds'
    __table_args__ = {'schema': 'public'}
    round_no = db.Column(db.Integer)

    game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
    game = db.relationship(GameModel, lazy='subquery', backref='rounds')

    @classmethod
    def find_all(cls) -> "RoundModel":
        return cls.query.all()

    @classmethod
    def find_all_by_game(cls, game_id: int) -> "RoundModel":
        return cls.query.join(GameModel).filter(cls.game_id == game_id).all()
