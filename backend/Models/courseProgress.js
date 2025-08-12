const mongoose = require('mongoose');

const courseProgressScheme = new mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    CompletedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ],
    // Enhanced progress tracking
    videoProgress: {
        type: Map,
        of: {
            watchTime: {
                type: Number,
                default: 0
            },
            lastWatched: {
                type: Date,
                default: Date.now
            },
            isCompleted: {
                type: Boolean,
                default: false
            },
            completedAt: {
                type: Date
            },
            notes: [
                {
                    timestamp: Number,
                    content: String,
                    createdAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
        }
    },
    // Overall course completion percentage
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Course start and completion dates
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    // Last activity timestamp
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
courseProgressScheme.index({ CourseId: 1, userId: 1 }, { unique: true });
courseProgressScheme.index({ userId: 1 });
courseProgressScheme.index({ CourseId: 1 });

// Update lastActivity on save
courseProgressScheme.pre('save', function(next) {
    this.lastActivity = new Date();
    next();
});

module.exports = mongoose.model('courseProgress', courseProgressScheme);
