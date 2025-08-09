const express = require("express");
const fileUpload = require('express-fileupload');
const dbConnect = require('./Config/database');
const cloudinaryConnect = require('./Config/cloudinary');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const courses = require('./Routes/course');
const payment = require('./Routes/payment');
const user = require('./Routes/user');
const { verifySignature } = require("./Controllers/payment");
const cron = require("node-cron");
const { deleteExpiredAccounts } = require("./Controllers/accountdeletion");

// Run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running account deletion cleanup...");
  await deleteExpiredAccounts();
});


app.post(
  "/api/v1/payment/verify-signature",
  express.raw({ type: "application/json" }),
  verifySignature
);

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
})); //temp folder ka path diya jisse ki file upload ho sake
dbConnect();
cloudinaryConnect.cloudinaryConnect();
app.use(cookieParser());
app.use('/api/v1/course', courses);
app.use('/api/v1/payment', payment);
app.use('/api/v1/user', user);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});
app.get('/',(req,res)=>{
    res.send("<h1>welcome to Gurukul - By Saurabh Mishra</h1>")
})