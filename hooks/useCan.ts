import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

type UseCanProps = {
  permissions?: string[],
  roles?: string[]
}
export function useCan({roles, permissions}: UseCanProps) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if(!isAuthenticated) {
    return false
  }

  if(permissions?.length > 0) {
    const hasAllPermissions = permissions.some(permission => {
      return user.permissions.includes(permission)
    })

    if(!hasAllPermissions) {
      return false
    }
  }


  if(roles?.length > 0) {
    const hasAllRoles = roles.every(role => {
      return user.permissions.includes(role)
    })

    if(!hasAllRoles) {
      return false
    }
  }

  return true
}