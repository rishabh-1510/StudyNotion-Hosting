import React from 'react'
import { useReducer } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';
import Myprofile from '../components/core/Dashboard/Myprofile';


const Dashboard = () => {
    const {loading : authLoading} = useSelector((state)=>state.auth);
    const {loading : profileLoading} = useSelector((state)=>state.auth);
    
    if(authLoading || profileLoading){
        return(
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
              <div className="spinner"></div>
            </div>
        )
    }
  
    return (
    <div className='relative flex justify-between min-h-[calc(100vh-3.5rem)] w-full'>
       <Sidebar/>
        <div className='h-[calc(100vh-3.5rem)] overflow-auto w-full '>
            <div className='mx-auto w-11/12  max-w-[1000px] py-10'>
                <Outlet/>
            </div>
        </div>
        
    </div>
  )
}

export default Dashboard