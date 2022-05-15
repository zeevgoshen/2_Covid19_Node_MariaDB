const express = require('express');
const router = express.Router();

const UserController = require('../src/controllers/UserController');
const ReportTimeController = require('../src/controllers/ReportTimeController');
const PositiveDiagnosisController = require('../src/controllers/PositiveDiagnosisController');


router.post('/login', UserController.login);
router.post('/register', UserController.register);

////////////////////////////////////////////////////
////////////////////// Level 1 /////////////////////
////////////////////////////////////////////////////
router.get('/:id', UserController.getUserbyId);
router.get('/getallrecords/:id', UserController.getAllUserRecordsById);
router.post('/report_in', ReportTimeController.reportTimeInByDate);
router.post('/report_out', ReportTimeController.reportTimeOutByDate);

////////////////////////////////////////////////////
////////////////////// Level 2 /////////////////////
////////////////////////////////////////////////////
router.post('/report_exposure', PositiveDiagnosisController.reportPoisitiveExposure);


module.exports = router;