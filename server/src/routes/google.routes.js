const express = require('express');
const ggSheetController = require('../controllers/googleSheet.controller');

const router = express.Router();

router.get("/sheet-data", ggSheetController.readSheetData);
router.post("/insert-spots", ggSheetController.insertSpotsInBatch);
router.post("/update-spots", ggSheetController.updateSpots);

module.exports = router;