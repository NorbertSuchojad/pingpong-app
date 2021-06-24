from typing import List

# from peewee import CharField, TextField, BooleanField, DoesNotExist
from app.db import db
from app.models.base import BaseModel


class RoleModel(BaseModel):
    __tablename__ = 'role'
    __table_args__ = {'schema': 'public'}
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String(255))
    basic_role = db.Column(db.Boolean, default=False)

    # name = CharField(unique=True)
    # description = TextField(null=True)
    # basic_role = BooleanField(default=False)

    @classmethod
    def get_all(cls) -> List["RoleModel"]:
        return cls.query.all()

    @classmethod
    def get_default(cls) -> "RoleModel":
        return cls.query.filter(cls.basic_role == True).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
