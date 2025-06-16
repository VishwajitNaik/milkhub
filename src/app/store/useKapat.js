import { create } from 'zustand';
import axios from 'axios';
const useKapat = create((set) => ({
  kapat: [],
  loading: false,
  error: null,

  fetchKapat: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/api/kapat/getKapat');
      const sthirKapat = res.data.data.filter(item => item.KapatType === 'Kapat');
      set({ kapat: sthirKapat, loading: false });
      const totalRakkam = sthirKapat.reduce((acc, item) => acc + parseFloat(item.Rakkam || 0), 0);
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error('Error fetching kapat:', err.message);
    }
  },
}));
export default useKapat;