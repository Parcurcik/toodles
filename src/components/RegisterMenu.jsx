import React, {useState} from 'react';
import '../css/RegisterMenu.css'
import reg_logo from '../images/reg_logo.png'
import InputData from "./InputData";
import Button from "./Button";
import first_image from "../images/first_image.png"
import second_image from "../images/second_image.png"
import third_image from "../images/third_image.png"
import four_image from "../images/four_image.png"
import adding_image from "../images/adding_image.png"
import axios from "axios";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    firstName: yup.string().required("Введите имя"),
    lastName: yup.string().required("Введите фамилию"),
    email: yup.string().email("Введите корректный адрес электронной почты").required("Введите адрес электронной почты"),
    password: yup.string().required("Введите пароль").min(6, "Пароль должен содержать минимум 6 символов"),
    repeatPassword: yup.string().oneOf([yup.ref("password"), null], "Пароли должны совпадать"),
});

const RegisterMenu = ({items, active, setActive, href}) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const setEmptyData = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate({
                firstName,
                lastName,
                email,
                password,
                repeatPassword,
            }, {abortEarly: false});

            const data = {
                firstName,
                lastName,
                email,
                password,
                repeatPassword,
            };

            const response = await axios.post("URL_адрес_сервера", data);
            console.log(response.data);

            setEmptyData();
        } catch (error) {
            // Обработка ошибок валидации, допилить вывод в строчки/под строчки

            if (error instanceof yup.ValidationError) {
                const errorMessages = {};

                error.inner.forEach((validationError) => {
                    errorMessages[validationError.path] = validationError.message;
                });

                console.log(errorMessages);
                // Вывод в виде
                // {firstName: 'Введите имя', lastName: 'Введите фамилию', email: 'Введите адрес электронной почты', password: 'Пароль должен содержать минимум 6 символов'}
            }



        }
    };
    return (
        <div className={active ? "menu_reg active" : "menu_reg"} onClick={() => setActive(false)}>
            <div className={"menu__content_reg"} onClick={e => e.stopPropagation()}>
                <img
                    src={reg_logo}
                    alt={"Логотип"}
                    style={{
                        width: "17vw",
                        margin: "6% auto"
                    }}/>
                <InputData
                    placeHolder={"Имя"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <InputData
                    placeHolder={"Фамилия"}
                    marginTop={"3.5%"}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <InputData
                    placeHolder={"Почта"}
                    marginTop={"3.5%"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputData
                    placeHolder={"Пароль"}
                    marginTop={"3.5%"}
                    input_type={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputData
                    placeHolder={"Повторите пароль"}
                    marginTop={"3.5%"}
                    input_type={"password"}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <div className={"avatar_cont"}>
                    <img src={first_image} style={{width: "3vw", marginLeft: "5.5vw", cursor: "pointer"}}/>
                    <img src={second_image} style={{width: "3vw", marginLeft: "1vw", cursor: "pointer"}}/>
                    <img src={third_image} style={{width: "3vw", marginLeft: "1vw", cursor: "pointer"}}/>
                    <img src={four_image} style={{width: "3vw", marginLeft: "1vw", cursor: "pointer"}}/>
                    <img src={adding_image} style={{width: "3vw", marginLeft: "1vw", cursor: "pointer"}}/>
                </div>
                <Button Text={"Зарегистрироваться"} Width={"20vw"} marginTop={"1vw"} onClick={handleSubmit}/>
            </div>
        </div>
    );
};

export default RegisterMenu;