from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(120), nullable=False)
    preference_currency_1 = db.Column(db.String(10), nullable=False)
    preference_currency_2 = db.Column(db.String(10), nullable=False)
    preference_currency_3 = db.Column(db.String(10), nullable=False)
    your_address = db.Column(db.String(200), nullable=False)
    lenders_address = db.Column(db.String(200), nullable=False)
    emi_payment_day = db.Column(db.Integer, nullable=False)
    amount_owes = db.Column(db.Integer, nullable=True , default=0)

    # Serialize the User object into a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "preference_currency_1": self.preference_currency_1,
            "preference_currency_2": self.preference_currency_2,
            "preference_currency_3": self.preference_currency_3,
            "your_address": self.your_address,
            "lenders_address": self.lenders_address,
            "emi_payment_day": self.emi_payment_day,
            "amount_owes": self.amount_owes
        }
