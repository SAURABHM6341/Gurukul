const Invoice = require('../Models/invoices');
const User = require('../Models/User');
const Course = require('../Models/course');

// Create invoice after successful payment
exports.createInvoice = async (userId, courses, paymentDetails) => {
    try {
        console.log("📧 Creating invoice...");
        
        // Get course details
        const courseDetails = await Course.find({ _id: { $in: courses } });
        
        let totalAmount = 0;
        const invoiceCourses = courseDetails.map(course => {
            totalAmount += course.price;
            return {
                courseId: course._id,
                courseName: course.courseName,
                price: course.price
            };
        });

        const invoice = new Invoice({
            User: userId,
            courses: invoiceCourses,
            totalAmount,
            paymentId: paymentDetails.paymentId,
            orderId: paymentDetails.orderId,
            paymentStatus: 'completed',
            paymentMethod: 'Razorpay'
        });

        await invoice.save();
        console.log("✅ Invoice created successfully");
        return invoice;
    } catch (error) {
        console.error("❌ Error creating invoice:", error);
        throw error;
    }
};

// Get user's purchase history
exports.getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const invoices = await Invoice.find({ User: userId })
            .populate('courses.courseId', 'courseName thumbnail instructor')
            .populate('User', 'Fname Lname email')
            .sort({ purchaseDate: -1 });

        return res.status(200).json({
            success: true,
            message: "Purchase history fetched successfully",
            invoices
        });
    } catch (error) {
        console.error("Error fetching purchase history:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch purchase history"
        });
    }
};

// Get specific invoice details
exports.getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const userId = req.user.id;
        
        const invoice = await Invoice.findOne({ _id: invoiceId, User: userId })
            .populate('courses.courseId', 'courseName thumbnail instructor')
            .populate('User', 'Fname Lname email');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Invoice details fetched successfully",
            invoice
        });
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch invoice details"
        });
    }
};
