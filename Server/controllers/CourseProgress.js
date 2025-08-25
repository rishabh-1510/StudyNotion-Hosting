const CourseProgress = require("../models/courseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async(req,res)=>{
    const {courseId , subSectionId} = req.body;
    const userId = req.user.id;
    
    try{
        //check if the subsection is valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection){
            return res.status(404).json({
                message:"Sub Section not found",
                success:false
            })
        }
        //check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId:courseId,
            userId:userId,
        });
        if(!courseProgress){
            return res.status(404).json({
                message:"course progress Not found",
                success:false
            })
        }
        else{
            //check for re-completing vdos
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    error:"Subsection already completed"
                });
            }

            courseProgress.completedVideos.push(subSectionId);
           
        }
        await courseProgress.save();
            return res.status(200).json({
                success:true,
                message:"Course Progress updated Successfully"
        })
    }catch(err){ 
        console.error(err);
        return res.status(400).json({
            error:"Internal server error",
            message:err.message
        });
    }

}

exports.getCourseCompletedLectures = async (req, res) => {
    const { courseId } = req.query; // Correct way to get data from a GET request
    const userId = req.user.id;
    try {
        if (!userId || !courseId) {
            return res.status(400).json({
                message: "User ID or Course ID not found",
                success: false
            });
        }
        
        const response = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        });

        // Correct check for a single document
        if (!response) {
            return res.status(404).json({
                success: false,
                message: "No course progress found for this user and course."
            });
        }
        
        return res.status(200).json({
            message: "Done",
            data: response
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};