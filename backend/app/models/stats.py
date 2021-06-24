from app.db import db
from app.models.base import BaseModel
from app.models.ligue import LigueModel
from app.models.user import UserModel


class StatsModel(BaseModel):
    __tablename__ = 'stats'
    __table_args__ = {'schema': 'public'}

    total_wins = db.Column(db.Integer, default=0)
    total_lost = db.Column(db.Integer, default=0)
    sets_win = db.Column(db.Integer, default=0)
    sets_lost = db.Column(db.Integer, default=0)
    points_earned = db.Column(db.Integer, default=0)
    points_lost = db.Column(db.Integer, default=0)
    balance = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship(UserModel, lazy='subquery', backref='stats')

    ligue_id = db.Column(db.Integer, db.ForeignKey('ligue.id'))
    ligue = db.relationship(LigueModel, lazy='subquery', backref='stats')

    # total_wins = IntegerField(default=0)
    # total_lost = IntegerField(default=0)
    # sets_win = IntegerField(default=0)
    # sets_lost = IntegerField(default=0)
    # points_earned = IntegerField(default=0)
    # points_lost = IntegerField(default=0)
    # balance = IntegerField(default=0)
    # points = IntegerField(default=0)
    #
    # user = ForeignKeyField(UserModel, backref='stats')
    # ligue = ForeignKeyField(LigueModel, backref='stats')

    @classmethod
    def find_by_user(cls, user: UserModel) -> "StatsModel":
        return cls.query.filter_by(cls.user_id == user.id).first()
