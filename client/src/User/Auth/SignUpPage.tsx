import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from 'User/Auth/AuthLayout'
import routes from 'routes'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import { useMutation } from '@apollo/client'
import { checkEmail, checkUsername, login as acceptLogin } from 'User/service'
import Button from 'Shared/Button'
import { registerQuery } from 'User/queries'

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
  const [register, { loading, error }] = useMutation(registerQuery, {
    errorPolicy: 'all',
    update(cache, { data: { register } }) {
      acceptLogin(register)
    },
  })

  const form = useForm({ schema: RegisterSchema, mode: 'onChange' })

  const submit = () => {
    register({ variables: form.getValues() })
  }

  return (
    <AuthLayout>
      <form onSubmit={form.handleSubmit(submit)}>
        <div className="text-xl text-center text-gray-900">Sign Up</div>
        <div className="text-red-500 h-6 mt-2 mb-6">{error?.message}</div>
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
        <Link to={routes.signIn} className="btn-secondary">
          Sign In
        </Link>
      </form>
    </AuthLayout>
  )
}
