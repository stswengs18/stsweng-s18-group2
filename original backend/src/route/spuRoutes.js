const express = require('express');
const router = express.Router();
const SpuController = require('../controller/SpuController');

router.post('/addSpu',SpuController.createSpu);
router.delete('/deleteSpu/:spuId',SpuController.deleteSpu)
router.get('/getAllSpu',SpuController.getAllSpus);

module.exports = router;