const express = require('express');
const ggSheetController = require('../../controllers/google/googleSheet.controller');

const router = express.Router();

router.get("/sheet-data", ggSheetController.readSheetData);

module.exports = router;