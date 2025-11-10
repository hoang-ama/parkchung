const dotenv =  require('dotenv');

dotenv.config();

const config = {
    GGSHEET: {
        sheetId: process.env.SHEET_ID || '',
        sheetTitle: process.env.SHEET_TITLE || '',
    }
}

module.exports = { config };