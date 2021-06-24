from typing import List

from flask_sqlalchemy import BaseQuery

from app.db import db


class BaseModel(db.Model):
    __abstract__ = True
    query: BaseQuery

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, name='id')

    def __init__(self, *args, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    @classmethod
    def get_by_id(cls, _id: int) -> 'cls':
        return cls.query.get(_id)

    @classmethod
    def find_by_id(cls, _id: int) -> "cls":
        return cls.query.get(_id)

    @classmethod
    def get_all(cls) -> List['cls']:
        return cls.query.all()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def save_to_db(self) -> None:
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self) -> int:
        return 1
