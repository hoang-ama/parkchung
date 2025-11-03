import * as ggSheetService from "../services/google/googleSheet.service.js";

export const readSheetData = async(req, res) => {
    try {
        const result = await ggSheetService.readGGSheetData();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: `Cannot get read google sheet data: ${error.message}`});
    }
}