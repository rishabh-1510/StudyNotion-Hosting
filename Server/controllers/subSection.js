const SubSection = require("../models/SubSection");
const Section =require("../models/Section");
const { imageUploader } = require("../utils/imageUploader");
//Time duration dekhna h
//create sub section
exports.createSubSection = async (req,res)=>{
    try{
        //fetch data from req body
        let {sectionId , title , description} = req.body;
        sectionId = sectionId.trim();
        //extract file / video
        const vdo =  req.files.video;
        //validation
        if(!sectionId || !title  ||!description ||!vdo 
        //    ||!timeDuration 
        ){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        //uload vdo to cloudinary and fetch secure url
        const uploadDetails = await imageUploader(vdo , process.env.FOLDER_NAME );
        //create a subsection
        const subSectiondetails =  await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this sub section
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {$push:{
                                                                    subSection:subSectiondetails._id
                                                                }},{new:true}
        ).populate("subSection")
        //hw to populate section here , after adding populate query
        //return response
        console.log(updatedSection);
        return res.status(200).json({
            success:true,
            message:'Sub Section Created Successfully',
            data:updatedSection,
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server errror",
            error:err.message
        })
    }
}

//update subsection
exports.updateSubsection = async(req,res)=>{

    try{
        const{sectionId ,subSectionId, title ,description} = req.body;
    const subSection = await SubSection.findById(subSectionId);
    
    if(!subSection){
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
    })}

    if(title !==undefined){
        subSection.title=title;
    }
    if(description !== undefined){
        subSection.description=description
    }
    if(req.files && req.files.video !==undefined){
        const video = req.files.video;
        const uploadDetails =await imageUploader(
            video,
            process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url;
        subSection.timeDuration = `${uploadDetails.duration}`
    }
    await subSection.save();
    const updatedSubSection = await Section.findById(sectionId).populate("subSection");

    return res.json({
        success:true,
        message:"Section updated successfully",
        data:updatedSubSection
    })

    }catch(err){
        console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })        
    }
    
}


//delete subsection
exports.deleteSubsection = async (req,res)=>{
    try{
        const{subSectionId , sectionId} = req.body
        await Section.findByIdAndUpdate({_id:sectionId},{$pull:{subSection:subSectionId},},{new:true});

        const subSection =  await SubSection.findByIdAndDelete({_id:subSectionId});
        if(!subSection){
            return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
        }
        const updatedSubSection = await Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success:true,
            message:"Subsection Deleted Successfully",
            data:updatedSubSection

        })
    }catch(err){
        console.error(err)
        return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
}