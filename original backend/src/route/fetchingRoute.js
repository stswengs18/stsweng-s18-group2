const express = require('express');
const session = require('express-session');
const EmployeeFetch = require('../controller/employeeFetchController');
const router = express.Router();


router.get('/head',EmployeeFetch.getHeadView);
router.get('/head/spu',EmployeeFetch.getHeadViewbySpu);
router.get('/supervisor',EmployeeFetch.getSupervisorViewbySpu);
router.get('/socialdevelopmentworker',EmployeeFetch.getSDWView);
router.get('/head/:supervisorId',EmployeeFetch.getHeadViewbySupervisor);
router.get('/head/:supervisorId/:sdwId',EmployeeFetch.getSDWViewbyParam);
router.get('/supervisors/:sdwId',EmployeeFetch.getSDWViewbyParam);

router.get('/employee/:id', EmployeeFetch.getEmployeeById);
router.get('/employees/by-username/:username', EmployeeFetch.getEmployeeByUsername);
router.get('/employees/by-sdw/:sdw_id', EmployeeFetch.getEmployeeBySDWId);
router.put('/employees/edit/:id', EmployeeFetch.editEmployeeCore);
router.put('/employees/edit-password/:id', EmployeeFetch.editEmployeePassword);
module.exports = router;