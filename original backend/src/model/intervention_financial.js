const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterventionFinancialAssessmentSchema = new Schema ({
    interventionType:{
        type:String,
        default:'Intervention Financial Assessment',
        required:true
    },
    type_of_assistance: {
        type: [String], // Changed from String to array of Strings
        required: true
    },
    other_assistance_detail: {
        type: String,
        required: function() {
            // Check if 'Other' is included in the array
            return this.type_of_assistance && this.type_of_assistance.includes('Other');
        }
    },
    area_and_subproject: {
        type: String,
        required: true
    },
    problem_presented: {
        type: String,
        required: true        
    },
    recommendation: {
        type: String,
        required: true        
    },       
}, { timestamps: true });

const Intervention_Financial_Assessment = mongoose.model('Intervention Financial Assessment', InterventionFinancialAssessmentSchema);
module.exports = Intervention_Financial_Assessment;