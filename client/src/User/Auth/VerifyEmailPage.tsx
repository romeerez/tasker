import React from 'react'
import { useLocation } from 'react-router-dom'
import ResendConfirmationInstructionsPage from 'User/Auth/ResendConfirmationInstructionsPage'
import jwtDecode from 'jwt-decode'
import Spinner from 'Shared/Spinner'
import { useMutation } from '@apollo/client'
import { verifyEmailMutation } from 'User/queries'
import { login } from 'User/service'

const tokenParamName = 'token'

export default function VerifyEmailPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const token = params.get(tokenParamName)
  let email: string | undefined
  if (token) {
    try {
      email = jwtDecode<{ email: string }>(token).email
    } catch (error) {
      // noop
    }
  }

  const [cantVerify, setCantVerify] = React.useState(false)

  const [verifyEmail] = useMutation(verifyEmailMutation, {
    onCompleted({ verifyEmail }) {
      if (verifyEmail) login(verifyEmail)
      else setCantVerify(true)
    },
  })

  React.useEffect(() => {
    verifyEmail({ variables: { token } })
  }, [email])

  if (!email || cantVerify)
    return (
      <ResendConfirmationInstructionsPage error="Confirmation token is invalid" />
    )

  return (
    <div className="w-full h-full flex-center flex-col">
      <div>Verifying email...</div>
      <div className="relative w-10 h-10 mt-4">
        <Spinner className="w-full h-full text-blue-500" />
      </div>
    </div>
  )
}
