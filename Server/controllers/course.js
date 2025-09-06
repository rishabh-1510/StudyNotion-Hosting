const Course = require("../models/Course");
const Section = require("../models/Section")
const Category = require("../models/Category");
const User =require("../models/User");
const {imageUploader} = require("../utils/imageUploader");
const SubSection = require("../models/SubSection"); 
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/courseProgress")
//create course
exports.createCourse = async (req,res)=>{
    try{
        //fetch data  
        let {courseName , courseDescription , whatYouWillLearn,price ,tag:_tag, category ,status ,instructions:_instructions} = req.body;
        const thumbnail =req.files.thumbnailImage;
            const tag = JSON.parse(_tag)
            const instructions = JSON.parse(_instructions);
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !category || !price ||!tag.length  || !thumbnail){
            return res.status(401).json({
                success:false,
                message:"All fields are mandatory",

            })
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

        console.log(instructorDetails);
        //TODO: verify that userid and instructor id are same or diff 


        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"Instructor details not found",
            })
        }

        //check given tag is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"Category details not found",
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await imageUploader(thumbnail,process.env.FOLDER_NAME);

        //create entry for new post
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions
        })
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,

                }
            },
            {new:true}
        );

        //update tag schema
            const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )

        return res.status(200).json({
            success:true,
            message:"Course created Successfully",
            data:newCourse
        });

    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Failed to create Course"
        })
    }
}

//get all courses

exports.getAllCourses = async (req,res)=>{
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            tag:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:"Course fetched successfully",
            data:allCourses
        });


    }catch(err){
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Failed to get all courses",
            error:err.message
        })
    }
}

//get course details
exports.getCoursedetails = async(req,res)=>{
    try{
        //get id
        const {courseId }= req.body;
        //find course details
        const courseDetails = await Course.findById(courseId)
                                                                .populate({
                                                                    path:"instructor",
                                                                    populate:{
                                                                        path:"additionalDetails",
                                                                    }
                                                                })
                                                                .populate("category")
                                                                .populate("ratingReviews")
                                                                .populate({
                                                                    path:"courseContent",
                                                                    populate:{
                                                                        path:"subSection",
                                                                        select:"-videoUrl",
                                                                    }
                                                                })
                                                                .exec();
        //validaton

        
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Couldnot find the course with course id"
            })
        }
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      }
    )
    }
  )

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return res.status(200).json({
            success:true,
            messsage:"Course details fetched successfully",
            data: {
            courseDetails,
            totalDuration,
          },
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key of Object.keys(updates)) {
      if (key === "tag" || key === "instructions") {
        course[key] = JSON.parse(updates[key])
      } else {
        course[key] = updates[key]
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor:instructorId,
    }).sort({ createdAt: -1 }).populate({
      path:"courseContent",
        populate:({
          path:"subSection"
        })
    })
        const coursesWithDuration = instructorCourses.map(course => {
            let totalDurationInSeconds = 0;
            course.courseContent.forEach(content => {
                content.subSection.forEach(subSection => {
                    const timeDurationInSeconds = parseInt(subSection.timeDuration);
                    if (!isNaN(timeDurationInSeconds)) {
                        totalDurationInSeconds += timeDurationInSeconds;
                    }
                });
            });
            const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
            
            return {
                ...course.toObject(),
                totalDuration,
            };
        });
    

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: coursesWithDuration,
    })  
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    //console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
