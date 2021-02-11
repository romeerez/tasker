import { gql } from '@apollo/client'

export const loginQuery = gql`
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

export const registerQuery = gql`
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
        username
        email
        firstName
        lastName
      }
      accessToken
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
