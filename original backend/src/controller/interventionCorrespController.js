const mongoose = require('mongoose');
const Sponsored_Member = require('../model/sponsored_member');
const Intervention_Correspondence = require('../model/intervention_correspondence');
const interCorespValidtor  = require('./validators/interCorespValidator');

const createCorespForm = async(req,res)=>{
    const newData = req.body;
    const smId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(smId)){
        return res.status(400).json({message: 'Invalid Sponsor Member Id'});

    }
    try{
        interCorespValidtor.validate(newData);
        
        const newForm = new Intervention_Correspondence({
            ...newData
        });
        await newForm.save();

        const sponsoredMember = await Sponsored_Member.findById(smId);

        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored Member not found' });
        }
       const interventions = sponsoredMember.interventions || [];
        
        //Just filters through the same type of intervention in the sponsored member
        const sameTypeInterventions = interventions.filter(
            i => i.interventionType === 'Intervention Correspondence'
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
            interventionType: 'Intervention Correspondence'
        });

        await sponsoredMember.save();
        return res.status(201).json(newForm);
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

/**
 * Adds a new intervention plan to an existing correspondence form
 * @route PUT /api/interventions/correspondence/add-plan/:formId
 */
const addInterventionPlan = async (req, res) => {
    const formId = req.params.formId;
    const newPlan = req.body; // Should be an object with action, time_frame, results

    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID' });
    }

    // Basic validation for the plan object
    if (
        !newPlan ||
        typeof newPlan.action !== 'string' || newPlan.action.length < 1 ||
        typeof newPlan.time_frame !== 'string' || newPlan.time_frame.length < 1 ||
        typeof newPlan.results !== 'string' || newPlan.results.length < 1 ||
        typeof newPlan.person_responsible !== 'string' || newPlan.results.length < 1
    ) {
        return res.status(400).json({ message: 'Invalid intervention plan data' });
    }

    try {
        const updatedForm = await Intervention_Correspondence.findByIdAndUpdate(
            formId,
            { $push: { intervention_plans: newPlan } },
            { new: true }
        ).lean();

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form not found' });
        }

        return res.status(200).json({
            message: 'Intervention plan added successfully',
            form: updatedForm,
        });
    } catch (error) {
        console.error('Error adding intervention plan:', error);
        return res.status(500).json({
            message: 'Failed to add intervention plan',
            error: error.message,
        });
    }
};
/**
 * Deletes an intervention plan from a correspondence form by plan _id
 * @route DELETE /api/interventions/correspondence/delete-plan/:formId/:planId
 */
const deleteInterventionPlanById = async (req, res) => {
    const formId = req.params.formId;
    const planId = req.params.planId;

    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(planId)) {
        return res.status(400).json({ message: 'Invalid Form ID or Plan ID' });
    }

    try {
        const updatedForm = await Intervention_Correspondence.findByIdAndUpdate(
            formId,
            { $pull: { intervention_plans: { _id: planId } } },
            { new: true }
        ).lean();

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form or intervention plan not found' });
        }

        return res.status(200).json({
            message: 'Intervention plan deleted successfully',
            form: updatedForm
        });
    } catch (error) {
        console.error('Error deleting intervention plan:', error);
        return res.status(500).json({
            message: 'Failed to delete intervention plan',
            error: error.message,
        });
    }
};

const getCorrespondenceForm = async(req,res)=>{
    const sponsor_id = req.params.smId;
    const formId = req.params.formId;
    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(sponsor_id)) {
        return res.status(400).json({ message: 'Invalid Sponsored Member or Form' });
    }
    try{
        // const sponsoredData = await Sponsored_Member.findById(sponsor_id).lean();
        const sponsoredData = await Sponsored_Member.findById(sponsor_id).populate('interventions.intervention').populate('spu').lean();
        const formData = await Intervention_Correspondence.findById(formId).lean()

        if (!sponsoredData || !formData) {
            return res.status(404).json({ message: 'Sponsored Member or Form not found' });
        }
        const interventionEntry = sponsoredData.interventions.find(
            i => i.intervention && i.intervention._id.toString() === formId.toString() && 
                i.interventionType === 'Intervention Correspondence'
        );

        const intervention_number = interventionEntry ? interventionEntry.intervention_number : null;

        const mergedData = {
            sponsored_member: {
                first_name: sponsoredData.first_name,
                middle_name: sponsoredData.middle_name,
                last_name: sponsoredData.last_name,
                sm_number: sponsoredData.sm_number,
                dob: sponsoredData.dob,
                spu: sponsoredData.spu.spu_name,
                present_address: sponsoredData.present_address,
            },
            form:{...formData,
                intervention_number
            }
        };
        
        return res.status(200).json(mergedData);
    }catch(error){

        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllCorrespondenceInterventions = async (req, res) => {
    const sponsored_id = req.params.smId;

    if (!mongoose.Types.ObjectId.isValid(sponsored_id)) {
        return res.status(400).json({ message: 'Invalid Sponsored Member ID' });
    }

    try {

        const sponsoredMember = await Sponsored_Member.findById(sponsored_id)
            .populate('interventions.intervention')
            .lean();

        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored Member not found' });
        }
 
        const correspondenceInterventions = (sponsoredMember.interventions || [])
            .filter(i => i.interventionType === 'Intervention Correspondence')
            .map(i => ({
                id: i.intervention ? i.intervention._id || i.intervention : null,
                intervention_number: i.intervention_number,
                createdAt: i.intervention ? i.intervention.createdAt : null
            }));

        return res.status(200).json(correspondenceInterventions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const editCorrespondenceForm = async(req,res) =>{
    const formId = req.params.formId
    const newData = req.body
    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID' });
    }    

    try{
        interCorespValidtor.validate(newData);

        const updatedForm = await Intervention_Correspondence.findByIdAndUpdate(
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
 * @route   DELETE /api/interventions/correspondence/delete/:formId
 * @desc    Deletes an Intervention Correspondence form and removes it from the Sponsored Member's interventions
 * 
 * @required
 *    - :formId URL parameter: ObjectId of the Intervention Correspondence form to delete
 * 
 * @notes
 *    - Validates if the provided id is a valid Mongo ObjectId
 *    - Finds and deletes the form document
 *    - Removes the intervention reference from the Sponsored Member's interventions array
 * 
 * @returns
 *    - 200 OK: Success message with deleted form ID
 *    - 400 Bad Request: If the provided id is invalid
 *    - 404 Not Found: If the form or associated Sponsored Member doesn't exist
 *    - 500 Internal Server Error: If something goes wrong during the process
 */
const deleteCorrespondenceForm = async(req, res) => {
    const formId = req.params.formId;

    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID' });
    }

    try {
        // Verify the form exists
        const correspondenceForm = await Intervention_Correspondence.findById(formId);
        
        if (!correspondenceForm) {
            return res.status(404).json({ message: 'Correspondence intervention form not found' });
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

        await Intervention_Correspondence.findByIdAndDelete(formId);

        return res.status(200).json({
            message: 'Correspondence intervention form deleted successfully',
            formId: formId,
            sponsored_member: {
                id: sponsoredMember._id
            }
        });
    } catch (error) {
        console.error('Error deleting correspondence intervention form:', error);
        return res.status(500).json({ 
            message: 'Failed to delete correspondence intervention form', 
            error: error.message 
        });
    }
};

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
            spu:caseData.spu.spu_name,
            dob : caseData.dob,
            present_address:caseData.present_address,
        };

        const interventions = caseData.interventions || [];
        const sameTypeInterventions = interventions.filter(
            i => i.interventionType === 'Intervention Correspondence'
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
    createCorespForm,
    getCorrespondenceForm,
    getAllCorrespondenceInterventions,
    editCorrespondenceForm,
    addInterventionPlan,
    deleteInterventionPlanById,
    deleteCorrespondenceForm,
    getAutoFillData
}