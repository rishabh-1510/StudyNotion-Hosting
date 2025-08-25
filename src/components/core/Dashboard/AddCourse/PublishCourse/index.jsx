import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import Iconbtn from '../../../../common/Iconbtn';
import { resetCourseState, setEditCourse, setStep } from '../../../../../slice/courseSlice';
import {editCourseDetails} from "../.././../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../../utils/constant"

const PublishCourse = () => {
  
  const {register , handleSubmit , setValue , getValues} = useForm();
  const dispatch = useDispatch();
  const {course}= useSelector((state)=>state.course);
  const {token}= useSelector((state)=>state.auth);
  const [loading , setLoading]= useState(false);

  useEffect(()=>{
    if(course?.status === COURSE_STATUS.PUBLISHED){
      setValue("public")
    }
  },[])
  const goTOCourses = ()=>{
    dispatch(resetCourseState());
    //navigate("/dasboard/my-courses")
  }

  const handleCoursePublish = async()=>{
    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public")===true || 
      (course?.status===COURSE_STATUS.DRAFT && getValues("public") ===false)){
        //no updation of form 
        // no need to do api call
        goTOCourses();  
        return
      }
      // if form updated
      const formdata = new FormData()
      formdata.append("courseId",course._id);
      const courseStatus = getValues("public")? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
      formdata.append("status", courseStatus);

      setLoading(true);

      const result = await editCourseDetails(formdata,token);

      if(result){
        goTOCourses();
      }
      setLoading(false);
  }

  const onSubmit = ()=>{
    handleCoursePublish()
  }
  const goBack = ()=>{
    dispatch(setStep(2))
  }

  return (
    <div className='rounded-md  border-[1px] bg-richblack-800 p-6 border-richblack-700 text-white'>
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor='public'>
          <input
            type='checkbox'
            id='publc'
            {...register("public")}
            className='rounded h-4 w-4'
          />
          <span className='ml-3'>Make this Course as Public</span>
          </label>
        </div>

        <div className='flex justify-end gap-x-3 '>
          <button
          disabled={loading}
          type='button'
          onClick={goBack}
          className='flex items-center rounded-md bg-richblack-300 p-6'>
            Back
          </button>
          <Iconbtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}

export default PublishCourse