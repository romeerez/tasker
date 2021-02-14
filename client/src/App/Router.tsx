import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import routes from 'routes'
import Layout from 'App/Layout/Layout'
import SignInPage from 'User/Auth/SignInPage'
import SignUpPage from 'User/Auth/SignUpPage'
import VerifyEmailPage from 'User/Auth/VerifyEmailPage'
import ForgotPasswordPage from 'User/Auth/ForgotPasswordPage'
import ResetPasswordPage from 'User/Auth/ResetPasswordPage'
import ResendConfirmationInstructionsPage from 'User/Auth/ResendConfirmationInstructionsPage'
import DashboardPage from 'Dashboard/DashboardPage'
import { useCurrentUser } from 'User/service'

const PublicRoutes = () => (
  <Switch>
    <Route path={routes.signIn} exact component={SignInPage} />
    <Route path={routes.signUp} exact component={SignUpPage} />
    <Route path={routes.verifyEmail} exact component={VerifyEmailPage} />
    <Route
      path={routes.resendConfirmationInstructions}
      exact
      component={ResendConfirmationInstructionsPage}
    />
    <Route path={routes.forgotPassword} exact component={ForgotPasswordPage} />
    <Route path={routes.resetPassword} exact component={ResetPasswordPage} />
    <Redirect to={routes.signIn} />
  </Switch>
)

const UserRoutes = () => (
  <Switch>
    <Layout>
      <Route path={routes.root} exact component={DashboardPage} />
      <Redirect to={routes.root} />
    </Layout>
  </Switch>
)

export default function Router() {
  const user = useCurrentUser()

  return (
    <>
      {!user && <PublicRoutes />}
      {user && <UserRoutes />}
    </>
  )
}
