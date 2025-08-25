import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore';
import HiglightText from "../HomePage/HiglightText";
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Career paths"
];

const Exploremore = () => {
  
  const [currentTab , Setcurrenttab] = useState(tabsName[0]);
  const[courses , setCourses] = useState(HomePageExplore[0].courses);
  const[currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);
  
  const setMyCard =(value)=>{
    Setcurrenttab(value);
    const result = HomePageExplore.filter((course)=> course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  }

  return (
    <div className='flex flex-col items-center '>
        <div className='text-4xl font-semibold text-center '>
          Unlock the 
          <HiglightText text={" Power of code"}/>
        </div>
        <p className='text-center text-richblack-300 text-[16px] sm:mt-3'>
          Learn to build anything you can imagine
        </p>
        <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1 w-fit flex-wrap justify-center mx-auto max-w-full' >
          {
            tabsName.map((element , index)=>{
              return(
                <div className={`text-[16px] flex flex-row items-center gap-2 ${currentTab === element 
                ? "bg-richblack-900 text-richblack-5 font-medium" :"text-richblack-200 " }
                 rounded-full transition-all duration-200 cursor-pointer hover:text-richblack-5 px-7 py-2`} key={index} onClick={()=>setMyCard(element)}>
                  {element}
                </div>
              )
            })
          }
        </div>

        <div className='lg:h-[150px] flex flex-row justify-center flex-wrap'>
          {/* Course Card ka group */}
          <div className='flex lg:flex-row absolute gap-[35px] justify-between  '>
            {
              courses.map( (element , index )=>{
                
                console.log(element);
                return(
                  <CourseCard key={index} cardData={element} 
                    currentCard ={currentCard} setCurrentCard ={setCurrentCard} 
                  />
                )
              } )
            }    
            
          </div>
        </div>
    </div>
    
  )
}

export default Exploremore