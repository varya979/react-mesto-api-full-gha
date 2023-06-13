import React from "react";
import PopupWithForm from "./PopupWithForm";
import Fieldset from "./Fieldset";

export default function EditAvatarPopup(props) {
  const inputRef = React.useRef();

  React.useEffect(() => {
    inputRef.current.value = "";
  }, [props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      name="update-avatar"
      title="Обновить аватар"
      formClassName="popup__form popup__form_avatar"
      submitButtonTitle="Сохранить"
      onSubmit={handleSubmit}
    >
      <Fieldset
        id="avatar"
        name="avatar"
        placeholderText="Ссылка на картинку"
        typeValue="url"
        inputRef={inputRef}
      />
    </PopupWithForm>
  );
}
