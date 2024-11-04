import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email
 * @param {string} from - Sender's email
 * @param {string[]} to - Recipient's email array
 * @param {string} resetCode - 6-digit password reset code
 * @returns {Object} - Success or error message
 */
export const sendForgotPasswordEmail = async (from, to, resetCode) => {
  try {
    const { data } = await resend.emails.send({
      from: from,
      to: to,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your account at <strong>The Good Network</strong>.</p>
          <p>Please use the following code to reset your password:</p>
          <p style="font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 0;">${resetCode}</p>
          <p>Enter this code on the password reset page to complete the process.</p>
          <p>If you didn't request a password reset, you can ignore this email. Your password will remain the same.</p>
          <p>Best regards,<br>The Good Network Team</p>
        </div>
      `,
    });

    if (data) {
      return { message: "Password reset email sent successfully" };
    }
  } catch (error) {
    return {
      error: error.message,
      message: "Could not send password reset email",
    };
  }
};

/**
 * Sends a warm welcome email during signup
 * @param {string} from - Sender's email
 * @param {string[]} to - Recipient's email array
 * @param {string} username - Recipient's username when signing up
 * @returns  {Object} - Success or error message
 */
export const sendSignupEmail = async (from, to, username) => {
  try {
    const { data } = await resend.emails.send({
      from: from,
      to: to,
      subject: "Welcome to The Good Network!",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Welcome to The Good Network, ${username}!</h2>
            <p>Hello ${username},</p>
            <p>We're thrilled to have you join us! At <strong>The Good Network</strong>, we're building a community dedicated to making meaningful connections and positive changes.</p>
            <p>As a new member, you're now part of a vibrant network where you can connect, collaborate, and grow together.</p>
            <p>Here are a few tips to get started:</p>
            <ul>
              <li>Complete your profile to let others know more about you.</li>
              <li>Explore our forums and groups to find topics that interest you.</li>
              <li>Connect with other members and start building your network.</li>
            </ul>
            <p>If you have any questions, feel free to reach out—we're here to help!</p>
            <p>Welcome aboard, and enjoy your journey with us!</p>
            <p>Best regards,<br>The Good Network Team</p>
          </div>
        `,
    });

    if (data) {
      return { message: "Signup email sent successfully" };
    }
  } catch (error) {
    return { error: error.message, message: "Could not send signup email" };
  }
};
