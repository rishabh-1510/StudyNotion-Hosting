const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseroutes = require("./routes/Course");


app.use(express.json());
require("dotenv").config();;
const PORT = process.env.PORT;

const cookieParser = require("cookie-parser");
const cors = require("cors");

const {cloudinaryConnect} = require("./config/cloudinary");


const fileUpload = require("express-fileupload");

require("./config/database").connect();
app.use(cookieParser());

app.use(
    cors({
        origin:["http://localhost:3000", "https://your-frontend-app.vercel.app"],
        credentials:true,
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
);

cloudinaryConnect();

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseroutes);

// def route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your Server is running.."
    })
});

app.listen(PORT , ()=>{
    console.log(`App is running at PORT no ${PORT}`)
})


