import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from 'User/Auth/AuthLayout'
import routes from 'routes'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import { useMutation } from '@apollo/client'
import Button from 'Shared/Button'
import { login as acceptLogin } from 'User/service'
import { loginQuery } from 'User/queries'

const LoginSchema = yup.object({
  usernameOrEmail: yup.string().required(),
  password: yup.string().min(6).required(),
})

export default function SignInPage() {
  const [login, { loading, error }] = useMutation(loginQuery, {
    errorPolicy: 'all',
    update(cache, { data: { login } }) {
      acceptLogin(login)
    },
  })

  const form = useForm({ schema: LoginSchema })

  const submit = () => {
    login({ variables: form.getValues() })
  }

  return (
    <AuthLayout>
      <form onSubmit={form.handleSubmit(submit)}>
        <div className="text-xl text-center text-gray-900">Sign In</div>
        <div className="text-red-500 mt-2 h-6 mb-6">{error?.message}</div>
        <FloatingInput
          form={form}
          name="usernameOrEmail"
          label="Username or Email"
        />
        <FloatingInput
          form={form}
          name="password"
          label="Password"
          type="password"
        />
        <Button type="submit" className="btn-primary mt-6" loading={loading}>
          Sign In
        </Button>
        <Link to={routes.signUp} className="btn-secondary">
          Sign Up
        </Link>
      </form>
    </AuthLayout>
  )
}
