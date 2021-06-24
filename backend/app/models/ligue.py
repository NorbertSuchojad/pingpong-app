from typing import List

from app.db import db
from app.models.base import BaseModel


class LigueModel(BaseModel):
    __tablename__ = 'ligue'
    __table_args__ = {'schema': 'public'}
    name = db.Column(db.String(50), unique=True)
    active = db.Column(db.Boolean, default=False)

    games = db.relationship('GameModel', back_populates='ligue', lazy='subquery')

    @classmethod
    def find_all(cls) -> List["LigueModel"]:
        return cls.query.all()

    @classmethod
    def find_by_active(cls):
        return cls.query.filter(cls.active == True).first()

    @classmethod
    def find_by_name(cls, name: str) -> "LigueModel":
        return cls.query.filter(cls.name.is_(name)).first()
