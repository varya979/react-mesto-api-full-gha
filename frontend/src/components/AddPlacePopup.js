import React from "react";
import PopupWithForm from "./PopupWithForm";
import Fieldset from "./Fieldset";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function AddPlacePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setName("");
    setLink("");
  }, [currentUser, props.isOpen]);

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlace({
      name: name,
      link: link,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      name="card"
      title="Новое место"
      formClassName="popup__form"
      submitButtonTitle="Создать"
    >
      <Fieldset
        id="card-name"
        name="name"
        placeholderText="Название"
        typeValue="text"
        minLengthValue="2"
        maxLengthValue="30"
        value={name}
        onChange={handleChangeName}
      />
      <Fieldset
        id="card-description"
        name="link"
        placeholderText="Ссылка на картинку"
        typeValue="url"
        value={link}
        onChange={handleChangeLink}
      />
    </PopupWithForm>
  );
}
