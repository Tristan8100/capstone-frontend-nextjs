import { ForgotPasswordForm } from "@/components/forgot-password";
import AuthTemplate from "@/components/auth/auth-template";

export default function ForgotPasswordPage() {
  return (
    <>
    <AuthTemplate>
        <ForgotPasswordForm />
    </AuthTemplate>
    </>
  );
}