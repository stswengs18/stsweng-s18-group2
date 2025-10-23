const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

router.get('/active-cases-count', dashboardController.getActiveCasesCount);
router.get('/closed-cases-count', dashboardController.getClosedCasesCount);
router.get('/intervention-correspondence-count', dashboardController.getInterventionCorrespondenceCount);
router.get('/intervention-counseling-count', dashboardController.getInterventionCounselingCount);
router.get('/intervention-financial-count', dashboardController.getInterventionFinancialCount);
router.get('/intervention-home-visit-count', dashboardController.getInterventionHomeVisitCount);

module.exports = router;