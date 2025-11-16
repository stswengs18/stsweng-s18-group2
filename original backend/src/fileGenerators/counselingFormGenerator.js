const mongoose = require('mongoose')
const Sponsored_Member = require('../model/sponsored_member')
const Intervention_Counseling = require('../model/intervention_counseling')

const {
	calculateAge,
	formatDate,
	getInterventionFormNumber,
	formatCounselingData,
} = require('./helpers')

const {
	checkCaseAccess,
} = require('../middlewares/caseAuthMiddleware')

/**
 * @params
 * - counselingId: The ID of the counseling intervention
 * 
 * @route GET /api/file-generator/counseling-form/:counselingId
 * 
 * @returns {Object} - The formatted counseling data for the sponsored member
 */
const generateCounselingForm = async (req, res) => {
    try {
        const counselingId = req.params.counselingId;
        if (!mongoose.Types.ObjectId.isValid(counselingId)) {
            return res.status(400).json({ message: "Invalid counseling ID." });
        }

        // Find counseling intervention by ID
        const counseling = await Intervention_Counseling.findById(counselingId);
        if (!counseling) {
            return res.status(404).json({ message: "Counseling intervention not found." });
        }

        // Fetch the sponsored member associated with the counseling
        const sponsored_member = await Sponsored_Member.findOne({ 'interventions.intervention': counselingId })
            .populate('spu');
        if (!sponsored_member) {
            return res.status(404).json({ message: "Sponsored member not found." });
        }

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

        // Format the counseling data
        const formattedData = formatCounselingData(counseling);

        // Add additional fields from sponsored member
        formattedData.spu = sponsored_member.spu.spu_name || '';
        formattedData.present_address = sponsored_member.present_address || '';
        formattedData.last_name = sponsored_member.last_name || '';
        formattedData.first_name = sponsored_member.first_name || '';
        formattedData.mi = sponsored_member.middle_name[0] || '';
        formattedData.sm_number = sponsored_member.sm_number || '';
        formattedData.form_num = getInterventionFormNumber(sponsored_member, counselingId);

        // console.log('FORMATTED COUNSELING FORM: ', formattedData);
        // Return data
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error generating counseling form:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    generateCounselingForm,
}