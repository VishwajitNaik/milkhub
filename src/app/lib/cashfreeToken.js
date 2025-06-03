const axios = require('axios');

const getCashfreeToken = async () => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';

    const baseURL = isProduction
      ? 'https://payout-api.cashfree.com'         // Production URL
      : 'https://payout-gamma.cashfree.com';      // Sandbox/Test URL

    const response = await axios.post(`${baseURL}/payout/v1/authorize`, {}, {
      headers: {
        'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
        'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
      },
    });

    console.log('Cashfree Auth Response:', response.data);

    console.log('Cashfree Auth Token:', response.data.data.token);
    

    if (!response.data || !response.data.data || !response.data.data.token) {
      throw new Error('Invalid response format from Cashfree auth');
    }

    return response.data.data.token;

  } catch (error) {
    console.error('Cashfree Auth Error:', error.response?.data || error.message);
    throw new Error('Failed to get Cashfree auth token');
  }
};

module.exports = { getCashfreeToken };
