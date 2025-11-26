const {google} = require('googleapis');
const { promises } = require("fs");
const { config } = require('../../config/constant.js');

const RECORD_STATUS = {
    NEW: 'new',
    UPDATE: 'update',
    UPDATED: 'updated'
}

const getSheetClient = async () => {
    const credentials = JSON.parse(await promises.readFile('credentials.json', 'utf-8'));
    
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();

    return google.sheets({version: 'v4', auth: client});
}

const getSheetData = async (sheetId, sheetTitle) => {
    const sheets = await getSheetClient();

    sheetId = sheetId ? sheetId : config.GGSHEET.sheetId;
    sheetTitle = sheetTitle ? sheetTitle : config.GGSHEET.sheetTitle;
    let response;
    try {
        response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: sheetTitle
        })
    } catch (error) {
        console.log("Message error: ", error)
        response = [[]]
    }
    return response.data.values;
}

const updateSheetData = async (range, values, sheetId, sheetTitle) => {
    const sheets = await getSheetClient();

    sheetId = sheetId ? sheetId : config.GGSHEET.sheetId;
    sheetTitle = sheetTitle ? sheetTitle : config.GGSHEET.sheetTitle;
    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `${sheetTitle}!${range}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: values }
        })
    } catch (error) {
        console.log("Message error: ", error)
    }
}

const updateSheetBatchData = async (dataRanges, sheetId, sheetTitle) => {
    const sheets = await getSheetClient();

    sheetId = sheetId ? sheetId : config.GGSHEET.sheetId;
    sheetTitle = sheetTitle ? sheetTitle : config.GGSHEET.sheetTitle;
    
    try {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: sheetId,
            resource: { 
                valueInputOption: "USER_ENTERED",
                data: dataRanges
            }
        })
    } catch (error) {
        console.log("Message error: ", error)
    }
}

// Format dữ liệu google sheet từ array về object
const formatGGSheetData = async(sheetId, sheetTitle) => {
    const rows = await getSheetData(sheetId, sheetTitle);
    
    const newSpots = [];
    const updateSpots = [];
    const updatedSpots = [];
    
    // Lấy các dữ liệu ở dòng đầu làm tên biến cho đối tượng
    const firstRow = rows[0];

    for(let index = 1; index < rows.length; index++){
        if (rows[index].length === 0)
            continue;

        const row = rows[index];
        let result = new Object();
        for(let i = 0; i < firstRow.length; i++ ){
            if (firstRow[i].length === 0)
                continue;
            result[`${firstRow[i]}`] = (String(row[i]).trim() === '' || row[i] === undefined) ? null : row[i];
        }

        if (result['record_status'] === RECORD_STATUS.NEW)
            newSpots.push(result);
        else if (result['record_status'] === RECORD_STATUS.UPDATE)
            updateSpots.push(result);
        else if (result['record_status'] === RECORD_STATUS.UPDATED)
            updatedSpots.push(result);
    }

    return {
        newSpots: newSpots,
        updateSpots: updateSpots,
        updatedSpots: updatedSpots
    };
}

module.exports =  { formatGGSheetData, getSheetData, updateSheetData, RECORD_STATUS, updateSheetBatchData };