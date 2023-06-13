import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `cards__button-like ${
    isLiked && "cards__button-like_active"
  }`;

  return (
    <li className="cards__item">
      <img
        onClick={handleClick}
        className="cards__image"
        src={props.card.link}
        alt={props.card.name}
      />
      {isOwn && (
        <button
          className="cards__button-delete  opacity"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="cards__info">
        <p className="cards__title">{props.card.name}</p>
        <div className="cards__likes-container">
          <button
            className={`${cardLikeButtonClassName} opacity`}
            type="button"
            onClick={handleLikeClick}
          />
          {props.card.likes.length > 0 && (
            <p className="cards__count-likes">{props.card.likes.length}</p>
          )}
        </div>
      </div>
    </li>
  );
}
