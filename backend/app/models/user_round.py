from app.db import db
from app.models.base import BaseModel


class UserRoundModel(BaseModel):
    __tablename__ = 'user_rounds'
    __table_args__ = {'schema': 'public'}

    winner = db.Column(db.Boolean, default=False)
    points_earned = db.Column(db.Integer)
    points_lost = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # user = db.relationship(UserModel, lazy='subquery', backref='user_rounds')

    round_id = db.Column(db.Integer, db.ForeignKey('round.id'))
    # round = db.relationship(RoundModel, lazy='subquery', backref='user_rounds')
