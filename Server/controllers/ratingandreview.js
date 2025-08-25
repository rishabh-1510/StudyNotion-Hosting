const ratingAndreview = require("../models/RatingandReview");
const Course = require("../models/Course");
const RatingandReview = require("../models/RatingandReview");
const { default: mongoose } = require("mongoose");

//create rating 
exports.createRating = async(req,res)=>{
    try{
        //get userid
        const userId = req.user.id;
        //fetch data from reqbody
        const {rating , review , courseId} = req.body;

        //check user is valid or not
        const courseDetails = await  Course.findOne({_id:courseId}, {studentsEnrolled:{$elemMatch:{$eq:userId}}});
        if(!courseDetails){
             return res.status(400).json({
                success:false,
                message:"Could not find course details"
            })
        }

        //check user already reviewed or not 
        const alreadyReviewed = await RatingandReview.findOne({
                                                            user:userId,
                                                            course:courseId,
        });
         if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "User is not enrolled in this course or course details not found."
            });
        }
        console.log("Rating is",rating, "review is",review ,"courseId is", courseId)
         if (!rating || !review || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Please provide rating, review, and courseId."
            });
        }
        if(alreadyReviewed){
             return res.status(400).json({
                success:false,
                message:"User already reviewed"
            })
        }
        //create review
        const ratingAndreview = await RatingandReview.create({
                                                        rating,review,
                                                        course:courseId,
                                                        user:userId,
        })
        //attach to course
        const updatedCoursedetails = await Course.findByIdAndUpdate({_id:courseId},{
                                        $push:{
                                            ratingReviews:ratingAndreview,
                                        }
        },{new:true});
        console.log(updatedCoursedetails);
        return res.status(200).json({
            success:true,
            message:"Ratind and review created successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
    })
}}

//get average rating
exports.getAverageRating = async(req,res)=>{
    try{
        //get course id
        const courseId = req.body.courseId;
        //calculate avg rating

        const result  = await RatingandReview.aggregate([
            {
                $match:{
                    course: mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating :{$avg :  "$rating"}
                }
            },

        ])
        //return rating

        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating : result[0].averageRating,
            })
        }
        //if no rating and review

        return res.status(200).json({
            success:true,
             message:"Average Rating is 0 , No rating given"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}

//getAllrating and reviews
exports.getAllratingAndReviews = async(req,res)=>{
    try{
        const allreviews = await RatingandReview.find({}).sort({rating:"desc"}).populate({
                                                                                path:"user",
                                                                                select:"firstName lastName email image"
                                                                                })
                                                                                .populate({
                                                                                    path:"course",
                                                                                    select:"courseName",
                                                                                })
                                                                                .exec();
        
        return res.status(200).json({
            success:true,
            message:"All reviews fetched sucessfully",
            data:allreviews
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}