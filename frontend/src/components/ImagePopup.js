import React from "react";
import popupCloseButton from "../images/popup__button-close.svg";

export default function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_picture ${
        props.card.link && "popup_opened"
      }`}
    >
      <div className="popup__picture-container">
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
        <figure className="popup__figure">
          <img
            className="popup__image"
            src={`${props.card.link}`}
            alt={props.card.name}
          />
          <figcaption className="popup__figcaption">
            {props.card.name}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
