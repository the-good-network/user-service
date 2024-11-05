import supabase from "../../config/db.js";

const authModel = {
  /**
   * Inserts a reset code into the "reset_code" table with an expiration time.
   * @param {number} userID - The ID of the user.
   * @param {string} resetCode - The reset code.
   * @returns {Object} The inserted reset code data.
   */
  async insertResetCode(userID, resetCode) {
    // Set a 5-minute expiration time
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("reset_code")
      .insert([
        {
          userID: userID,
          resetCode: resetCode,
          expirationTime: expirationTime,
        },
      ])
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Retrieves the reset code for a given user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Object} The reset code data, if available.
   */
  async getResetCode(userID) {
    // Retrieve the reset code data for the specified user ID
    const { data, error } = await supabase
      .from("reset_code")
      .select("*")
      .eq("userID", userID)
      .single(); // Retrieve only one result

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Deletes the reset code for a given user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Object} A success message if deletion was successful.
   */
  async deleteResetCode(userID) {
    const { error } = await supabase
      .from("reset_code")
      .delete()
      .eq("userID", userID);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Reset Code deleted successfully" };
  },
};

export default authModel;
