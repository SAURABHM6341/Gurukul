const userModel = require('../Models/User');
exports.accountDelete = async (req, res) => {
    try {
        const userID = req.user.id;
        const deletionTime = 3 * 24 * 60 * 60 * 1000;
        await userModel.findByIdAndUpdate({ userID }, {
            markedForDeletion: true,
            deletionScheduledAt: deletionTime
        });
        res.status(200).json({
            success: true,
            message: "Account deletion requested. It will be deleted in 3 days unless canceled.",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error requesting account deletion" });
    }
}

exports.cancelAccountDeletion = async (req, res) => {
  try {
    const userId = req.user.id;

    await userModel.findByIdAndUpdate(userId, {
      markedForDeletion: false,
      deletionScheduledAt: null,
    });

    res.status(200).json({
      success: true,
      message: "Account deletion canceled.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error canceling deletion" });
  }
};
//script to delete accounts
exports.deleteExpiredAccounts = async () => {
  const now = new Date();

  try {
    const usersToDelete = await userModel.find({
      markedForDeletion: true,
      deletionScheduledAt: { $lte: now },
    });

    for (const user of usersToDelete) {
      await userModel.findByIdAndDelete(user._id);
      console.log(`Deleted user: ${user.email}`);
    }
  } catch (err) {
    console.error("Error deleting expired accounts:", err);
  }
};
