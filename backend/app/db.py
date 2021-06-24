import os

from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, create_engine

load_dotenv(".env")

db_name = os.environ.get("DB_NAME")
db_host = os.environ.get("DB_HOST")
db_user = os.environ.get("DB_USER")
db_pass = os.environ.get("DB_PASSWORD")
db_schema = os.environ.get("DB_SCHEMA")

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)  # , schema=db_schema)
db = SQLAlchemy(metadata=metadata)

engine = create_engine(os.environ.get('SQLALCHEMY_DATABASE_URI'),
                       client_encoding="utf8",
                       pool_pre_ping=True)
