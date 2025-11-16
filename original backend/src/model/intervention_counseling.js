const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterventionCounselingSchema = new Schema ({
     grade_year_level: {
          type: String,
          required: true
     },
     school: {
          type: String,
          required: true
     },
     area_self_help:{
          type: String,
          required: true        
     },
     counseling_date:{
          type: Date,
          required: true        
     },     
     reason_for_counseling:{
          type: String,
          required: true        
     },
     corrective_action:{
          type: String,
          required: true        
     },
     recommendation:{
          type: String,
          required: true        
     },
     sm_comments:{
          type: String,
          required: false        
     },
}, { timestamps: true });

const InterventionCounseling = mongoose.model('Intervention Counseling', InterventionCounselingSchema);
module.exports = InterventionCounseling;