import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import Iconbtn from '../../../../common/Iconbtn'
import {GrAddCircle} from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import{BiRightArrow} from 'react-icons/bi'
import { setCourse, setEditCourse, setStep } from '../../../../../slice/courseSlice'
import toast from 'react-hot-toast'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'
 

const CourseBuilderForm = () => {
    const {token} = useSelector((state)=>state.auth);
    const {register , handleSubmit , setValue , formState:{errors} } = useForm();
    const [editSectionName , setEditSectionName] = useState(null);
    const {course} = useSelector((state)=>state.course);
    const [loading , setLoading] = useState(false);

    useEffect(() => {
    console.log("UPDATED");
  },[course])


    const dispatch = useDispatch();
    const cancelEdit = ()=>{
      setEditSectionName(null);
      setValue("sectionName","")
    }
    
    const goBack = ()=>{
      dispatch(setStep(1));
      dispatch(setEditCourse(true));
    }
    const goToNext = ()=>{
      if(course.courseContent.length===0){
        toast.error("Please add atlesat one section");
        return;
      }
      if(course.courseContent.some((section)=>section.subSection.length===0)){
        toast.error("Please add atleast one lecture");
        return;
      }
      // if all ok
      dispatch(setStep(3));
    }

    const onSubmit =async (data)=>{
      console.log("data is",data)
      setLoading(true);
      let result;
      if(editSectionName){
        //we are editing 
        result = await updateSection({
          sectionName:data.sectionName,
          sectionId:editSectionName,
          courseId:course._id,
          
        },token 
      )
      
      }
      else{
        result =await createSection({
          sectionName:data.sectionName,
          courseId:course._id,

        },token)
        console.log("API response (result):", result);
      }
      //update values
      if(result){
        dispatch(setCourse(result));
        setEditSectionName(null);
         setValue("sectionName","");
         
      }
      console.log("result is",result);
      setLoading(false); 
    }

    const handleChangeEditSectionName = (sectionId ,sectionName) =>{
      if(editSectionName === sectionId){
        cancelEdit();
        console.log("sections id me h")
        return;
      }
      setEditSectionName(sectionId);
      setValue("sectionName",sectionName);
    }
    console.log('course is' , course)

  return (
 
    <div className='text-white'>
        <p>Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div> 
            <label htmlFor='sectionName'>Section Name<sup>*</sup></label>
            <input
              id='sectionName'
              placeholder='Add section name'
              {...register('sectionName',{required:true})}
              className='w-full'
            />
            {
              errors.sectionName && (
                <span>Section Name is required</span>
              )
            }
          </div>
          <div className='mt-10 flex w-full'>
            <Iconbtn
              type="Submit"
              text={editSectionName?"Edit Section Name":"Create Section"}
              outline={true} 
              customClasses={"text-white"}

            >

              <GrAddCircle className='text-yellow-50 ' size={20}/>
            </Iconbtn>
            

            {
              editSectionName && (
                <button 
                type='button' onClick={cancelEdit} className='text-sm text-richblack-300 underline'>
                  Cancel Edit
                </button>
              )
            }

          </div>
          
        </form>
        
        {
          course?.courseContent?.length>0 && (
            <NestedView
              handleChangeEditSectionName={handleChangeEditSectionName}
            />
          )
        }

        <div className='flex justify-end gap-x-3 mt-10'>
          <button onClick={goBack} className='rounded-md cursor-pointer items-center w-20 text-md  bg-richblack-400'>
            Back
          </button>
          <Iconbtn text="Next" onclick={goToNext}>
            <BiRightArrow/>
          </Iconbtn>

        </div>
        
    </div>
  )

}


export default CourseBuilderForm