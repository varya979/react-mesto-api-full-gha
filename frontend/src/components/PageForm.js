import React from "react";
import Fieldset from "./Fieldset";

export default function PageForm(props) {
  return (
    <div className="page-form">
      <h2 className="page-form__title">{props.title}</h2>
      <form className="page-form__form" onSubmit={props.handleSubmit}>
        <Fieldset
          id="email"
          name="email"
          placeholderText="Email"
          typeValue="email"
          minLengthValue="2"
          maxLengthValue="40"
          value={props.email}
          onChange={props.handleChange}
        />
        <Fieldset
          id="password"
          name="password"
          placeholderText="Пароль"
          typeValue="password"
          minLengthValue="2"
          maxLengthValue="40"
          value={props.password}
          onChange={props.handleChange}
        />
        <button className="page-form__button-save opacity" type="submit">
          {props.submitButtonTitle}
        </button>
        {props.children}
      </form>
    </div>
  );
}
