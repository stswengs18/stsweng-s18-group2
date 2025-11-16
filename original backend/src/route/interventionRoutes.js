const express = require('express');
const router = express.Router();

const caseController = require('../controller/caseController');
const interventionCounselingController = require('../controller/interventionCounselingController');

// Counseling Intervention Routes
// /api/intervention
router.get('/counseling/add/:id', interventionCounselingController.getCaseData);
router.get('/counseling/intervention/:counselingId', interventionCounselingController.getCounselingInterventionById);
router.get('/counseling/intervention/:caseId/:counselingId', interventionCounselingController.getCounselingInterventionById);
router.get('/counseling/member/:memberID', interventionCounselingController.getAllCounselingInterventionsByMemberId);
router.post('/counseling/add/:memberID', interventionCounselingController.addCounselingIntervention);
router.delete('/counseling/delete/:counselingId', interventionCounselingController.deleteCounselingIntervention);
router.put('/counseling/edit/:counselingId', interventionCounselingController.editCounselingIntervention);

module.exports = router;