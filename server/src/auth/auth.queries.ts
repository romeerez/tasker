import { gql } from 'common/graphql-request';

export const findForLoginQuery = gql`
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
      confirmedAt
    }
  }
`;

export const findByEmailQuery = gql`
  query GetUserByEmail($email: String!) {
    user(where: { email: { _eq: $email } }) {
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

export const getEmailConfirmationInfoByEmail = gql`
  query GetConfirmationSentAt($email: String!) {
    user(where: { email: { _eq: $email } }) {
      confirmedAt
      confirmationSentAt
    }
  }
`;

export const getResetPasswordSentAtByEmail = gql`
  query GetConfirmationSentAt($email: String!) {
    user(where: { email: { _eq: $email } }) {
      resetPasswordSentAt
    }
  }
`;

export const setConfirmationSentAtByEmail = gql`
  mutation SetConfirmationSentAtByEmail(
    $email: String!
    $confirmationSentAt: timestamptz!
  ) {
    update_user(
      where: { email: { _eq: $email } }
      _set: { confirmationSentAt: $confirmationSentAt }
    ) {
      affected_rows
    }
  }
`;

export const setResetPasswordSentAtByEmail = gql`
  mutation SetResetPasswordSentAtByEmail(
    $email: String!
    $resetPasswordSentAt: timestamptz!
  ) {
    update_user(
      where: { email: { _eq: $email } }
      _set: { resetPasswordSentAt: $resetPasswordSentAt }
    ) {
      affected_rows
    }
  }
`;

export const setConfirmedAtById = gql`
  mutation SetConfirmedAt($id: bigint!, $confirmedAt: timestamptz!) {
    update_user(
      where: { id: { _eq: $id }, confirmedAt: { _is_null: true } }
      _set: { confirmedAt: $confirmedAt }
    ) {
      affected_rows
    }
  }
`;

export const setConfirmedAtByEmail = gql`
  mutation SetConfirmedAt($email: String!, $confirmedAt: timestamptz!) {
    update_user(
      where: { email: { _eq: $email }, confirmedAt: { _is_null: true } }
      _set: { confirmedAt: $confirmedAt }
    ) {
      affected_rows
    }
  }
`;

export const resetPassword = gql`
  mutation ResetPassword($email: String!, $password: String!) {
    update_user(
      where: { email: { _eq: $email } }
      _set: { password: $password }
    ) {
      returning {
        id
        username
        firstName
        lastName
        email
      }
    }
  }
`;
