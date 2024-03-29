import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { parseCookies } from 'nookies'
import { withSRRGuest } from '../utils/withSSRGuest'


const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useContext(AuthContext)


  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const data = {
       email,
      password
    }

    await signIn(data)
  }

  return (
    <form onSubmit={handleSubmit} > 
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" >Entrar</button>
    </form>
  )
}

export const getServerSideProps = withSRRGuest(async (ctx) => {
  return {
    props: {}
  }
})

export default Home
