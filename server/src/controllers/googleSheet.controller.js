const ggSheetService = require("../services/google/googleSheet.service.js");
const spotSheetDataService = require("../services/google/spotSheetData.service.js");

const readSheetData = async(req, res) => {
    const sheetId = req.params.sheetId;
    const sheetTitle = req.params.sheetTitle;
    try {
        const result = await ggSheetService.formatGGSheetData(sheetId, sheetTitle);
        res.status(200).json();
    } catch (error) {
        res.status(400).json({message: `Cannot get read google sheet data: ${error.message}`});
    }
}

const insertSpotsInBatch = async (req, res) => {
    const sheetId = req.body.sheetId;
    const sheetTitle = req.body.sheetTitle;
    try {
        await spotSheetDataService.addNewSpotSheetData(sheetId, sheetTitle);
        res.status(200).json({message: 'Spots inserted successfully'}); 
    } catch (error) {
        res.status(400).json({message: `Error inserting spots in batch: ${error.message}`});
    }
}

const updateSpots = async (req, res) => {
    const sheetId = req.body.sheetId;
    const sheetTitle = req.body.sheetTitle;
    try {
        await spotSheetDataService.updateSpotSheetData(sheetId, sheetTitle);
        res.status(200).json({message: 'Spots inserted successfully'}); 
    } catch (error) {
        res.status(500).json({message: `Error inserting spots in batch: ${error.message}`});
    }
}

module.exports = { readSheetData, insertSpotsInBatch, updateSpots };