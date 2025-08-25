import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Iconbtn from '../../common/Iconbtn';
import { IoIosArrowBack } from "react-icons/io"
import {BsChevronDown} from 'react-icons/bs'
import { apiConnector } from '../../../services/apiconnector';
import { courseEndpoints } from '../../../services/apis';

import { getCourseCompletedLectures } from '../../../services/operations/courseDetailsAPI';
const VideoDetailsSidebar = ({setReviewModal}) => {
  
    const[activeStatus , setActiveStatus] = useState("");
    const [videobarActive , setVideobarActive] = useState("");
    const navigate = useNavigate();
    
    const {courseId,sectionId , subSectionId} = useParams();
    const[completedVideosLocal , setCompletedVideosLocal] =  useState([]);
    const location = useLocation();
    const token = useSelector((state=>state.auth));
    const user = useSelector((state)=>state.profile)
        const{
            courseSectionData,
            courseEntireData,   
            totalNoOfLectures,
            completedVideos,
        } = useSelector((state)=>state.viewCourse);
          
        useEffect(()=>{
            const setActiveFlags=()=>{
                if(!courseSectionData.length){
                    return;
                }
                
                const currentSectionIndex = courseSectionData.findIndex(
                    (data)=>data._id === sectionId
                )
                const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                    (data)=>data._id === subSectionId
                )

                const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
                // set Currenrt Section
                setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
                //set current subSection
                setVideobarActive(activeSubSectionId);
                
            }
                
            setActiveFlags();
            
        },[courseSectionData , courseEntireData , location.pathname])

        useEffect(() => {
            const fetchCompletedLectures = async () => {
                try {
                    // Get data from the URL parameters
                    // Note: The `getCourseCompletedLectures` function needs to be correctly implemented on the backend
                    // to handle these parameters.
                    const CVresponse = await getCourseCompletedLectures(
                        { courseId: courseId, userId: user._id },
                        token.token
                    );
                    console.log("RESPONSE IS", CVresponse);
                    // You should also update the state with the fetched data
                     if (CVresponse?.data?.completedVideos) {
                        console.log(CVresponse.data.completedVideos);
                         setCompletedVideosLocal(CVresponse.data.completedVideos);
                    }

                } catch (err) {
                    console.log(err);
                }
            };
            fetchCompletedLectures();
            console.log("complete Videos.....",completedVideosLocal);
        }, [courseId, user._id, token.token]); 
    return (
    <>
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        {/* for button heading */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
            {/* for buttons */}
                <div className="flex w-full items-center justify-between "> 
                    <div onClick={()=>{
                        navigate("/dashboard/enrolled-courses")
                    }} className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                    title='back'>
                        <IoIosArrowBack size={30} />
                    </div>
                    <Iconbtn
                        text="Add Review" customClasses="ml-auto" onclick={()=>setReviewModal(true)}
                        />
                    
                </div>
                {/* for heading and title */}
                <div className="flex flex-col">
                    <p>{courseEntireData?.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">{completedVideos?.length} / {totalNoOfLectures}</p>
                </div>
            </div>

            {/* for section and Subsection */}
            <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                {
                    courseSectionData.map((course , index)=>(
                        <div onClick={()=>setActiveStatus(course?._id)}  className="mt-2 cursor-pointer text-sm text-richblack-5">
                            {/* section */}
                            <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                <div className="w-[70%] font-semibold">
                                    {course?.sectionName}
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* <span className="text-[12px] font-medium">
                                        Lession {course?.subSection.length}
                                    </span> */}
                                    <span
                                        className={`transition-all duration-500 ${activeStatus === course?._id ? 'rotate-180' : 'rotate-0'}`}
                                    >
                                        <BsChevronDown />
                                    </span>
                                </div>

                                
                            </div>
                            {/* SubSection */}
                            <div>
                                {
                                    activeStatus === course?._id && (
                                        <div className="transition-[height] duration-500 ease-in-out">
                                            {
                                                course.subSection.map((topic , index)=>(
                                                    <div key={index} className={`flex gap-3  px-5 py-2 ${
                                                                videobarActive === topic._id
                                                                ? "bg-yellow-200 font-semibold text-richblack-800"
                                                                : "hover:bg-richblack-900"
                                                            } `} onClick={()=>{navigate(
                                                             `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`)
                                                            setVideobarActive(topic?._id)

                                                        }}>
                                                        <input
                                                            type='checkbox'
                                                            checked={completedVideosLocal.includes(topic?._id) || completedVideos.includes(topic?._id)}
                                                            onChange={()=>{}}
                                                        />
                                                        <span>
                                                            {topic.title }
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default VideoDetailsSidebar