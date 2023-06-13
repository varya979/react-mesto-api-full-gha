class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this._headers = options.headers;
  }

  _checkAnswer(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, { headers: this._headers }).then(
      (res) => {
        return this._checkAnswer(res);
      }
    );
  }

  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => {
      return this._checkAnswer(res);
    });
  }

  getCards() {
    return fetch(`${this._url}/cards`, { headers: this._headers }).then(
      (res) => {
        return this._checkAnswer(res);
      }
    );
  }

  postCard(card) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      }),
    }).then((res) => {
      return this._checkAnswer(res);
    });
  }

  deleteCard(card) {
    return fetch(`${this._url}/cards/${card}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      return this._checkAnswer(res);
    });
  }

  changeLikeCardStatus(card, isLiked) {
    return fetch(`${this._url}/cards/${card}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    }).then((res) => {
      return this._checkAnswer(res);
    });
  }

  changeUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => {
      return this._checkAnswer(res);
    });
  }
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-54",
  headers: {
    authorization: "aabcb11b-8f59-4aaf-a42c-ed2259c463e8",
    "Content-Type": "application/json",
  },
});

export default api;
