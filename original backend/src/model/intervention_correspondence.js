const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterventionCorrespondenceSchema = new Schema ({
    interventionType:{
        type:String,
        default:'Intervention Correspondence',
        required:true
    },

     name_of_sponsor: {
          type: String,
          required: true
     },
     date_of_sponsorship: {
          type: Date,
          required: true
     }, 
     identified_problem:{
          type: String,
          required: true
     },
     assesment: {
          type: String,
          required: true
     },
     objective: {
          type:String,
          required:true
     },
     recommendation: {
          type: String,
          required: true,
     },
     intervention_plans: [{
          action: {
               type: String,
               required: true
          },
          time_frame: {
               type: String,
               required: true
          },
          results: {
               type: String,
               required: true
          },
          person_responsible:{
               type:String,
               required: true
          },
     }],
}, { timestamps: true });

const Intervention_Correspondence = mongoose.model('Intervention Correspondence', InterventionCorrespondenceSchema);
module.exports = Intervention_Correspondence;