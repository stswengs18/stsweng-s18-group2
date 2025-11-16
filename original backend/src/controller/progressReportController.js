const mongoose = require('mongoose');
const Sponsored_member = require('../model/sponsored_member');
const Progress_Report = require('../model/progress_report');

/**
 * Fetches a progress report by its ID.
 * 
 * @route GET /api/progress-report/:reportId
 * 
 * @param {string} reportId - The ID of the progress report to fetch.
 * 
 * @returns {Object} 200 - Progress report object.
 * @returns {Object} 400 - Invalid report ID or missing report.
 * @returns {Object} 404 - Progress report not found.
 * @returns {Object} 500 - Internal server error.
 */
const getProgressReportById = async (req, res) => {
    try {
        const reportId = req.params.reportId;
        const caseId = req.params.caseId

        // Validate progress report ID
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ error: 'Invalid progress report ID' });
        }

        // Find the progress report by ID
        const progressReport = await Progress_Report.findById(reportId);
        if (!progressReport) {
            return res.status(404).json({ error: 'Progress report not found' });
        }

        // Get the sponsored member associated with the report
        const sm = await Sponsored_member.findOne({ "progress_reports.progress_report": reportId })
            .populate("spu")
            .lean();
        if (!sm) {
            return res.status(404).json({ error: 'Sponsored member not found for this report' });
        }

        if (sm._id.toString() != caseId) {
            return res.status(403).json({ error: 'Case and form mismatch' });
        }

        // Get report number from the sponsored member's progress reports
        const reportNumber = sm.progress_reports.find(report => report.progress_report.toString() === reportId)?.report_number;
        if (!reportNumber) {
            return res.status(404).json({ error: 'Report number not found for this progress report' });
        }
        
        sm.subproject = sm.spu
        return res.status(200).json({
            progressReport,
            reportNumber,
            case: sm,
        });
    } catch (error) {
        console.error('Error fetching progress report:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Fetches case data for a given case ID.
 * 
 * @route GET /api/progress-report/add/:caseId
 * 
 * @param {string} caseId - The ID of the case to fetch data for.
 * 
 * @returns {Object} 200 - Case data object.
 * @returns {Object} 400 - Invalid case ID.
 * @returns {Object} 404 - Case not found.
 * @returns {Object} 500 - Internal server error.
 */
const getCaseData = async (req, res) => {
    try {
        const caseId = req.params.caseId;

        // Validate case ID
        if (!mongoose.Types.ObjectId.isValid(caseId)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        // Fetch the case data (assuming a Case model exists)
        const sm_data = await Sponsored_member.findById(caseId).populate('spu');
        if (!sm_data) {
            return res.status(404).json({ error: 'Case not found' });
        }

        // Get the last progress report number
        const lastReport = sm_data.progress_reports[sm_data.progress_reports.length - 1];
        const lastReportNumber = lastReport ? lastReport.report_number : 0;

        const caseData = {
            last_name: sm_data.last_name || '',
            middle_name: sm_data.middle_name || '',
            first_name: sm_data.first_name || '',
            ch_number: sm_data.sm_number || '',
            dob: new Date(sm_data.dob).toISOString().split('T')[0] || '',
            subproject: sm_data.spu.spu_name || '',
            reportNumber: lastReportNumber + 1,
            is_active: sm_data.is_active
        }

        return res.status(200).json(caseData);
    } catch (error) {
        console.error('Error fetching case data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Gets all progress reports for a case.
 * 
 * @route GET /api/progress-report/case/:caseId
 * 
 * @param {string} caseId - The ID of the case to fetch progress reports for.
 * 
 * @returns {Object} 200 - Array of progress reports.
 * @returns {Object} 400 - Invalid case ID.
 * @returns {Object} 404 - Sponsored member not found.
 * @returns {Object} 500 - Internal server error.
 */
const getAllProgressReportsForCase = async (req, res) => {
    try {
        const caseId = req.params.caseId;

        // Validate case ID
        if (!mongoose.Types.ObjectId.isValid(caseId)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        // Fetch all progress reports for the sponsored member
        const sm = await Sponsored_member.findById(caseId).populate('progress_reports.progress_report');
        if (!sm) {
            return res.status(404).json({ error: 'Sponsored member not found' });
        }

        const progressReports = sm.progress_reports.map(report => ({
            _id: report.progress_report._id,
            report_number: "Progress Report " + report.report_number,
            created_at: report.progress_report.createdAt,
        }));

        return res.status(200).json(progressReports);
    } catch (error) {
        console.error('Error fetching all progress reports:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Adds a progress report to a sponsored member.
 * 
 * @route POST /api/progress-report/add/:caseId
 * 
 * @param {string} caseId - The ID of the sponsored member.
 * 
 * @param {Object} req.body - The progress report data.
 * 
 * @returns {Object} 201 - Progress report added successfully.
 * @returns {Object} 400 - Invalid case ID, type, or missing required fields.
 * @returns {Object} 404 - Sponsored member not found.
 * @returns {Object} 500 - Internal server error.
 */
const addProgressReport = async (req, res) => {
    try {
        const caseId = req.params.caseId;

        // Validate case ID
        if (!mongoose.Types.ObjectId.isValid(caseId)) {
            return res.status(400).json({ error: 'Invalid case ID' });
        }

        // Find sponsored member
        const sm = await Sponsored_member.findById(caseId);
        if (!sm) {
            return res.status(404).json({ error: 'Sponsored member not found' });
        }

        // Validate required fields
        const requiredFields = [
            'sponsor_name',
            'sponsorship_date',
            'sm_update',
            'family_update',
            'services_to_family',
            'participation',
            'relation_to_sponsor',
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                missingFields 
            });
        }

        // Check if sponsorship date is valid
        const sponsorshipDate = new Date(req.body.sponsorship_date).setHours(0, 0, 0, 0);
        const currentDate = new Date().setHours(0, 0, 0, 0);
        if (sponsorshipDate > currentDate) {
            return res.status(400).json({
                error: 'Invalid sponsorship date',
                message: 'Sponsorship date cannot be in the future.'
            });
        }

        // Check if date accomplished is valid
        if (req.body.date_accomplished) {
            const dateAccomplished = new Date(req.body.date_accomplished).setHours(0, 0, 0, 0);
            if (dateAccomplished > currentDate || dateAccomplished < sponsorshipDate) {
                return res.status(400).json({
                    error: 'Invalid date accomplished',
                    message: 'Date accomplished cannot be in the future or before the sponsorship date.'
                });
            }
        }

        // Validate relation_to_sponsor structure
        if (!req.body.relation_to_sponsor || 
            typeof req.body.relation_to_sponsor.know_sponsor_name === 'undefined' ||
            typeof req.body.relation_to_sponsor.cooperative === 'undefined' ||
            typeof req.body.relation_to_sponsor.personalized_letter === 'undefined') {

            return res.status(400).json({ 
                error: 'Invalid relation_to_sponsor structure',
                message: 'relation_to_sponsor must include know_sponsor_name, cooperative, and personalized_letter properties'
            });
        }

        // Create new progress report
        const progressReportData = {
            sponsor_name: req.body.sponsor_name,
            sponsorship_date: new Date(req.body.sponsorship_date),
            date_accomplished: req.body.date_accomplished ? new Date(req.body.date_accomplished) : null,
            period_covered: req.body.period_covered || '',
            sm_update: req.body.sm_update,
            family_update: req.body.family_update,
            services_to_family: req.body.services_to_family,
            participation: req.body.participation,
            relation_to_sponsor: {
                know_sponsor_name: req.body.relation_to_sponsor.know_sponsor_name,
                cooperative: req.body.relation_to_sponsor.cooperative,
                personalized_letter: req.body.relation_to_sponsor.personalized_letter,
            },
        };

        const progressReport = new Progress_Report(progressReportData);
        await progressReport.save();
        // console.log('Progress report created:', progressReport);

        // Add the progress report to the sponsored member's progress_reports array
        sm.progress_reports.push({
            progress_report: progressReport._id,
            report_number: sm.progress_reports.length + 1
        });
        await sm.save();
        // console.log('Progress report added to sponsored member');

        return res.status(201).json({
            message: 'Progress report added successfully',
            progressReport,
            case: sm,
        });
    } catch (error) {
        console.error('Error adding progress report:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Deletes a progress report from a sponsored member.
 * 
 * @route DELETE /api/progress-report/delete/:reportId
 * 
 * @param {string} reportId - The ID of the progress report to delete.
 * 
 * @returns {Object} 200 - Progress report deleted successfully.
 * @returns {Object} 400 - Invalid report ID.
 * @returns {Object} 404 - Progress report or intervention not found.
 * @returns {Object} 500 - Internal server error.
 */
const deleteProgressReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;

        // Validate progress report ID
        if (!mongoose.Types.ObjectId.isValid(reportId)) {
            return res.status(400).json({ error: 'Invalid progress report ID' });
        }

        // Find the progress report
        const progressReport = await Progress_Report.findById(reportId);
        if (!progressReport) {
            return res.status(404).json({ error: 'Progress report not found' });
        }

        // Find the sponsored member and delete the progress report
        const sm = await Sponsored_member.findOneAndUpdate(
            { "progress_reports.progress_report": reportId },
            { $pull: { progress_reports: { progress_report: reportId } } },
            { new: true }
        );

        if (!sm) {
            return res.status(404).json({ error: 'Sponsored member not found' });
        }
        // console.log('Progress report removed from sponsored member:', sm._id);

        // Delete the progress report
        await Progress_Report.findByIdAndDelete(reportId);
        // console.log('Progress report deleted:', reportId);

        return res.status(200).json({ message: 'Progress report deleted successfully' });
    } catch (error) {
        console.error('Error deleting progress report:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Edits an existing progress report.
 * 
 * @route PUT /api/progress-report/edit/:reportId
 * 
 * @param {string} reportId - The ID of the progress report to edit.
 * @param {Object} req.body - The updated progress report data.
 * 
 * @returns {Object} 200 - Progress report updated successfully.
 * @returns {Object} 400 - Invalid report ID, missing required fields, or invalid sponsorship date.
 * @returns {Object} 404 - Progress report not found.
 * @returns {Object} 500 - Internal server error.
 */ 
const editProgressReport = async (req, res) => {
    try {
        const reportId = req.params.reportId;

        // Find the progress report
        const progressReport = await Progress_Report.findById(reportId);

        if (!progressReport) {
            return res.status(404).json({ error: 'Progress report not found' });
        }

        // Validate required fields
        const requiredFields = [
            'sponsor_name',
            'sponsorship_date',
            'sm_update',
            'family_update',
            'services_to_family',
            'participation',
            'relation_to_sponsor',
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: 'Missing required fields', 
                missingFields 
            });
        }

        // Check if sponsorship date is valid
        const sponsorshipDate = new Date(req.body.sponsorship_date).setHours(0, 0, 0, 0);
        const currentDate = new Date().setHours(0, 0, 0, 0);
        if (sponsorshipDate > currentDate) {
            return res.status(400).json({
                error: 'Invalid sponsorship date',
                message: 'Sponsorship date cannot be in the future.'
            });
        }
        // Check if date accomplished is valid
        if (req.body.date_accomplished) {
            const dateAccomplished = new Date(req.body.date_accomplished).setHours(0, 0, 0, 0);
            if (dateAccomplished > currentDate || dateAccomplished < sponsorshipDate) {
                return res.status(400).json({
                    error: 'Invalid date accomplished',
                    message: 'Date accomplished cannot be in the future or before the sponsorship date.'
                });
            }
        }

        // Validate relation_to_sponsor structure
        if (!req.body.relation_to_sponsor || 
            typeof req.body.relation_to_sponsor.know_sponsor_name === 'undefined' ||
            typeof req.body.relation_to_sponsor.cooperative === 'undefined' ||
            typeof req.body.relation_to_sponsor.personalized_letter === 'undefined') {
            return res.status(400).json({ 
                error: 'Invalid relation_to_sponsor structure',
                message: 'relation_to_sponsor must include q1, q2, and q3 properties'
            });
        }

        // Update the progress report
        progressReport.sponsor_name = req.body.sponsor_name;
        progressReport.sponsorship_date = new Date(req.body.sponsorship_date);
        progressReport.date_accomplished = req.body.date_accomplished ? new Date(req.body.date_accomplished) : null;
        progressReport.period_covered = req.body.period_covered || '';
        progressReport.sm_update = req.body.sm_update;
        progressReport.family_update = req.body.family_update;
        progressReport.services_to_family = req.body.services_to_family;
        progressReport.participation = req.body.participation;
        progressReport.relation_to_sponsor = {
            know_sponsor_name: req.body.relation_to_sponsor.know_sponsor_name,
            cooperative: req.body.relation_to_sponsor.cooperative,
            personalized_letter: req.body.relation_to_sponsor.personalized_letter,
        };
        await progressReport.save();
        // console.log('Progress report updated:', progressReport);

        return res.status(200).json({
            message: 'Progress report updated successfully',
            progressReport,
        });
    } catch (error) {
        console.error('Error editing progress report:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getProgressReportById,
    getCaseData,
    getAllProgressReportsForCase,
    addProgressReport,
    deleteProgressReport,
    editProgressReport,
}