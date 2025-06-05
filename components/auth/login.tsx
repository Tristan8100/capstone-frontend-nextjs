import AuthTemplate from "./auth-template"
import { LoginForm } from "../login-form"


function Login() {

  return (
    <>
      <AuthTemplate>
        <LoginForm />
      </AuthTemplate>
    </>
  )
}

export default Login