const mongoose = require('mongoose')
const Sponsored_Member = require('../model/sponsored_member')
const Intervention_Home_Visit = require('../model/intervention_homevisit')

const {
	calculateAge,
	formatDate,
    getInterventionFormNumber,
    formatHomeVisitData
} = require('./helpers')

const {
	checkCaseAccess,
} = require('../middlewares/caseAuthMiddleware')

const generateHomeVisitForm = async (req, res) => {
    try {
        const formSelected = await Intervention_Home_Visit.findById(req.params.homeVisitId);
        if (!formSelected)
            return res.status(404).json({message: "Invalid form ID."})

        const sponsored_member = await Sponsored_Member.findOne({ 'interventions.intervention': formSelected._id });
        if (!sponsored_member)
            return res.status(404).json({ message: "Sponsored member not found." });

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

        const formattedData = formatHomeVisitData(formSelected);

        // additional fields
        formattedData.last_name = sponsored_member.last_name || '';
        formattedData.first_name = sponsored_member.first_name || '';
        formattedData.middle_name = sponsored_member.middle_name || '';
        formattedData.sm_number = sponsored_member.sm_number || '';
        formattedData.form_num = getInterventionFormNumber(sponsored_member, formSelected._id);

        //console.log('FORMATTED HOME VISIT FORM: ', formattedData);
        return res.status(200).json(formattedData)
    } catch (error) {
        console.error("Error generating home visitation form:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {
    generateHomeVisitForm,
}