const userModel = require('../Models/User');
const mailSender = require('../Util/mailsender');

exports.accountDelete = async (req, res) => {
    try {
        const userID = req.user.id;
        
        // Get user details for email
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Calculate deletion date (3 days from now)
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 3);
        
        // Update user with deletion flags
        await userModel.findByIdAndUpdate(userID, {
            markedForDeletion: true,
            deletionScheduledAt: deletionDate
        });

        // Prepare email content
        const emailTitle = "Account Deletion Initiated - Gurukul";
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #ef4444; text-align: center;">Account Deletion Initiated</h2>
                
                <p>Dear ${user.Fname} ${user.Lname},</p>
                
                <p>We have received a request to delete your Gurukul account. This email confirms that the deletion process has been initiated.</p>
                
                <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #dc2626; margin-top: 0;">⚠️ Important Information:</h3>
                    <ul style="color: #7f1d1d;">
                        <li><strong>Deletion Date:</strong> ${deletionDate.toLocaleDateString()} at ${deletionDate.toLocaleTimeString()}</li>
                        <li><strong>Time Remaining:</strong> 3 days from now</li>
                        <li><strong>Account Email:</strong> ${user.email}</li>
                    </ul>
                </div>
                
                <h3>What happens next?</h3>
                <ul>
                    <li>Your account is now marked for deletion</li>
                    <li>You have 3 days to cancel this request if you change your mind</li>
                    <li>After 3 days, your account and all associated data will be permanently deleted</li>
                    <li>This includes your profile, courses, progress, and any other account data</li>
                </ul>
                
                <h3>Want to cancel the deletion?</h3>
                <p>If you didn't request this deletion or changed your mind:</p>
                <ol>
                    <li>Log in to your Gurukul account</li>
                    <li>Go to Settings → Delete Account</li>
                    <li>Click "Cancel Deletion Request"</li>
                </ol>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e;"><strong>Note:</strong> If you don't cancel within 3 days, this action cannot be undone.</p>
                </div>
                
                <p>If you have any questions or need assistance, please contact our support team immediately.</p>
                
                <hr style="margin: 30px 0;">
                <p style="text-align: center; color: #6b7280; font-size: 14px;">
                    This is an automated email from Gurukul - Centralized Learning Platform<br>
                    If you didn't request this, please contact support immediately.
                </p>
            </div>
        `;

        // Send email notification
        try {
            await mailSender(user.email, emailTitle, emailBody);
            console.log(`Account deletion email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Error sending deletion email:", emailError);
            // Don't fail the request if email fails, but log it
        }

        res.status(200).json({
            success: true,
            message: "Account deletion initiated. You will receive an email confirmation and your account will be deleted in 3 days unless canceled.",
            deletionDate: deletionDate
        });
    } catch (err) {
        console.error("Error requesting account deletion:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error requesting account deletion", 
            error: err.message 
        });
    }
}

exports.cancelAccountDeletion = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user details for email
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if account was actually marked for deletion
        if (!user.markedForDeletion) {
            return res.status(400).json({
                success: false,
                message: "Account is not currently marked for deletion",
            });
        }

        // Cancel the deletion
        await userModel.findByIdAndUpdate(userId, {
            markedForDeletion: false,
            deletionScheduledAt: null,
        });

        // Prepare cancellation email content
        const emailTitle = "Account Deletion Cancelled - Gurukul";
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #059669; text-align: center;">Account Deletion Cancelled</h2>
                
                <p>Dear ${user.Fname} ${user.Lname},</p>
                
                <p>Good news! Your account deletion request has been successfully cancelled.</p>
                
                <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #065f46; margin-top: 0;">✅ Cancellation Confirmed:</h3>
                    <ul style="color: #064e3b;">
                        <li>Your account is now safe and will not be deleted</li>
                        <li>All your data, courses, and progress remain intact</li>
                        <li>You can continue using your account normally</li>
                        <li>Cancelled on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</li>
                    </ul>
                </div>
                
                <h3>What's next?</h3>
                <p>Your account is now fully restored and you can:</p>
                <ul>
                    <li>Continue accessing all your courses</li>
                    <li>Use all platform features normally</li>
                    <li>Update your account settings if needed</li>
                </ul>
                
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e;"><strong>Security Note:</strong> If you didn't cancel this deletion request, please contact our support team immediately and consider changing your password.</p>
                </div>
                
                <p>Thank you for staying with Gurukul!</p>
                
                <hr style="margin: 30px 0;">
                <p style="text-align: center; color: #6b7280; font-size: 14px;">
                    This is an automated email from Gurukul - Centralized Learning Platform<br>
                    If you have any questions, please contact our support team.
                </p>
            </div>
        `;

        // Send cancellation email notification
        try {
            await mailSender(user.email, emailTitle, emailBody);
            console.log(`Account deletion cancellation email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Error sending cancellation email:", emailError);
            // Don't fail the request if email fails, but log it
        }

        res.status(200).json({
            success: true,
            message: "Account deletion cancelled successfully. You will receive an email confirmation.",
        });
    } catch (err) {
        console.error("Error canceling deletion:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error canceling deletion",
            error: err.message 
        });
    }
};
//script to delete accounts
exports.deleteExpiredAccounts = async () => {
    const now = new Date();
    console.log(`Running account deletion cleanup at ${now.toISOString()}`);

    try {
        const usersToDelete = await userModel.find({
            markedForDeletion: true,
            deletionScheduledAt: { $lte: now },
        });

        console.log(`Found ${usersToDelete.length} accounts scheduled for deletion`);

        for (const user of usersToDelete) {
            try {
                // Send final deletion notification email
                const emailTitle = "Account Deleted - Gurukul";
                const emailBody = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #ef4444; text-align: center;">Account Successfully Deleted</h2>
                        
                        <p>Dear ${user.Fname} ${user.Lname},</p>
                        
                        <p>This email confirms that your Gurukul account has been permanently deleted as requested.</p>
                        
                        <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #dc2626; margin-top: 0;">🗑️ Deletion Details:</h3>
                            <ul style="color: #7f1d1d;">
                                <li><strong>Account Email:</strong> ${user.email}</li>
                                <li><strong>Deletion Date:</strong> ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}</li>
                                <li><strong>Account Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</li>
                            </ul>
                        </div>
                        
                        <h3>What has been deleted:</h3>
                        <ul>
                            <li>Your user profile and personal information</li>
                            <li>Course enrollment and progress data</li>
                            <li>Account settings and preferences</li>
                            <li>Any associated platform data</li>
                        </ul>
                        
                        <p>Thank you for being part of the Gurukul community. We're sorry to see you go!</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="text-align: center; color: #6b7280; font-size: 14px;">
                            This is the final automated email from Gurukul - Centralized Learning Platform<br>
                            Your account and email have been removed from our systems.
                        </p>
                    </div>
                `;

                // Send final email before deletion
                try {
                    await mailSender(user.email, emailTitle, emailBody);
                    console.log(`Final deletion email sent to ${user.email}`);
                } catch (emailError) {
                    console.error(`Error sending final deletion email to ${user.email}:`, emailError);
                }

                // Delete the user
                await userModel.findByIdAndDelete(user._id);
                console.log(`Successfully deleted user: ${user.email} (ID: ${user._id})`);

            } catch (deleteError) {
                console.error(`Error deleting user ${user.email}:`, deleteError);
            }
        }

        if (usersToDelete.length > 0) {
            console.log(`Account deletion cleanup completed. Deleted ${usersToDelete.length} accounts.`);
        }

        return {
            success: true,
            deletedCount: usersToDelete.length,
            message: `Successfully processed ${usersToDelete.length} account deletions`
        };

    } catch (err) {
        console.error("Error in deleteExpiredAccounts:", err);
        return {
            success: false,
            error: err.message
        };
    }
};
