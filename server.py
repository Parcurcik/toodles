import psycopg2
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS, cross_origin
import asyncio
from config import db_config
from toodles_model.call_model import Toodles
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import bcrypt
from models import db, User
from werkzeug.security import check_password_hash

app = Flask(__name__)

toodles_instance = Toodles()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = '20E0DE1D130FE2045E9F77217B23835DDFB30DC0F33C860576FC0D2044D41F42'

db.init_app(app)
jwt = JWTManager(app)


@app.route('/api/question', methods=['POST', 'OPTIONS'])
@cross_origin()
def process_data():
    data = request.get_json()
    print(data[0])

    async def process_question():
        result = toodles_instance.make_answer(data)
        return result

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(process_question())

    print(result)
    response_data = {'message': 'Данные успешно обработаны', 'result': result}
    return jsonify(response_data), 200


@app.route('/api/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    print(data)

    name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    avatar = data.get('avatar')

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        response_data = {'message': 'Пользователь с такой почтой уже существует'}
        return jsonify(response_data), 400

    hashed_password = hash_password(password)

    new_user = User(name=name, last_name=last_name, email=email, avatar=avatar, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=email)
    print(access_token)

    response_data = {'message': 'Регистрация прошла успешно', 'access_token': access_token}
    return jsonify(response_data), 200


@app.route('/api/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    print(data)

    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        response_data = {'message': 'Пользователь с такой почтой не найден'}
        return jsonify(response_data), 400

    #if not check_password_hash(user.password, password):
    #   response_data = {'message': 'Неверный пароль'}
    #  return jsonify(response_data), 400

    access_token = create_access_token(identity=email)
    print(access_token)

    response_data = {'message': 'Аутентификация прошла успешно', 'access_token': access_token}
    return jsonify(response_data), 200



def hash_password(password):
    pwhash = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    hashed_password = pwhash.decode('utf8')
    return hashed_password




if __name__ == '__main__':
    app.run(debug=True)