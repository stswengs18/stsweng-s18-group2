const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilyRelationshipSchema = new Schema ({
     family_id: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Family Member',

          required: true
     },
     sponsor_id: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Sponsored Member',

          required: true,
     },
     relationship_to_sm: {
          type: String, 

          required: true
     },
}, { timestamps: true });

const Family_Relationship = mongoose.model('Family Relationship', FamilyRelationshipSchema);
module.exports = Family_Relationship;