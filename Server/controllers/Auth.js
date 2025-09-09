const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenrator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender")
require("dotenv").config();
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate");

exports.sendOtp = async (req,res)=>{
  try{
      //fetch email from req body
    const{email} = req.body;
    //check if user alreaady exist
    const checkUserPresent = await User.findOne({email});
    if(checkUserPresent){
        return res.status(400).json({
            success:false,
            message:"User already exist"
        })
    }
    //genrate otp
    var otp =otpGenrator.generate(6 ,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,

    });
    console.log("Otp generated");

    //check unique otp or not
    const result = await OTP.findOne({otp:otp});
    while(result){
        otp = otpGenrator.generate(6 ,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,

        });
        result = await OTP.findOne({otp:otp});
    }

    const otpPayload = {
        email,otp
    };
    //create an entry in DB
    const otpBody = await OTP.create(otpPayload);
    console.log("otpBody is",otpBody);



    //return res
    res.status(200).json({
        success:true,
        message:"OTP send Successfully"
    })



  }catch(err){  
    console.log("error in genrating otp" , err);
    return res.status(500).json({
        success:false,
        message:err.message
    })
  }
}

exports.signUp = async(req,res)=>{
    //data fetch
    try{
        const{firstName, lastName , email , password, confirmPassword , accountType , contactNumber , otp } = req.body;
    //validate data
    
            if(!firstName || !lastName || !email || !password || !email || !confirmPassword || !otp){
        return res.status(400).json({
            success:false,
            message:"Fill all fieldds properly",
        })
    }

    //2 passsword match karlo

    if(password !==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and Confirm Password doesnot match"
        });
    }
    //check user already exist

    const existUser =await User.findOne({email});
    if(existUser){
        return res.status(400).json({
            success:false,
            message:"User is already Registered"
        })
    }
    //find most recent otp stored for the user
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log("recent otp is" , recentOtp);

    console.log("OTP from request body:", otp);
    if(recentOtp.length===0){
        return res.status(400).json({
            success:false,
            message:"OTP not found",
        })
    }
    
    //validate otp
    else if(otp!==recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:'Otp not matching'
        })
    }
    //hash password
    const hashPassword =await  bcrypt.hash(password,10);
    
    //create entery in db
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        contactNo:null,
        
    })


    const user = await User.create({
        firstName,
        lastName,
        contactNumber,
        email,
        password:hashPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    //return res
    return res.status(200).json({
        success:true,
        message:"User Registered Succcessfully",
        user,
    })
    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"User cannot be registered . Please try again later",
        })

    }    

}

exports.login = async(req,res)=>{
    try{
        const{email , password} = req.body;
        
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Fill all details completely",
            });

        }
        const user = await User.findOne({email}).populate("additionalDetails").exec();
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User doesnot exist",
            });
        }
        console.log(user);

        if(await bcrypt.compare(password,user.password)){

            const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);
            
            user.token = token;
            user.password=undefined;

            const options ={
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token , options ).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }

    
    }catch(err){
        console.log(err);
        return res.status(500).json({   
            success:false,
            message:"Login failure please try again",
            });
    }

}
//HW
exports.changePassword = async (req,res)=>{
    try{
            //get data from req
        const {email , oldPassword , newPassword } = req.body;
        //get old password , new password , confirmpassword
        //validation
        if(!email){
            return res.status(402).json({
                success:false,
                message:"Fill email properly",
            })
        }
        if(!oldPassword){
            return res.status(402).json({
                success:false,
                message:"Fill op properly",
            })
        }
        if(!newPassword){
            return res.status(402).json({
                success:false,
                message:"Fill np properly",
            })
        }
        const mail =await User.findOne({email})
        if(!mail){
            return res.status(401).json({
                success:false,
                message:"Not a registered User",
            })
        }
        const compare =await bcrypt.compare(oldPassword ,mail.password)

        if(!compare){
            return res.status(402).json({
                success:false,
                message:"Old Password is incorrect",
            })
        }

        
        //update pw in DB
        const bcryptedpassword = await bcrypt.hash(newPassword,10);
        const data = await User.findOneAndUpdate({email:email},{password:bcryptedpassword },{new:true});
        //send mail-password updated 
        await mailSender(email , "Password Updated" , "Password is updated Successfully");

        //return response 
        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        });
    }catch(err){
        console.log(err);
        res.status(401).json({
            success:false,
            message:"Problem in updating password"
        })
    }
}
