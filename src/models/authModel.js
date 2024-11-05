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
   * Retrieves and deletes the reset code for a given user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Object} The reset code data, if available.
   */
  async getAndDeleteResetCode(userID) {
    // First select the reset code for the user
    const { data, error } = await supabase
      .from("reset_code")
      .select("*")
      .eq("userID", userID)
      .single(); // Retrieve only one result

    if (error) {
      throw new Error(error.message);
    }

    // Delete the reset code entry after retrieving it
    const { error: deleteError } = await supabase
      .from("reset_code")
      .delete()
      .eq("userID", userID);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return data;
  },
};

export default authModel;
