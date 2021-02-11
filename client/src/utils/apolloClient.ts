import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getCurrentUser } from 'User/service'

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  const user = getCurrentUser()
  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.accessToken}` : '',
    },
  }
})

export const serverClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
