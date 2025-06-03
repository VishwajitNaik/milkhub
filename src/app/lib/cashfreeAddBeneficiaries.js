require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { getCashfreeToken } = require('../lib/cashfreeToken');
const Owner = require('../models/ownerModel'); // adjust path as needed
const { connect } = require('../dbconfig/dbconfig');

const addBeneficiaries = async () => {
  try {
    await connect(); // Connect to DB
    const token = await getCashfreeToken();

    const owners = await Owner.find({
      'bankDetails.verified': true,
      kycStatus: 'verified'
    });

    console.log(`✅ Found ${owners.length} verified owners`);

    for (const owner of owners) {
      const { _id, ownerName, phone, email, bankDetails } = owner;

      const beneId = `owner_${_id.toString().slice(-6)}`; // generate unique beneId

      const payload = {
        beneId,
        name: ownerName,
        email,
        phone,
        bankAccount: bankDetails.accountNumber,
        ifsc: bankDetails.ifsc,
        address1: "Default Address", // or pull from user if available
      };

      try {
        const res = await axios.post('https://payout-api.cashfree.com/payout/v1/addBeneficiary', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`✅ Added: ${ownerName} (${beneId})`);

      } catch (err) {
        console.error(`❌ Failed for ${ownerName}:`, err.response?.data || err.message);
      }
    }

    process.exit(0);

  } catch (err) {
    console.error('❌ Script Error:', err.message);
    process.exit(1);
  }
};

addBeneficiaries();
