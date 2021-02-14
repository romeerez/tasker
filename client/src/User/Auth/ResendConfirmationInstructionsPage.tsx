import React from 'react'
import AuthLayout from 'User/Auth/AuthLayout'
import Button from 'Shared/Button'
import { useMutation } from '@apollo/client'
import { sendEmailConfirmationMutation } from 'User/queries'
import * as yup from 'yup'
import { useForm } from 'utils/useForm'
import FloatingInput from 'Shared/Form/FloatingInput'
import { Link } from 'react-router-dom'
import routes from 'routes'

export const sendConfirmationDelayMs = 5000

const ResendConfirmationSchema = yup.object({
  email: yup.string().email().required(),
})

type Props = {
  email?: string
  error?: string
  hideEmail?: boolean
  children?: React.ReactNode
}

export default function ResendConfirmationInstructionsPage({
  email,
  error: providedError,
  hideEmail,
  children,
}: Props) {
  const [initialError, setInitialError] = React.useState(providedError)
  const [isEmailSent, setEmailSent] = React.useState(false)

  const form = useForm({
    schema: ResendConfirmationSchema,
    defaultValues: { email },
  })

  const [
    sendConfirmationAvailable,
    setSendConfirmationAvailable,
  ] = React.useState(true)

  const onSendSettled = () => {
    setTimeout(
      () => setSendConfirmationAvailable(true),
      sendConfirmationDelayMs,
    )
  }

  const [
    sendConfirmationPerform,
    { loading: sendConfirmationLoading, error: sendConfirmationError },
  ] = useMutation(sendEmailConfirmationMutation, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data) setEmailSent(true)
      onSendSettled
    },
    onError: onSendSettled,
  })

  const disabled = sendConfirmationLoading || !sendConfirmationAvailable

  const submit = () => {
    if (disabled) return

    setInitialError(undefined)
    setEmailSent(false)
    setSendConfirmationAvailable(false)
    sendConfirmationPerform({ variables: { email: form.getValues().email } })
  }

  const error = sendConfirmationError?.message || initialError

  return (
    <div className="w-full h-full flex-col flex-center">
      <div className="box w-full max-w-sm">
        <form onSubmit={form.handleSubmit(submit)}>
          <div className="text-xl text-center">Email confirmation</div>
          {isEmailSent && (
            <div className="text-green-500 mt-4 mb-8 text-center">
              Email was sent
            </div>
          )}
          {error && <div className="text-red-500 mt-4 mb-8">{error}</div>}
          {children}
          {!hideEmail && (
            <FloatingInput form={form} name="email" label="Email" />
          )}
          {hideEmail && (
            <input ref={form.register} type="hidden" name="email" />
          )}
          <Button
            type="submit"
            className="btn-secondary mt-6"
            disabled={disabled}
          >
            Resend confirmation instructions
          </Button>
        </form>
        <div className="text-sm mt-6">
          <div className="flex-center h-5">
            <Link to={routes.signIn} className="link">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
