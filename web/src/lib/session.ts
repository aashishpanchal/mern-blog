interface IToken {
  accessToken: string;
  refreshToken: string;
}

class Session {
  get accessToken() {
    return sessionStorage.getItem("accessToken");
  }

  getToken(key: keyof IToken) {
    return sessionStorage.getItem(key);
  }

  store(tokens: IToken) {
    sessionStorage.setItem("accessToken", tokens.accessToken);
    sessionStorage.setItem("refreshToken", tokens.refreshToken);
  }

  update(key: keyof IToken, value: string) {
    sessionStorage.setItem(key, value);
  }

  remove(key: keyof IToken) {
    sessionStorage.removeItem(key);
  }

  removeAll() {
    sessionStorage.clear();
  }
}

export default new Session();
