import Router from "next/router";
import { setCookie, parseCookies } from 'nookies'
import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  isAuthenticated: boolean;
  user: User
  signIn(credentials: SignInCredentials): Promise<void>
}

type AuthPRoviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextData) 

export function AuthProvider({children}: AuthPRoviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user

  useEffect(() => {
    const {'nextauth.token': token } = parseCookies()

    if(token) {
      api.get('me').then(response => {
       const { email, permissions, roles } = response.data

       setUser({email, permissions, roles})
      })
    }
  }, [])

  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/'
      })
   
      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')

    } catch (error) {
      console.log(error)
    }
   
  }
  return (
    <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
      {children}
    </AuthContext.Provider>
  )
}