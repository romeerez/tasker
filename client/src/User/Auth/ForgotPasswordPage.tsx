import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from 'User/Auth/AuthLayout'
import routes from 'routes'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import { useMutation } from '@apollo/client'
import Button from 'Shared/Button'
import { sendResetPasswordMutation } from 'User/queries'

const LoginSchema = yup.object({
  email: yup.string().email().required(),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState<string>()
  const [isSent, setSent] = React.useState(false)

  const [sendResetPassword, { loading, error }] = useMutation(
    sendResetPasswordMutation,
    {
      errorPolicy: 'all',
      onCompleted(data) {
        if (data) setSent(true)
      },
    },
  )

  const form = useForm({ schema: LoginSchema })

  const submit = () => {
    const { email } = form.getValues()
    setEmail(email)
    sendResetPassword({ variables: { email } })
  }

  return (
    <AuthLayout className="max-w-sm">
      {isSent && (
        <>
          <div className="text-xl text-center">Please check your email.</div>
          <div className="mt-3">
            We sent an email to {email}, which contains a link to reset your
            password.
          </div>
        </>
      )}
      {!isSent && (
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="text-xl text-center">Forgot password?</div>
          {error && (
            <div className="text-red-500 mt-4 mb-6">{error.message}</div>
          )}
          <FloatingInput form={form} name="email" label="Email" />
          <Button type="submit" className="btn-primary mt-6" loading={loading}>
            Send me reset password instructions
          </Button>
        </form>
      )}
      <div className="text-sm mt-6">
        <div className="flex-center h-5">
          <Link to={routes.signIn} className="link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
