const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5 * 60
    },

});

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = mailSender(email,"Verification Email from StudyNotion" , otp);
        console.log("Email send Successfully" , mailResponse);

    }catch(err){
        console.log("error occur while sending mail" , err)
    }
}

otpSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP",otpSchema);
module.exports = OTP;