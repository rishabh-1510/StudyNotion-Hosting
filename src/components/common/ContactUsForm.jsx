import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form"
import { apiConnector } from '../../services/apiconnector';
import CountryCode from "../../data/countrycode.json"
import { contactusEndpoint } from '../../services/apis';

const ContactUsForm = () => {
  const [loading , setLoading] = useState(false);
    const {
        register, handleSubmit , reset , formState:{errors , isSubmitSuccessful}
    } = useForm();
    
    const submitContactForm = async (data)=>{
        console.log("Logging Data" , data);
        try{
            setLoading(true);
            const response  = await apiConnector("POST" , contactusEndpoint.CONTACT_US_API , data);
            //const response = {status :"OK"};
            console.log("Logging Response" , response);
            setLoading(false);
        }
        catch(err){
            console.log("Error",err.messsage);
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                messsage:"",
                phoneNo:"",

            });
        }
    },[reset , isSubmitSuccessful])

    return (
        <form  onSubmit={handleSubmit(submitContactForm)}>
        <div className='flex flex-col gap-7'>
            <div className="flex flex-col gap-5 lg:flex-row" >
                {/* first name */}
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='firstname' className='label-style'>First Name</label>
                    <input
                        required
                        type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter First Name'
                        className='form-style '
                        {...register("firstname",{required:true})}

                    />
                    {
                        errors.firstname &&(

                            <span  className="-mt-1 text-[12px] text-yellow-100">
                                Please enter Your name
                            </span>
                        )
                    }
                </div>
                {/* last name  */}
                 <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor='lastname' className='label-style'>Last Name</label>
                    <input
                        required
                        className='form-style'
                        type='text'
                        name='lastname'
                        id='lastname'
                        placeholder='Enter First Name'
                        {...register("lastname")}

                    />
                    {
                        errors.lastname &&(

                            <span>
                                Please enter Your name
                            </span>
                        )
                    }
                </div>

                


            </div>
              {/* email */}
            <div className="flex flex-col gap-2">
                    <label htmlFor='email' className='label-style'>Email Address</label>
                    <input
                        
                        type='email'
                        className='form-style'
                        name='email'
                        id='email'
                        placeholder='Enter email Address'
                        {...register("email",{required:true})}
                        
                    />
                    {
                        errors.email && (
                            <span>
                                Please enter your email address
                            </span>
                        )
                    }
            </div>

            {/* phone number */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='phonenumber' className='label-style'>Phone Number</label>
                    <div className='flex gap-5'>
                        {/* dropdown */}
                         <div className="flex w-[81px] flex-col gap-2">
                            <select className='form-style text-richblack-800'
                                name='dropdown'
                                id='dropdown'
                                {...register("countrycode",{required:true})} 
                                 
                                >
                                {
                                    CountryCode.map((element , index)=>{
                                        return(
                                            <option key={index} value={element.code} className='text-black '>
                                                {element.code} - {element.country}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                         </div>
                            

                        <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                            <input
                            type='number' 
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='form-style'
                            {...register("phoneNo",{required:{value:true , message:"Please enter phone number"} , maxLength:{value:10,messsage:"Invalid Phone Number"},minLength:{value:8,messsage:"Invalid Phone Number"}})}
                        />
                        </div>
                         
                            
                        
                    </div>
                    {
                        errors.phoneNo && (
                            <span>
                                {errors.phoneNo.message}
                            </span>
                        )
                    }
            </div>

            {/* message */}
            <div className='flex flex-col gap-2'>
                    <label htmlFor='message' className='label-style'>Message</label>
                    <textarea
                        className='form-style'
                        name='message'
                        id='message'
                        cols="30"
                        rows="7"
                        placeholder='Enter Your message'
                        {...register("message",{required:true})}
                    />
                    {
                        errors.messsage && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your message.
                            </span>
                        )   
                    }
            </div>

            <button type='submit' className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `} >
                Send Message
            </button>
        </div>
            
        </form> 
    )
}

export default ContactUsForm