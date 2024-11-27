import supabase from "../config/db.js";

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
      .from("reset-code")
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

    return { data, message: "Reset code inserted successfully" };
  },

  /**
   * Retrieves the reset code for a given user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Object} The reset code data, if available.
   */
  async getResetCode(userID) {
    const { data, error } = await supabase
      .from("reset-code")
      .select("*")
      .eq("userID", userID)
      .order("expirationTime", { ascending: false }) // Fetch the latest reset code
      .limit(1) // Ensure only one row is returned
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { data, message: "Reset code retrieved successfully" };
  },

  /**
   * Deletes the reset code for a given user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Object} A success message if deletion was successful.
   */
  async deleteResetCode(userID) {
    const { error } = await supabase
      .from("reset-code")
      .delete()
      .eq("userID", userID);

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Reset code deleted successfully" };
  },
};

export default authModel;
