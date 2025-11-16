const express = require('express');
const router = express.Router();
const homVisController = require('../controller/interventionHomeVisController');

/**
 *   Home Visitation Intervention Routes
 * 
 *   /api/intervention
 */
router.get('/home-visit-form/:caseID', homVisController.loadHomeVisitationForm);
router.get('/home-visit-form/all/:caseID', homVisController.loadAllHomeVisitationForms);
router.get('/home-visit-form/:caseID/:formID', homVisController.loadHomeVisitationFormEdit);
router.put('/home-visit-form/create/:caseID', homVisController.createHomVis);
router.put('/home-visit-form/edit/:caseID/:formID', homVisController.editHomeVis);
router.delete('/delete/home-visit-form/:formID', homVisController.deleteHomeVis);

module.exports = router;