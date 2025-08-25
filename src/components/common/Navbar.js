 import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart ,AiOutlineMenu} from "react-icons/ai"
import ProfileDropDown from '../core/auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import {IoIosArrowDropdownCircle} from "react-icons/io"

// const subLinks =[
//     {
//         title:"pyhton",
//         link:"/catalog/python"
//     },
//     {
//         title:"web dev",
//         link:"/catalog/web-dev"
//     }
// ]

 const Navbar = () => {
    const {token} = useSelector((state) =>state.auth);
    const {user} = useSelector((state) =>state.profile);
    const {totalItems} = useSelector((state)=>state.cart)
    const [subLinks , setSubLinks] =useState([]);

    const fetchSublinks = async()=>{
            try{
                const result =await apiConnector("GET",categories.CATEGORIES_API);
                console.log("Printing Sublinks result:", result);   
                setSubLinks(result.data.data)

            }catch(err){
                console.log("Could not fetch the category list")
            }
        }

    useEffect(()=>{
        fetchSublinks(); 
    },[])

    const location = useLocation();
    const matchRoute = (route) =>{
        return matchPath({path:route},location.pathname);
    }

    return (
     <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-400 '>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
            {/* image */}
            <Link to="/">
                <img src={logo} width={160} height={32}/>
            </Link>

            {/* nav links */}
            <nav className="hidden md:block">
                <ul className='flex flex-row gap-x-6 text-richblack-25 '>
                    {
                        NavbarLinks.map((link , index)=>(
                            <li key={index}>
                                {
                                    link.title==="Catalog"? (
                                        <div className={`group relative flex cursor-pointer items-center gap-1 ${
                                                             matchRoute("/catalog/:catalogName")
                                                              ? "text-yellow-25"
                                                              : "text-richblack-25"}`}>
                                            <p>{link.title}</p>
                                
                                            <IoIosArrowDropdownCircle/> 

                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]" >
                                                <div className='absolute left-[50%] top-0
                                                                 translate-x-[80%]
                                                          translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5 '>

                                                </div>
                                                {
                                                    subLinks.length ? (
                                                            subLinks.map((subLink , index)=>{
                                                                return    <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index}>
                                                                        <p className='text-black'>{subLink.name}</p>
                                                                    </Link>
                                                            })
                                                        
                                                    ) :(<div></div>)
                                                }
                                            
                                            </div>
                                        </div>
                                        ) :(
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path)? "text-yellow-25":"text-richblack-2"}`}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/* Login/Signup/Dashboard */}

            <div className="hidden items-center gap-x-4 md:flex">
                {
                    user&& user?.accountType!="Instructor" && (
                        <Link to="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {
                                totalItems > 0 && (
                                    <span className="absolute bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full
                                     bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {
                    token===null && (
                        <Link to='/login'>
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in 
                            </button>
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to='/signup'> 
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token!==null && <ProfileDropDown/>
                }
            </div>
            <button className="mr-4 md:hidden">
                <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            </button>
        </div>
     </div>
   )
 }
 
 export default Navbar