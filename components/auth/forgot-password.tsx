import AuthTemplate from "./auth-template"
import { ForgotPasswordForm } from "../forgot-password-form"


function ForgotPassword() {

  return (
    <>
      <AuthTemplate>
        <ForgotPasswordForm />
      </AuthTemplate>
    </>
  )
}

export default ForgotPassword