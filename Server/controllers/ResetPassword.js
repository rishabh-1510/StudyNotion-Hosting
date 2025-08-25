const { useActionData } = require("react-router-dom");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
//reset paassword token
exports.resetPasswordToken = async (req , res)=>{
    try{
            //get email by body
        const email = req.body.email;
        //check the email
        const user =await User.findOne({email:email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your Email is invalid",

            })
        }
        //generate token
        const token = crypto.randomUUID()
        //update user by adding token and expiration time
        const updatedUser = await User.findOneAndUpdate({email:email},{
            token,
            resetPassword:Date.now() + 5*60*1000
        },{new:true}); 
        //create url
        const url = `htttp"//localhost:3000/update-password/${token}`

        //send mail containing the url
        await mailSender(email,"Password Reset Link" , `Password Reset Link : ${url}`);

        //return response
        return res.json({
            success:true,
            message:"Email sent successfully , Please check email and change password"
})

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong while sending reset email"
        })
    }
}


//reset password

exports.resetPassword = async(req,res)=>{
    try{
            //data fetch
            const{password , confirmPassword , token} = req.body;
            //validation
            if(password !== confirmPassword){
                return res.json({
                    success:false,
                    message:"Password not matching"
                });
            }
            
            //get userdetails from db using token
            const userDetail =await User.findOne({token:token});
            console.log("USER DETAILS",userDetail);
            //if no entry - invalid token
            if(token!=userDetail.token){
                return res.json({
                    success:false,
                    message:"Token used",
                });
            }
            if(!userDetail){
                return res.json({
                    success:false,
                    message:"Token invalid",
                });
            }

            //time expire
            if(userDetail.resetPassword < Date.now()){
                return res.json({
                    success:false,
                    message:"Token is expired please regenrate yout token"
                })
            }
            //hashpassword
            const hashedPassword =await bcrypt.hash(password,10);
            //password update
            await User.findOneAndUpdate(
                {token:token},
                {password:hashedPassword,
                    token:null
                },
                {new:true}
            )
            //return
            return res.status(200).json({
                success:true,
                message:"Password reset successfully"
            })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Problem in reseting password"
        })
    }
}