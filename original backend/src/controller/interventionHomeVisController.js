/**
 *   HOME VISITATION FORM CONTROLLER
 */

const mongoose = require("mongoose");

const Family_Relationship = require("../model/family_relationship");
const Sponsored_Member = require("../model/sponsored_member");
const Family_Member = require("../model/family_member");
const InterventionHomeVisit = require("../model/intervention_homevisit");

const homeVisitFormValidate = require("./validators/homeVisitValidator");

// ================================================== //

/**
 *   Fetches the avaliable sponsored member data
 *   @returns the data needed for sponsored member
 */
const loadHomeVisitationForm = async (req, res) => {
    try {
        const caseSelected = await Sponsored_Member.findById(req.params.caseID);
        if (!caseSelected) throw error;

        // Match family IDs and relationship to client
        const relationships = await Family_Relationship.find({
            sponsor_id: caseSelected,
        });
        const familyData = relationships.map((rel) => ({
            id: rel.family_id._id.toString(),
            relationship_to_sm: rel.relationship_to_sm,
            _id: rel._id,
        }));
        const familyMembers = await Family_Member.find({
            _id: { $in: familyData.map((fam) => fam.id) },
        });
        const FamilyRelationshipMap = familyMembers.map((member) => {
            const rel = familyData.find(
                (fam) => fam.id === member._id.toString()
            );
            return {
                ...member.toObject(),
                relationship_to_sm: rel.relationship_to_sm,
                relationship_id: rel._id.toString(),
            };
        });

        const fatherData = FamilyRelationshipMap.find(
            (member) =>
                member.relationship_to_sm === "Father" ||
                member.relationship_to_sm === "father"
        );
        const motherData = FamilyRelationshipMap.find(
            (member) =>
                member.relationship_to_sm === "Mother" ||
                member.relationship_to_sm === "mother"
        );
        const otherFamilyMembers = FamilyRelationshipMap.filter((member) => {
            if (
                fatherData &&
                member._id.toString() === fatherData._id.toString()
            )
                return false;
            if (
                motherData &&
                member._id.toString() === motherData._id.toString()
            )
                return false;
            return true;
        });

        const homeVisitNumbers = (caseSelected.interventions || [])
            .filter((entry) => entry.interventionType === 'Intervention Home Visit')
            .map((entry) => entry.intervention_number || 0); // fallback in case it's undefined
        const maxHomeVisitNumber = homeVisitNumbers.length > 0
            ? Math.max(...homeVisitNumbers)
            : 0;
        const form_number = maxHomeVisitNumber;

        return res.status(200).json({
            case: caseSelected,
            father: fatherData,
            mother: motherData,
            otherFamily: otherFamilyMembers,
            form_number
        });
    } catch (error) {
        console.error("Error creating loading home intervention:", error);
        res.status(500).json({
            message: "Failed to load home intervention",
            error,
        });
    }
};

/**
 * Retrieves all home visit interventions for a sponsored member by their ID.
 * Filters interventions to include only those of type 'Intervention Home Visit'.
 * 
 * @route GET /api/intervention/home-visit-form/all/:caseID
 * 
 * @param {string} req.params.memberID - ID of the sponsored member
 * 
 * @returns {Object} 200 - JSON object with home visit interventions and sponsored member details
 * @returns {Object} 404 - If sponsored member is not found
 * @returns {Object} 500 - If a server error occurs
 */
const loadAllHomeVisitationForms = async (req, res) => {
    try {
        const memberID = req.params.caseID;

        // Find the sponsored member by ID
        const sponsored_member = await Sponsored_Member.findById(memberID).populate('interventions.intervention');
        if (!sponsored_member) {
            return res.status(404).json({ error: 'Sponsored member not found' });
        }

        // Filter interventions of type 'Intervention Counseling'
        const homeVisitInterventions = sponsored_member.interventions.filter(intervention => 
            intervention.interventionType === 'Intervention Home Visit'
        );

        return res.status(200).json({
            message: 'Home visit interventions retrieved successfully',
            interventions: homeVisitInterventions,
            sponsored_member: {
                id: sponsored_member._id,
                first_name: sponsored_member.first_name,
                middle_name: sponsored_member.middle_name,
                last_name: sponsored_member.last_name,
                ch_number: sponsored_member.sm_number,
                subproject: sponsored_member.spu.spu_name,
                address: sponsored_member.present_address,
            },
        });
    } catch (error) {
        console.error('Error fetching home visit interventions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 *  Loads the hom visitation form ready for editing 
 *  NOTE: since edit function was removed, this is just simply for loading the existing form data
 *  @returns    form object, case object, father (family member object), mother (family member object),
 *              other family (array of family member object), and form number
 */
const loadHomeVisitationFormEdit = async (req, res) => {
    try {
        const caseSelected = await Sponsored_Member.findById(req.params.caseID);
        const formSelected = await InterventionHomeVisit.findById(
            req.params.formID
        );

        // console.log(caseSelected);
        // console.log(formSelected);

        if (!caseSelected || !formSelected) throw error;

        const { mother, father, otherFam } = 
            transform_family_to_frontend(
                formSelected.mother,
                formSelected.father,
                formSelected.familyMembers
            );
        // console.log(father, mother, otherFam)
                       
        const formId = formSelected._id.toString(); 
        const matchingIntervention = (caseSelected.interventions || []).find(
        (entry) =>
            entry.interventionType === 'Intervention Home Visit' &&
            entry.intervention.toString() === formId
        );
        const form_number = matchingIntervention?.intervention_number || null;

        return res.status(200).json({
            form: formSelected,
            case: caseSelected,
            father: father,
            mother: mother,
            otherFamily: otherFam,
            form_number
        });
    } catch (error) {
        console.error("Error loading home intervention:", error);
        res.status(500).json({
            message: "Failed to load home intervention",
            error,
        });
    }
};

/**
 *   Creates home visitation intervention and adds it to the sponsored member intervention array
 *   @returns New intervention made
 */
const createHomVis = async (req, res) => {
    try {
        const caseSelected = await Sponsored_Member.findById(req.params.caseID);
        const formData = req.body;

        if (!caseSelected) {
            return res
                .status(404)
                .json({ message: "Sponsored member not found" });
        }

        // Validation
        // console.log(formData)
        // console.log(formData)
        const requiredFields = [
            "grade_year_course",
            "years_in_program",
            "date",
            "community",
            "sponsor_name",
            "family_type",
            "sm_progress",
            "family_progress",
        ];
        const missingFields = requiredFields.filter(
            (field) => !formData[field]
        );
        if (missingFields.length > 0) {
            // console.log("Missing field/s found.", missingFields);
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        // Family members
        const { mother, father, otherFam } = 
            transform_family_to_backend(
                formData.rawMotherData || null,
                formData.rawFatherData || null,
                formData.rawOtherFamilyData || null
            );
        // console.log(formData.rawMotherData,
        //         formData.rawFatherData,
        //         formData.rawOtherFamilyData)
        // console.log("OUT: ", mother, father, otherFam)

        // Creating new intervention
        const newForm = new InterventionHomeVisit({
            grade_year_course: formData.grade_year_course,
            years_in_program: formData.years_in_program,
            date: formData.date,
            community: formData.community,
            sponsor_name: formData.sponsor_name,
            family_type: formData.family_type,

            father: father || null,
            mother: mother || null,
            familyMembers: otherFam || [],

            sm_progress: formData.sm_progress,
            family_progress: formData.family_progress,
            recommendations: formData.recommendations,
            agreement: formData.agreement,

            observation_findings: formData.observation_findings,
            interventions: formData.interventions,
        });
        // console.log("NEW FORM: ", newForm);

        await newForm.validate();
        await newForm.save();

        // add to the case
        const updatedCase = await Sponsored_Member.findByIdAndUpdate(
            req.params.caseID,
            {
                $push: {
                    interventions: {
                        intervention: newForm._id,
                        interventionType: "Intervention Home Visit",
                        intervention_number: formData.form_num,
                    },
                },
            },
            { new: true }
        );

        return res.status(200).json({
            form: newForm,
            case: updatedCase,
            father: father,
            mother: mother,
            otherFamily: otherFam,
        });
    } catch (error) {
        console.error("Error creating new home intervention:", error);
        res.status(500).json({
            message: "Failed to create home intervention",
            error,
        });
    }
};

/**
 *   [NOT USED] Edits the home visitation form selected
 *   @returns The edited home visitation object
 */
const editHomeVis = async (req, res) => {
    try {
        const caseSelected = await Sponsored_Member.findById(req.params.caseID);
        const interventionSelected = await InterventionHomeVisit.findById(
            req.params.formID
        );
        const formData = req.body;

        // console.log("Controller Enter");
        // console.log("Controller CaseSelected: ", caseSelected);
        // console.log("Controller interventionSelected: ", interventionSelected);
        // console.log("Controller formData: ", formData);

        if (!caseSelected) {
            return res.status(404).json({ message: "Case not found" });
        }
        if (!interventionSelected) {
            return res.status(404).json({ message: "Intervention not found" });
        }

        // run through the family data again if ever there are changes
        const relationships = await Family_Relationship.find({
            sponsor_id: caseSelected,
        });
        const familyData = relationships.map((rel) => ({
            id: rel.family_id._id.toString(),
            relationship_to_sm: rel.relationship_to_sm,
            _id: rel._id,
        }));
        const familyMembers = await Family_Member.find({
            _id: { $in: familyData.map((fam) => fam.id) },
        });
        const FamilyRelationshipMap = familyMembers.map((member) => {
            const rel = familyData.find(
                (fam) => fam.id === member._id.toString()
            );
            return {
                ...member.toObject(),
                relationship_to_sm: rel.relationship_to_sm,
                relationship_id: rel._id.toString(),
            };
        });

        const fatherData = FamilyRelationshipMap.find(
            (member) =>
                member.relationship_to_sm === "Father" ||
                member.relationship_to_sm === "father"
        );
        const motherData = FamilyRelationshipMap.find(
            (member) =>
                member.relationship_to_sm === "Mother" ||
                member.relationship_to_sm === "mother"
        );
        const otherFamilyMembers = FamilyRelationshipMap.filter((member) => {
            if (
                fatherData &&
                member._id.toString() === fatherData._id.toString()
            )
                return false;
            if (
                motherData &&
                member._id.toString() === motherData._id.toString()
            )
                return false;
            return true;
        });
        const familyMembersArray = otherFamilyMembers.map((member) => ({
            family_member_details: member._id,
            family_member_relationship: member.relationship_id,
        }));
        // console.log(familyMembersArray);

        const updatedData = {
            grade_year_course:
                formData.grade_year_course ||
                interventionSelected.grade_year_course,
            years_in_program:
                formData.years_in_program ||
                interventionSelected.years_in_program,
            date: formData.date || interventionSelected.date,
            community: formData.community || interventionSelected.community,
            sponsor_name:
                formData.sponsor_name || interventionSelected.sponsor_name,
            family_type:
                formData.family_type || interventionSelected.family_type,

            father: {
                father_details: fatherData?._id || null,
                father_relationship: fatherData?.relationship_id || null,
            },
            mother: {
                mother_details: motherData?._id || null,
                mother_relationship: motherData?.relationship_id || null,
            },
            familyMembers: familyMembersArray,

            sm_progress:
                formData.sm_progress || interventionSelected.sm_progress,
            family_progress:
                formData.family_progress ||
                interventionSelected.family_progress,
            recommendations: formData.recommendations,
            agreement: formData.agreement,

            observation_findings: formData.observation_findings,
            interventions: formData.interventions,
        };

        // update
        const updatedForm = await InterventionHomeVisit.findByIdAndUpdate(
            interventionSelected._id,
            updatedData,
            { new: true, runValidators: true }
        );
        // console.log("Updated Data: ", updatedData);

        return res.status(200).json({
            form: updatedForm,
            case: caseSelected,
            father: fatherData,
            mother: motherData,
            otherFamily: otherFamilyMembers,
        });
    } catch (error) {
        console.error("Error editing home intervention:", error);
        res.status(500).json({
            message: "Failed to edit home intervention",
            error,
        });
    }
};

/**
 * Deletes a home visit intervention by its ID and removes it from the sponsored member's interventions.
 * 
 * @route DELETE /api/intervention/delete/home-visit-form/:formId
 * 
 * @param {string} req.params.formId - ID of the home intervention to delete
 * 
 * @returns {Object} 200 - JSON object with success message and intervention ID
 * @returns {Object} 404 - If intervention or sponsored member is not found
 * @returns {Object} 500 - If a server error occurs
 */
const deleteHomeVis = async (req, res) => {
    try {
        const formId = req.params.formID;
        
        const intervention = await InterventionHomeVisit.findById(formId);
        
        if (!intervention) {
            return res.status(404).json({ error: 'Home Visit intervention not found' });
        }

        // Remove the intervention from the sponsored member's interventions array
        const sponsored_member = await Sponsored_Member.findOneAndUpdate(
            { 'interventions.intervention': formId },
            { $pull: { interventions: { intervention: formId } } },
            { new: true }
        );

        if (!sponsored_member) {
            return res.status(404).json({ error: 'Sponsored member not found' });
        }

        // Delete the intervention
        await InterventionHomeVisit.findByIdAndDelete(formId);

        // Return success response
        return res.status(200).json({
            message: 'Home Visit intervention deleted successfully',
            interventionId: formId,
            sponsored_member: {
                id: sponsored_member._id,
            },
        });
    } catch (error) {
        console.error('Error deleting home visit intervention:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// =========== ADDTL. FUNCTIONS ===========  //


// Transform the data to cater frontend variables
function transform_family_to_frontend(mother_data, father_data, other_fam_data) {
    let mother, father, otherFam

    if (mother_data){
        mother = {
            first_name: mother_data.first_name,
            last_name: mother_data.last_name,
            middle_name: mother_data.middle_name,
            occupation: mother_data.occupation,
            income: mother_data.income,
            age: mother_data.age
        }
    }

    if (father_data) {
        father = {
            first_name: father_data.first_name,
            last_name: father_data.last_name,
            middle_name: father_data.middle_name,
            occupation: father_data.occupation,
            income: father_data.income,
            age: father_data.age
        }
    }

    if (other_fam_data.length > 0) {
        otherFam = other_fam_data.map((member) => ({
            first_name: member.first_name,
            last_name: member.last_name,
            middle_name: member.middle_name,
            income: member.income,
            occupation: member.occupation,
            edu_attainment: member.edu_attainment,
            relationship_to_sm: member.relationship_to_sm,
            civil_status: member.civil_status,
            status: member.status,
            age: member.age,
        }));
    }

    return {mother, father, otherFam}
}

// Transform the data to cater database variables
function transform_family_to_backend(mother_data, father_data, other_fam_data) {
    let mother, father, otherFam

    if (mother_data) {
        mother = {
            first_name: mother_data.first_name,
            last_name: mother_data.last_name,
            middle_name: mother_data.middle_name,
            occupation: mother_data.occupation,
            income: mother_data.income,
            age: mother_data.age,
            relationship_to_sm: mother_data.relationship_to_sm,
            status: mother_data.status
        }
    }

    if (father_data) {
        father = {
            first_name: father_data.first_name,
            last_name: father_data.last_name,
            middle_name: father_data.middle_name,
            occupation: father_data.occupation,
            income: father_data.income,
            age: father_data.age,
            relationship_to_sm: father_data.relationship_to_sm,
            status: father_data.status
        }
    }

    if (other_fam_data.length > 0) {
        otherFam = other_fam_data.map((member) => ({
            first_name: member.first_name,
            last_name: member.last_name,
            middle_name: member.middle_name,
            income: member.income,
            occupation: member.occupation,
            edu_attainment: member.edu_attainment,
            relationship_to_sm: member.relationship_to_sm,
            civil_status: member.civil_status,
            status: member.status,
            age: member.age,
        }));
    }

    //console.log("RETURN: ", mother, father, otherFam)
    return {mother, father, otherFam}
}

module.exports = {
    loadHomeVisitationForm,
    loadAllHomeVisitationForms,
    loadHomeVisitationFormEdit,
    createHomVis,
    editHomeVis,
    deleteHomeVis,
};
