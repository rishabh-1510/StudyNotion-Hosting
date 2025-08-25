const express = require("express");
const Router = express.Router();
const{auth, isInstructor} = require("../middlewares/auth");

const{deleteAccount , updateProfile , getAllUserDetails ,updateDisplayPicture ,getEnrolledCourses, instructorDashboard} = require("../controllers/profile") ;

//profile routes

Router.delete("/deleteprofile",auth,deleteAccount);
Router.put("/updateprofile",auth,updateProfile);
Router.get("/getUserDetails",auth,getAllUserDetails);
Router.put("/updatedisplaypicture",auth,updateDisplayPicture);
Router.get("/getEnrolledCourses",auth,getEnrolledCourses);
Router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);

module.exports = Router;