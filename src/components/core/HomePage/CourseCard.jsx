import React from 'react'
import{TbBinaryTree2Filled} from "react-icons/tb" 
import { HiMiniUsers } from "react-icons/hi2";

const CourseCard = ({cardData , currentCard , setCurrentCard }) => {
  console.log(currentCard)
  console.log(cardData);

  return (
    <div className={`mx-auto text-richblack-300 w-[341.3333435058594px] h-[300px] ${currentCard===cardData.heading? "bg-white shadow-[12px_20px_0px_0px_rgba(255,214,10,1)] rounded" :"bg-richblack-800"}`} >
        <div>
            <h2 className={`${currentCard===cardData.heading?"text-richblack-800" :"text-richblack-25"} font-inter font-semibold text-[20px] mt-5 ml-4`}>{cardData.heading}</h2>
            <div className='w-[293px] h-[93px]'>
              <p className={`text-md text-[16px] text-richblack-500 mt-3 ml-4  `}>{cardData.description}</p>
            </div>
            <div className={`w-[341px] h-[56px] flex flex-row ${currentCard ===cardData.heading? "bg-white" :"bg-richblack-800"} mt-24 items-center justify-between border-t-2 border-dashed  border-richblack-50`} >
              <div className='flex flex-row items-center text-blue-500 ml-5'>
                <HiMiniUsers className={`w-[17.73px] h-[16px] ${currentCard ===cardData.heading? "text-blue-500":"text-richblack-300"}`}/>
                <p className={`px-1 py-2 ${currentCard ===cardData.heading? "text-blue-500":"text-richblack-300"} `}>Beginner</p>
              </div>
              <div className='flex flex-row items-center mr-4'>
                <TbBinaryTree2Filled className={`w-[17.73px] h-[16px] text-blue-500 ${currentCard ===cardData.heading? "text-blue-500":"text-richblack-300"}`}/>
                <p className={`ml-1 text-blue-500 ${currentCard ===cardData.heading? "text-blue-500":"text-richblack-300"}`}>6 Lessons</p>
              </div>


            </div>
            
        </div>
    </div>
  )
}


export default CourseCard 