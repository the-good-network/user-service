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
    const { data: userData, error: userError } = await supabase
      .from("user-service")
      .insert([{ email: email, username: username }])
      .select("*");

    if (userError) {
      throw new Error(userError.message);
    }

    // Insert the user's password into the user-auth table
    const { data: passwordData, error: passwordError } = await supabase
      .from("user-auth")
      .insert([{ id: userData[0].id, password: password }]);

    if (passwordError) {
      throw new Error(passwordError.message, "Error inserting password");
    }

    return userData[0];
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
   * This function finds a user by their email address
   * @param {*} email The user's email address
   * @returns The user and password object from the database
   */
  async findUserByEmailWithPassword(email) {
    const { data: userData, error: userError } = await supabase
      .from("user-service")
      .select("*")
      .eq("email", email);

    if (userError) {
      throw new Error(userError.message);
    }

    const { data: passwordData, error: passwordError } = await supabase
      .from("user-auth")
      .select("password")
      .eq("id", userData[0].id);

    if (passwordError) {
      throw new Error(passwordError.message);
    }

    const user = { ...userData[0], password: passwordData[0].password };
    return user; // Return the user object with password
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

  /**
   * This function resets a user's password in the database
   * @param {*} id The user's id in the database
   * @param {*} newPassword The new password to be saved
   * @returns Throws an error if the update fails or returns nothing
   */
  async updatePassword(id, newPassword) {
    const { data, error } = await supabase
      .from("user-auth")
      .update({ password: newPassword })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};

export default userModel;
