import axios from 'axios';
import { getCashfreeToken } from '../app/lib/cashfreeToken';
import Sanscript from 'sanscript';

export const addBeneficiaryToCashfree = async (owner) => {
  try {
    const token = await getCashfreeToken();

    const isProduction = process.env.NODE_ENV === 'production';
    const baseURL = isProduction
      ? 'https://payout-api.cashfree.com'
      : 'https://payout-gamma.cashfree.com';

    // Transliterate name from Devanagari to ITRANS
    let name = Sanscript.t(owner.ownerName || '', 'devanagari', 'itrans').trim();

    // Capitalize each word
    name = name
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    console.log('Transliterated name:', name);

    if (!name || name.length < 3 || /[^a-zA-Z\s]/.test(name)) {
      throw new Error(`Invalid name provided: "${owner.ownerName}"`);
    }

    const payload = {
      beneId: `owner${owner.registerNo}`,
      name: name,
      email: owner.email || "noemail@example.com",
      phone: owner.phone,
      bankAccount: owner.bankDetails.accountNumber,
      ifsc: owner.bankDetails.ifsc,
      address1: owner.formattedAddress || "Not Provided",
      transferMode: 'banktransfer'
    };

    console.log("Beneficiary payload:", payload);

    const response = await axios.post(
      `${baseURL}/payout/v1/addBeneficiary`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Beneficiary added successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Failed to add beneficiary:", error.response?.data || error.message);
    throw new Error("Cashfree beneficiary addition failed");
  }
};
