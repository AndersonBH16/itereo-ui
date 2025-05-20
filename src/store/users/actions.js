/* eslint-disable no-unused-vars */
import users from "@/services/users";

export default {
  registerUser({ commit }, { email, password, name }) {
    const data = {
      name,
      email,
      password,
      password_confirmation: password,
      role: 1,
    };
    return users.registerUser(data).then((response) => {
      if (response && response.status === 201 && response.data) {
        commit("SET_NEW_USER", response.data.user);
        return response.data;
      } else {
        return false;
      }
    });
  },
  async getUsers({ commit }, payload) {
    const response = await users.getUsers(payload);

    if (response && response.status === 200 && response.data) {
      commit("SET_USERS", response.data);
    }
  },
  async sendResetPasswordLink({ commit }, { email }) {
    const data = { email: email };
    const response = await users.sendResetPasswordLink(data);
    if (response && response.status === 200 && response.data) {
      return response.data;
    }
  },
  async resetPassword(
    { commit },
    { password, password_confirmation, id, token }
  ) {
    const data = {
      password,
      password_confirmation,
      id,
      token,
    };
    const response = await users.resetPassword(data);
    if (response && response.status === 200 && response.data) {
      return response.data;
    }
  },
  async updateUserPhoto({ commit }, data) {
    const response = await users.savePhoto(data);
    return response;
  },
  async sendContactUs({ commit }, data) {
    const response = await users.sendContactUs(data);
    return response;
  },
};
