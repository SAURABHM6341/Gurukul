const { instance } = require('../Config/razorpay');
const courseModel = require('../Models/course');
const crypto = require('crypto');
const userModel = require('../Models/User');
const mailSender = require('../Util/mailsender');
//capture the payment and initiate the course purchase order
exports.capturePayment = async (req, res) => {
    try {
        const { courseId } = req.body;
        const UserId = req.user.id;
        //validation
        if (!courseId || !UserId) {
            return res.status(400).json({ message: "Course ID and User ID are required" });
        }
        const course = await courseModel.findById(courseId);
        //validate userId and course id
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }
        const user = await userModel.findById(UserId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        //check if user already bought the course
        if (user.courses.includes(course._id)) {
            return res.status(400).json({
                message: "User already bought this course",
                success: false
            });
        }
        //create order in razorpay
        // API signature
        // {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])
        var options = {
            amount: course.price * 100, //amount in paise
            currency: "INR",
            receipt: `${Date.now()}_${UserId}`,
            notes: {
                userId: UserId,
                courseId: courseId
            },
        };
        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(500).json({
                message: "Failed to create order",
                success: false
            });
        }
        return res.status(200).json({
            message: "Order created successfully",
            order: order.id,
            success: true,
            course: {
                id: course._id,
                name: course.courseName,
                amount: order.amount / 100, // convert to rupees
                currency: order.currency,
                thumbnail: course.thumbnail,
                courseDescription: course.courseDescription,


            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.verifySignature = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const webhookSecret = '1234567890'; // Replace with your webhook secret
        const shaSum = crypto.createHmac("sha256", webhookSecret);
        shaSum.update(req.rawBody.toString());
        const digest = shaSum.digest("hex");

        // Verify the signature
        if (digest === signature) {
            console.log("Signature verified successfully");
            // return res.status(200).json({
            //     message: "Signature verified successfully",});
            // now user ko course dena h to course id aur user id ki need h isiliye hamne notes me userId aur courseId pass kiya tha
            const { userId, courseId } = req.body.payload.payment.entity.notes;  // this is the path where we get notes
            // find user and course
            const user = await userModel.findById(userId);
            const course = await courseModel.findByIdAndUpdate(
                { _id: courseId },
                {
                    $push: { studentEnrolled: user._id }
                },
                { new: true }
            );
            // add course to user profile
            await userModel.findByIdAndUpdate({ _id: userId },
                {
                    $push: { courses: course._id }
                },
                { new: true }
            )
            if (!user || !course) {
                return res.status(404).json({
                    message: "User or Course not found",
                    success: false
                });
            }
            // send email to user
            const emailResponse = await mailSender(
                user.email,
                "Course Purchase Successful",
                `<h1>Congratulations ${user.Fname}!</h1>
                   <p>You have successfully purchased the course: ${course.courseName}</p>
                   <p>Course Description: ${course.courseDescription}</p>
                   <p>Price: ₹${course.price}</p>
                   <p>Thank you for choosing our platform!</p>`
            );
            return res.status(200).json({
                message: "Payment verified and course enrolled successfully",
                success: true,
                course: {
                    id: course._id,
                    name: course.courseName,
                    price: course.price,
                    thumbnail: course.thumbnail
                },
                emailResponse: emailResponse
            });
        }
        else{
            return res.status(400).json({
                message: "Invalid signature",
                success: false
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error",
            success: false,
            error: err.message
         });
    }
}