//i,port the payment request
const express = require("express");
const Router = express.Router();

const {capturePayment,verifyPayment , sendPaymentSuccessEmail} = require("../controllers/Payments");
const{auth , isStudent , isAdmin , isInstructor} = require("../middlewares/auth");
Router.post("/capturepayment",auth,isStudent,capturePayment);
Router.post("/verifyPayment",auth ,isStudent,verifyPayment);
Router.post("/sendPaymentSuccessEmail" , auth , isStudent , sendPaymentSuccessEmail);

module.exports = Router; 