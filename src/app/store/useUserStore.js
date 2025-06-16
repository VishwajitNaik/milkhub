// store/useUserStore.js
import { create } from 'zustand';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  loading: false,

  fetchUser: async (id) => {
    try {
      set({ loading: true });
      const res = await axios.get(`/api/user/getUsers/${id}`);
      set({ user: res.data.data });
      return res.data.data;
    } catch (err) {
      console.error("Error fetching user:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;