import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from "axios"
export const adminDataContext = createContext()
function AdminContext({children}) {
    const {serverUrl} = useContext(authDataContext)
    const[adminData, setAdminData] = useState(null)

    const getCurrentAdmin = async ()=>{
        try {
            const result = axios.get(`${serverUrl}/api/admin/currentadmin`,
                {withCredentials: true})
                setAdminData(result.data)
            
        } catch (error) {
            console.log(error)
            setAdminData(null)
            
        }
    }

    useEffect(()=>{
        getCurrentAdmin()
    }, [])

    const value = {
        adminData,
        setAdminData
    }
  return (
    <div>
      <adminDataContext.Provider value={value}>
        {children}
      </adminDataContext.Provider>
     
    </div>
  )
}

export default AdminContext
