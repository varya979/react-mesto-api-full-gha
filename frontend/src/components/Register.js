import React from "react";
import Header from "./Header";
import PageForm from "./PageForm";
import { Link } from "react-router-dom";

export default function Register(props) {
  const [userData, setUserData] = React.useState({
    password: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.handleRegister(userData);
  }

  return (
    <>
      <Header link="/sign-in" linkName="Войти" />
      <PageForm
        handleSubmit={handleSubmit}
        title="Регистрация"
        password={userData.password || ""}
        email={userData.email || ""}
        handleChange={handleChange}
        submitButtonTitle="Зарегистрироваться"
        children={
          !props.isLogin && (
            <p className="page-form__subtitle">
              Уже зарегистрированы?{" "}
              <Link to="/sign-in" className="page-form__link opacity">
                Войти
              </Link>
            </p>
          )
        }
      />
    </>
  );
}
