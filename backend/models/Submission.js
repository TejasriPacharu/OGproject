const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        problemId: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
            enum: ["cpp", "java", "python", "js"],
        },
        code: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        executionTime: {
            type: Number,
        },
        verdict: {
            type: String,
            enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error"],
            default: "Wrong Answer"
        },
        status: {
            type: String,
            enum: ["solved", "attempted"],
            default: "attempted"
        }
    },
     {timestamps: true,}
);

module.exports = mongoose.model("Submission", SubmissionSchema);