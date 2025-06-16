import { create } from 'zustand';
import axios from 'axios';

const useMilkStore = create((set) => ({
  morningRecords: [],
  eveningRecords: [],
    totalEveningRakkam: 0,
  totalMorningRakkam: 0,
  totalMorningLiters: 0,
  totalEveningLiters: 0,
  totalRakkam: 0,

  fetchMilkRecords: async ({ userId, startDate, endDate }) => {
    try {
      const milkRes = await axios.get(`/api/milk/getMilkRecords`, {
        params: {
          userId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      console.log('milkRes', milkRes);
      

      let milkRecords = milkRes.data.data;

      console.log('milkRecords', milkRecords);
      

      milkRecords = milkRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

      const morning = milkRecords.filter((record) => record.session === 'morning');
      const evening = milkRecords.filter((record) => record.session === 'evening');

      const totalMorning = morning.reduce((totals, record) => {
        totals.liters += record.liter;
        totals.rakkam += record.rakkam;
        return totals;
      }, { liters: 0, rakkam: 0 });

      const totalEvening = evening.reduce((totals, record) => {
        totals.liters += record.liter;
        totals.rakkam += record.rakkam;
        return totals;
      }, { liters: 0, rakkam: 0 });

      set({
        morningRecords: morning,
        eveningRecords: evening,
        totalMorningLiters: totalMorning.liters,
        totalEveningLiters: totalEvening.liters,
              totalEveningRakkam: Math.floor(totalEvening.rakkam),
      totalMorningRakkam: Math.floor(totalMorning.rakkam),
        totalRakkam: Math.floor(totalMorning.rakkam + totalEvening.rakkam),
      });
    } catch (error) {
      console.error('Error fetching milk records:', error.message);
    }
  },
}));

export default useMilkStore;
