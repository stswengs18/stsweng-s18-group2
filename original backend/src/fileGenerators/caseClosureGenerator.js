const mongoose = require('mongoose');
const Case_Closure = require('../model/case_closure');
const Sponsored_Member = require('../model/sponsored_member');

const {
    calculateAge,
    formatDate,
} = require('./helpers')

const generateCaseClosure = async (req, res) => {
    try {
        const { caseClosureId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(caseClosureId)) {
            return res.status(400).json({ message: 'Invalid case closure ID' });
        }

        // Find the case closure document
        const caseClosure = await Case_Closure.findById(caseClosureId);
        if (!caseClosure) {
            return res.status(404).json({ message: 'Case closure not found' });
        }

        // Find the sponsored member document
        const sponsoredMember = await Sponsored_Member.findById(caseClosure.sm)
            .populate('spu');
        if (!sponsoredMember) {
            return res.status(404).json({ message: 'Sponsored member not found' });
        }

        // Format services provided
        const formattedServicesProvided = {
            services: caseClosure.services_provided.map(service => ({
                service: service.service || '',
                description: service.description || '',
            })),
        }
        // console.log("FORMATTED SERVICES PROVIDED", formattedServicesProvided);

        // Generate the case closure form
        const form = {
            spu: sponsoredMember.spu.spu_name || '',
            sm_number: sponsoredMember.sm_number || '',
            sm_name: `${sponsoredMember.last_name || ''}, ${sponsoredMember.first_name || ''} ${sponsoredMember.middle_name || ''}`.trim(),
            address: sponsoredMember.present_address || '',
            religion: sponsoredMember.religion || '',
            dob: formatDate(caseClosure.sponsorship_date) || '',
            age: calculateAge(sponsoredMember.dob) || '0',
            closure_date: formatDate(caseClosure.closure_date) || '',
            sponsorship_date: formatDate(caseClosure.sponsorship_date) || '',
            reason_for_retirement: caseClosure.reason_for_retirement || '',
            sm_awareness: caseClosure.sm_awareness ? "Yes" : "No",
            sm_notification: caseClosure.sm_notification || '',
            services_provided: formattedServicesProvided.services,
            evaluation: caseClosure.evaluation || '',
            recommendation: caseClosure.recommendation || '',
        };
        // console.log("CASE CLOSURE FORM", form);

        res.status(200).json(form);
    } catch (error) {
        console.error('Error generating case closure form:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    generateCaseClosure
}