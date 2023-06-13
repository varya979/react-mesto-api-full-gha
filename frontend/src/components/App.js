import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Routes, Route, useNavigate } from "react-router-dom";
import Main from "./Main";
import Header from "./Header";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

import api from "../utils/api";
import * as auth from "../utils/auth";

export default function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [currentUser, setCurrentUser] = React.useState({ name: "", about: "" });
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [successRegistation, setSuccessRegistation] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();

  // Запрос к Api за инфо о пользователе выполняется единожды при монтировании
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
    api
      .getUser()
      .then((data) => {
        // console.log(data);
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn]);

  // Запрос к Api за инфо о массиве карточек выполняется единожды при монтировании
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      api
        .getCards()
        .then((data) => {
          //console.log(data);
          setCards(data.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
      .checkToken(token)
      .then((res) => {
        setLoggedIn(true);
        setEmail(res.email);
        navigate("/");
      })
      .catch((err) => {
        localStorage.removeItem('jwt');
        console.log(err);
      })
    }
  }, [navigate]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);

    api
      .updateLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api
      .updateUser(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api
      .updateAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .postCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin({ password, email }) {
    return auth.authorize(password, email).then((data) => {
      if (data) {
        localStorage.setItem("jwt", data.token);
        setEmail(email);
        setLoggedIn(true);
        navigate("/");
      }
    });
  }

  function handleRegister({ password, email }) {
    return auth
      .register(password, email)
      .then(() => {
        setSuccessRegistation(true);
        openInfoTooltipPopup();
        navigate("/signin");
      })
      .catch(() => {
        setSuccessRegistation(false);
        openInfoTooltipPopup();
      });
  }

  function signOut() {
    if (localStorage.getItem("jwt")) {
      localStorage.removeItem("jwt");
      setLoggedIn(false);
      setEmail("");
    }
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function openInfoTooltipPopup() {
    setIsInfoTooltipPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ name: "", link: "" });
    setIsInfoTooltipPopupOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={
                <>
                  <Header
                    link="/signin"
                    loggedIn={loggedIn}
                    email={email}
                    linkName="Выйти"
                    onSignOut={signOut}
                  />
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                  />
                  <Footer />
                </>
              }
            ></ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <Register handleRegister={handleRegister} loggedIn={loggedIn} />
          }
        />
        <Route
          path="/signin"
          element={<Login handleLogin={handleLogin} loggedIn={loggedIn} />}
        />
      </Routes>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <PopupWithForm
        name="confirm-delete"
        title="Вы уверены?"
        formClassName="popup__form popup__form_confirm"
        submitButtonTitle="Да"
      />

      <InfoTooltip
        isOpen={isInfoTooltipPopupOpen}
        onClose={closeAllPopups}
        successRegistation={successRegistation}
      />

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}
