import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email
 * @param {string} from - Sender's email
 * @param {string} to - Recipient's email
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
    return { error: error.message, message: "Could not send email" };
  }
};
