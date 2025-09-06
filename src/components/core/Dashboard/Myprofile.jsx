import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Iconbtn from '../../common/Iconbtn';
import { formattedDate } from '../../../utils/dateFormatter';
const Myprofile = () => {
const {user} = useSelector((state)=>state.profile);
const navigate = useNavigate();


    return (

    <div className=''>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">My Profile</h1>
        {/* section 1 */}
        <div className= "flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex items-center gap-x-4">
                <img src={user?.image} alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover"/>
                <div className="space-y-1">
                    <p className="text-lg font-semibold text-richblack-5">{user?.firstName + " "+user?.lastName}</p>
                    <p className="text-sm text-richblack-300">{user?.email}</p>
                </div>
            </div>
            <Iconbtn text="Edit" onclick={()=>{
                navigate("/dashboard/setting")
            }}/>
        </div>

        {/* section 2 */}
        <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold text-richblack-5">About</p>
                <Iconbtn text="Edit"
                onclick={()=>{
                    navigate("/dashboard/settings")
                }}
            />
            </div>
            <p className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}>{user?.additionalDetails?.about ?? "Write Something about Yourself"}</p>

        </div>
        

        {/* section 3 */}
        <div className="my-10 flexs flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex w-full items-center justify-between">
                <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                <Iconbtn  text="Edit"
                onclick={()=>{
                    navigate("/dashboard/settings")
                }}/>
            </div>
            <div className="flex  justify-between">
          <div className="flex flex-col gap-y-5">
            <div >
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
        </div>

    </div>
  )
}

export default Myprofile
