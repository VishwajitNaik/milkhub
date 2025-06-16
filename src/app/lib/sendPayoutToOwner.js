const response = await axios.post(
  'https://payout-gamma.cashfree.com/payout/v1/requestTransfer', // use TEST URL
  {
    beneId,
    amount,
    transferId: `TXN-${Date.now()}-${beneId}`,
    remarks,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
