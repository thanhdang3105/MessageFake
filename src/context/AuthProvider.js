import { createContext, useEffect, useState } from "react";
import { auth } from '../firebase/config'
import { Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

function AuthProvider({ children }) {
    
    const [user, setUser ] = useState({})

    const [ isloading, setIsLoading ] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(auth.getAuth(), (user) => {

            if(user) {
                const { displayName, email, uid, photoURL } = user
                setUser({
                    displayName,
                    email,
                    uid,
                    photoURL
                })
                setIsLoading(false)
                navigate('/')
            }
            else{
                setIsLoading(false)
                navigate('/login')
            }
        })

        return () => {
            unsubscribe()
        }
    } ,[navigate])

    return (
        <AuthContext.Provider value={user}>
            {isloading ? <Spin /> : children}
        </AuthContext.Provider>
    )

}

export default AuthProvider