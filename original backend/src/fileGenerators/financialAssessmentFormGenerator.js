const mongoose = require('mongoose')
const Sponsored_Member = require('../model/sponsored_member')
const Intervention_Financial_Assessment = require('../model/intervention_financial')

const {
    getInterventionFormNumber,
    formatFinancialData,
} = require('./helpers')

const {
	checkCaseAccess,
} = require('../middlewares/caseAuthMiddleware')

const generateFinancialAssessmentForm = async (req, res) => {
    try {
        const financialId = req.params.financialId;
        if (!mongoose.Types.ObjectId.isValid(financialId)) {
            return res.status(404).json({ message: "Financial assessment form not found." });
        }

        // Find financial assessment intervention by id
        const financial = await Intervention_Financial_Assessment.findById(financialId);
        if (!financial) {
            return res.status(404).json({ message: "Financial assessment intervention not found." });
        }

        // Fetch the sponsored member associated with the counseling
        const sponsored_member = await Sponsored_Member.findOne({ 'interventions.intervention': financialId })
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

        // Format the financial assessment data
        const formattedData = formatFinancialData(financial);

        // Add additional fields from sponsored member
        formattedData.last_name = sponsored_member.last_name || '';
        formattedData.first_name = sponsored_member.first_name || '';
        formattedData.middle_name = sponsored_member.middle_name || '';
        formattedData.sm_number = sponsored_member.sm_number || '';
        formattedData.spu = sponsored_member.spu.spu_name || '';
        formattedData.form_num = getInterventionFormNumber(sponsored_member, financialId);

        // console.log('FORMATTED FINANCIAL ASSESSMENT FORM: ', formattedData);
        // Return data
        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error generating financial assessment form:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    generateFinancialAssessmentForm
}