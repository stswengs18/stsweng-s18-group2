//this is the controller for intervention financial form

const mongoose =require('mongoose');
const Sponsored_Member = require('../model/sponsored_member');
const Intervention_Financial = require('../model/intervention_financial');
const interFinSchemaValidator = require('./validators/interFinValidator');


/**
 * @route   POST /api/interventions/financial/:id
 * @desc    Creates a new Intervention Financial Assessment form and links it to a Sponsored Member
 * 
 * @required
 *    - :id URL parameter: ObjectId of the Sponsored Member to link the intervention to
 *    - Request body: Valid Intervention Financial Assessment data
 * 
 * @notes
 *    - Validates if the provided id is a valid Mongo ObjectId
 *    - Validates the request body using Joi schema
 *    - Creates a new Intervention Financial Assessment document
 *    - Pushes the new intervention's ObjectId into the Sponsored Member's interventions array
 * 
 * @returns
 *    - 201 Created: The newly created intervention form
 *    - 400 Bad Request: if the provided id is invalid or validation fails
 *    - 500 Internal Server Error: if something goes wrong during the process
 */
const createFinForm = async (req, res) => {
    const newData = req.body;
    const smId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(smId)) {
        return res.status(400).json({ message: 'Invalid Sponsored Member' });
    }

    try {
        interFinSchemaValidator.validate(newData);

        const newForm = new Intervention_Financial({
            ...newData
        });
        await newForm.save();

        
        const sponsoredMember = await Sponsored_Member.findById(smId);

        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored Member not found' });
        }

        // Make sure interventions exists and is an array before filtering
        const interventions = sponsoredMember.interventions || [];
        
        //Just filters through the same type of intervention in the sponsored member
        const sameTypeInterventions = interventions.filter(
            i => i.interventionType === 'Intervention Financial Assessment'
        );

        //gets last number
        const maxNumber = sameTypeInterventions.length > 0
            /* ? Math.max(...sameTypeInterventions.map(i => i.intervention_number)) */
            ? sameTypeInterventions.length
            : 0;

        //pushes 
        sponsoredMember.interventions = sponsoredMember.interventions || [];
        sponsoredMember.interventions.push({
            intervention: newForm._id,
            intervention_number: maxNumber + 1,
            interventionType: 'Intervention Financial Assessment'
        });

        await sponsoredMember.save();

        return res.status(201).json(newForm);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
/**
 * @route   GET /api/interventions/financial/form/:caseId/:formId
 * @desc    Retrieves a specific Intervention Financial Assessment form and basic Sponsored Member info
 * 
 * @required
 *    - :caseId URL parameter: ObjectId of the Sponsored Member
 *    - :formId URL parameter: ObjectId of the Intervention Financial Assessment form
 * 
 * @notes
 *    - Validates if the provided ids are valid Mongo ObjectIds
 *    - Fetches the Sponsored Member's name, sm_number, and spu
 *    - Fetches the full Intervention Financial Assessment form data
 *    - Combines both into a single response object
 * 
 * @returns
 *    - 200 OK: Object containing sponsored_member info and full form data
 *    - 400 Bad Request: if any provided id is invalid
 *    - 404 Not Found: if the Sponsored Member or form does not exist
 *    - 500 Internal Server Error: if something goes wrong during the process
 */

const getFinancialForm = async(req,res)=>{
    const sponsor_id = req.params.smId;
    const formId = req.params.formId;
    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(sponsor_id)) {
        return res.status(400).json({ message: 'Invalid Sponsored Member or Form' });
    }
    try{
        const sponsoredData = await Sponsored_Member.findById(sponsor_id).populate('spu').lean();
        const formData = await Intervention_Financial.findById(formId).lean()

        if (!sponsoredData || !formData) {
            return res.status(404).json({ message: 'Sponsored Member or Form not found' });
        }
        const interventionEntry = sponsoredData.interventions.find(
            i => i.intervention && i.intervention.toString() === formId.toString() && 
                i.interventionType === 'Intervention Financial Assessment'
        );

        const intervention_number = interventionEntry ? interventionEntry.intervention_number : null;


        const mergedData = {
            sponsored_member: {
                first_name: sponsoredData.first_name,
                middle_name: sponsoredData.middle_name,
                last_name: sponsoredData.last_name,
                sm_number: sponsoredData.sm_number,
                spu: sponsoredData.spu.spu_name
            },
            form: {
            ...formData,
            intervention_number}
        };
        
        return res.status(200).json(mergedData);
    }catch(error){

        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
/**
 * @route   GET /api/interventions/financial/all/:id
 * @desc    Retrieves all "Intervention Financial Assessment" interventions for a Sponsored Member
 * 
 * @required
 *    - :id URL parameter: ObjectId of the Sponsored Member whose interventions are to be retrieved
 * 
 * @notes
 *    - Validates if the provided id is a valid Mongo ObjectId
 *    - Fetches the Sponsored Member by its _id
 *    - Populates the interventions array with only those interventions whose interventionType is "Intervention Financial Assessment"
 *    - Filters out any null interventions (in case of mismatched types or missing documents)
 * 
 * @returns
 *    - 200 OK: Array of all "Intervention Financial Assessment" intervention documents for the Sponsored Member
 *    - 400 Bad Request: if the provided id is invalid
 *    - 404 Not Found: if the Sponsored Member does not exist
 *    - 500 Internal Server Error: if something goes wrong during the process
 */
const getAllFinancialInterventions = async (req, res) => {
    const sponsored_id = req.params.smId;

    if (!mongoose.Types.ObjectId.isValid(sponsored_id)) {
        return res.status(400).json({ message: 'Invalid Sponsored Member ID' });
    }

    try {
        const sponsoredMember = await Sponsored_Member.findById(sponsored_id).populate('interventions.intervention').lean();

        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored Member not found' });
        }

        const financialInterventions = (sponsoredMember.interventions || [])
            .filter(i => i.interventionType === 'Intervention Financial Assessment')
            .map(i => ({
                id: i.intervention._id || i.intervention,
                intervention_number: i.intervention_number,
                createdAt: i.intervention.createdAt || null
            }));

        return res.status(200).json(financialInterventions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const editFinancialForm = async(req,res) =>{
    const formId = req.params.formId
    const newData = req.body
    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID' });
    }    

    try{
        interFinSchemaValidator.validate(newData);

        const updatedForm = await Intervention_Financial.findByIdAndUpdate(
            formId,
            newData,
            {
                new:true
            }).lean();
        
        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }        

        res.status(200).json({
            message:'Form updated succesfully',
            form: updatedForm,
        })

    }catch(error){

        console.error('Error updating form:', error);
        res.status(500).json({ 
            message: 'Failed to update form', 
            error: error.message 
        });
    }

}

/**
 * @route   DELETE /api/interventions/financial/delete/:formId
 * @desc    Deletes an Intervention Financial Assessment form and removes it from the Sponsored Member's interventions
 * 
 * @required
 *    - :formId URL parameter: ObjectId of the Intervention Financial Assessment form to delete
 * 
 * @notes
 *    - Validates if the provided id is a valid Mongo ObjectId
 *    - Finds and deletes the form document
 *    - Removes the intervention reference from the Sponsored Member's interventions array
 * 
 * @returns
 *    - 200 OK: Success message with deleted form ID
 *    - 404 Not Found: If the form or associated Sponsored Member doesn't exist
 *    - 500 Internal Server Error: If something goes wrong during the process
 */
const deleteFinForm = async(req, res) => {
    const formId = req.params.formId;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID' });
    }

    try {
        const financialForm = await Intervention_Financial.findById(formId);
        
        if (!financialForm) {
            return res.status(404).json({ message: 'Financial intervention form not found' });
        }

        // Remove the intervention from the sponsored member's interventions array
        const sponsoredMember = await Sponsored_Member.findOneAndUpdate(
            { 'interventions.intervention': formId },
            { $pull: { interventions: { intervention: formId } } },
            { new: true }
        );

        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored member not found' });
        }

        await Intervention_Financial.findByIdAndDelete(formId);

        return res.status(200).json({
            message: 'Financial intervention form deleted successfully',
            formId: formId,
            sponsored_member: {
                id: sponsoredMember._id
            }
        });
    } catch (error) {
        console.error('Error deleting financial intervention form:', error);
        return res.status(500).json({ 
            message: 'Failed to delete financial intervention form', 
            error: error.message 
        });
    }
}

const getAutoFillData = async(req,res)=>{
    const smId = req.params.smId;
    if(!mongoose.Types.ObjectId.isValid(smId)){
        return res.status(400).json({message:'Invalid User Id'});
    }
    try{
        const caseData = await Sponsored_Member.findById(smId).populate('spu').lean();
        if(!caseData){
            return res.status(404).json({message:'Not Found'});
        }
        const returningData = {
            last_name : caseData.last_name,
            first_name: caseData.first_name,
            middle_name: caseData.middle_name,
            sm_number:caseData.sm_number,
            spu:caseData.spu.spu_name
        };

        const interventions = caseData.interventions || [];
        const sameTypeInterventions = interventions.filter(
            i => i.interventionType === 'Intervention Financial Assessment'
        );
        const lastInterventionNumber = sameTypeInterventions.length > 0
            ? sameTypeInterventions[sameTypeInterventions.length - 1].intervention_number
            : 0;

        returningData.intervention_number = lastInterventionNumber + 1;

        return res.status(200).json({message: 'Fetched Succesfully', returningData});
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}
module.exports = {
    createFinForm,
    getFinancialForm,
    getAllFinancialInterventions,
    editFinancialForm,
    deleteFinForm,
    getAutoFillData,
}
