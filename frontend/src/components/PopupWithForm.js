import React from "react";
import popupCloseButton from "../images/popup__button-close.svg";

export default function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen && "popup_opened"
      }`}
    >
      <div className="popup__container">
        <button
          onClick={props.onClose}
          className="popup__button-close opacity"
          type="button"
        >
          <img
            className="popup__button-close-image"
            src={popupCloseButton}
            alt="рисунок 'крестик' закрытия окна"
          />
        </button>
        <form
          className={props.formClassName}
          name={props.name}
          action="#"
          method="post"
          noValidate
          onSubmit={props.onSubmit}
        >
          <h3 className="popup__title">{props.title}</h3>
          {props.children}
          <button className="popup__button-save" type="submit">
            {props.submitButtonTitle}
          </button>
        </form>
      </div>
    </div>
  );
}
