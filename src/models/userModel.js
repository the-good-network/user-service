import supabase from "../../config/db.js";

const userModel = {
  /**
   * This function creates a new user in the database
   * @param {*} email The user's email
   * @param {*} username The user's username
   * @param {*} password The user's hashed password
   * @returns
   */
  async createUser(email, username, password) {
    const { data, error } = await supabase
      .from("user-service")
      .insert([{ email: email, username: username, password: password }]);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findUserByEmail(email) {},
  async findUserById(id) {},
  async updateUser(id, data) {},
  async deleteUser(id) {},
};

export default userModel;
