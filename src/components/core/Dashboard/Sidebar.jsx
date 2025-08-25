import React, { useState } from 'react'
import {sidebarLinks} from "../../../data/dashboard-links"
import { logout } from '../../../services/operations/authApi'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { VscSettingsGear, VscSignOut } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
    const {user,loading: profileLoading} =useSelector((state)=>state.profile)
    const { loading: authLoading} =useSelector((state)=>state.auth)

    const dispatch = useDispatch();
    const navigate =useNavigate();

    const [confirmationModal , setConnfirmationModal]=useState(null);
 

    if(authLoading || profileLoading){
        return(
            <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
                <div  className="spinner">

                </div>
            </div>
        )
    }
  return (
    <div >
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-richblack-700 h-[calc[100vh-3.5rem]] bg-richblack-800 py-10 h-full'>
            <div className='flex flex-col  '>
                {
                    sidebarLinks.map((link)=>{
                        if(link.type && user?.accountType !==link.type) return null;
                        return (<SidebarLink link={link} iconName={link.icon} key={link.id}/>)
                    })
                }

            </div>
            <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>
            <div className='flex flex-col '>
                <SidebarLink 
                    link={{name:"Settings" , path:"dashboard/settings "}}
                    iconName="VscSettingsGear"
                    
                />
                <button onClick={()=>setConnfirmationModal({
                    
                    text1:"Are You Sure ?",
                    text2:"You will be logged out of your Account",
                    btn1Text:"Logout",
                    btn2Text:"Cancel",
                    btn1Handler:()=> dispatch(logout(navigate)),
                    btn2Handler:()=> dispatch(setConnfirmationModal(null))
                
                })} className="px-8 py-2 text-sm font-medium text-richblack-300">
                    <div className='flex items-center  gap-x-2 '>
                        <VscSignOut className='text-lg '/>
                        <span>Logout</span>
                    </div>
                </button>
            </div>

        </div>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
        }
    </div>
  )
}

export default Sidebar