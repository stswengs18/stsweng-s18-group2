const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 *   Needed information:
 *        > General Info
 *        > Family Type
 *        > Father, Mother
 *        > Progress in the Family
 *             > SM
 *             > Family
 *             > Worker's Observation/Findings (array of string)
 *             > Interventions made (array of string)
 *        > Recommendations
 *        > Agreement
 */
const InterventionHomeVisitSchema = new Schema ({
     grade_year_course: {
          type: String,
          required: true
     },
     years_in_program: {
          type: Number,
          required: true
     },
     date: {
          type: Date,
          required: true
     },
     community: {
          type: String,
          required: true
     },
     sponsor_name: {
          type: String,
          required: true
     },
     family_type: {
          type: String,
          enum: ["Nuclear", "Extended", "Blended"], // Add family type here
          required: true
     },
     father: {
          last_name: String,
          first_name: String,
          middle_name: String,
          age: Number,
          occupation: String,
          income: Number,
          status: String,
          relationship_to_sm: String,
     },
     mother: {
          last_name: String,
          first_name: String,
          middle_name: String,
          age: Number,
          occupation: String,
          income: Number,
          status: String,
          relationship_to_sm: String,
     },
     familyMembers: [{
          last_name: String,
          first_name: String,
          middle_name: String,
          age: Number, 
          civil_status: String,
          edu_attainment: String,
          occupation: String,
          income: Number,
          status: String,
          relationship_to_sm: String,

          _id: false
     }],
     sm_progress: {
          type: String,
          required: true
     },
     family_progress: {
          type: String,
          required: true
     },
     observation_findings: {
          type: String,
          required: false
     },
     interventions: {
          type: String,
          required: false
     },
     recommendations: {
          type: String,
          required: false
     },
     agreement: {
          type: String,
          required: false
     },
}, { timestamps: true });

const InterventionHomeVisit = mongoose.model('Intervention Home Visit', InterventionHomeVisitSchema);
module.exports = InterventionHomeVisit;