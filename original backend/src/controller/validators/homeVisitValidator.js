const Joi = require('joi');

const homeVisitFormValidate = Joi.object({
     grade_year_course: Joi.string().required(),
     years_in_program: Joi.number().required(),
     date: Joi.date().required(),
     community: Joi.string().required(),
     sponsor_name: Joi.string().required(),
     family_type: Joi.string().required(),

     father: Joi.object({
          father_details: Joi.string().hex().length(24).optional(),
          father_relationship: Joi.string().hex().length(24).optional()
     }).optional(),

     mother: Joi.object({
          mother_details: Joi.string().hex().length(24).optional(),
          mother_relationship: Joi.string().hex().length(24).optional()
     }).optional(),

     familyMembers: Joi.array().items(
          Joi.object({
               family_member_details: Joi.string().hex().length(24).optional(),
               family_member_relationship: Joi.string().hex().length(24).optional()
          })
     ).optional(),

     sm_progress: Joi.string().required(),
     family_progress: Joi.string().required(),
     observation_findings: Joi.array().items(Joi.string()).optional(),
     interventions: Joi.array().items(Joi.string()).optional(),
     recommendations: Joi.string().optional(),
     agreement: Joi.string().optional(),
     progress_reports: Joi.array().items(Joi.string().hex().length(24)).optional()
});

module.exports = homeVisitFormValidate;