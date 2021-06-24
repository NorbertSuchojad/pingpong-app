from app.db import db
from app.models.ligue import LigueModel
from app.models.stats import StatsModel
from app.models.user import UserModel

LIGUE_NOT_FOUND = "Ligue not found"
LIGUE_ALREADY_EXISTS = "Ligue with this name exists"
LIGUE_CREATED_SUCCESSFULLY = "Ligue create success!"


def create_ligue(ligue: LigueModel):
    with db.atomic():
        if LigueModel.find_by_name(ligue.name):
            return LIGUE_ALREADY_EXISTS, 400

        res = LigueModel.update({LigueModel.active: False}).where(LigueModel.active == True).execute()
        print('Rows updated: ', res)
        ligue.active = True

        users = UserModel.find_all()
        ligue.save_to_db()

        for user in users:
            StatsModel.create(user=user, ligue=ligue)

        return LIGUE_CREATED_SUCCESSFULLY, 201
