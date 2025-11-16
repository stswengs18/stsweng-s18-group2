

const express = require('express');
const router = express.Router();
const interventionCorrespController = require('../controller/interventionCorrespController');

router.post('/create-form/:id',interventionCorrespController.createCorespForm);
router.get('/viewform/:smId/:formId',interventionCorrespController.getCorrespondenceForm);
router.get('/getAllForms/:smId',interventionCorrespController.getAllCorrespondenceInterventions);
router.put('/edit-form/:formId',interventionCorrespController.editCorrespondenceForm);
router.delete('/delete-plan/:formId/:planId', interventionCorrespController.deleteInterventionPlanById);
router.put('/add-plans/:formId', interventionCorrespController.addInterventionPlan);
router.delete('/delete/:formId', interventionCorrespController.deleteCorrespondenceForm);
router.get('/getAutoFillForm/:smId',interventionCorrespController.getAutoFillData);
module.exports = router;