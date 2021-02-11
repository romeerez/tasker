import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import routes from 'routes'
import Layout from 'App/Layout/Layout'
import SignInPage from 'User/Auth/SignInPage'
import SignUpPage from 'User/Auth/SignUpPage'
import DashboardPage from 'Dashboard/DashboardPage'
import { useCurrentUser } from 'User/service'

const AuthRoutes = () => (
  <Switch>
    <Route path={routes.signIn} exact component={SignInPage} />
    <Route path={routes.signUp} exact component={SignUpPage} />
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
      {!user && <AuthRoutes />}
      {user && <UserRoutes />}
    </>
  )
}
