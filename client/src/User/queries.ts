import { gql } from '@apollo/client'

export const loginMutation = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(input: { usernameOrEmail: $usernameOrEmail, password: $password }) {
      user {
        id
        username
        firstName
        lastName
        email
      }
      accessToken
    }
  }
`

export const registerMutation = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      input: {
        username: $username
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        id
      }
    }
  }
`

export const isUsernameFreeQuery = gql`
  query IsUsernameFree($username: String!) {
    isUsernameFree(username: $username)
  }
`

export const isEmailFreeQuery = gql`
  query IsEmailFree($email: String!) {
    isEmailFree(email: $email)
  }
`

export const sendEmailConfirmationMutation = gql`
  mutation SendEmailConfirmation($email: String!) {
    sendEmailConfirmation(email: $email)
  }
`

export const verifyEmailMutation = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      user {
        id
        username
        firstName
        lastName
        email
      }
      accessToken
    }
  }
`

export const sendResetPasswordMutation = gql`
  mutation SendResetPassword($email: String!) {
    sendResetPassword(email: $email)
  }
`

export const resetPasswordMutation = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(input: { token: $token, password: $password }) {
      user {
        id
        username
        firstName
        lastName
        email
      }
      accessToken
    }
  }
`
