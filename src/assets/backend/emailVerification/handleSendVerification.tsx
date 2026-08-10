import { getAuth, sendEmailVerification } from "firebase/auth";

export const handleSendVerification = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent!");
      // Show a message to the user: "Check your inbox for a verification link."
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};