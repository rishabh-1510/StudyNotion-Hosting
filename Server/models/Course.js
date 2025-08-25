const mongoose = require("mongoose");


const CourseSchema=mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,

    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    whatYouWillLearn:{
        type:String,

    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",

        }
    ],
    ratingReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",

    }
    ],
    price:{
        type:Number,

    },
    thumbnail:{
        type:String,

    },
    tag:{
        type:[String],
        rquired:true,
    },
    category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        default:[]
    }],
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt:{
        type: Date,
        default:Date.now()
    },

});

module.exports = mongoose.model("Course",CourseSchema);
