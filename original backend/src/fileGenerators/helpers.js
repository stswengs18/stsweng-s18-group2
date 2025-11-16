function calculateAge(dateValue) {
    const birthday = new Date(dateValue);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();

    const birthdayDone =
        today.getMonth() > birthday.getMonth() ||
        (today.getMonth() === birthday.getMonth() &&
            today.getDate() >= birthday.getDate());

    if (!birthdayDone) {
        age--;
    }

    return age;
}

function formatDate(date) {
	if (!date) return '';
	return new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function getInterventionFormNumber(sponsored_member, interventionId) {
	const intervention = sponsored_member.interventions.find(
		(entry) => entry.intervention.toString() === interventionId.toString()
	);
	return intervention ? intervention.intervention_number || '' : '';
}

/* Return format:
{
	name_of_sponsor: String,
	date_of_sponsorship: Date,
	identified_problem: String,
	assesment: String,
	objective: String,
	intervention_plans: [{
		action: String,
		time_frame: String,
		results: String,
		person_responsible: String,
	}],
	recommendation: String,
}
*/
function formatCorrespondenceData(correspondence) {
	if (!correspondence) return {};
    // console.log('formatCorrespondenceData', correspondence);

	const intervention_plans = (correspondence.intervention_plans || []).map(plan => ({
		action: plan.action || '',
		time_frame: plan.time_frame || '',
		results: plan.results || '',
		person_responsible: plan.person_responsible || '',
	}));

    return {
		name_of_sponsor: correspondence.name_of_sponsor || '',
		date_of_sponsorship: formatDate(correspondence.date_of_sponsorship) || '',
		identified_problem: correspondence.identified_problem || '',
		assesment: correspondence.assesment || '',
		objective: correspondence.objective || '',
		intervention_plans: intervention_plans,
		recommendation: correspondence.recommendation || '',
	}
}

/* Return format:
{
	grade_year_level: String,
	school: String,
	counseling_date: Date,
	area_self_help: String,
	reason_for_counseling: String,
	corrective_action: String,
	recommendation: String,
	sm_comments: String,
}
*/
function formatCounselingData(counseling) {
	if (!counseling) return {};
    // console.log('formatCounselingData', counseling);
    return {
		grade_year_level: counseling.grade_year_level || '',
		school: counseling.school || '',
		counseling_date: formatDate(counseling.counseling_date) || '',
		area_self_help: counseling.area_self_help || '',
		reason_for_counseling: counseling.reason_for_counseling || '',
		corrective_action: counseling.corrective_action || '',
		recommendation: counseling.recommendation || '',
		sm_comments: counseling.sm_comments || '',
	}
}

/* Return format:
{
	type_of_assistance: {
		// a1 to a8 is either '✓' or ''
		a1: String,
		a2: String,
		a3: String,
		a4: String,
		a5: String,
		a6: String,
		a7: String,
		a8: String,
		other: String,
	},
	problem_presented: String,
	recommendation: String,
}
*/
function formatFinancialData(financial) {
    if (!financial) return {};
	// console.log('formatFinancialData', financial);
	const type_of_assistance = financial.type_of_assistance;
	let formatted_type_of_assistance = {
			a1: '',
			a2: '',
			a3: '',
			a4: '',
			a5: '',
			a6: '',
			a7: '',
			a8: '',
			other: '',
		};
	if (type_of_assistance) {
		formatted_type_of_assistance = {
			a1: type_of_assistance.includes('Funeral Assistance to the Family Member') ? '✓' : '',
			a2: type_of_assistance.includes('Funeral Assistance to the Sponsored Member') ? '✓' : '',
			a3: type_of_assistance.includes('Medical Assistance to the Family Member') ? '✓' : '',
			a4: type_of_assistance.includes('Medical Assistance to the Sponsored Member') ? '✓' : '',
			a5: type_of_assistance.includes('Food Assistance') ? '✓' : '',
			a6: type_of_assistance.includes('Home Improvement/Needs') ? '✓' : '',
			a7: type_of_assistance.includes('IGP Capital') ? '✓' : '',
			a8: type_of_assistance.includes('Other: Please Indicate Below') ? '✓' : '',
			other: financial.other_assistance_detail || '',
		}
	}
    return {
		type_of_assistance: formatted_type_of_assistance,
		problem_presented: financial.problem_presented || '',
		recommendation: financial.recommendation || '',
	}
}

/* Return format:
{
	grade_year_course: String,
	years_in_program: String,
	family_type: String,
	f_name, f_income, f_occupation
	m_name, m_income, m_occupation
	otherFamily: {
		last_name: String,
		first_name: String,
		middle_name: String,
		age: String,
		civil_status: String,
		relationship_to_sm: String,
		occupation: String,
		edu_attainment: String,
		income: String,
	},
	sm_progress: String,
	family_progress: String,
	observation_findings: String,
	interventions: String,
	recommendations: String,
	agreement: String,
}
*/
function formatHomeVisitData(homevisit) {
    if (!homevisit) 
		return {};
	// console.log('formatHomeVisitData', homevisit);

	// Safe formatting for father data with multiple null checks
	let f_name = '', f_income = '', f_occupation = '';
	if (homevisit.father) {
		const father = homevisit.father.toObject?.();

		const last_name = father?.last_name?.trim();
		const first_name = father?.first_name?.trim();
		if (last_name || first_name) {
			f_name = `${last_name || ''}, ${first_name || ''}`.replace(/^, |, $/, '')
		}

		const income = father?.income?.toLocaleString();
		if (income) {
			f_income = income;
		}

		const occupation = father?.occupation?.trim();
		if (occupation) {
			f_occupation = occupation;
		}
	};
	//console.log('Formatted Father:', formattedFather);

    // Safe formatting for mother data with multiple null checks
	let m_name = '', m_income = '', m_occupation = '';
	if (homevisit.mother) {
		const mother = homevisit.mother.toObject?.();

		const last_name = mother?.last_name?.trim();
		const first_name = mother?.first_name?.trim();
		if (last_name || first_name) {
			m_name = `${last_name || ''}, ${first_name || ''}`.replace(/^, |, $/, '')
		}
		
		const income = mother?.income?.toLocaleString();
		if (income) {
			m_income = income;
		}

		const occupation = mother?.occupation?.trim();
		if (occupation) {
			m_occupation = occupation;
		}
	};
	//console.log('Formatted Mother:', formattedMother);

	const formattedOtherFamilyMembers = (homevisit.familyMembers && Array.isArray(homevisit.familyMembers)) 
        ? homevisit.familyMembers.map(member => {
            // Check if member and family_member_details exist
            if (!member) {
                return {
                    last_name: '',
                    first_name: '',
                    middle_name: '',
                    age: '',
                    civil_status: '',
                    relationship_to_sm: '',
                    occupation: '',
                    edu_attainment: '',
                    income: '',
                };
            }
			member = member.toObject?.();

            return {
                last_name: member.last_name || '',
                first_name: member.first_name || '',
                middle_name: member.middle_name || '',
                age: member.age || '0',
                civil_status: member.civil_status || '',
                relationship_to_sm: member.relationship_to_sm || '',
                occupation: member.occupation || '',
                edu_attainment: member.edu_attainment || '',
                income: member.income != null ? member.income.toLocaleString() : '',
            };
        })
        : [];
	//console.log('OTHER FAMILY:', formattedOtherFamilyMembers);
	
    return {
		grade_year_course: homevisit.grade_year_course || '',
		years_in_program: homevisit.years_in_program || '',
		family_type: homevisit.family_type || '',
		f_name, f_income, f_occupation,
		m_name, m_income, m_occupation,
		otherFamily: formattedOtherFamilyMembers,
		sm_progress: homevisit.sm_progress || '',
		family_progress: homevisit.family_progress || '',
		observation_findings: homevisit.observation_findings || '',
		interventions: homevisit.interventions || '',
		recommendations: homevisit.recommendations || '',
		agreement: homevisit.agreement || '',
		sponsor_name: homevisit.sponsor_name || '',
		date: formatDate(homevisit.date) || '',
		community: homevisit.community || '',
	}
}

/*
{
    report_num: Number,
    sponsor_name: String,
    sponsorship_date: Date,
    date_accomplished: Date,
    period_covered: String,
    sm_update: String,
    family_update: String,
    services_to_family: String,
    participation: String,
    relation_to_sponsor: {
        // Can only be 'Yes', 'Sometimes', or 'No'
        know_sponsor_name: String,
        cooperative: String,
        personalized_letter: String,
    }
}
*/
function formatProgressReport(report) {
    if (!report) return {};
	// console.log('formatProgressReport', report);

	const formattedRelation = {
		know_sponsor_name: report.relation_to_sponsor.know_sponsor_name || '',
		cooperative: report.relation_to_sponsor.cooperative || '',
		personalized_letter: report.relation_to_sponsor.personalized_letter || '',
	}

    return {
		sponsor_name: report.sponsor_name || '',
		sponsorship_date: formatDate(report.sponsorship_date) || '',
		date_accomplished: formatDate(report.date_accomplished) || '',
		period_covered: report.period_covered || '',
		sm_update: report.sm_update || '',
		family_update: report.family_update || '',
		services_to_family: report.services_to_family || '',
		participation: report.participation || '',
		relation_to_sponsor: formattedRelation,
	}
}

module.exports = {
    calculateAge,
	formatDate,
	getInterventionFormNumber,
    formatCorrespondenceData,
    formatCounselingData,
    formatFinancialData,
    formatHomeVisitData,
    formatProgressReport,
};