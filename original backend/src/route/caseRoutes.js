const express = require('express');
const router = express.Router();
const caseController = require('../controller/caseController'); // Changed from controllers to controller

// Fixed-path GET routes first
router.get('/getsdw', caseController.getAllSDWs);
router.get('/allCases', caseController.getAllCases);
router.get('/', caseController.getAllCases); // Alternative endpoint for getAllCases

// Parameterized GET routes
router.get('/case-by-sm-number/:sm_number', caseController.getCaseBySMNumber);
router.get('/case-by-sdw/:sdwID', caseController.getAllCasesbySDW);
router.get('/get-family-compositon/:caseID', caseController.getFamilyMembers);

// POST routes
router.post('/case-create', caseController.addNewCase);

// PUT routes for case edits
router.put('/edit/core/:id', caseController.editCaseCore);
router.put('/edit/identifyingdata/:id', caseController.editCaseIdentifyingData);
router.put('/update-problems-findings/:caseID', caseController.editProblemsAndFindings);
router.put('/update-assessment/:caseID', caseController.editAssessment);
router.put('/update-evaluation-recommendation/:caseID', caseController.editEvaluationAndRecommendation);

// PUT routes for family members
router.put('/edit-family-composition/:caseID/:famID', caseController.editFamilyMember);
router.put('/add-family-member/:caseID', caseController.addFamilyMember);
router.put('/delete-family-member/:caseID/:famID', caseController.deleteFamilyMember);

// Generic ID route must be last
router.get('/:id', caseController.getCaseById);

module.exports = router;