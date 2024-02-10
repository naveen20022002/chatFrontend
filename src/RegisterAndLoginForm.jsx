import React, { useContext, useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext';

const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login')
  const {setUsername:setLoggedInUsername, setId} = useContext(UserContext)

  async function Register(ev){
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login"
    const {data} = await axios.post(url, {username, password})
    setLoggedInUsername(username);
    setId(data.id)
  }

  return (
    <div className='bg-gray-900 h-screen flex-col flex justify-center items-center'>
      <div className='flex gap-2 text-xl text-gray-200'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
        <h1 className='text-white mb-10 text-bold'>SpeakEase</h1>
      </div>
      <form className='w-64 mx-auto mb-12' onSubmit={Register}>
        <input value={username} onChange={ev => setUsername(ev.target.value)} type="text" placeholder='username' className='block w-full border-gray-500 rounded-sm mb-2 p-2 border'/>
        <input value={password} onChange={ev => setPassword(ev.target.value)} type="password" placeholder='password' className='block w-full border-gray-500 rounded-sm mb-2 p-2 border'/>
        <button className='bg-gray-400 text-bold text-gray-900 block w-full rounded-sm p-2'>
          {isLoginOrRegister === 'register' ? "Register" : "Login"}
        </button>
        <div className="text-center text-gray-200 mt-2">
          {isLoginOrRegister === "register" && ( 
            <div>
            Already a member? <button  className="ml-1" onClick={()=>{setIsLoginOrRegister('login')}}>Login here</button>
            </div>
          )}
          {isLoginOrRegister === "login" && ( 
            <div>
            Dont have an account? <button  className="ml-1" onClick={()=>{setIsLoginOrRegister('register')}}>Register</button>
            </div>
          )}
        </div>
        
      </form>
    </div>
  )
}

export default RegisterAndLoginForm
