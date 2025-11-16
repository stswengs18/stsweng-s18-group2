//This is the intervention Finanfical form route

const express = require('express');
const router = express.Router();
const interventionFinController = require('../controller/interventionFinController');

router.post('/create-form/:id', interventionFinController.createFinForm);
router.get('/viewform/:smId/:formId', interventionFinController.getFinancialForm);
router.get('/getAllForms/:smId', interventionFinController.getAllFinancialInterventions);
router.put('/edit-form/:formId',interventionFinController.editFinancialForm);
router.delete('/deleteform/:formId',interventionFinController.deleteFinForm);
router.get('/getAutoFillForm/:smId',interventionFinController.getAutoFillData);
module.exports = router;