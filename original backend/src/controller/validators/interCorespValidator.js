const Joi = require('joi');

const interCorespValidator = Joi.object({
    name_of_sponsor: Joi.string().min(1).required(),
    date_of_sponsorship: Joi.date().required(),
    identified_problem: Joi.string().min(1).required(),
    assesment: Joi.string().min(1).required(),
    objective: Joi.string().min(1).required(),
    recommendation: Joi.string().min(1).required(),
    intervention_plans: Joi.array().items(
        Joi.object({
            action: Joi.string().min(1).required(),
            time_frame: Joi.string().min(1).required(),
            results: Joi.string().min(1).required(),
        })
    ).required(),
    progress_reports: Joi.array().items(
        Joi.string().length(24).hex()
    ).optional(),
});

module.exports = interCorespValidator;