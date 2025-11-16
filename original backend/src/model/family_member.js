const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilyMemberSchema = new Schema({
     last_name: {
          type: String,

          required: true,
     },
     first_name: {
          type: String,

          required: true
     },
     // Default is NULL, considered those without middle names
     middle_name: {
          type: String,

          default: null,
          required: false
     },
     age: {
          type: Number,

          required: true
     },
     civil_status: {
          type: String,

          required: true
     },
     edu_attainment: {
          type: String,

          required: true
     },
     occupation: {
          type: String,

          required: true
     },
     income: {
          type: Number,

          required: true
     },
     status: {
          type: String,

          default: "Living",
          required: true,
     }
}, { timestamps: true });

const Family_Member = mongoose.model('Family Member', FamilyMemberSchema);
module.exports = Family_Member;