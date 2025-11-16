const Joi = require('joi');

/*
//THIS IS FOR ALL

*/
const caseSchemaValidate = Joi.object({
  sm_number: Joi.number().required(),

  last_name: Joi.string().min(1).pattern(/^[^0-9]*$/).required().messages({
    'string.empty': 'Last name cannot be empty'
  }),
  first_name: Joi.string().min(1).pattern(/^[^0-9]*$/).required().messages({
    'string.empty': 'First name cannot be empty'
  }),
  middle_name: Joi.string().empty('').pattern(/^[^0-9]*$/).allow(null).optional(),


  is_active: Joi.boolean().required(),

  present_address: Joi.string().min(1).required().messages({
    'string.empty': 'Present address cannot be empty',
    'any.required': 'Present address is required'
  }),

  dob: Joi.date().less('now').required().messages({
    'date.less': 'Date of birth must be in the past',
    'any.required': 'Date of birth is required',
    'date.base': 'Date of birth must be a valid date'
  }),

  pob: Joi.string().min(1).required().messages({
    'string.empty': 'Place of birth cannot be empty',
    'any.required': 'Place of birth is required'
  }),


  civil_status: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').required().messages({
    'any.only': 'Civil status must be one of Single, Married, Divorced, Widowed, or Separated',
    'any.required': 'Civil Status is required'
  }),

  edu_attainment: Joi.string().empty('').allow(null).optional(),

  religion: Joi.string().empty('').allow(null).optional(),

  occupation: Joi.string().empty('').allow(null).optional(),

  sex: Joi.string().valid('Male', 'Female').required().messages({
    'any.only': 'Sex must be one of Male or Female',
    'any.required': 'Sex is required'
  }),

  contact_no: Joi.string().pattern(/^[0-9]{11}$/).messages({
    'string.pattern.base': 'Contact number must be exactly 11 numerical digits'
  }).empty('').optional(),

  relationship_to_client: Joi.string().empty('').allow(null).optional(),

  problem_presented: Joi.string().empty('').allow(null).optional(),

  observation_findings: Joi.string().empty('').allow(null).optional(),

  recommendation: Joi.string().empty('').allow(null).optional(),

  history_problem: Joi.string().empty('').allow(null).optional(),

  evaluation: Joi.string().empty('').allow(null).optional(),
  assessment: Joi.string().empty('').allow(null).optional(),

  classifications: Joi.string().empty('').allow(null).optional(),
});
/*
//THIS IS FOR CORE ONLY





*/
const caseCoreValidate = Joi.object({
  sm_number: Joi.number().integer().min(0).required(),

  last_name: Joi.string().min(1).pattern(/^[^0-9]*$/).required().messages({
    'string.empty': 'Last name cannot be empty'
  }),
  first_name: Joi.string().min(1).pattern(/^[^0-9]*$/).required().messages({
    'string.empty': 'First name cannot be empty'
  }),
  middle_name: Joi.string().empty('').pattern(/^[^0-9]*$/).allow(null).optional(),
  spu: Joi.string().pattern(/^[a-f\d]{24}$/i).required().messages({
    'string.pattern.base': 'SPU must be a valid ObjectId',
    'any.required': 'SPU is required'
  }),
  is_active: Joi.boolean().required(),
  classifications: Joi.string().empty('').pattern(/^[^0-9]*$/).allow(null).optional(),
    assigned_sdw: Joi.string().pattern(/^[a-f\d]{24}$/i).required()
    .messages({
      'string.pattern.base': 'assigned_sdw must be a valid ObjectId'
    }),
});
/*
//THIS IS FOR IDENTIFYING DATA ONLY





*/
const caseIdentifyingValidate = Joi.object({
  present_address: Joi.string().min(1).required().messages({
    'string.empty': 'Present address cannot be empty',
    'any.required': 'Present address is required'
  }),

  dob: Joi.date().less('now').required().messages({
    'date.less': 'Date of birth must be in the past',
    'any.required': 'Date of birth is required',
    'date.base': 'Date of birth must be a valid date'
  }),

  pob: Joi.string().min(1).required().messages({
    'string.empty': 'Place of birth cannot be empty',
    'any.required': 'Place of birth is required'
  }),

  civil_status: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed', 'Separated').required().messages({
    'any.only': 'Civil status must be one of Single, Married, Divorced, Widowed, or Separated',
    'any.required': 'Civil Status is required'
  }),

  edu_attainment: Joi.string().empty('').optional(),

  religion: Joi.string().empty('').optional(),

  occupation: Joi.string().empty('').optional(),

  sex: Joi.string().valid('Male', 'Female').required().messages({
    'any.only': 'Sex must be one of Male or Female',
    'any.required': 'Sex is required'
  }),

  contact_no: Joi.string().pattern(/^[0-9]{11}$/).messages({
    'string.pattern.base': 'Contact number must be exactly 11 numerical digits'
  }).empty('').optional(),

  relationship_to_client: Joi.string().empty('').optional()
});
module.exports = [caseSchemaValidate, caseCoreValidate, caseIdentifyingValidate];
