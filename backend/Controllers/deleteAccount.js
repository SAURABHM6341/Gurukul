const profileScheme = require('../Models/profle');
const userSchema = require('../Models/User');
const courseSchema = require('../Models/course');
exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(400).json({
            message: "user id is required",
            success: false,
        });
    }
    const user = await userSchema.findById(userId);
    if (!user) {
        return res.status(400).json({
            message: "user not found",
            success: false
        });
    }
    await profileScheme.findByIdAndDelete({ _id: user.additionalDetails });
    // if a student is deregistered then enrooled student ki list se usko htana 
    const course = user.courses;
    //#IMPLEMENT
    // i have al the courses now i want to get that course one by one and in that courses i will pull this users id from student enrolled objects array
    //immediately deleting an account is not a good practice then search for how to schedule any request so that account can be deleted after 2 days of clicking on it 
    
    //cron job what is this 
    await userSchema.findByIdAndDelete({ _id: userId });
}