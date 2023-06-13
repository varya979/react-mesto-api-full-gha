import React from "react";
import popupCloseButton from "../images/popup__button-close.svg";
import successImg from "../images/success.svg";
import failImg from "../images/fail.svg";

export default function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_infoTooltip ${
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
        <div className="popup__infoTooltip-container">
          {!props.successRegistation && (
            <figure className="popup__figure">
              <img
                className="popup__infoTooltip-image"
                src={failImg}
                alt="Рисунок крестика"
              />
              <h3 className="popup__infoTooltip-text">
                Что-то пошло не так! Попробуйте ещё раз.
              </h3>
            </figure>
          )}
          {props.successRegistation && (
            <figure className="popup__figure">
              <img
                className="popup__infoTooltip-image"
                src={successImg}
                alt="Рисунок галочки"
              />
              <h3 className="popup__infoTooltip-text">
                Вы успешно зарегистрировались!
              </h3>
            </figure>
          )}
        </div>
      </div>
    </div>
  );
}
