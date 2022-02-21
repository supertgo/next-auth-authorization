import { destroyCookie } from "nookies"
import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../contexts/AuthContext"
import { AuthTokenError } from "../errors/AuthTokenError"
import { useCan } from "../hooks/useCan"
import { setupApiClient } from "../services/api"
import { api } from "../services/apiClient"
import { withSRRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
  const { user }  = useContext(AuthContext)
  

  useEffect(() => {
    api.get('/me')
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }, [])


  return (
    <>
      <h1>Dashboard {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
    </>
  )
  
  
} 

export const getServerSideProps = withSRRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx)
  const response =  await apiClient.get('/me')

  console.log(response)
 
  return {  
    props: {}
  }
})