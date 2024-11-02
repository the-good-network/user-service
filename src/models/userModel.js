import supabase from "../../config/db.js";

const userModel = {
  /**
   * This function creates a new user in the database
   * @param {*} email The user's email
   * @param {*} username The user's username
   * @param {*} password The user's hashed password
   * @returns The created user object
   */
  async createUser(email, username, password) {
    const { data, error } = await supabase
      .from("user-service")
      .insert([{ email: email, username: username, password: password }])
      .select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  /**
   * This function finds a user by their email address
   * @param {*} email The user's email address
   * @returns The user object from the database
   */
  async findUserByEmail(email) {
    const {data, error} = await supabase
      .from("user-service")
      .select("*")
      .eq("email", email);

    if (error) {
      throw new Error(error.message);
    }
    return data[0]; // Return the first user object
  },

  async findUserById(id) {},
  async updateUser(id, data) {},
  async deleteUser(id) {},
};

export default userModel;
