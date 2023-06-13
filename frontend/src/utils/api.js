class Api {
  constructor({ url }) {
    this._url = url;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // GET '/users/me' - получение пользователя
  getUser() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      }
    })
    .then((res) => {
        return this._checkResponse(res);
      }
    );
  }

  // PATCH '/users/me' - обновление профиля пользователя
  updateUser(data) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  // GET '/cards' - получение всех карточек
  getCards() {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
      }
    })
    .then(
      (res) => {
        return this._checkResponse(res);
      }
    );
  }

  // POST '/cards' - новая карточка
  postCard(card) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: card.name,
        link: card.link,
      }),
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  // DELETE '/cards/:cardId' - удаление карточки
  deleteCard(cardId) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  // DELETE или PUT '/cards/:cardId/likes' - добавляет или удаляет лайк
  updateLike(cardId, isLiked) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return this._checkResponse(res);
    });
  }

  // PATCH '/users/me/avatar' - обновляет аватар
  updateAvatar(data) {
    const token = localStorage.getItem('jwt');
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => {
      return this._checkResponse(res);
    });
  }
}

const api = new Api({
  url: "https://api.varya-project.nomoredomains.rocks"
});

export default api;
