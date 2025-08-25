import React, { useEffect, useRef, useState } from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updatecompletedVideos } from '../../../slice/viewCourseSlice';
import {Player ,BigPlayButton} from 'video-react';
import 'video-react/dist/video-react.css';
import {AiFillPlayCircle} from "react-icons/ai"
import Iconbtn from '../../common/Iconbtn';
 

const VideoDetails = () => {

  const {courseId , sectionId , subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData , courseEntireData,completedVideos} = useSelector((state)=>state.viewCourse);

  const[videoData , setVideoData] = useState([]);
  const [videoEnded , setVideoEnded] = useState(false);
  const [loading , setLoading] = useState(false);
  
  useEffect(()=>{
      const setVideoSpecificDetails = ()=>{
        if(!courseSectionData.length){
          return;
        }
        if(!courseId && !sectionId && !subSectionId){
          navigate("/dashboard/enrolled-courses");
        }
        else{
          //assume all three are present
          const filteredData = courseSectionData.filter((course)=>course._id===sectionId);

          const filterVideoData = filteredData?.[0]?.subSection?.filter(
            (data)=>data._id===subSectionId
          )
          setVideoData(filterVideoData[0]);
          setVideoEnded(false);
        }
      } 
      setVideoSpecificDetails();
  },[courseSectionData , courseEntireData , location.pathname])

  const isFirstVideo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      ((data)=>data._id === subSectionId)
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex===0 ){
      return true;
    }
    else{
      return false;
    }
  }
  const isLastVideo =()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId);
    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      ((data)=>data._id === subSectionId))
    
    if(currentSectionIndex === courseSectionData.length -1 && currentSubSectionIndex === noOfSubSections-1){
      return true
    }
    else{
      return false
    }
    
  }
  const goToNxtVdo = ()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId);
    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      ((data)=>data._id === subSectionId));
      
    if(currentSubSectionIndex !== noOfSubSections-1){
      //same section ki next vdo 
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id
      //is vdo ppe jana h
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }

    else{
      //diff section ki 1st vdo
      const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id 
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }
  }
  const goToPreviousVdo =()=>{
    const currentSectionIndex = courseSectionData.findIndex((data)=>data._id === sectionId);
    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      ((data)=>data._id === subSectionId));

    if(currentSubSectionIndex > 0){
      //same section prev vdo
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }    
    
    else if(currentSectionIndex > 0){
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const prevSubSectionlength = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex-1].subSection[prevSubSectionlength-1]._id
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    }
  }
    
const handleLectureCompletion = async () => {
  setLoading(true);
  try {
    const res = await markLectureAsComplete({ courseId: courseId, subSectionId: subSectionId }, token);
    
    if (res) {
      dispatch(updatecompletedVideos(subSectionId));
    }
  } catch (error) {
    console.error("Failed to mark lecture as complete", error);
  } finally {
    // This line is crucial! It re-enables the buttons.
    setLoading(false);
  }
};

  
  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData ? (<div>
          No Data Found
        </div>):(<div>
          <Player ref={playerRef} aspectRatio='16:9' playsInline onEnded={()=>setVideoEnded(true)} src={videoData?.videoUrl}>
              <BigPlayButton position="center" />
             {
              videoEnded && (
                  <div 
                    style={{
                    backgroundImage:
                    "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                    
                  }} className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter">
                    {
                      !completedVideos?.includes(subSectionId) && (
                        <Iconbtn 
                          customClasses="text-xl max-w-max px-4 mx-auto"
                          disabled={loading}
                          onclick={()=> handleLectureCompletion()}
                          text={!loading ? "Mark As Completed":"Loading..."}
                        />
                      )
                    }
                    <Iconbtn disabled={loading} onclick={()=>{
                      if(playerRef?.current){
                        playerRef.current?.seek(0);
                        setVideoEnded(false);
                        
                      }
                    }} text={"Rewatch"} customClasses="text-xl max-w-max px-4 mx-auto mt-2"/>

                    <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                      {!isFirstVideo() && (
                        <button
                        disabled={loading} onClick={goToPreviousVdo} className='blackButton'>
                          Prev
                        </button>
                      )}
                      {!isLastVideo() && (
                        <button className='blackButton' disabled={loading} onClick={goToNxtVdo} >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
              )
             }
          </Player>
        </div>)
      }
      <h1 className="mt-4 text-3xl font-semibold">{videoData.title}</h1>
      <p className="pt-2 pb-6">
        {
          videoData?.description
        }
      </p>
    </div> 

  )
}

export default VideoDetails