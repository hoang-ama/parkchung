const {google} = require('googleapis');
const { promises } = require("fs");
const { config } = require('../../config/constant.js');

const getSheetData = async (sheetId, sheetTitle) => {
    const credentials = JSON.parse(await promises.readFile('credentials.json', 'utf-8'));
    
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();

    const sheets = google.sheets({version: 'v4', auth: client});

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

// Format dữ liệu google sheet từ array về object
const readGGSheetData = async() => {
    const rows = await getSheetData();
    
    const results = new Array();
    
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

        results.push(result);
    }

    return results;
}

module.exports =  { readGGSheetData, getSheetData };