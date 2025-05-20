export default {
  loggedIn(state) {
    return !!state.authData;
  },
  getAuthUserData(state) {
    if (state.authData && state.authData.user) {
      return state.authData.user;
    }
  },
  getAuthData(state) {
    return state.authData;
  },
};
