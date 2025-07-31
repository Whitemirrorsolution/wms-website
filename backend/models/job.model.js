import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  department: { 
    type: String, 
    required: true 
},
  location: 
  { 
    type: String, 
    required: true 
},
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship'],
    required: true
  },
  description: { 
    type: String, 
    required: true 
},
  isActive: { 
    type: Boolean, 
    default: true 
}
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema)

export default Job