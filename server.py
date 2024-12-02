from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize database
with app.app_context():
    if not os.path.exists('database.db'):
        db.create_all()

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()

    required_fields = [
        "username", "password", "preference_currency_1",
        "preference_currency_2", "preference_currency_3",
        "your_address", "lenders_address", "emi_payment_day"
    ]

    # Validate required fields
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate EMI payment day
    if not (1 <= int(data["emi_payment_day"]) <= 28):
        return jsonify({"error": "EMI payment day must be between 1 and 28"}), 400

    user = User(
        username=data["username"],
        password=data["password"],
        preference_currency_1=data["preference_currency_1"],
        preference_currency_2=data["preference_currency_2"],
        preference_currency_3=data["preference_currency_3"],
        your_address=data["your_address"],
        lenders_address=data["lenders_address"],
        emi_payment_day=int(data["emi_payment_day"])
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Data saved successfully"}), 201


@app.route("/users", methods=['GET'])
def showusers():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


@app.route("/login" , methods=["POST"])
def func():
    data = request.get_json()
    username=data["username"],
    password=data["password"],
    your_address=data["your_address"],


@app.route("/admin/<int:user_id>", methods=["PUT"])
def update_amount_owes(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)

    # Ensure the 'amount_owes' field is passed in the request
    if 'amount_owes' not in data:
        return jsonify({"error": "Amount owes field is required"}), 400

    user.amount_owes = data['amount_owes']
    db.session.commit()

    return jsonify({"message": "Amount owes updated successfully", "amount_owes": user.amount_owes})


if __name__ == '__main__':
    app.run(debug=True)
