import Router from "next/router";
import { createContext, useState } from "react";
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

  async function signIn({email, password}: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { toke, refreshToken, permissions, roles } = response.data
   
      setUser({
        email,
        permissions,
        roles
      })

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