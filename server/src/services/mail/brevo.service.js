const { config } = require("../../config/constant.js");
const SibApiV3Sdk = require('sib-api-v3-sdk');

const apiKey = config.BREVO.apiKey;
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = apiKey;

const SENDINBLUE_ERRORS = {
    duplicate_parameter: 'duplicate_parameter',
    document_not_found: 'document_not_found',
}

async function CreateContact(contactData) {
    const apiInstanceContact = new SibApiV3Sdk.ContactsApi();
    
    const newContact = new SibApiV3Sdk.CreateContact();
    
    newContact.email = contactData.email;
    newContact.listIds = contactData.ids;
    
    newContact.attributes = {
        FIRSTNAME: contactData.name,
        SMS: `+84${+contactData.phone}`,
    };
    newContact.updateEnabled = true;
    
    try {
        const data = await apiInstanceContact.createContact(newContact);
        console.log(
        'Create Contact Successfully: ' + JSON.stringify(data)
        );
    } catch (error) {
        const { code } = error.response.body;
    
        if (Object.values(SENDINBLUE_ERRORS).includes(code)) {
        console.warn('Brevo: ', code);
        return;
        }
    
        throw new Error(code);
    }
}

async function sendMail(emailBodyData, contactData = null) {
    if (null !== contactData) {
        await CreateContact(contactData);
    }
    
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    let emailBody = new SibApiV3Sdk.SendSmtpEmail();
    
    emailBody = emailBodyData;
    try {
        const data = await apiInstance.sendTransacEmail(emailBody);
    } catch (error) {
        console.error(error);
    }
}

function getTemplateId(key) {
    const configTemplateEmail = JSON.parse(config.BREVO.templateEmail);
    
    if (configTemplateEmail[key] === undefined) {
        throw new Error('Invalid template name');
    }
    
    return configTemplateEmail[key];
}

module.exports = { sendMail, getTemplateId };