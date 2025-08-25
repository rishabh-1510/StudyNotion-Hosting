import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import Iconbtn from '../../common/Iconbtn';
import CoursesTable from './InstructorCourses/CoursesTable';
const MyCourses = () => {

    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const [courses , setCourses] = useState([]);

    useEffect(() => {
    const fetchCourses = async () => {
        // Only fetch courses if a token exists
        if (token) {
            const result = await fetchInstructorCourses(token);
            if (result) {
                console.log("result is ",result);
                setCourses(result);
            }
        }
    };
    fetchCourses();
    }, [token]); // Add token to the dependency array
    //console.log("token form intrucctor is" ,token)
  return (
    <div>
        <div className="mb-14 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
            <Iconbtn
                text="Add Course"
                onclick={()=>navigate("/dashboard/add-course")}
            />
        </div>

        {courses && <CoursesTable courses={courses} setCourses={setCourses}/>}
    </div>
  )
}

export default MyCourses