const mongoose = require('mongoose');
const Sponsored_Member = require('../model/sponsored_member')
const Intervention_Correspondence = require('../model/intervention_correspondence')

const {
	formatDate,
    getInterventionFormNumber,
	formatCorrespondenceData,
} = require('./helpers')

const {
	checkCaseAccess,
} = require('../middlewares/caseAuthMiddleware')

/**
 * @params
 *  - correspondenceId: The ID of the correspondence intervention
 * 
 * @route GET /api/file-generator/correspondence-form/:correspondenceId
 * 
 * @returns {Object} - The formatted correspondence data for the sponsored member
 */
const generateCorrespondenceForm = async (req, res) => {
    try {
        const correspondenceId = req.params.correspondenceId;
        if (!mongoose.Types.ObjectId.isValid(correspondenceId)) {
            return res.status(400).json({ message: "Invalid correspondence ID." });
        }

        // Find the correspondence intervention by ID
        const correspondence = await Intervention_Correspondence.findById(correspondenceId);
        if (!correspondence) {
            return res.status(404).json({ message: "Correspondence intervention not found." });
        }

        // Fetch the sponsored member associated with the correspondence
        const sponsored_member = await Sponsored_Member.findOne({ 'interventions.intervention': correspondenceId })
            .populate('spu');
        if (!sponsored_member) {
            return res.status(404).json({ message: "Sponsored member not found." });
        }
        // console.log('SM', sponsored_member);

        // Check is user is logged in
		const user = req.session.user;
		if (!user) {
			return res.status(401).json({ message: "Authentication required." });
		}

		// Check if user has access to the case
		const auth = checkCaseAccess(user, sponsored_member);
		if (!auth.authorized) {
			return res.status(auth.statusCode).json({ message: auth.error });
		}

        // Format the correspondence data
        const formattedData = formatCorrespondenceData(correspondence);

        // Add additional fields from sponsored member
        formattedData.last_name = sponsored_member.last_name || '';
        formattedData.first_name = sponsored_member.first_name || '';
        formattedData.middle_name = sponsored_member.middle_name || '';
        formattedData.sm_number = sponsored_member.sm_number || '';
        formattedData.dob = formatDate(sponsored_member.dob) || '';
        formattedData.present_address = sponsored_member.present_address || '';
        formattedData.spu = sponsored_member.spu.spu_name || '';
        formattedData.form_num = getInterventionFormNumber(sponsored_member, correspondenceId);

        // console.log('FORMATTED CORRESPONDENCE FORM: ', formattedData);
        // Return data
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error generating correspondence form:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    generateCorrespondenceForm,
}