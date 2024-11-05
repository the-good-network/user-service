import supabase from "../config/db.js";

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
    const { data, error } = await supabase
      .from("user-service")
      .select("*")
      .eq("email", email);

    if (error) {
      throw new Error(error.message);
    }
    return data[0]; // Return the first user object
  },

  /**
   * This function finds a user by their id
   * @param {*} id The user's id in the database
   * @returns The user object from the database
   */
  async findUserById(id) {
    const { data, error } = await supabase
      .from("user-service")
      .select("*")
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
    return data[0]; // Return the first user object
  },

  /**
   * This function gets all users from the database
   * @returns An array of user objects from the database
   */
  async getAllUsers() {
    const { data, error } = await supabase.from("user-service").select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data; // Return all user objects
  },

  /**
   * This function updates a user's data in the database
   * @param {*} id The user's id in the database
   * @param {*} data The updated user data to be saved
   * @returns The updated user object from the database
   */
  async updateUser(id, updatedData) {
    const { data, error } = await supabase
      .from("user-service")
      .update(updatedData)
      .eq("id", id)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data[0]; // Return the first user object
  },

  /**
   * This function deletes a user from the database
   * @param {*} id The user's id in the database
   * @returns The deleted user object from the database
   */
  async deleteUser(id) {
    const { data, error } = await supabase
      .from("user-service")
      .delete()
      .eq("id", id)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data[0]; // Return the first user object
  },
};

export default userModel;
