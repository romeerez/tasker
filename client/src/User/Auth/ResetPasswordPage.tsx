import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import AuthLayout from 'User/Auth/AuthLayout'
import Button from 'Shared/Button'
import routes from 'routes'
import { useMutation } from '@apollo/client'
import { resetPasswordMutation } from 'User/queries'
import { login as acceptLogin } from 'User/service'

const ResetPasswordSchema = yup.object({
  password: yup.string().min(6).required(),
})

export default function ResetPasswordPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const token = params.get('token')
  let email: string | undefined
  if (token) {
    try {
      email = jwtDecode<{ email: string }>(token).email
    } catch (error) {
      // noop
    }
  }

  const [resetPassword, { loading, error: resetPasswordError }] = useMutation(
    resetPasswordMutation,
    {
      errorPolicy: 'all',
      onCompleted(data) {
        if (data) acceptLogin(data.resetPassword)
      },
    },
  )

  const form = useForm({ schema: ResetPasswordSchema })

  const submit = () => {
    if (!email) return
    resetPassword({ variables: { ...form.getValues(), token } })
  }

  const error = !email
    ? 'Reset password token is invalid'
    : resetPasswordError?.message

  return (
    <AuthLayout className="max-w-sm">
      <form onSubmit={form.handleSubmit(submit)}>
        <div className="text-xl text-center">Reset Password</div>
        {error && <div className="text-red-500 mt-4 mb-6">{error}</div>}
        {email && (
          <>
            <FloatingInput
              form={form}
              type="password"
              name="password"
              label="New Password"
            />
            <Button
              type="submit"
              className="btn-primary mt-6"
              loading={loading}
            >
              Set New Password
            </Button>
          </>
        )}
      </form>
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
