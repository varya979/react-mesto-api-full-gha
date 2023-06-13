import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";
import Fieldset from "./Fieldset";

export default function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeDescription(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      name="profile"
      title="Редактировать профиль"
      formClassName="popup__form"
      submitButtonTitle="Сохранить"
    >
      <Fieldset
        id="profile-name"
        name="name"
        placeholderText="Имя"
        typeValue="text"
        minLengthValue="2"
        maxLengthValue="40"
        value={name}
        onChange={handleChangeName}
      />
      <Fieldset
        id="profile-description"
        name="description"
        placeholderText="О себе"
        typeValue="text"
        minLengthValue="2"
        maxLengthValue="200"
        value={description}
        onChange={handleChangeDescription}
      />
    </PopupWithForm>
  );
}
