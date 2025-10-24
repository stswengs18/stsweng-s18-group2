const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

router.get('/active-cases-count', dashboardController.getActiveCasesCount);
router.get('/closed-cases-count', dashboardController.getClosedCasesCount);
router.get('/intervention-correspondence-count', dashboardController.getInterventionCorrespondenceCount);
router.get('/intervention-counseling-count', dashboardController.getInterventionCounselingCount);
router.get('/intervention-financial-count', dashboardController.getInterventionFinancialCount);
router.get('/intervention-home-visit-count', dashboardController.getInterventionHomeVisitCount);
router.get('/active-cases-per-spu', dashboardController.getActiveCasesPerSpu);

//case demographic routes
router.get('/gender-distribution', dashboardController.getGenderDistribution);
router.get('/average-age', dashboardController.getAverageAge);
router.get('/average-family-size', dashboardController.getAverageFamilySizeByLastName);
router.get('/average-family-income', dashboardController.getAverageFamilyIncome);
router.get('/average-interventions', dashboardController.getAverageInterventionsPerCase);
router.get('/average-case-duration', dashboardController.getAverageCaseDuration);

module.exports = router;