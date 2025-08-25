import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authApi'; 
import { useLocation } from 'react-router-dom';
import {AiFillEyeInvisible , AiFillEye} from 'react-icons/ai';
import { Link } from 'react-router-dom';
const UpdatePassword = () => {
    const [formdata ,setFormData] = useState({
        password:"",
        confirmPassword:""
    })

    const dispatch = useDispatch();
    const location = useLocation();
    const {loading} = useSelector ((state)=>state.auth);
    const [showPass , setShowPass] = useState(false);
    const [showConfirmPass , setShowConfirmPass] = useState(false);
    const { password, confirmPassword } = formdata;

    const handleOnChange = (e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value
            }
        ))
    }
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password ,confirmPassword , token));
    }
  return (
    <div  className='text-white'>
        {
            loading? (<div>
                Loading...
            </div>):(
                <div>
                    <h1>Choose new Password</h1>
                    <p>Almost done. Enter your new password and you are all set. </p>
                    <form onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password*</p>
                            <input
                                required
                                type={showPass?"text":"password"}
                                name='password'
                                value={password}
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                                onChange={handleOnChange}
                            />
                            <span onClick={()=>setShowPass((prev)=>!prev)} >
                                {
                                    showPass?(<AiFillEyeInvisible fontSize={24}/>)
                                    :(<AiFillEye fontSize={24}/>)
                                }
                            </span>
                        </label>
                        <label>
                            <p>Confirm Password*</p>
                            <input
                                required
                                type={showConfirmPass?"text":"password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleOnChange}
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                            />
                            <span onClick={()=>setShowConfirmPass((prev)=>!prev)} >
                                {
                                    showConfirmPass?(<AiFillEyeInvisible fontSize={24}/>)
                                    :(<AiFillEye fontSize={24}/>)
                                }
                            </span>
                        </label>
                        <button type='submit' >
                            Reset Password
                        </button>
                    </form>
                    <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword