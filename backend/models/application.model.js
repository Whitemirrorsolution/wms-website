import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
      fullName: { 
        type: String, 
        required: true 
    },
     email: { 
        type: String, 
        required: true,
        unique: true,
    },
     phone: { 
        type: String, 
        required: true 
    },
     gender: { 
        type: String, 
        required: true, 
        enum: ['Male', 'Female', 'Other'] 
    },
     dateOfBirth: { 
        type: Date, 
        required: true 
    },
      qualification: { 
        type: String, 
        required: true 
    },
      resumePath: { 
        type: String, 
        required: true 
    },
    coverLetter: { 
        type: String 
    },
    appliedJobTitle: { 
        type: String, 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
    },
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'] 
    },
    appliedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {timestamps:true})

const Application = mongoose.model("Application", applicationSchema)

export default Application