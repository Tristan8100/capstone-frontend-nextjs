import AuthTemplate from "./auth-template"
import { RegisterForm } from "../register-form"


function Register() {

  return (
    <>
      <AuthTemplate>
        <RegisterForm />
      </AuthTemplate>
    </>
  )
}

export default Register