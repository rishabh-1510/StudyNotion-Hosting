const {instance} = require("../config/razorpay");
const Course =  require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentTemplate");
const {  mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require('crypto');
const CourseProgress = require("../models/courseProgress");
require("dotenv").config();
const PurchaseHistory = require("../models/PurchaseHistory");
//initiate the  razorpay order
exports.capturePayment = async(req,res)=>{
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length ===0 ){
        return res.json({
            success:false,
            message:"Please Provide Course Id"
        })
    }
    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try{
            course = await Course.findById(course_id);
            if(!course){
                return res.status(400).json({success:false , message:"Could not find the course"});

            }
            console.log("course is.......",course)
            const uid =  new mongoose.Types.ObjectId(userId);
             if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({success:false , message:"Student is already Enrolled"});
            }

            totalAmount += course.price;

        }catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }

    }
    const options={
        amount: totalAmount+100,
        currency:"INR",
        receipt:Math.random(Date.now()).toString(),

    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            sucess:true,
            message:paymentResponse ,
            razorpayKey: process.env.RAZORPAY_API_KEY,
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
                                                                                                                
//verify payment
exports.verifyPayment = async(req,res)=>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const  courses = req.body?.courses;
    const userId = req.user.id;
    
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature  || !courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Payment failed"
        })
    }
    console.log("RAZORPAY_SECRET", process.env.RAZORPAY_API_SECRET)
    let body = razorpay_order_id +"|"+razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature){
            //enroll student

            await enrollStudents(courses , userId , res)
            //retrun res
            return res.status(200).json({
                success:true,
                message:"Payment Verified"
            })
        }
        return res.status(400).json({
            success:false,
            message:"Payment failed"
        })
}

const enrollStudents = async(courses , userId , res)=>{
    if(!courses || !userId){
        return res.status(400).json({success:false , message:"Please Provide Data for coures"});

    }
    for(const courseId of courses){
        try{
            const enrolledCourse = await Course.findOneAndUpdate({_id:courseId}, {$push:{studentsEnrolled:userId}},{new:true});
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",                  
                })
            }               

            const courseProgress = await CourseProgress.create({
                courseId:courseId,
                userId:userId,
                completedVideos:[],   

            })
            const History = await PurchaseHistory.create({
                user:userId,
                course:courseId,
                purchasedAt:Date.now(),});
            //find std and add course in enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(userId ,{$push:{courses:courseId , CourseProgress:courseProgress._id}, }, {new:true})
            // mail send
            const emailresponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName , `${enrolledStudent.firstName}`)

        )
        }catch(err){
            console.log(err);
            return res.status(500).json({
                success:false,
                message:err.message
            })
        }
    }
}

exports.sendPaymentSuccessEmail = async(req,res)=>{
    const {orderId , paymentId ,amount} = req.body;
    const userId = req.user.id;
    if(!orderId || !paymentId||!amount || !userId){
        return res.status(400).json({success:false,message:"Please provide all the fields"})
    }

    try{
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received `,
            paymentSuccessEmail(`${enrolledStudent.firstName}`, amount/100 , orderId ,paymentId)
        )
    }catch(err){
        console.log("error in sending mail");
        return res.status(500).json({
            success:false,
            message:"Could not send Email"
        })
    }
}

//capture the payment and initiate the razorpay order
// exports.capturePayment = async (req,res)=>{
//     //get courseId and Userid
//     const course_id  = req.body;
//     const Userid = req.user.id;
//     //validation
//     if(!course_id){
//         return res.json({
//             success:false,
//             message:"Please Provide valid course id",
//         })
//     }
//     //valid course id or not
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }
//         //user already pay for the same course
//         const uid = mongoose.Types.ObjectId(Userid);
//         if(course.studentEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:"Student is already enrolled",

//             });
//         }
//     }catch(err){
//         console.error(err);
//         return res.status(500),json({
//             success:false,
//             message:err.message,
//         })
//     }
//     //valid course details
//     //order create
//     const amount = course.price;
//     const currency ="INR";
//     const options={
//         amount:amount*10,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseID:course_id,
//             Userid
//         }
//     };
//     try{
//         //initiate the payment using rzorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         return res.status(200).json({
//             sucess:true,
//             courseName:course.courseName,
//             courseDescritpion:course.courseDescritpion,
//             thumbnail:course.Thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         })
    
//     }catch(err){
//         console.log(err);
//         res.json({
//             success:false,
//             message:"Could not initiate order",

//         });
//     }
    
// };

//verify signature of Razorpay and server

// exports.verifySignature = async(req,res)=>{
//     const webhooksecret = "12345678";

//     const signature= req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhooksecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
//     if(signature===digest){
//         console.log("Payment is Authorized");
        
//         const{courseID , Userid} = req.body.payload.payment.entity.notes;

//         try{
//             const enrolledCourse = await Course.findOneAndUpdate({_id:courseID},
//                                                                 {$push:{studentEnrolled:Userid}},{neww:true}
//             );
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course not Found"
//                 })
//             }
//             console.log(enrolledCourse);
//             //find the student and add course to their course list
//             const enrollstd =await User.findOneAndUpdate({_id:Userid},
//                                                          {$push:{courses:courseID}},{new:true},               
//             );
//             console.log(enrollstd);

//             //send mail
//             const emailresponse = await mailSender(enrollstd.email , "Congratulations from Rishabh ","Congratulations you are onboarded into the new Course");
//             console.log(emailresponse);
//             return res.status(200).json({
//                 sucess:true,
//                 message:"Signature verified and Course added"
//             })

//         }catch(err){
//             console.log(err);
//             return res.status(401).json({
//                 success:false,
//                 message:err.message,
//             })
//         }

//     }
//     else{
//         return res.status(401).json({
//             success:false,
//             message:err.message,
//             })
//     }
    
// }
