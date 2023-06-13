import React from "react";
import Header from "./Header";
import PageForm from "./PageForm";

export default function Login(props) {
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

    if (!userData.password || !userData.email) {
      return;
    }

    props
      .handleLogin(userData)
      .then(() => {
        setUserData({ password: "", email: "" });
      })
      .catch((error) => {
        console.log(`Что-то пошло не так! ${error} `);
      });
  }
  return (
    <>
      <Header link="/sign-up" linkName="Регистрация" />
      <PageForm
        title="Вход"
        submitButtonTitle="Войти"
        handleSubmit={handleSubmit}
        password={userData.password || ""}
        email={userData.email || ""}
        handleChange={handleChange}
      />
    </>
  );
}
