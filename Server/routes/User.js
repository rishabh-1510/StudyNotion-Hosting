const express = require("express");
const Router = express.Router();

const{login , signUp ,sendOtp, changePassword} = require("../controllers/Auth");
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword");
const{auth} = require("../middlewares/auth");


//AUTHENTICATION ROUTES

Router.post("/login",login);
Router.post("/signup",signUp);
Router.post('/sendotp',sendOtp);
Router.post("/changePassword",auth,changePassword);

//RESET PASSWORD
Router.post("/reset-password-token",resetPasswordToken);
Router.post("/reset-password",resetPassword);

module.exports = Router;