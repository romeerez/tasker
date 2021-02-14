import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from 'User/Auth/AuthLayout'
import routes from 'routes'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import { useMutation } from '@apollo/client'
import { checkEmail, checkUsername } from 'User/service'
import Button from 'Shared/Button'
import { registerMutation } from 'User/queries'
import ResendConfirmationInstructionsPage from 'User/Auth/ResendConfirmationInstructionsPage'

const RegisterSchema = yup.object({
  username: yup
    .string()
    .required()
    .test('unique-username', 'Username is already taken', checkUsername),
  email: yup
    .string()
    .email()
    .required()
    .test('unique-email', 'Email is already taken', checkEmail),
  password: yup.string().min(6).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})

export default function SignUpPage() {
  const [registeredEmail, setRegisteredEmail] = React.useState<string>()

  const [register, { loading, error, data: registered }] = useMutation(
    registerMutation,
    {
      errorPolicy: 'all',
    },
  )

  const form = useForm({ schema: RegisterSchema, mode: 'onChange' })

  const submit = () => {
    const variables = form.getValues()
    setRegisteredEmail(variables.email)
    register({ variables })
  }

  if (registered && registeredEmail)
    return (
      <ResendConfirmationInstructionsPage email={registeredEmail} hideEmail>
        <div className="mt-2 mb-4">
          A message with a confirmation link has been sent to your email
          address.
        </div>
        Please follow the link to activate your account.
      </ResendConfirmationInstructionsPage>
    )

  return (
    <AuthLayout className="max-w-md">
      <div className="text-xl text-center">Sign Up</div>
      {error && <div className="text-red-500 mt-4 mb-6">{error.message}</div>}
      <form onSubmit={form.handleSubmit(submit)} className="mt-10">
        <FloatingInput form={form} name="username" label="Username" />
        <FloatingInput form={form} name="firstName" label="First name" />
        <FloatingInput form={form} name="lastName" label="Last name" />
        <FloatingInput form={form} name="email" label="Email" type="email" />
        <FloatingInput
          form={form}
          name="password"
          label="Password"
          type="password"
        />
        <Button type="submit" className="btn-primary mt-6" loading={loading}>
          Sign Up
        </Button>
        <Link to={routes.signIn} className="btn-secondary mt-3">
          Sign In
        </Link>
        <div className="text-sm mt-6">
          <div className="flex-center h-5">
            <Link to={routes.forgotPassword} className="link">
              Forgot password?
            </Link>
          </div>
          <div className="flex-center h-5 mt-3">
            <Link to={routes.resendConfirmationInstructions} className="link">
              Didn't receive confirmation instructions?
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  )
}
