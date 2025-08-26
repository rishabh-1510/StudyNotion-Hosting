const Section = require("../models/Section");
const Course = require("../models/Course");
const { populate } = require("../models/OTP");
const SubSection = require("../models/SubSection");


exports.createSection = async(req,res)=>{
    try{
        //data fetch
        const{sectionName , courseId} = req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Misssing Properties",
            })
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update in course Schema with course id
        const updatedCourse = await Course.findByIdAndUpdate(courseId , 
                                                            {$push:{
                                                                courseContent:newSection._id,
                                                            }},
                                                        {new:true}).populate({
                                                            path:"courseContent",
                                                            populate:{
                                                                path:"subSection",
                                                            },

                                                        }).exec();
        //return rewsponse
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourse,
            newSection
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:err.message,
        })
    }
}

exports.updateSection = async(req,res)=>{
    try{
        //data input
        const{sectionName , sectionId ,courseId} = req.body; 
        //validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"fill the info rightly",
            })
        }
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true}) 
        const course = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        });
        //update data
        

        //return res
        return res.status(200).json({
            success:true,
            message:'Section updated Sucessfully',
            message:section,
            data:course
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            error:err.message,
        })
    }
}


exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   
