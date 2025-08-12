const { instance } = require('../Config/razorpay');
const courseModel = require('../Models/course');
const crypto = require('crypto');
const userModel = require('../Models/User');
const mailSender = require('../Util/mailsender');
const { createInvoice } = require('./invoice');
//capture the payment and initiate the course purchase order
exports.capturePayment = async (req, res) => {
  try {
    console.log("🚀 capturePayment called");
    console.log("📦 Request body:", req.body);
    console.log("👤 User ID:", req.user?.id);
    
    const { courses } = req.body;
    const UserId = req.user.id;
    //validation
    if (courses.length === 0) {
      return res.status(400).json({ message: "No courses found", success: false });
    }
    let totalAmount = 0;
    for (const courseId of courses) {
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
          success: false
        });
      }
      if (course.studentEnrolled.includes(UserId)) {
        return res.status(400).json({
          message: "User already enrolled in one of the course,please remove it from cart",
          success: false
        });
      }
      totalAmount += course.price;
    }
    const user = await userModel.findById(UserId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    //create order in razorpay
    // API signature
    // {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])
    var options = {
      amount: totalAmount * 100, //amount in paise
      currency: "INR",
      receipt: `${Date.now()}_${UserId}`,
      notes: {
        userId: UserId,
        courseIds: courses
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
      coursesIds: courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifySignature = async (req, res) => {
  try {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;

    if (!razorpay_signature || !razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required Razorpay parameters",
      });
    }

    // Fetch order details from Razorpay to get courseIds and userId from notes
    const order = await instance.orders.fetch(razorpay_order_id);
    
    if (!order || !order.notes) {
      return res.status(400).json({
        success: false,
        message: "Order not found or missing notes",
      });
    }

    // Parse courseIds - it might be a string or array from notes
    let courseIds = order.notes.courseIds;
    if (typeof courseIds === 'string') {
      try {
        courseIds = JSON.parse(courseIds);
      } catch (e) {
        // If it's not valid JSON, treat it as a single course ID
        courseIds = [courseIds];
      }
    }
    
    const userId = order.notes.userId;

    if (!courseIds || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing courseIds or userId in order notes",
      });
    }

    // Now parse the raw buffer to extract data
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const user = await userModel.findById(userId);
      const courses = await courseModel.find({ _id: { $in: courseIds } });
      if (!user || !courses) {
        return res.status(404).json({
          success: false,
          message: "User or Course not found",
        });
      }

      // Add course to user profile
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $push: { courses: { $each: courses.map(course => course._id) } } },
        { new: true }
      );
      //add student to courses
      const updatedCourses = await courseModel.updateMany(
        { _id: { $in: courses.map(course => course._id) } },
          { $addToSet: { studentEnrolled: userId } },{ new: true }
      );

      // Send confirmation email
      const emailResponse = await mailSender(
        user.email,
        "Course Purchase Successful",
        `<h1>Congratulations ${user.Fname}!</h1>
        <p>You have successfully purchased the following courses:</p>
        <ul>
          ${courses.map(course => `<li>${course.courseName} - ₹${course.price}</li>`).join("")}
        </ul>
        <p>Thank you for choosing our platform!</p>`
      );

      // Create invoice for purchase history
      try {
        const invoice = await createInvoice(userId, courseIds, {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        });
        console.log("✅ Invoice created:", invoice._id);
      } catch (invoiceError) {
        console.error("❌ Error creating invoice:", invoiceError);
        // Don't fail the entire transaction if invoice creation fails
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and course enrolled successfully",
        courses: courses,
        user: updatedUser,
        emailResponse
      });
    }

  } catch (err) {
    console.error("❌ Error in verifySignature:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};
