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
      const emailBody = `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 Purchase Successful!</h1>
                <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
            </div>
            
            <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Thank You for Your Purchase!</h2>
                
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Hi <strong>${user.Fname}</strong>,
                </p>
                
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Congratulations! Your payment has been processed successfully. You now have access to the following course${courses.length > 1 ? 's' : ''}:
                </p>
                
                <div style="background-color: #f7fafc; border-radius: 10px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 20px;">📚 Your Course${courses.length > 1 ? 's' : ''}</h3>
                    ${courses.map(course => `
                        <div style="background-color: white; border-radius: 8px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea;">
                            <h4 style="color: #2d3748; margin: 0 0 10px 0; font-size: 18px;">${course.courseName}</h4>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                                <span style="color: #48bb78; font-weight: 600; font-size: 16px;">₹${course.price}</span>
                                <span style="background-color: #e6fffa; color: #234e52; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: 600;">✅ ENROLLED</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 30px 0; border-radius: 5px;">
                    <h3 style="color: #2f855a; margin: 0 0 15px 0; font-size: 18px;">💰 Payment Summary</h3>
                    <ul style="color: #2f855a; margin: 0; padding-left: 20px; font-size: 14px; list-style: none;">
                        <li style="margin-bottom: 8px;">📅 <strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
                        <li style="margin-bottom: 8px;">⏰ <strong>Time:</strong> ${new Date().toLocaleTimeString()}</li>
                        <li style="margin-bottom: 8px;">💳 <strong>Total Paid:</strong> ₹${courses.reduce((total, course) => total + course.price, 0)}</li>
                        <li>✅ <strong>Status:</strong> Payment Successful</li>
                    </ul>
                </div>
                
                <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">🚀 What's next?</h3>
                <ol style="color: #4a5568; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                    <li>Access your course${courses.length > 1 ? 's' : ''} immediately from your dashboard</li>
                    <li>Start learning at your own pace</li>
                    <li>Complete assignments and track your progress</li>
                    <li>Get certificates upon course completion</li>
                </ol>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; margin-right: 15px;">
                        Go to Dashboard
                    </a>
                    <a href="${process.env.FRONTEND_URL}/my-courses" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                        Start Learning
                    </a>
                </div>
                
                <div style="background-color: #e6fffa; border-left: 4px solid #38b2ac; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="color: #234e52; margin: 0; font-size: 14px;">
                        <strong>💡 Need Help?</strong> If you have any questions about your course${courses.length > 1 ? 's' : ''} or need technical support, contact us at <a href="mailto:support@gurukul.com" style="color: #234e52;">support@gurukul.com</a>
                    </p>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                        Happy Learning!<br>
                        <strong>The Gurukul Team</strong><br>
                        🎓 Empowering learners worldwide
                    </p>
                </div>
            </div>
        </div>
      `;

      const emailResponse = await mailSender(
        user.email,
        "Course Purchase Confirmation - Gurukul",
        emailBody
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
