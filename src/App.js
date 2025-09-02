import { Route ,Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./Pages/login";
import Signup from "./Pages/signup";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/updatePassword";
import VerifyEmail from "./Pages/VerifyEmail";
import Aboutus from "./Pages/Aboutus";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Error from "./Pages/Error"
import Myprofile from "./components/core/Dashboard/Myprofile";
import Settings from "./components/core/Dashboard/settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./Pages/Catalog";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/core/viewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/instructorDashboard/Instructor";
import Contact from "./Pages/Contact";
import PurchaseHistory from "./Pages/PurchaseHistory";

function App() {
  const {user} =  useSelector((state)=>state.profile);
  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/catalog/:catalogName" element={<Catalog/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/login" element={<Login/>  }/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/forgot-Password" element ={<ForgotPassword/>}/>
      <Route path="/update-password/:token" element ={<UpdatePassword/>}/>
      <Route path="/verify-email" element ={<VerifyEmail/>}/>
      <Route path="/about" element ={<Aboutus/>}/>
      <Route path="/courses/:courseId" element={<CourseDetails/>}/>
      
     <Route element={
      <PrivateRoute>
        <Dashboard/>
      </PrivateRoute>
     }>
        <Route path="dashboard/my-profile" element ={<Myprofile/>}/>

        <Route path="dashboard/Settings" element={<Settings />} />


        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
              <Route path="dashboard/cart" element={<Cart/>}/>
              <Route path="dashboard/purchase-history" element={<PurchaseHistory/>}/>
            </>
          )
        }
         {
          user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse/>}/>
              <Route path="dashboard/instructor" element ={<Instructor/>}/>
              <Route path="dashboard/my-courses" element={<MyCourses/>}/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              
            </>
          )
        }
     </Route>

     <Route element={
      <PrivateRoute>
        <ViewCourse/>
      </PrivateRoute>
     }>
        {
          user?.accountType===ACCOUNT_TYPE.STUDENT &&(
            <>
              <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element={<VideoDetails/>}/> 

            </>
          )
        }
     </Route>
  
      <Route path="*" element ={<Error/>}/>
    </Routes>
   </div>
  );
}

export default App;
