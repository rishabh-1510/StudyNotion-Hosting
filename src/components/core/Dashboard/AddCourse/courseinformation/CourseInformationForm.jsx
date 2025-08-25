  import React, { useEffect, useState } from 'react'
  import {useForm} from 'react-hook-form'
  import { useDispatch, useSelector } from 'react-redux';
  import { editCourseDetails, fetchCourseCategories ,addCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
  import {HiOutlineCurrencyRupee} from "react-icons/hi2"
  import RequirementField from './RequirementField';
  import { setCourse, setStep } from '../../../../../slice/courseSlice';
  import Iconbtn from '../../../../common/Iconbtn';
  import {   toast} from 'react-hot-toast';
  import { COURSE_STATUS } from '../../../../../utils/constant';
  import ChipInput from './ChipInput';
  import Upload from '../Upload';
  const CourseInformationForm = () => {
    const {token} = useSelector((state)=>state.auth)  
    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState:{errors},
    } = useForm();
    const dispatch= useDispatch();
    const {course , editCourse } = useSelector((state)=>state.course);
    const[loading ,setLoading] = useState(false);
    const [courseCategory , setCourseCategories] = useState([]);
    
    useEffect(()=>{
      const getCategories = async()=>{
        setLoading(true);
        const categories =await fetchCourseCategories();
        if(categories.length > 0){
          setCourseCategories(categories); 
        }
        setLoading(false)
      }
      if(editCourse){
        setValue("courseTitle", course.courseName);
        setValue("courseShortDesc", course.courseDescription);
        setValue("coursePrice", course.price);
        setValue("courseTags", course.tag);
        setValue("courseBenifits", course.whatYouWillLearn);
        setValue("courseCategory", course.category);
        setValue("courseRequirements", course.instructions);
        setValue("courseImage", course.thumbnail);
      }

      getCategories()
    },[])
    
    const isFormUpdated = ()=>{
      const currentValues = getValues();
      if(currentValues.courseTitle !== course.courseName || currentValues.courseShortDesc !== course.courseShortDesc || currentValues.coursePrice !== course.coursePrice
        //|| currentValues.courseTags.toString( ) !== course.tag.toString() 
        ||currentValues.courseBenifits !== course.whatYouWillLearn || currentValues.courseCategory._id !== course.category._id ||
        // currentValues.courseImage !== course.thumbnail
        currentValues.courseRequirements.toString() !== course.instructions.toString()
      ){
        return true;
      }
      else{
        return false;
      }
    }
    //handle next button click
    const onSubmit = async(data)=>{
      if(editCourse){
        if(isFormUpdated()){
          const currentValues = getValues();
        const formData =new FormData();

        formData.append("courseId",course._id);
        if(currentValues.courseTitle !== course.courseName){
          formData.append("courseName",data.courseTitle);
          
        }
        if(currentValues.courseShortDesc !== course.courseDescription){
          formData.append("courseDescription",data.courseShortDesc);
          
        }
        if(currentValues.coursePrice !== course.price){
          formData.append("price",data.coursePrice);
          
        }
        if(currentValues.courseBenifits !== course.whatYouWillLearn){
          formData.append("whatYouWillLearn",data.courseBenifits);
          
        }
        if(currentValues.courseCategory._id !== course.courseCategory._id){
          formData.append("category",data.courseCategory);
          
        }
        if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
          formData.append("instructions",JSON.stringify(data.courseRequirements));
        }
        if (currentValues.courseImage !== course.thumbnail) {formData.append("thumbnailImage", data.courseImage)
        }
        
        setLoading(true);
        const result = await editCourseDetails(formData , token);
        setLoading(false);
        if(result){
          dispatch(setStep(2));
          dispatch(setCourse(result));

        }
        }
        else{
          toast.error("NO Changes made so far")
        }

        return;
        
      }

      const formData = new FormData();
      formData.append("courseName",data.courseTitle)
      formData.append("courseDescription",data.courseShortDesc)
      formData.append("price",data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn",data.courseBenifits)
      formData.append("category",data.courseCategory)
      formData.append("instructions",JSON.stringify(data.courseRequirements))
      formData.append("status",COURSE_STATUS.DRAFT);
      formData.append("thumbnailImage", data.courseImage)

      setLoading(true);
          console.log("BEFORE add course API call");
          console.log("PRINTING FORMDATA", formData);
          const result = await addCourseDetails(formData,token);
          if(result) {
              dispatch(setStep(2));
              dispatch(setCourse(result));
          }
          setLoading(false);
          console.log("PRINTING FORMDATA")
          console.log("PRINTING FORMDATA");
          for (let [key, value] of formData.entries()) {
          console.log(key, value);
}
          console.log("PRINTING result", result);

    }
    
    return (
      <form onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor='courseTitle'>Course Title<sup className="text-pink-200">*</sup></label>
          <input
            id='courseTitle'
            placeholder='Enter Course Title'
            {...register("courseTitle",{required:true})}
            className='w-full form-style'
          />
          {
            errors.courseTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required </span>
            )
          }
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor='courseShortDesc' className="text-sm text-richblack-5">Course Short Description<sup className="text-pink-200">*</sup></label>
          <textarea
            id='courseShortDesc'
            placeholder='Enter Description'
            {...register("courseShortDesc", {required:true})}
            className="form-style resize-x-none min-h-[130px] w-full"

          />
          {
            errors.courseShortDesc && (<span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Description is required**
            </span>)
          }
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor='coursePrice' className="text-sm text-richblack-5">Course Price<sup className="text-pink-200">*</sup></label>
          <div className="relative">
            <input
            id='coursePrice'
            placeholder='Enter Course Price'
            {...register("coursePrice",{required:true , valueAsNumber:true, pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },})}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400"/>
          </div>
          
          {
            errors.coursePrice && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is Required </span>
            )
          }
        </div>

        <div className="flex flex-col space-y-2">
            <label htmlFor='coursCategory' className="text-sm text-richblack-5">Course Category<sup className="text-pink-200">*</sup></label>
            <select 
            id='courseCategory'
            className="form-style w-full"
            defaultValue=""
              {...register("courseCategory",{required:true})}
            >
              <option value="" disabled className='text-black'>Choose a Category</option>
              {
                !loading && courseCategory.map((category ,index)=>(
                  <option key={index} value={category._id} className='text-black' >
                    {category?.name}
                  </option>
                ))
              }
            </select>
            {
              errors.courseCategory&&(
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Course Category is Required
                </span>
              )
            }
        </div>
        {/* crete a custom component for handling inputs */} 
        <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
        {/* create a component for uploading and showing preview of media */}
         <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}/>
        
        // {/* benifits of the course */}

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5">Benifits of the course<sup className="text-pink-200">*</sup></label>
          <textarea
            id='courseBenifits'
            placeholder='Enter Benifits of the course'
            {...register("courseBenifits",{required:true})}
            className="form-style resize-x-none min-h-[130px] w-full"
          />
          {
            errors.courseBenifits && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Benifits of the course are required**
              </span>
            )
          }
        </div>

          <RequirementField
            name = "courseRequirements"
            label="Requirements/Instructions"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
    
          />
          <div className="flex justify-end gap-x-2">
            {
              editCourse && (
                <button className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`} onClick={()=>{
                  dispatch(setStep(2))
                }}>
                  Continue Without Saving
                </button>
              )
            }
            <Iconbtn
              text={!editCourse ?"Next":"Save Changes"}
              
            />
          </div>

      </form>
    )
  }

  export default CourseInformationForm