let accessToken: string | null = null;

let authUser: any | null = null;

export const authUtils = {
  getAuthUser() {
    return authUser;
  },

  setAuthUser(user: any) {
    authUser = user;
  },

  getAccessToken() {
    return accessToken;
  },

  setAccessToken(token: string) {
    accessToken = token;
  },

  clearAccessToken() {
    accessToken = null;
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  },

  clearRefreshToken() {
    localStorage.removeItem('refresh_token');
  },
};

