import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import CourseReviewModal from '../components/core/viewCourse/CourseReviewModal';
import { setcompletedVideos, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slice/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/viewCourse/VideoDetailsSidebar';
const ViewCourse = () => {

    const[reviewModal , setReviewModal]= useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);  
    const dispatch = useDispatch();
     const [loading, setLoading] = useState(true); // Add a new loading state


    useEffect(()=>{
        const setCourseSpecificDetails = async()=>{
            const courseData = await getFullDetailsOfCourse(courseId , token);
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setcompletedVideos(courseData.compledVideos));
            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec)=>{
                lectures += sec?.subSection?.length
            })
            dispatch(setTotalNoOfLectures(lectures));
        }
        setCourseSpecificDetails();
        setLoading(false);  
    },[])

  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal}/>

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6">
                    <Outlet/>
                </div>
            </div>
        </div>
        {
            reviewModal &&  <CourseReviewModal setReviewModal={setReviewModal}/>
        }
    </>
  )
}

export default ViewCourse