const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CaseClosureSchema = new Schema ({
     sm: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Sponsored Member',
          required: true
     },
     closure_date: {
          type: Date,
          required: true
     },
     sponsorship_date: {
          type: Date,
          required: true
     },
     reason_for_retirement: {
          type: String,
          required: true
     },
     sm_awareness: {
          type: Boolean,
          required: true
     },
     sm_notification: {
          type: String,
          required: function () {
               return this.sm_awareness; // Only required if sm_awareness is true
          }
     },
     services_provided: [{
        service: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
     }],
     evaluation: {
          type: String,
          required: true
     },
     recommendation: {
          type: String,
          required: true
     },
     status: {
          type: String,
          enum: ['Pending', 'Accepted'],
          default: 'Pending',

          required: true
     }
}, { timestamps: true });

const Case_Closure = mongoose.model('Case Closure', CaseClosureSchema);
module.exports = Case_Closure;