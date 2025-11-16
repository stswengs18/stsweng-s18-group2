const mongoose = require('mongoose')
const Sponsored_Member = require('../model/sponsored_member')
const Family_Relationship = require('../model/family_relationship')
const Family_Member = require('../model/family_member')
const Intervention_Correspondence = require('../model/intervention_correspondence')
const Intervention_Counseling = require('../model/intervention_counseling')
const Intervention_Financial_Assessment = require('../model/intervention_financial')
const Intervention_Home_Visit = require('../model/intervention_homevisit')
const Progress_Report = require('../model/progress_report')

const {
	calculateAge,
	formatDate,
	formatCorrespondenceData,
	formatCounselingData,
	formatFinancialData,
	formatHomeVisitData,
	formatProgressReport,
} = require('./helpers')

/**
 * @params
 * 	- id: The ID of the sponsored member
 * 
 * @route GET /api/file-generator/case-data/:id
 * 
 * @returns {Object} - The case data for the sponsored member
 * @throws {Error} - If the sponsored member ID is invalid or not found
 */
/* The structure of the returned object is as follows:
{
	last_name: String,
	first_name: String,
	middle_name: String,
	sex: String,
	present_address: String,
	dob: Date,
	pob: String,
	age: Number,
	civil_status: String,
	edu_attainment: String,
	religion: String,
	occupation: String,	
	contact_no: String,
	classification: String,
	family_members: Array,
	problem_presented: String,
	history_problem: String,
	observation_findings: String,
	assessment: String,
	interventions: [Object],
		{
			intervention_number: Number,
			interventionType: String,
			correspondence: Object, // If interventionType is 'Intervention Correspondence'
			counseling: Object, // If interventionType is 'Intervention Counseling'
			financial: Object, // If interventionType is 'Intervention Financial Assessment'
			homevisit: Object, // If interventionType is 'Intervention Home Visit'
			// Refer to helpers.js for the structure of these objects
		}
	progress_reports: [Object], // Refer to helpers.js for the structure
	evaluation: String,
	recommendation: String,
}
*/
const generateCaseData = async (req, res) => {
    try {
		const sponsoredMemberId = req.params.id;
		// Validate the sponsored member ID
		if (!mongoose.Types.ObjectId.isValid(sponsoredMemberId)) {
			throw new Error("Invalid sponsored member ID");
		}

		// Fetch the sponsored member data
		const sponsoredMember = await Sponsored_Member.findById(
			sponsoredMemberId
		);
		if (!sponsoredMember) {
			throw new Error("Sponsored member not found");
		}

		// Match family IDs and relationship to client
		const relationships = await Family_Relationship.find({
			sponsor_id: sponsoredMemberId,
		});
		const familyData = relationships.map((rel) => ({
			id: rel.family_id._id.toString(),
			relationship_to_sm: rel.relationship_to_sm,
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
			};
		});

		// Format family members data
		const formattedFamilyMembers = FamilyRelationshipMap.map((member) => ({
			first_name: member.first_name || "",
			middle_name: member.middle_name || "",
			last_name: member.last_name || "",
			age: member.age || "0",
			income: member.income || "0",
			civil_status: member.civil_status || "",
			occupation: member.occupation || "",
			edu_attainment: member.edu_attainment || "",
			relationship_to_sm: member.relationship_to_sm || "",
		}));
		// console.log('Formatted Family Members:', formattedFamilyMembers);

        // Fetch intervention data
        let formattedInterventions = [];
        const interventions = await Promise.all(
            sponsoredMember.interventions.map(async (intervention) => {
                let interventionData;
                let formattedIntervention = {
                    intervention_number: intervention.intervention_number,
                    interventionType: intervention.interventionType,
                };

                try {
                    switch (intervention.interventionType) {
                        case 'Intervention Correspondence':
                            interventionData = await Intervention_Correspondence.findById(intervention.intervention);
                            formattedIntervention.correspondence = formatCorrespondenceData(interventionData);
                            break;
                        case 'Intervention Counseling':
                            interventionData = await Intervention_Counseling.findById(intervention.intervention);
                            formattedIntervention.counseling = formatCounselingData(interventionData);
                            break;
                        case 'Intervention Financial Assessment':
                            interventionData = await Intervention_Financial_Assessment.findById(intervention.intervention);
                            formattedIntervention.financial = formatFinancialData(interventionData);
                            break;
                        case 'Intervention Home Visit':
                            interventionData = await Intervention_Home_Visit.findById(intervention.intervention);
                            formattedIntervention.homevisit = formatHomeVisitData(interventionData);
                            break;
                        default:
                            console.warn(`Unknown intervention type: ${intervention.interventionType}`);
                            return null;
                    }
					// console.log('Formatted Intervention:', formattedIntervention);
                    return formattedIntervention;
                } catch (error) {
                    console.error(`Error fetching intervention ${intervention.intervention}:`, error);
                    return null;
                }
            })
        );

        // Filter out any null results from failed queries
        formattedInterventions = interventions.filter(intervention => intervention !== null);
        // console.log('FORMATTED INTERVENTIONS', formattedInterventions);

        // Fetch progress reports
		let formattedProgressReports = [];
		const progressReports = await Promise.all(
			sponsoredMember.progress_reports.map(async (report) => {
				let formattedReport;
				try {
					const progressReport = await Progress_Report.findById(report.progress_report);
					if (progressReport) {
						formattedReport = {
							report_num: report.report_number,
							...formatProgressReport(progressReport),
						}
						// console.log('formatted Report', formattedReport);
						return formattedReport;
					}
					return null;
				} catch (error) {
					console.error(`Error fetching progress report ${report}:`, error);
					return null;
				}
			})
		)

		formattedProgressReports = progressReports.filter(report => report !== null);
		// console.log('FORMATTED PROGRESS REPORTS', formattedProgressReports);

		// Format data for the document
		const caseData = {
			sm_number: sponsoredMember.sm_number || '',
			last_name: sponsoredMember.last_name || '',
			first_name: sponsoredMember.first_name || '',
			middle_name: sponsoredMember.middle_name || '',
			sex: sponsoredMember.sex || '',
			present_address: sponsoredMember.present_address || '',
			dob: formatDate(sponsoredMember.dob) || '',
			pob: sponsoredMember.pob || '',
			age: calculateAge(sponsoredMember.dob) || '0',
			civil_status: sponsoredMember.civil_status || '',
			edu_attainment: sponsoredMember.edu_attainment || '',
			religion: sponsoredMember.religion || '',
			occupation: sponsoredMember.occupation || '',
			contact_no: sponsoredMember.contact_no || '',
			classification: sponsoredMember.classifications || '',
			family_members: formattedFamilyMembers,
			problem_presented: sponsoredMember.problem_presented || '',
			history_problem: sponsoredMember.history_problem || '',
			observation_findings: sponsoredMember.observation_findings || '',
			assessment: sponsoredMember.assessment || '',
			interventions: formattedInterventions,
			progress_reports: formattedProgressReports,
			evaluation: sponsoredMember.evaluation || '',
			recommendation: sponsoredMember.recommendation || '',
		};
		// console.log('CASE DATA', caseData);

		return res.status(200).json(caseData);
	} catch (error) {
        console.error('Error generating case data:', error)
        throw error
    }
}

module.exports = {
    generateCaseData
}