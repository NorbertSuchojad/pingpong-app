from functools import wraps

import bcrypt
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import and_
from sqlalchemy.ext.hybrid import hybrid_property

from app.db import db
from app.models.base import BaseModel
from app.models.role import RoleModel

salt = bcrypt.gensalt()


class UserModel(BaseModel):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'public'}

    _email = db.Column(db.String(160), nullable=False, unique=True,
                       name='email')  # CharField(column_name='email', max_length=160, null=False, unique=True)
    _password = db.Column(db.String, nullable=False, name='password')  # CharField(column_name='password', null=True)
    nickname = db.Column(db.String(80), unique=True)  # CharField(max_length=80, unique=True)
    domain = db.Column(db.String(80))  # CharField(max_length=80)
    image_uri = db.Column(db.String, default='')  # CharField(default='')
    total_games = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    total_wins = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    total_lost = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    points_earned = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    points_lost = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    balance = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    points = db.Column(db.Integer, default=0)  # IntegerField(default=0)
    rating = db.Column(db.Integer, default=0)  # FloatField(default=0)
    experience = db.Column(db.Integer, default=0)  # IntegerField(default=0)

    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))  # ForeignKeyField(RoleModel, backref='users')
    role = db.relationship(RoleModel, lazy='subquery', backref='stats')  # ForeignKeyField(RoleModel, backref='users')

    # games = db.relationship('UserGameModel', lazy='joined')

    # user_game = db.relationship('GameModel', secondary=UserGameModel, lazy='subquery', backref='user_games')
    # games = db.relationship('GameModel',
    #                         secondary=UserGameModel.__table__,
    #                         lazy='subquery')

    # games = db.relationship('UserModel',
    #                         secondary=UserGameModel.__table__,
    #                         secondaryjoin=UserGameModel.game_id,
    #                         back_populates='users',
    #                         lazy='subquery')
    # rounds = db.relationship('RoundModel',
    #                         secondary=UserRoundModel.__table__,
    #                         back_populates='users',
    #                         lazy='subquery')

    @hybrid_property
    def email(self) -> str:
        return self._email

    @email.setter
    def email(self, email):
        self._email = email

    @hybrid_property
    def password(self):
        return f'{self._password}'

    @password.setter
    def password(self, password):
        if password:
            password_encoded = f'{password}'.encode('utf-8')
            self._password = bcrypt.hashpw(password_encoded, salt)
        else:
            pass

    def verify_password(self, password: str):
        password_encoded = bytes(password.encode('utf-8'))
        if type(self._password) != bytes:
            return bcrypt.checkpw(password_encoded, self._password.encode('utf-8'))
        else:
            return bcrypt.checkpw(password_encoded, self._password)

    @classmethod
    def find_admins(cls) -> "UserModel":
        return cls.select() \
            .join(RoleModel) \
            .where(RoleModel.name == 'ADMIN') \
            .order_by(cls.total_wins.desc(),
                      cls.balance.desc())

    @classmethod
    def find_who_to_play(cls, _id: int) -> "UserModel":
        admin = RoleModel.query.filter(RoleModel.name == 'ADMIN').first()
        # cls.select(cls.nickname, cls.image_uri) \
        #     .join(UserGameModel, JOIN.LEFT_OUTER).where(((cls.id != id) & (cls.role != admin))) \
        #     .group_by(cls.nickname, cls.image_uri).having(fn.COUNT(UserGameModel.game) < 3)
        some = db.session.query(UserModel).filter(UserModel.id.notin_([_id, admin.id])).all()
        players = [x for x in some if len(x.games) < 3]
        return players

    @classmethod
    def find_all(cls) -> "UserModel":
        return cls.query \
            .join(RoleModel) \
            .filter(RoleModel.name != "ADMIN") \
            .order_by(cls.total_wins.desc(), cls.balance.desc())

    @classmethod
    def find_by_email(cls, email: str, nickname: str = None) -> "UserModel":
        return cls.query.filter(cls.email.__eq__(email)).first()

    @classmethod
    def find_by_nickname(cls, nickname: str) -> "UserModel":
        return cls.query.filter(cls.nickname.__eq__(nickname)).first()


def has_admin_permission(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        user_id = get_jwt_identity()
        try:
            user = UserModel.query.join(RoleModel).filter(
                and_(UserModel.id == user_id, RoleModel.name == 'ADMIN')).first()
        except:
            user = None
            pass
        if user:
            return f(*args, **kwargs)
        return "System niedostępny", 403

    return decorator
