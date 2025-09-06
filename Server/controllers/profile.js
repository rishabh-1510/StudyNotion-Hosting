
const Profile = require("../models/Profile");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const {imageUploader} = require("../utils/imageUploader");
const CourseProgress = require("../models/courseProgress")
const Course = require("../models/Course")
exports.updateProfile=async (req,res)=>{
    try{
        //get data
        const {dateOfBirth="" , about="" , contactNumber , gender } = req.body;
        //get user id
        const id = req.user.id;
        //validation
        if(!gender ){
            return res.status(400).json({
                success:false,
                message:"Gender is required"
            });

        }
        if(!gender){
            return res.status(400).json({
                success:false,    
                message:"Gender is required"
        })
      }
        if(!contactNumber){
          return res.status(400).json({
              success:false,
              message:"Contact Number is required"
          })
        }
        //find profile
        const userdetails = await User.findById(id);
        const profileId = userdetails.additionalDetails;
        const profiledetails =await  Profile.findById(profileId);
        
        //update profile
        profiledetails.dateOfBirth=dateOfBirth;
        profiledetails.gender = gender;
        profiledetails.about = about;
        profiledetails.contactNumber = contactNumber;

        await profiledetails.save();
        console.log("profile details updated successfully",profiledetails);

        const updatedUserDetails = await User.findById(id).populate("additionalDetails")
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully',
            profiledetails,
            updatedUserDetails,     
        }) 

        
    }catch(err){
        res.status(500).json({
            success:false,
            error:err.message,
        })
    }
}

//delete account
exports.deleteAccount = async(req,res)=>{
    try{
        //get id
        const id = req.user.id;
        //validation
        const userDetail = await User.findById({_id:id});
        if(!id){
             return res.status(404).json({
                success:false,
                message:"User doesnnot exist"
            });
        }
        console.log(id);
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetail.additionalDetails});
        //Hw enroll user from all unrolled courses/
        //delete user
        await User.findByIdAndDelete({_id:id});

        //Hw enroll user from all unrolled courses
        //res
        return res.status(200).json({
            success:true,
            message:'Profile deleted Successfully',
                 
        }) 
    }catch(err){
        res.status(500).json({
            success:false,
            message:"User cannot be deleted"
        })
    }
};
 
exports.getAllUserDetails = async(req,res)=>{
        try{
            const id = req.user.id;

            const userDetails = await User.findById(id).populate("additionalDetails").exec();
            if (!userDetails) {
                return res.status(404).json({ // Use 404 Not Found if user doesn't exist
                    success: false,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                success:true,
                message:"User Data Fetched Successfully",
                data:userDetails

            })
        }catch(err){
            return res.status(500).json({
                success:false,
                message:err.message,
                
            })
        }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await imageUploader(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userObject = await User.findOne({
        _id: userId,
      })
        .populate({
          path:"courses",
          populate:{
            path:"courseContent",
            populate:{
              path:"subSection"
            }
          }

        })
        .exec();

      const userDetails = userObject.toObject();
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }


      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard= async(req,res)=>{
  try{  
    const courseDetails =await Course.find({instructor:req.user.id}).exec();
    const courseData = courseDetails.map((course)=>{
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      //create a new object with the additonal fields
      const courseDataWithStats = {
        _id:course._id,
        courseName : course.courseName,
        courseDescription:course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated
      }
      return courseDataWithStats

    })

    res.status(200).json({courses:courseData})
  }catch(err){
    console.error(err);
    res.status(500).json({
      message:"Internal Server Error",
      message2:err.message
    })
  }
}
