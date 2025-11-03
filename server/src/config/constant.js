import * as dotenv from 'dotenv'

dotenv.config();

const config = {
    GGSHEET: {
        sheetId: process.env.SHEET_ID || '',
        sheetTitle: process.env.SHEET_TITLE || '',
    }
}

export { config };