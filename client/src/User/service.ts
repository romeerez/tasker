import { setItem, useLocalStorage } from 'utils/localStorage'
import { CurrentUser } from './types'
import { serverClient } from 'utils/apolloClient'
import debounce from 'debounce-promise'
import { isEmailFreeQuery, isUsernameFreeQuery } from 'User/queries'
import * as yup from 'yup'

const storageKey = 'currentUser'

let currentUser: CurrentUser | null

const validateAndParse = (json: string | null) => {
  if (!json) return null

  const user = JSON.parse(json)
  if (
    typeof user === 'object' &&
    user.firstName &&
    user.lastName &&
    user.email &&
    user.accessToken
  )
    return user

  return null
}

export const useCurrentUser = (): CurrentUser | null => {
  const [json] = useLocalStorage(storageKey)
  if (!currentUser) currentUser = validateAndParse(json)
  return currentUser
}

export const getCurrentUser = () => {
  if (!currentUser) {
    const json = localStorage.getItem(storageKey)
    currentUser = validateAndParse(json) as CurrentUser
  }
  return currentUser
}

export const setCurrentUser = (user?: CurrentUser) => {
  currentUser = user as CurrentUser
  setItem(storageKey, user ? JSON.stringify(user) : null)
}

export const login = ({
  user,
  accessToken,
}: {
  user: Omit<CurrentUser, 'accessToken'>
  accessToken: string
}) => {
  serverClient.resetStore()
  setCurrentUser({ ...user, accessToken })
}

export const logOut = () => {
  serverClient.resetStore()
  setCurrentUser()
}

export const checkUsername = debounce(async (username: string | undefined) => {
  if (!username) return true

  const res = await serverClient.query<{ isUsernameFree: boolean }>({
    query: isUsernameFreeQuery,
    variables: { username },
  })
  return res.data.isUsernameFree
}, 300)

const yupEmail = yup.object({
  email: yup.string().email().required(),
})

export const checkEmail = debounce(async (email: string | undefined) => {
  try {
    yupEmail.validateSync({ email })
  } catch (err) {
    return true
  }

  const res = await serverClient.query<{ isEmailFree: boolean }>({
    query: isEmailFreeQuery,
    variables: { email },
  })
  return res.data.isEmailFree
}, 300)
