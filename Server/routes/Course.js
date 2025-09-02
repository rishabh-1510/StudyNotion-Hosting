const express = require("express");
const Router = express.Router();

const{createCourse , getAllCourses , getCoursedetails ,editCourse , getInstructorCourses , getFullCourseDetails , deleteCourse ,} = require("../controllers/course");
const {createCategory ,showAllCategories ,categoryPageDetails} = require("../controllers/Category");

const {createSection , updateSection , deleteSection } = require("../controllers/section");
const {createSubSection,updateSubsection,deleteSubsection} = require("../controllers/subSection");
const{createRating , getAverageRating,getAllratingAndReviews} = require("../controllers/ratingandreview");

const{auth,isStudent,isAdmin,isInstructor} = require("../middlewares/auth");
const {updateCourseProgress , getCourseCompletedLectures} = require("../controllers/CourseProgress");
const {getPurchaseHistory} = require("../controllers/Purchasehistory");

// Courses can Only be Created by Instructors
Router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
Router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
Router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
Router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
Router.post("/updateSubSection", auth, isInstructor, updateSubsection)
// Delete Sub Section
Router.post("/deleteSubSection", auth, isInstructor, deleteSubsection)
// Add a Sub Section to a Section
Router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
Router.get("/getAllCourses", getAllCourses)
// Edit Course routes
Router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
Router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get Details for a Specific Courses
Router.post("/getCourseDetails", getCoursedetails)
Router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
Router.delete("/deleteCourse", deleteCourse)

//Puraachase history of a user
Router.get("/getPurchaseHistory", auth, isStudent, getPurchaseHistory);

//update course progress
Router.post("/updateCourseProgress", auth , isStudent,updateCourseProgress);
Router.get("/getCourseCompletedLectures",auth , isStudent , getCourseCompletedLectures)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
Router.post("/createCategory", auth, isAdmin, createCategory)
Router.get("/showAllCategories", showAllCategories)
Router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
Router.post("/createRating", auth, isStudent, createRating)
Router.get("/getAverageRating", getAverageRating)
Router.get("/getReviews", getAllratingAndReviews)

module.exports=Router; 
