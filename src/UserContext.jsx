import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider({children}){
    const [username, setUsername] = useState(null)
    const [id, setId] = useState(null)
    useEffect(()=>{
        axios.get('/profile').then(response=>{
            setUsername(response.data.username)
            setId(response.data.userId)
        })
    },[])
    return(
        <UserContext.Provider value={{username, id, setId, setUsername}}>{children}</UserContext.Provider>
    )
}