const PurchaseHistory = require("../models/PurchaseHistory");

exports.getPurchaseHistory = async(req,res)=>{
    const userId = req.user.id;
    try{
        const courseList = await PurchaseHistory.find({user:userId}).populate("user").populate({
        path: "course",
        populate: {
          path: "category",
          model: "Category", // Ensure 'Category' matches your actual model name
        },
      });

        console.log("courselist is ",courseList)
        return res.status(200).json({
            success:true,
            message:"Purchase history fetched successfully",
            data:courseList,
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}