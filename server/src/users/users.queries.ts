import { gql } from 'utils/graphql-request';

export const findByUsernameOrEmailQuery = gql`
  query GetUserByEmail($usernameOrEmail: String!) {
    user(
      where: {
        _or: [
          { username: { _eq: $usernameOrEmail } }
          { email: { _eq: $usernameOrEmail } }
        ]
      }
    ) {
      id
      username
      firstName
      lastName
      email
      password
    }
  }
`;

export const registerQuery = gql`
  mutation Register(
    $username: String!
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    insert_user_one(
      object: {
        username: $username
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      id
      updatedAt
      createdAt
    }
  }
`;

export const getUserIdByUsername = gql`
  query GetUserIdByUsername($username: String!) {
    user(where: { username: { _eq: $username } }) {
      id
    }
  }
`;

export const getUserIdByEmail = gql`
  query GetUserIdByUsername($email: String!) {
    user(where: { email: { _eq: $email } }) {
      id
    }
  }
`;
