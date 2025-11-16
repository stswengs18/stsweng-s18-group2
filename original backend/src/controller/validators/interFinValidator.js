const Joi = require('joi');

const interFinSchemaValidator = Joi.object({
    type_of_assistance: Joi.array().items(
        Joi.string().valid(
            'Funeral Assistance to the family member',
            'Medical Assistance to Family Member',
            'Food Assistance',
            'IGP Capital',
            'Funeral Assistance to Sponsored Member',
            'Medical Assistance to Sponsored Member',
            'Home Improvement/Needs',
            'Other'
        )
    ).min(1).required()
    .messages({
        'array.min': 'At least one type of assistance must be selected',
        'any.required': 'Type of assistance is required'
    }),
    
    other_assistance_detail: Joi.when('type_of_assistance', {
        is: Joi.array().items(Joi.string()).custom((value, helpers) => {
            return value.includes('Other');
        }),
        then: Joi.string().required().messages({
            'any.required': 'Please specify details for Other assistance type'
        }),
        otherwise: Joi.string().allow('', null)
    }),

  area_and_subproject: Joi.string().required(),

  problem_presented: Joi.string().required(),

  recommendation: Joi.string().required(),

  progress_reports: Joi.array()
    .items(Joi.string().length(24).hex())
    .optional()
});

module.exports = interFinSchemaValidator;