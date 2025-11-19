const axios = require('axios');
const { config } = require('../../config/constant.js');

const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = config.GGMAPS.apiKey;
    const apiUrl = config.GGMAPS.apiUrl;

    try {
        const reponse = await axios.get(`${apiUrl}?latlng=${lat},${lng}&key=${apiKey}`);
        if (reponse.data.status === 'OK') {
            const address = reponse.data.results[0].formatted_address;
            return address;
        } else {
            throw new Error('Error fetching address from Google Maps API');
        }
    } catch (error) {
        console.error('Google Maps API error:', error.message);
        throw new Error('Failed to get address from coordinates');
    }
}

module.exports = { getAddressFromCoordinates };